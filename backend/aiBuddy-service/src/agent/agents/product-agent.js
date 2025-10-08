import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ToolMessage, AIMessage, HumanMessage } from "@langchain/core/messages";
import { ProductSearchTool } from "../tools/product-tools.js";
import { config } from "../../config/config.js";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0.5,
  apiKey: config.geminiKey,
});

const graph = new StateGraph(MessagesAnnotation)
  .addNode("chat", async (state) => {
    // AI generates response or tool call
    const response = await model.invoke(state.messages, {
      tools: [ProductSearchTool],
    });

    state.messages.push(
      new AIMessage({
        content: response.text,
        tool_calls: response.tool_calls,
      })
    );

    return state;
  })
  .addNode("tools", async (state) => {
    const lastMessage = state.messages[state.messages.length - 1];

    const toolCalls = lastMessage.tool_calls ?? [];
    const toolResults = [];

    for (const call of toolCalls) {
      if (call.name === "ProductSearchTool") {
        const result = await ProductSearchTool.invoke(call.args);
        toolResults.push(new ToolMessage({ content: result, name: call.name }));
      }
    }

    state.messages.push(...toolResults);
    return state;
  })
  .addEdge("__start__", "chat")
  .addConditionalEdges("chat", async (state) => {
    const last = state.messages[state.messages.length - 1];
    return last.tool_calls?.length ? "tools" : "__end__";
  })
  .addEdge("tools", "chat");

export const agent = graph.compile();

// Example use:
const initialState = { messages: [new HumanMessage("Find me some electronics")] };
const finalState = await agent.invoke(initialState);

console.log("Final AI Output:", finalState.messages.at(-1)?.content);

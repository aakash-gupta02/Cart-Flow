import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ToolMessage, AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { AddToCartTool, ProductSearchTool } from "../tools/product-tools.js";
import { config } from "../../config/config.js";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0.5,
  apiKey: config.geminiKey,
});

// System message to provide context about the agent's capabilities
const systemMessage = new SystemMessage(`
You are an e-commerce assistant. FOLLOW THESE RULES EXACTLY:

**MANDATORY BEHAVIOR PATTERNS:**

1. **WHEN USER SAYS "find X and add to cart" OR "find X and add the first one":**
   - STEP 1: Use ProductSearchTool 
   - STEP 2: IMMEDIATELY use AddToCartTool with the first product ID (NO questions asked)
   - NEVER ask for confirmation when user explicitly says "and add"

2. **WHEN USER SAYS "find X" (without "add"):**
   - Use ProductSearchTool
   - Show results and ask if they want to add any

3. **WHEN USER SAYS "yes" OR "add it" OR "add to cart" (after product search):**
   - Extract product ID from previous ToolMessage
   - Use AddToCartTool immediately
   - DO NOT search again

4. **WHEN USER SAYS "find X phone or computer" or any generic word like ["phone, computer, laptop, shoes, dress"] then dont use this generic keywords in search:**
    - Use ProductSearchTool with specific keywords only (e.g., brand/model)
    - Avoid using generic terms like "phone", "computer", etc. in the search query.
    - for example, if user says "find iPhone 13 phone", search for "iPhone 13" only.

**EXAMPLES:**
User: "find samsung and add to cart" → Search + Add (no confirmation)
User: "find samsung" → Search + Ask
User: "yes" (after search) → Add immediately

**CRITICAL:** If user request contains both "find" AND "add" keywords, you MUST do both actions automatically. Never ask for confirmation in this case.

Default quantity: 1
Use exact product ID from search results.
`);

const graph = new StateGraph(MessagesAnnotation)
  .addNode("chat", async (state, config) => {
    // Add system message if it's not already in the conversation
    const messages = state.messages;
    if (messages.length > 0 && !(messages[0] instanceof SystemMessage)) {
      messages.unshift(systemMessage);
    }
    
    const response = await model.invoke(messages, {
      tools: [ProductSearchTool, AddToCartTool],
    });

    // Fix: response contains tool_calls[] not .text
    const toolCalls = response.tool_calls || [];
    const text = response.content || response.text || "";

    state.messages.push(
      new AIMessage({
        content: text,
        tool_calls: toolCalls,
      })
    );

    return state;
  })

  .addNode("tools", async (state, config) => {
    const lastMessage = state.messages[state.messages.length - 1];
    const toolCalls = lastMessage.tool_calls ?? [];
    const toolResults = [];

    for (const call of toolCalls) {
      let result;
      
      if (call.name === "ProductSearchTool") {
        result = await ProductSearchTool.invoke(call.args);

      } else if (call.name === "AddToCartTool") {
        
        // Pass access token via configuration to the tool
        result = await AddToCartTool.invoke(call.args, {
          metadata: {
            accessToken: config.metadata.accessToken
          }
        });
        console.log("AddToCartTool result:", result);
      } else {
        result = `Unknown tool: ${call.name}`;
      }
      
      toolResults.push(
        new ToolMessage({
          content: typeof result === 'string' ? result : JSON.stringify(result),
          name: call.name,
          tool_call_id: call.id,
        })
      );
    }

    state.messages.push(...toolResults);
    return state;
  })

  .addEdge("__start__", "chat")
  .addConditionalEdges("chat", async (state, config) => {
    const last = state.messages[state.messages.length - 1];
    return last.tool_calls?.length ? "tools" : "__end__";
  })
  .addEdge("tools", "chat");

export const agent = graph.compile();

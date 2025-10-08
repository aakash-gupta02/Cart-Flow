import { tool } from "@langchain/core/tools";
import axios from "axios";
import Joi from "joi";


export const ProductSearchTool = tool(

    async ({ query }) => {
        console.log("ProductSearchTool invoked with query:", query);
        try {
            const response = await axios.get(`https://fakestoreapi.com/products`, {
                params: { q: query }
            });
            return JSON.stringify(response.data);

        } catch (error) {
            return { error: error.message };
        }

    },

    {
        name: "ProductSearchTool",
        description: "A tool for searching products in an e-commerce store. Input should be a search query string.",
        inputSchema: Joi.object({
            query: Joi.string().required().description("The search query string."),
        }),
    }
)


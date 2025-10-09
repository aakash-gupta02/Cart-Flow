import { tool } from "@langchain/core/tools";
import axios from "axios";
import { z } from "zod";
import { config as conf } from "../../config/config.js";

// Define schemas using Zod for better LangChain compatibility
const productSearchSchema = z.object({
    input: z.string().describe("The search query string for finding products")
});

const addToCartSchema = z.object({
    productId: z.string().describe("The ID of the product to add"),
    quantity: z.number().min(1).describe("The quantity of the product to add")
});

export const ProductSearchTool = tool(
    async (input) => {

        // Basic validation - ensure input has the required property
        if (!input || typeof input !== 'object' || !input.input) {
            throw new Error(`Invalid input: expected object with 'input' property, got: ${JSON.stringify(input)}`);
        }

        const query = input.input; // Get the search query from the input field

        try {
            const response = await axios.get(conf.productUrl, {
                params: { q: query }
            });

            const products = response.data?.products;
            
            if (!products || products.length === 0) {
                return "No products found matching your search query.";
            }

            // Format the products for better readability
            const formattedProducts = products.map(product => ({
                id: product._id || product.id,
                name: product.name,
                price: product.price,
                description: product.description,
                category: product.category,
                stock: product.stock
            }));

            return `Found ${products.length} product(s):\n\n${JSON.stringify(formattedProducts, null, 2)}`;

        } catch (error) {
            console.error("ProductSearchTool error:", error.response?.data || error.message);
            return `Failed to search products: ${error.response?.data?.message || error.message}`;
        }
    },
    {
        name: "ProductSearchTool",
        description: "Search for products in the e-commerce store. Use this tool when users ask to find, search, or look for products. Provide the search query in the 'input' parameter.",
        schema: productSearchSchema,
    }
);

export const AddToCartTool = tool(
    async (input, config) => {


        const { productId, quantity } = input;
        const accessToken = config?.metadata?.accessToken;

        if (!accessToken) {
            console.log("❌ No access token provided in config!");
            return "Error: Access token is required for adding products to cart.";
        }

        try {
            const response = await axios.post(`${conf.cartURL}/add`, {
                productId 
            },
                {
                    headers: {
                        Cookie: `accessToken=${accessToken}`,
                    },
                    withCredentials: true,
                }
            );

            const data = response.data;
            return `✅ Product successfully added to cart! Cart details: ${JSON.stringify(data, null, 2)}`;

        } catch (error) {
            console.error("AddToCartTool error:", error.response?.data || error.message);
            return `❌ Failed to add product to cart: ${error.response?.data?.message || error.message}`;
        }
    },
    {
        name: "AddToCartTool",
        description: "Add products to the user's shopping cart. Use this when users want to add, purchase, or buy a product. Requires productId and quantity.",
        schema: addToCartSchema,
    }
);

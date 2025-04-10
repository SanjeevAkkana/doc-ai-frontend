import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Analyze a health-related query using Gemini 1.5 Flash.
 * @param {string} query - The user's health-related question.
 * @returns {Promise<{ success: boolean, data?: string, message?: string }>}
 */
export const analyzeHealthQuery = async (query) => {
  if (!query?.trim()) {
    return { success: false, message: "Query is required." };
  }

  try {
    // Wait before starting the health check
    await sleep(5000);

    const healthCheckPrompt = `Is the following query related to health? Respond with only 'yes' or 'no'. Query: "${query}"`;

    const healthCheck = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: healthCheckPrompt }] }],
    });

    const isHealth = healthCheck?.response?.candidates?.[0]?.content?.parts?.[0]?.text?.toLowerCase().trim();

    if (isHealth !== "yes") {
      return { success: false, message: "Please ask health-related questions." };
    }

    // Wait before sending the actual question
    await sleep(5000);

    const healthResponse = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: query }] }],
    });

    const responseText = healthResponse?.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!responseText) {
      return { success: false, message: "Empty response. Try again." };
    }

    return { success: true, data: responseText };
  } catch (error) {
    console.error("Health Query Error:", error.message);
    return { success: false, message: "Error processing query. Try again later." };
  }
};

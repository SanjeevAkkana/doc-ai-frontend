import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const MAX_RETRIES = 3;
const REQUEST_INTERVAL = 4000;
let lastRequestTime = 0;

const callGemini = async (prompt) => {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime;
      if (timeSinceLastRequest < REQUEST_INTERVAL) {
        await sleep(REQUEST_INTERVAL - timeSinceLastRequest);
      }

      lastRequestTime = Date.now();
      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const textResponse = response?.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (!textResponse) {
        return { success: false, message: "Empty response from Gemini. Please try again." };
      }

      return { success: true, data: textResponse };
    } catch (error) {
      console.error(`Gemini API Error (Attempt ${attempt}):`, error.message);
      if (attempt === MAX_RETRIES) {
        return { 
          success: false, 
          message: "Maximum retry attempts reached. Gemini API request failed." 
        };
      }
      await sleep(2000 * attempt);
    }
  }
  return { success: false, message: "Unexpected error occurred" };
};

export const analyzeReport = async (reportName, reportContent) => {
  if (!reportName || !reportContent) {
    return { success: false, message: "Report name and content are required." };
  }

  try {
    // First check if the content is health-related
    const healthCheckPrompt = `Does the following text contain structured medical or health-related information? Reply with exactly 'yes' or 'no'.\n\nContent:\n"""${reportContent}"""`;
    const healthCheckResult = await callGemini(healthCheckPrompt);

    if (!healthCheckResult.success) {
      return healthCheckResult;
    }

    const isHealthRelated = healthCheckResult.data.trim().toLowerCase();
    if (isHealthRelated !== "yes") {
      return {
        success: false,
        message: "The provided content does not appear to be health-related. Please submit a valid health report.",
      };
    }

    // If health-related, proceed with analysis
    const processingPrompt = `Analyze the following health report and extract key medical details in JSON format with these exact fields:
    - problem: string (main health issue identified)
    - solution: string (recommended treatment)
    - precautions: string[] (list of precautions)
    - suggestions: string[] (list of suggestions)
    - tips: string[] (list of health tips)
    - uses: string[] (list of medication uses if mentioned)
    - dosage: string (recommended dosage if mentioned)
    - sideEffects: string[] (list of side effects if mentioned)
    - route: string (administration route if mentioned)
    - disclaimer: string (any disclaimers)
    
    Format the response as valid JSON only, without any additional text or markdown.
    
    Report Content:
    """${reportContent}"""`;

    const analysisResult = await callGemini(processingPrompt);
    if (!analysisResult.success) {
      return analysisResult;
    }

    try {
      // Clean the JSON response
      const cleanedJSON = analysisResult.data
        .replace(/```json|```/g, "")
        .trim();
      const parsedAnalysis = JSON.parse(cleanedJSON);

      // Validate required fields
      const requiredFields = [
        "problem",
        "solution",
        "precautions",
        "suggestions",
        "tips",
        "uses",
        "dosage",
        "sideEffects",
        "route",
        "disclaimer",
      ];

      const missingFields = requiredFields.filter(
        (field) => !(field in parsedAnalysis)
      );

      if (missingFields.length > 0) {
        return {
          success: false,
          message: `Analysis missing required fields: ${missingFields.join(", ")}`,
        };
      }

      return {
        success: true,
        message: "Report successfully analyzed.",
        data: {
          reportName,
          reportContent,
          analysis: parsedAnalysis,
        },
      };
    } catch (error) {
      console.error("Error parsing analysis:", error);
      return {
        success: false,
        message: "Failed to parse analysis results. Please try again.",
      };
    }
  } catch (error) {
    console.error("Error in analyzeReport:", error);
    return {
      success: false,
      message: "An unexpected error occurred during analysis.",
    };
  }
};

// Utility function for simpler text analysis
export const analyzeTextWithGemini = async (text) => {
  const prompt = `Analyze the following text and provide a summary with key points:
  
  Text:
  ${text}
  
  Provide the response in clear, concise paragraphs with bullet points for key findings.`;

  const result = await callGemini(prompt);
  return result.success ? result.data : "Error analyzing text";
};
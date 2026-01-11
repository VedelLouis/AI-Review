
import { GoogleGenAI } from "@google/genai";
import { ReviewResult } from "../types";
import { SYSTEM_PROMPT, REVIEW_SCHEMA } from "../constants";

export const performCodeReview = async (code: string, language: string = "python"): Promise<ReviewResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Langage : ${language}\n\nCode à réviser :\n\`\`\`${language}\n${code}\n\`\`\``,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: REVIEW_SCHEMA,
        temperature: 0.2, // Low temperature for consistent code analysis
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("L'IA n'a retourné aucun contenu.");
    }

    return JSON.parse(text) as ReviewResult;
  } catch (error) {
    console.error("Error during Gemini API call:", error);
    throw error;
  }
};

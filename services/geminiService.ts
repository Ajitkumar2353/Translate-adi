
import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

export const translateText = async (
  text: string, 
  sourceLang: Language, 
  targetLang: Language
): Promise<{ translatedText: string; detectedLanguage?: string }> => {
  if (!text.trim()) return { translatedText: "" };

  // Initialize inside the function to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `You are an expert English-Hindi-Odia translator.
    Your task: Translate the input text to fluent, natural Odia.
    - If source is "Auto-Detect", identify if it's English or Hindi.
    - Return ONLY the translated Odia text.
    - Do not add notes, explanations, or quotes.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Source Language setting: ${sourceLang}. Target: Odia. Text to translate: "${text}"`,
      config: {
        systemInstruction,
        temperature: 0.1, // Near-zero temperature for maximum speed and consistency
      },
    });

    const translatedText = response.text || "Translation failed.";
    
    // Simple heuristic for detection result display if it was auto
    let detected = undefined;
    if (sourceLang === Language.AUTO) {
      // In a real high-perf app, we'd rely on the model to just do it, 
      // but if we need to show the "Detected" badge, we can ask the model 
      // or just assume based on common character sets if speed is paramount.
      // For now, focus on the translation itself being the primary "working" part.
    }

    return { translatedText, detectedLanguage: detected };
  } catch (error) {
    console.error("Gemini Translation Error Details:", error);
    throw error;
  }
};

export const detectLanguage = async (text: string): Promise<Language> => {
  if (!text.trim()) return Language.AUTO;
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Return only the word "Hindi" or "English" for this text: "${text}"`,
      config: { temperature: 0.1 },
    });

    const result = response.text?.trim().toLowerCase() || "";
    if (result.includes("hindi")) return Language.HINDI;
    return Language.ENGLISH;
  } catch {
    return Language.ENGLISH;
  }
};

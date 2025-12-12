
import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini safely
// We check if process exists to avoid crashing in browser environments that don't polyfill it
const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const getAIRecommendations = async (query: string): Promise<string[]> => {
  if (!apiKey) {
    console.warn("No API Key provided for Gemini");
    return [];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User search query: "${query}".
      
      The user is searching on a rental marketplace (like borrowing items from neighbors).
      Based on their query, suggest 5 specific item categories they might be looking for or that would be helpful for their intent.
      For example, if they say "wedding", suggest "speakers", "chairs", "marquee", "camera", "lighting".
      If they say "drill", suggest "impact driver", "hammer drill", "rotary hammer".
      
      Return ONLY a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return [];
  }
};

export const detectObjectInImage = async (base64Image: string): Promise<{ ymin: number, xmin: number, ymax: number, xmax: number } | null> => {
  if (!apiKey) return null;

  try {
    // Remove header if present (data:image/jpeg;base64,)
    const cleanBase64 = base64Image.split(',')[1];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          {
            text: "Detect the single most prominent physical object for sale/rent in this image. Return the bounding box coordinates as percentages (0-100) of the image size. Return JSON."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ymin: { type: Type.NUMBER, description: "Top edge percentage (0-100)" },
            xmin: { type: Type.NUMBER, description: "Left edge percentage (0-100)" },
            ymax: { type: Type.NUMBER, description: "Bottom edge percentage (0-100)" },
            xmax: { type: Type.NUMBER, description: "Right edge percentage (0-100)" }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return null;
  }
};

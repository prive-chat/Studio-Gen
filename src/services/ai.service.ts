import { GoogleGenAI } from "@google/genai";

// Standard prompt engineering instructions
const SYSTEM_ENHANCE = "Eres un experto en prompts de ingeniería para IA generativa. Tu tarea es recibir una idea simple y convertirla en un prompt descriptivo, ultra-realista, artístico y cinematográfico en español que maximice la calidad visual, la profundidad y el uso de colores vibrantes. Si el prompt menciona personas, enfócate de forma obsesiva en el realismo facial: poros reales, textura de piel detallada, ojos cristalinos y brillantes, labios naturales y proporciones perfectas. Responde ÚNICAMENTE con el prompt mejorado en inglés para mejor compatibilidad con el motor de imagen, sin introducciones ni etiquetas.";
const STYLE_PRESETS: Record<string, string> = {
  "Cinematic": "cinematic lighting, anamorphic lens, shallow depth of field, 8k resolution, film grain, breathtaking atmosphere",
  "Hyper-Real": "ultra-realistic portrait photography, extremely sharp focus, 8k uhd, realistic skin textures, visible pores, detailed iris, high fidelity, masterwork, ray traced shadows",
  "Vibrant": "explosion of colors, high saturation, intense lighting, colorful palette, vivid, eye-catching, dynamic range",
  "Anime": "modern anime style, clean lines, vibrant colors, expressive characters, Studio Ghibli or Makoto Shinkai inspiration, detailed backgrounds",
  "3D Render": "3D masterpiece, Octane render, Unreal Engine 5, Pixar style, ray tracing, subsurface scattering, volumetric lighting, high fidelity",
  "Cyberpunk": "cyberpunk aesthetic, futuristic neon city, techwear, rainy night, cinematic lighting, high tech, glowing accents, cyan and magenta tones",
  "Oil Painting": "classical oil painting, visible canvas texture, thick brushstrokes, rich impasto, Rembrandt or Van Gogh technique, masterpiece",
  "Noir": "classic film noir, deep black and white, high contrast, dramatic shadows, moody atmosphere, moody lighting, 1940s aesthetics",
  "Pop Art": "vivid pop art style, Andy Warhol or Roy Lichtenstein inspired, bold colors, halftone patterns, comic book aesthetic, high impact",
  "Sketch": "artistic hand-drawn sketch, graphite or charcoal, rough texture, expressive lines, pencil drawing on paper, artistic masterpiece",
  "Double Exposure": "creative double exposure effect, two distinct images blended, surreal composition, artistic overlay, ghosting effects, minimalist background",
  "Concept": "masterpiece concept art, stylized, atmospheric, illustrative style, digital painting"
};

let aiClient: GoogleGenAI | null = null;
const getAI = () => {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not available in the frontend. Ensure 'AI Studio Free Tier' is selected in the Secrets panel and changes are applied.");
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
};

export class AIService {
  static async enhancePrompt(prompt: string): Promise<string> {
    try {
      const ai = getAI();
      // @ts-ignore
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", 
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_ENHANCE,
          temperature: 0.7,
        }
      });

      const text = response.text?.trim();
      if (!text) throw new Error("AI returned empty content");
      return text;
    } catch (error: any) {
      this.handleError(error, "Mejora de Prompt");
      throw error;
    }
  }

  static async generateScript(prompt: string): Promise<string> {
    try {
      const ai = getAI();
      // @ts-ignore
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Create a brief cinematographic narrative/script (max 3 short scenes) for this visual concept: "${prompt}". Focus on visual descriptions. Language: Spanish.`
      });
      return response.text || "Guión no disponible.";
    } catch (error: any) {
      console.warn("Script Generation optional failure:", error.message);
      return "Error al generar narrativa.";
    }
  }

  static async generateImage(prompt: string, aspectRatio: string = "16:9", style: string = "None"): Promise<string> {
    try {
      let finalPrompt = prompt;
      
      const personKeywords = ["man", "woman", "girl", "boy", "person", "face", "portrait", "human", "people", "child", "hombre", "mujer", "niño", "niña", "persona", "rostro"];
      const isPerson = personKeywords.some(key => prompt.toLowerCase().includes(key));
      
      if (isPerson) {
        finalPrompt += ", high definition facial features, eyes macro detail, realistic skin texture, symmetrical face, detailed iris, 8k resolution sharp focus";
      }

      if (style !== "None" && STYLE_PRESETS[style]) {
        finalPrompt = `${finalPrompt}. Style: ${STYLE_PRESETS[style]}`;
      }

      const ai = getAI();
      // @ts-ignore
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: finalPrompt,
        config: {
          imageConfig: {
            aspectRatio: (aspectRatio as any) || "16:9",
          }
        }
      });

      // @ts-ignore
      const parts = response.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find((p: any) => p.inlineData);
      
      if (imagePart?.inlineData?.data) {
        return `data:image/png;base64,${imagePart.inlineData.data}`;
      } else {
        throw new Error("No image data received from the generative model.");
      }
    } catch (error: any) {
      this.handleError(error, "Generación de Imagen");
      throw error;
    }
  }

  private static handleError(error: any, context: string) {
    console.error(`AIService Error [${context}]:`, error);
    if (error.message?.includes("API key not valid")) {
      error.message = "La clave de API (GEMINI_API_KEY) no es válida. Por favor, revísala en Settings -> Secrets.";
    } else if (error.message?.includes("Safety")) {
      error.message = "El contenido fue bloqueado por los filtros de seguridad de la IA.";
    }
  }
}

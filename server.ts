import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Lazy AI Client
let aiClient: GoogleGenAI | null = null;
const getAI = () => {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY || 
                process.env.GOOGLE_API_KEY || 
                process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
                process.env.VITE_GEMINI_API_KEY;
    
    if (!key || key.trim() === "") {
      throw new Error("GEMINI_API_KEY is not set. Please ensure you have added a Secret named 'GEMINI_API_KEY' with your API key and clicked 'Apply changes' in the Settings -> Secrets panel.");
    }

    aiClient = new GoogleGenAI({ apiKey: key.trim() });
  }
  return aiClient;
};

app.use(express.json());

// --- API ROUTES ---

app.post("/api/enhance", async (req, res) => {
  try {
    const { prompt } = req.body;
    const ai = getAI();
    // @ts-ignore
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: prompt,
      config: {
        systemInstruction: "Eres un experto en prompts de ingeniería para IA generativa. Tu tarea es recibir una idea simple y convertirla en un prompt descriptivo, artístico y cinematográfico en español que maximice la calidad visual. Responde ÚNICAMENTE con el prompt mejorado, sin introducciones ni etiquetas.",
      }
    });

    if (!response.text) {
      throw new Error("No text returned from AI");
    }
    res.json({ text: response.text.trim() });
  } catch (error: any) {
    console.error("API Enhance Error:", error.message);
    res.status(500).json({ error: error.message || "Internal AI Error" });
  }
});

app.post("/api/script", async (req, res) => {
  try {
    const { prompt } = req.body;
    const ai = getAI();
    // @ts-ignore
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Crea un guión cinematográfico corto de 3 escenas basado en este prompt: "${prompt}". Enfócate en descripciones visuales intensas. Responde brevemente.`
    });
    res.json({ text: response.text });
  } catch (error: any) {
    console.error("API Script Error:", error.message);
    res.status(500).json({ error: error.message || "Internal AI Error" });
  }
});

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, aspectRatio, style } = req.body;
    
    // Style logic
    let finalPrompt = prompt;
    if (style !== "None") {
      const styleInstructions: Record<string, string> = {
        "Cinematic": "cinematic lighting, anamorphic lens, shallow depth of field, 8k resolution, film grain",
        "Hyper-Real": "extremely detailed, hyper-realistic textures, ray traced, photorealism, sharp focus",
        "Macro": "macro photography, extreme close-up, intricate details, bokeh background",
        "Concept": "masterpiece concept art, stylized, atmospheric, illustrative style"
      };
      finalPrompt = `${prompt}. Style: ${styleInstructions[style]}`;
    }

    const ai = getAI();
    // @ts-ignore
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: finalPrompt,
      config: {
        imageConfig: {
          aspectRatio: aspectRatio || "16:9",
        }
      }
    });

    // Find the image part as per skill guidelines
    // @ts-ignore
    const parts = response.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: any) => p.inlineData);
    
    if (imagePart?.inlineData?.data) {
      res.json({ image: `data:image/png;base64,${imagePart.inlineData.data}` });
    } else {
      console.error("No image data in response parts:", parts);
      throw new Error("No image data generated");
    }
  } catch (error: any) {
    console.error("API Generate Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// --- VITE MIDDLEWARE ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`API Key present: ${!!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)}`);
  });
}

startServer();

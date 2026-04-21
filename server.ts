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
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is required in environment variables.");
    }
    aiClient = new GoogleGenAI({ apiKey: key });
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
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "Eres un experto en prompts de ingeniería para IA generativa. Tu tarea es recibir una idea simple y convertirla en un prompt descriptivo, artístico y cinematográfico en español que maximice la calidad visual. Responde ÚNICAMENTE con el prompt mejorado, sin introducciones ni etiquetas.",
      }
    });

    res.json({ text: response.text?.trim() });
  } catch (error: any) {
    console.error("API Enhance Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/script", async (req, res) => {
  try {
    const { prompt } = req.body;
    const ai = getAI();
    // @ts-ignore
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: `Crea un guión cinematográfico corto de 3 escenas basado en este prompt: "${prompt}". Enfócate en descripciones visuales intensas. Responde brevemente.` }] }]
    });
    res.json({ text: response.text });
  } catch (error: any) {
    console.error("API Script Error:", error.message);
    res.status(500).json({ error: error.message });
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
      contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
      config: {
        imageConfig: {
          aspectRatio: aspectRatio || "16:9",
        }
      }
    });

    const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    
    if (part?.inlineData) {
      res.json({ image: `data:image/png;base64,${part.inlineData.data}` });
    } else {
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
  });
}

startServer();

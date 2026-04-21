export class AIService {
  static async enhancePrompt(prompt: string): Promise<string> {
    try {
      const response = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) throw new Error("Enhance API failed");
      const data = await response.json();
      return data.text || prompt;
    } catch (error) {
      console.error("AIService.enhancePrompt Error:", error);
      throw error;
    }
  }

  static async generateScript(prompt: string): Promise<string> {
    try {
      const response = await fetch("/api/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) throw new Error("Script API failed");
      const data = await response.json();
      return data.text || "No se pudo generar el guión.";
    } catch (error) {
      console.error("AIService.generateScript Error:", error);
      return "Error generando guión.";
    }
  }

  static async generateImage(prompt: string, aspectRatio: string = "16:9", style: string = "None"): Promise<string> {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, aspectRatio, style }),
      });
      if (!response.ok) throw new Error("Generate API failed");
      const data = await response.json();
      return data.image;
    } catch (error) {
      console.error("AIService.generateImage Error:", error);
      throw error;
    }
  }
}

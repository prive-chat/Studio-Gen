import { useState, useCallback, useEffect } from "react";
import { AIService } from "../services/ai.service";
import { DBService } from "../services/db.service";
import { supabase } from "../lib/supabase";
import { GenMode, GenResult, AspectRatio, GenStyle } from "../types/generator";

export function useGenerator() {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<GenMode>("image");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [style, setStyle] = useState<GenStyle>("None");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [result, setResult] = useState<GenResult | null>(null);
  const [history, setHistory] = useState<GenResult[]>([]);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Sync with Supabase Auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load history from Supabase
  useEffect(() => {
    if (user) {
      DBService.getGenerations().then(setHistory);
    } else {
      setHistory([]);
    }
  }, [user]);

  // Real-time synchronization listener
  useEffect(() => {
    if (!user) return;

    const channel = DBService.subscribeToGenerations((payload) => {
      if (payload.eventType === 'INSERT') {
        const newItem: GenResult = {
          type: payload.new.type,
          url: payload.new.url,
          prompt: payload.new.prompt,
          script: payload.new.script
        };
        
        setHistory(prev => {
          // Check if it already exists to prevent duplication with optimistic updates
          if (prev.find(item => item.url === newItem.url)) return prev;
          return [newItem, ...prev];
        });
      } else if (payload.eventType === 'DELETE') {
        // Handle deletions if needed
        DBService.getGenerations().then(setHistory);
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const simulateProgress = async (target: number, msg: string, duration = 800) => {
    setStatusMsg(msg);
    const steps = 15;
    const currentProgress = progress;
    const increment = (target - currentProgress) / steps;
    
    for (let i = 0; i < steps; i++) {
      setProgress(prev => {
        const next = prev + increment;
        return next > target ? target : next;
      });
      await new Promise(r => setTimeout(r, duration / steps));
    }
  };

  const enhancePrompt = useCallback(async () => {
    if (!prompt.trim() || isEnhancing) return;
    setIsEnhancing(true);
    try {
      const enhanced = await AIService.enhancePrompt(prompt);
      setPrompt(enhanced);
    } catch (error) {
      console.error("Hook Error (enhance):", error);
    } finally {
      setIsEnhancing(false);
    }
  }, [prompt, isEnhancing]);

  const generate = async () => {
    if (!prompt.trim() || loading) return;
    
    setLoading(true);
    setResult(null);
    setProgress(0);

    try {
      let finalResult: GenResult;
      if (mode === "image") {
        await simulateProgress(30, "Analizando visión...");
        await simulateProgress(60, "Sintetizando...");
        
        const imageUrl = await AIService.generateImage(prompt, aspectRatio, style);
        
        await simulateProgress(100, "Renderizado finalizado.");
        finalResult = { type: "image", url: imageUrl, prompt };
      } else {
        await simulateProgress(20, "Diseñando narrativa...");
        const script = await AIService.generateScript(prompt);

        await simulateProgress(50, "Extrayendo fotogramas...");
        const imageUrl = await AIService.generateImage(prompt, aspectRatio, style); // Preview frame

        await simulateProgress(90, "Ensamblando...");
        await new Promise(r => setTimeout(r, 400));
        await simulateProgress(100, "Cinemática lista.");
        
        finalResult = { type: "video", url: imageUrl, prompt, script };
      }

      setResult(finalResult);
      
      // Save to Supabase if logged in
      if (user) {
        await DBService.saveGeneration(finalResult);
        // Refresh history to include new item (already updated locally for speed)
        setHistory(prev => [finalResult, ...prev]);
      } else {
        setHistory(prev => [finalResult, ...prev]);
      }
    } catch (error) {
      console.error("Hook Error (generate):", error);
      alert("Error en la generación. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1500);
    }
  };

  const clear = () => {
    setPrompt("");
    setResult(null);
  };

  return {
    prompt,
    setPrompt,
    mode,
    setMode,
    aspectRatio,
    setAspectRatio,
    style,
    setStyle,
    loading,
    progress,
    statusMsg,
    result,
    setResult,
    history,
    setHistory,
    isEnhancing,
    enhancePrompt,
    generate,
    clear,
    user
  };
}

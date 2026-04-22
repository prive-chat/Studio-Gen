import { create } from 'zustand';
import { GenMode, GenResult, AspectRatio, GenStyle, GenStatus } from '../types/generator';
import { AIService } from '../services/ai.service';
import { DBService } from '../services/db.service';
import { supabase } from '../lib/supabase';

interface AppState {
  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  
  // User State
  user: any | null;
  setUser: (user: any) => void;

  // Generator Configuration
  prompt: string;
  setPrompt: (p: string) => void;
  mode: GenMode;
  setMode: (m: GenMode) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (a: AspectRatio) => void;
  style: GenStyle;
  setStyle: (s: GenStyle) => void;

  // Generator Execution
  loading: boolean;
  progress: number;
  statusMsg: string;
  result: GenResult | null;
  setResult: (r: GenResult | null) => void;
  history: GenResult[];
  isEnhancing: boolean;

  // Actions
  enhancePrompt: () => Promise<void>;
  generate: () => Promise<void>;
  clear: () => void;
  setHistory: (h: GenResult[]) => void;
  
  // Notifications
  notifications: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>;
  addNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeNotification: (id: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // UI
  sidebarOpen: false,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  authModalOpen: false,
  setAuthModalOpen: (authModalOpen) => set({ authModalOpen }),

  // User
  user: null,
  setUser: (user) => set({ user }),

  // Config
  prompt: "",
  setPrompt: (prompt) => set({ prompt }),
  mode: "image",
  setMode: (mode) => set({ mode }),
  aspectRatio: "16:9",
  setAspectRatio: (aspectRatio) => set({ aspectRatio }),
  style: "None",
  setStyle: (style) => set({ style }),

  // Execution
  loading: false,
  progress: 0,
  statusMsg: "",
  result: null,
  setResult: (result) => set({ result }),
  history: [],
  isEnhancing: false,

  setHistory: (history) => set({ history }),

  // Helpers
  addNotification: (message, type = 'info') => {
    const id = Math.random().toString(36).substring(7);
    set(state => ({
      notifications: [...state.notifications, { id, message, type }]
    }));
    setTimeout(() => get().removeNotification(id), 5000);
  },
  removeNotification: (id) => set(state => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  notifications: [],

  // Business Logic
  enhancePrompt: async () => {
    const { prompt, isEnhancing, addNotification } = get();
    if (!prompt.trim() || isEnhancing) return;
    
    set({ isEnhancing: true });
    try {
      const enhanced = await AIService.enhancePrompt(prompt);
      set({ prompt: enhanced });
      addNotification("Prompt optimizado con éxito", "success");
    } catch (error: any) {
      addNotification(error.message || "Error al mejorar el prompt", "error");
    } finally {
      set({ isEnhancing: false });
    }
  },

  generate: async () => {
    const { prompt, mode, aspectRatio, style, loading, user, addNotification } = get();
    if (!prompt.trim() || loading) return;

    set({ loading: true, result: null, progress: 0 });

    const simulateProgress = async (target: number, msg: string) => {
      set({ statusMsg: msg });
      const current = get().progress;
      const step = (target - current) / 10;
      for (let i = 0; i < 10; i++) {
        set(state => ({ progress: Math.min(state.progress + step, target) }));
        await new Promise(r => setTimeout(r, 100));
      }
    };

    try {
      let finalResult: GenResult;
      
      if (mode === "image") {
        await simulateProgress(40, "Analizando composición...");
        const imageUrl = await AIService.generateImage(prompt, aspectRatio, style);
        await simulateProgress(100, "Finalizando...");
        finalResult = { type: "image", url: imageUrl, prompt };
      } else {
        await simulateProgress(20, "Diseñando narrativa...");
        const script = await AIService.generateScript(prompt);
        await simulateProgress(60, "Renderizando visuales...");
        const imageUrl = await AIService.generateImage(prompt, aspectRatio, style);
        await simulateProgress(100, "Ensamblando escena...");
        finalResult = { type: "video", url: imageUrl, prompt, script };
      }

      set({ result: finalResult });
      addNotification("Generación completada", "success");
      
      // Save logic (Optimistic and actual)
      if (user) {
        // Actual save happens in background
        DBService.saveGeneration(finalResult).catch(e => {
          console.error("Failed to save background:", e);
        });
      }
      
      // Local history update
      set(state => ({
        history: [finalResult, ...state.history].slice(0, 20) // Keep reasonable local history
      }));

    } catch (error: any) {
      addNotification(error.message || "Error en la generación", "error");
    } finally {
      set({ loading: false });
    }
  },

  clear: () => set({ prompt: "", result: null, progress: 0 })
}));

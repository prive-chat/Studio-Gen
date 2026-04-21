import React from "react";
import { Sparkles, Trash2, Loader2, Bolt, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GenMode, AspectRatio, GenStyle } from "../../types/generator";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  prompt: string;
  setPrompt: (v: string) => void;
  mode: GenMode;
  setMode: (m: GenMode) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (a: AspectRatio) => void;
  style: GenStyle;
  setStyle: (s: GenStyle) => void;
  loading: boolean;
  isEnhancing: boolean;
  onEnhance: () => void;
  onGenerate: () => void;
  onClear: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  setIsOpen,
  prompt,
  setPrompt,
  mode,
  setMode,
  aspectRatio,
  setAspectRatio,
  style,
  setStyle,
  loading,
  isEnhancing,
  onEnhance,
  onGenerate,
  onClear
}) => {
  const ratios: AspectRatio[] = ["1:1", "9:16", "16:9", "4:3", "3:4"];
  const styles: GenStyle[] = ["Cinematic", "Hyper-Real", "Macro", "Concept", "None"];

  const content = (
    <div className="flex flex-col h-full bg-brand-sidebar border-r border-white/10 w-80 max-w-[85vw]">
      <div className="p-4 flex items-center justify-between border-b border-white/10 lg:hidden">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Settings</span>
        <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 text-slate-500">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-4">
          <label className="creation-prompt-label">Creation Prompt</label>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Cybernetic samurai standing in a neon-drenched Kyoto rain..."
            className="w-full h-32 md:h-40 bg-slate-900/50 border border-white/10 rounded-xl p-4 text-sm resize-none focus:ring-1 focus:ring-brand-indigo outline-none transition-all placeholder:text-slate-600 leading-relaxed"
          />
          <div className="flex gap-2">
            <button 
              onClick={onEnhance}
              disabled={!prompt || isEnhancing || loading}
              className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isEnhancing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-brand-indigo-light" />}
              {isEnhancing ? "Refinando" : "Mejorar"}
            </button>
            <button 
              onClick={onClear}
              className="px-4 py-3 bg-white/5 hover:bg-red-500/10 border border-white/10 text-slate-500 hover:text-red-400 rounded-xl transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <label className="param-label">Generation Parameters</label>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setMode('image')}
                className={`flex flex-col p-3 border rounded-xl items-start gap-1 transition-all ${mode === 'image' ? 'bg-brand-indigo/10 border-brand-indigo text-brand-indigo-light' : 'bg-white/5 border-white/10 opacity-70'}`}
              >
                <span className="text-[9px] uppercase text-slate-500 font-bold">Type</span>
                <span className="text-xs font-bold uppercase tracking-wider">Image</span>
              </button>
              <button 
                onClick={() => setMode('video')}
                className={`flex flex-col p-3 border rounded-xl items-start gap-1 transition-all ${mode === 'video' ? 'bg-brand-indigo/10 border-brand-indigo text-brand-indigo-light' : 'bg-white/5 border-white/10 opacity-70'}`}
              >
                <span className="text-[9px] uppercase text-slate-500 font-bold">Type</span>
                <span className="text-xs font-bold uppercase tracking-wider">Video</span>
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] uppercase text-slate-500 font-bold">Aspect Ratio</span>
              <div className="flex flex-wrap gap-1.5">
                {ratios.map(r => (
                  <button
                    key={r}
                    onClick={() => setAspectRatio(r)}
                    className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${aspectRatio === r ? 'bg-brand-indigo border-brand-indigo text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="param-label">Advanced Styling</label>
          <div className="flex flex-wrap gap-2">
            {styles.map(s => (
              <button 
                key={s} 
                onClick={() => setStyle(s)}
                className={`px-2 py-1 border rounded text-[10px] font-bold transition-all ${style === s ? 'bg-brand-indigo/20 text-brand-indigo-light border-brand-indigo/40' : 'bg-white/5 text-slate-400 border-white/10'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-white/10 bg-brand-sidebar shadow-[0_-10px_20px_rgba(0,0,0,0.4)]">
        <button 
          onClick={onGenerate}
          disabled={!prompt || loading}
          className="btn-primary w-full"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bolt className="w-4 h-4 text-white" />}
          {loading ? "Generating..." : "Generate Asset"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex shrink-0">
        {content}
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 left-0 shadow-2xl"
            >
              {content}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

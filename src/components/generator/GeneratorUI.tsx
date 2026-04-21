import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Play, Wand2, Image as ImageIcon, Maximize2, X, Download } from "lucide-react";
import { GenResult } from "../../types/generator";

export const FullScreenModal: React.FC<{ result: GenResult; onClose: () => void; onDownload: () => void }> = ({ result, onClose, onDownload }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex items-center justify-center overflow-hidden"
    onClick={onClose}
  >
    <div className="absolute top-6 right-6 flex gap-4 z-[110]" onClick={(e) => e.stopPropagation()}>
      <button 
        onClick={onDownload}
        className="w-10 h-10 md:w-12 md:h-12 bg-white/5 hover:bg-white/20 border border-white/10 rounded-full flex items-center justify-center transition-all group"
        title="Download"
      >
        <Download className="w-4 h-4 md:w-5 md:h-5 text-white/60 group-hover:text-white" />
      </button>
      <button 
        onClick={onClose}
        className="w-10 h-10 md:w-12 md:h-12 bg-white/5 hover:bg-white/20 border border-white/10 rounded-full flex items-center justify-center transition-all group"
        title="Close"
      >
        <X className="w-5 h-5 md:w-6 md:h-6 text-white/60 group-hover:text-white" />
      </button>
    </div>

    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-full h-full flex items-center justify-center p-2 md:p-8"
    >
      {result.type === "image" ? (
        <img 
          src={result.url} 
          className="max-w-full max-h-full object-contain shadow-[0_0_100px_rgba(0,0,0,0.5)] select-none" 
          alt="Full Screen Result" 
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div 
          className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center bg-black/40 rounded-3xl overflow-hidden shadow-2xl border border-white/5"
          onClick={(e) => e.stopPropagation()}
        >
          <img src={result.url} className="w-full h-full object-cover opacity-20 blur-2xl scale-110" alt="Video Background" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-20 h-20 md:w-28 md:h-28 bg-brand-indigo/10 backdrop-blur-2xl rounded-full flex items-center justify-center border border-brand-indigo/30 mb-8 shadow-2xl">
              <Play className="w-8 h-8 md:w-12 md:h-12 text-brand-indigo-light fill-brand-indigo-light" />
            </div>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.6em] text-white/40">Cinematic Masterpiece</span>
          </div>
        </div>
      )}
    </motion.div>
  </motion.div>
);

export const LoadingState: React.FC<{ progress: number; statusMsg: string }> = ({ progress, statusMsg }) => (
  <motion.div 
    key="loading"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="text-center space-y-4 md:space-y-6 px-6"
  >
    <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-full mx-auto flex items-center justify-center animate-pulse relative">
      <div className="absolute inset-0 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin"></div>
      <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-brand-indigo-light" />
    </div>
    <p className="text-slate-400 text-[10px] md:text-xs font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase animate-pulse">{statusMsg || "Rendering..."}</p>
    
    <div className="w-40 md:w-48 h-1 bg-slate-800 rounded-full mx-auto overflow-hidden">
      <motion.div 
        className="h-full bg-brand-indigo"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
      />
    </div>
  </motion.div>
);

export const ResultView: React.FC<{ result: GenResult; onVariation: () => void; onDownload: () => void }> = ({ result, onVariation, onDownload }) => {
  const [showFull, setShowFull] = useState(false);

  return (
    <>
      <motion.div 
        key="result"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full h-full flex flex-col"
      >
        <div className="flex-1 flex items-center justify-center p-3 md:p-4 min-h-0 relative group">
          {result.type === "image" ? (
            <img src={result.url} className="max-w-full max-h-full object-contain rounded-xl md:rounded-2xl shadow-inner" alt="Result" />
          ) : (
            <div className="relative group flex items-center justify-center w-full h-full">
              <img src={result.url} className="w-full h-full object-cover opacity-40 blur-sm rounded-xl md:rounded-2xl" alt="Video Preview" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-indigo/20 backdrop-blur-md rounded-full flex items-center justify-center border border-brand-indigo/30 mb-2 md:mb-4 transition-transform group-hover:scale-110">
                  <Play className="w-4 h-4 md:w-6 md:h-6 text-brand-indigo-light fill-brand-indigo-light" />
                </div>
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em]">Cinematic Sequence</span>
              </div>
            </div>
          )}
          
          <button 
            onClick={() => setShowFull(true)}
            className="absolute top-6 right-6 md:top-8 md:right-8 w-8 h-8 md:w-10 md:h-10 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-indigo/20"
            title="Pantalla Completa"
          >
            <Maximize2 className="w-3 h-3 md:w-4 md:h-4 text-white" />
          </button>
        </div>

        {result.script && (
          <div className="px-4 md:px-8 pb-3 md:pb-4">
            <div className="p-3 md:p-4 bg-black/40 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/5 max-h-24 md:max-h-32 overflow-y-auto">
              <h4 className="text-[8px] md:text-[9px] font-bold text-brand-indigo-light uppercase mb-1 md:mb-2">Narrative Concept</h4>
              <p className="text-[10px] md:text-xs text-slate-400 font-medium leading-relaxed">{result.script}</p>
            </div>
          </div>
        )}

        <div className="p-4 md:p-6 bg-black/40 backdrop-blur-md border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex gap-4 md:gap-8 order-2 sm:order-1">
            <div className="space-y-0.5 md:space-y-1">
              <p className="text-[8px] md:text-[9px] uppercase text-slate-500 tracking-tighter font-bold">Res</p>
              <p className="text-[10px] md:text-xs font-bold font-mono">4K</p>
            </div>
            <div className="space-y-0.5 md:space-y-1 hidden xs:block">
              <p className="text-[8px] md:text-[9px] uppercase text-slate-500 tracking-tighter font-bold">Engine</p>
              <p className="text-[10px] md:text-xs font-bold font-mono tracking-tighter uppercase">IMAGEN</p>
            </div>
            <div className="space-y-0.5 md:space-y-1">
              <p className="text-[8px] md:text-[9px] uppercase text-slate-500 tracking-tighter font-bold">Speed</p>
              <p className="text-[10px] md:text-xs font-bold font-mono">14.2s</p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2">
            <button 
              onClick={onVariation}
              className="flex-1 sm:flex-none px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] md:text-[10px] uppercase font-bold tracking-widest hover:bg-white/10 transition"
            >
              Variation
            </button>
            <button 
              onClick={onDownload}
              className="flex-1 sm:flex-none px-4 py-2 bg-brand-indigo-dark rounded-lg text-[9px] md:text-[10px] uppercase font-bold tracking-widest hover:bg-brand-indigo transition shadow-lg shadow-brand-indigo/20"
            >
              Download
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showFull && (
          <FullScreenModal 
            result={result} 
            onClose={() => setShowFull(false)} 
            onDownload={onDownload}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export const Sandbox: React.FC = () => (
  <motion.div 
    key="empty"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center space-y-4 md:space-y-6 px-6"
  >
    <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-full mx-auto flex items-center justify-center border border-white/5">
      <Wand2 className="w-5 h-5 md:w-6 md:h-6 text-slate-600" />
    </div>
    <div className="space-y-2">
      <h3 className="text-sm md:text-lg font-bold tracking-[0.1em] uppercase">Creative Sandbox</h3>
      <p className="text-slate-500 text-[9px] md:text-[11px] font-medium max-w-xs md:max-w-sm mx-auto uppercase tracking-wider">
        Ready for your next digital masterpiece. Enter a prompt to begin.
      </p>
    </div>
  </motion.div>
);

export const RecentGenerations: React.FC<{ 
  history: GenResult[]; 
  onSelect: (r: GenResult) => void;
}> = ({ history, onSelect }) => (
  <div className="h-40 md:h-48 border-t border-white/10 p-4 md:p-6 flex flex-col gap-3 md:gap-4 bg-brand-section shrink-0 overflow-hidden">
    <div className="flex justify-between items-center">
      <h4 className="text-[8px] md:text-[10px] uppercase tracking-widest text-slate-500 font-bold font-mono">Session Assets</h4>
      <span className="text-[8px] md:text-[10px] text-brand-indigo-light font-bold hover:underline cursor-pointer uppercase tracking-widest shrink-0">
        Results: {history.length}
      </span>
    </div>
    <div className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar pb-2 scroll-smooth">
      <AnimatePresence mode="popLayout">
        {history.length > 0 ? (
          history.map((item, index) => (
            <motion.div 
              key={item.url + index}
              initial={{ scale: 0.8, opacity: 0, x: -20 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => onSelect(item)}
              className="w-24 h-24 md:w-32 md:h-32 rounded-lg md:rounded-xl overflow-hidden flex-shrink-0 border border-white/5 cursor-pointer group relative bg-black/50"
            >
              <img 
                src={item.url} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100" 
                alt="Thumbnail" 
              />
              <div className="absolute inset-0 bg-brand-indigo/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {item.type === 'video' && <Play className="w-5 h-5 text-white/80 fill-white/20" />}
              </div>
            </motion.div>
          ))
        ) : (
          [1, 2, 3, 4, 5].map(i => (
            <div 
              key={i} 
              className="w-24 h-24 md:w-32 md:h-32 rounded-lg md:rounded-xl bg-slate-800/10 flex-shrink-0 border border-dotted border-white/5 flex items-center justify-center"
            >
              <ImageIcon className="w-4 h-4 md:w-5 md:h-5 text-slate-800" />
            </div>
          ))
        )}
      </AnimatePresence>
    </div>
  </div>
);

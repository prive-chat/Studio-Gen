/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useGenerator } from "./hooks/useGenerator";
import { Navbar, Footer } from "./components/layout/Layout";
import { Sidebar } from "./components/layout/Sidebar";
import { 
  LoadingState, 
  ResultView, 
  Sandbox, 
  RecentGenerations 
} from "./components/generator/GeneratorUI";

export default function App() {
  const {
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
    clear
  } = useGenerator();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [result]);

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result.url;
    link.download = `studiogen-${Date.now()}.png`;
    link.click();
  };

  const handleVariation = () => {
    if (!result) return;
    setResult(null);
    generate();
  };

  const onGenerate = () => {
    setSidebarOpen(false);
    generate();
  };

  return (
    <div className="flex flex-col h-screen bg-brand-bg text-slate-100 overflow-hidden select-none font-sans">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <main className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          prompt={prompt}
          setPrompt={setPrompt}
          mode={mode}
          setMode={setMode}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          style={style}
          setStyle={setStyle}
          loading={loading}
          isEnhancing={isEnhancing}
          onEnhance={enhancePrompt}
          onGenerate={onGenerate}
          onClear={clear}
        />

        <section className="flex-1 flex flex-col bg-brand-section overflow-hidden relative">
          <div className="flex-1 p-4 md:p-8 flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-full max-w-4xl bg-slate-900/50 rounded-[24px] md:rounded-[32px] border border-white/5 overflow-hidden shadow-2xl flex flex-col">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_0%,#4338ca_0%,transparent_50%)] pointer-events-none"></div>
              
              <div className="flex-1 flex items-center justify-center relative overflow-hidden" ref={resultRef}>
                <AnimatePresence mode="wait">
                  {loading ? (
                    <LoadingState progress={progress} statusMsg={statusMsg} />
                  ) : result ? (
                    <ResultView 
                      result={result} 
                      onVariation={handleVariation} 
                      onDownload={handleDownload} 
                    />
                  ) : (
                    <Sandbox />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <RecentGenerations 
            history={history} 
            onSelect={(item) => {
              setResult(item);
              setPrompt(item.prompt);
            }} 
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}



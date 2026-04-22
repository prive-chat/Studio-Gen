import { useEffect, useRef } from "react";
import { AnimatePresence } from "motion/react";
import { useStore } from "./store/useStore";
import { Navbar, Footer } from "./components/layout/Layout";
import { Sidebar } from "./components/layout/Sidebar";
import { 
  LoadingState, 
  ResultView, 
  Sandbox, 
  RecentGenerations 
} from "./components/generator/GeneratorUI";
import { AuthModal } from "./components/auth/AuthModal";
import { ToastContainer } from "./components/ui/Toast";
import { supabase } from "./lib/supabase";
import { DBService } from "./services/db.service";

export default function App() {
  const s = useStore();
  const resultRef = useRef<HTMLDivElement>(null);
  
  // Auth Synchronization
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => s.setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      s.setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // History Synchronization
  useEffect(() => {
    if (s.user) {
      DBService.getGenerations().then(s.setHistory);
      const channel = DBService.subscribeToGenerations(() => {
        DBService.getGenerations().then(s.setHistory);
      });
      return () => { supabase.removeChannel(channel); };
    } else {
      s.setHistory([]);
    }
  }, [s.user]);

  // UX: Auto-scroll to results
  useEffect(() => {
    if (s.result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [s.result]);

  return (
    <div className="flex flex-col h-screen bg-brand-bg text-slate-100 overflow-hidden select-none font-sans">
      <ToastContainer />
      <AuthModal isOpen={s.authModalOpen} onClose={() => s.setAuthModalOpen(false)} />
      
      <Navbar />

      <main className="flex flex-1 overflow-hidden relative">
        <Sidebar />

        <section className="flex-1 flex flex-col bg-brand-section overflow-hidden relative">
          <div className="flex-1 p-4 md:p-8 flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-full max-w-4xl bg-slate-900/50 rounded-[24px] md:rounded-[32px] border border-white/5 overflow-hidden shadow-2xl flex flex-col">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_0%,#4338ca_0%,transparent_50%)] pointer-events-none" />
              
              <div className="flex-1 flex items-center justify-center relative overflow-hidden" ref={resultRef}>
                <AnimatePresence mode="wait">
                  {s.loading ? (
                    <LoadingState progress={s.progress} statusMsg={s.statusMsg} />
                  ) : s.result ? (
                    <ResultView 
                      result={s.result} 
                      onVariation={() => s.generate()} 
                      onDownload={() => {
                        const link = document.createElement("a");
                        link.href = s.result!.url;
                        link.download = `artistry-${Date.now()}.png`;
                        link.click();
                      }} 
                    />
                  ) : (
                    <Sandbox />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <RecentGenerations 
            history={s.history} 
            onSelect={(item) => {
              s.setResult(item);
              s.setPrompt(item.prompt);
            }} 
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}

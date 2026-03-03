import { ReactNode } from "react";
import Navbar from "./Navbar";
import Background from "../canvas/Background";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col text-white selection:bg-[#22d3ee]/30">
      <Background />
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12 px-6 container mx-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Global CRT Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
    </div>
  );
}

import { Link } from "wouter";
import { motion } from "framer-motion";
import { Video, Mic, Image as ImageIcon, ShieldAlert, Cpu, Fingerprint } from "lucide-react";

export default function Home() {
  const labs = [
    {
      title: "Video Forensics",
      description: "Analyze micro-expressions, facial boundaries, and frame-by-frame anomalies to detect deepfakes.",
      icon: Video,
      path: "/video",
      stats: "94.2% ACCURACY",
      color: "#22d3ee"
    },
    {
      title: "Audio Forensics",
      description: "Detect synthetic voice cloning via spectral harmony analysis and room impulse response.",
      icon: Mic,
      path: "/audio",
      stats: "SPECTRAL SCAN",
      color: "#a855f7"
    },
    {
      title: "Image Forensics",
      description: "Extract hidden metadata, analyze error levels, and uncover copy-move forgery artifacts.",
      icon: ImageIcon,
      path: "/image",
      stats: "ELA ACTIVE",
      color: "#10b981"
    }
  ];

  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col items-center justify-center text-center py-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 relative"
        >
          <div className="absolute inset-0 bg-[#22d3ee] blur-[60px] opacity-20 rounded-full" />
          <ShieldAlert className="w-24 h-24 text-[#22d3ee] relative z-10" />
        </motion.div>
        
        <motion.h1 
          className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          FORENSIC <span className="text-[#22d3ee]">COMMAND</span>
        </motion.h1>
        
        <motion.p 
          className="text-xl text-white/60 font-mono max-w-2xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          AWAITING EVIDENCE INPUT. SELECT A LAB ENVIRONMENT TO BEGIN NEURAL ANALYSIS.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {labs.map((lab, index) => (
          <Link key={lab.path} href={lab.path}>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="group block relative p-1 bg-[#22d3ee]/5 clip-edges hover:bg-[#22d3ee]/10 transition-colors cursor-pointer"
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#22d3ee] opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#22d3ee] opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#22d3ee] opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#22d3ee] opacity-50 group-hover:opacity-100 transition-opacity" />
              
              <div className="bg-[#020617]/80 backdrop-blur-sm p-6 h-full border border-[#22d3ee]/20 group-hover:border-[#22d3ee]/50 transition-colors flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-[#22d3ee]/10 rounded clip-edges text-[#22d3ee]">
                    <lab.icon className="w-8 h-8" />
                  </div>
                  <div className="px-2 py-1 bg-[#22d3ee]/10 border border-[#22d3ee]/30 font-mono text-[10px] text-[#22d3ee]">
                    {lab.stats}
                  </div>
                </div>
                
                <h3 className="text-2xl font-display text-white mb-3 group-hover:text-[#22d3ee] transition-colors">
                  {lab.title}
                </h3>
                
                <p className="text-white/60 font-sans leading-relaxed flex-grow">
                  {lab.description}
                </p>
                
                <div className="mt-6 flex items-center gap-2 text-sm font-mono text-[#22d3ee] opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                  <Cpu className="w-4 h-4" />
                  INITIALIZE LAB
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <motion.div 
        className="mt-12 p-6 border border-[#22d3ee]/20 bg-[#020617]/50 backdrop-blur-md flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-4">
          <Fingerprint className="w-8 h-8 text-[#22d3ee]" />
          <div>
            <div className="text-sm font-mono text-[#22d3ee] mb-1">SYSTEM STATUS</div>
            <div className="font-display text-white uppercase">All Neural Models Online</div>
          </div>
        </div>
        <div className="flex gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-1.5 h-8 bg-[#22d3ee]/20 overflow-hidden relative">
              <motion.div 
                className="absolute bottom-0 left-0 w-full bg-[#22d3ee]"
                animate={{ height: ["20%", "80%", "40%", "100%", "30%"] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: i * 0.1 }}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Shield, Video, Mic, Image as ImageIcon, Activity } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { path: "/video", icon: Video, label: "Video Lab" },
    { path: "/audio", icon: Mic, label: "Audio Lab" },
    { path: "/image", icon: ImageIcon, label: "Image Lab" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-[#22d3ee]/20 bg-[#020617]/80 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 flex items-center justify-center bg-[#22d3ee]/10 rounded clip-edges border border-[#22d3ee]/30 group-hover:border-[#22d3ee] transition-colors">
            <Shield className="w-5 h-5 text-[#22d3ee]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg leading-tight text-white tracking-widest glitch-hover">
              AEGIS
            </span>
            <span className="font-mono text-[10px] text-[#22d3ee]/70 tracking-widest leading-tight">
              CMD_CENTER v3.1
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path} className={`relative px-4 py-2 text-sm font-display tracking-widest uppercase transition-all duration-300 ${
              location === item.path ? "text-[#22d3ee]" : "text-white/60 hover:text-white"
            }`}>
              <span className="flex items-center gap-2">
                <item.icon className="w-4 h-4" />
                {item.label}
              </span>
              {location === item.path && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-[#22d3ee]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-4 bg-[#22d3ee]/30 blur-md rounded-full -translate-y-1/2" />
                </motion.div>
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-[#ef4444]/10 border border-[#ef4444]/30 clip-edges flex items-center gap-2">
            <Activity className="w-3 h-3 text-[#ef4444]" />
            <span className="font-mono text-xs text-[#ef4444]">NODE: ONLINE</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

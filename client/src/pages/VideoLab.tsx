import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ScanLine, AlertTriangle, CheckCircle, ChevronRight, Cpu } from "lucide-react";
import { api, type ForensicResponse } from "../lib/api";
import ProcessingCube from "../components/canvas/ProcessingCube";

export default function VideoLab() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ForensicResponse | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("video/")) {
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsProcessing(true);
    setResult(null);
    try {
      const response = await api.post("/analyze/video/", { file });
      setResult(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <header className="flex justify-between items-end border-b border-[#22d3ee]/30 pb-4">
        <div>
          <h1 className="text-3xl font-display text-white glitch-hover">VIDEO FORENSICS</h1>
          <p className="font-mono text-[#22d3ee]/70 text-sm mt-1">MODULE: DEEPFAKE_DETECTION_V3</p>
        </div>
        <div className="font-mono text-xs text-white/50 text-right">
          <div>MODEL: GTX 1650 TENSOR</div>
          <div>STATUS: <span className="text-[#22d3ee]">READY</span></div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
        {/* Main Work Area */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div 
            className={`flex-grow relative border-2 border-dashed ${file ? 'border-[#22d3ee]/50' : 'border-[#22d3ee]/20'} bg-[#020617]/50 backdrop-blur-sm flex items-center justify-center overflow-hidden transition-colors`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div 
                  key="upload"
                  className="text-center p-8 flex flex-col items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="w-16 h-16 rounded-full bg-[#22d3ee]/10 flex items-center justify-center mb-4 border border-[#22d3ee]/30">
                    <Upload className="w-8 h-8 text-[#22d3ee]" />
                  </div>
                  <h3 className="font-display text-xl mb-2">UPLOAD EVIDENCE</h3>
                  <p className="text-sm font-mono text-white/50">DRAG AND DROP VIDEO FILE HERE</p>
                  <label className="mt-6 px-6 py-2 bg-[#22d3ee]/10 border border-[#22d3ee] text-[#22d3ee] font-display uppercase hover:bg-[#22d3ee] hover:text-[#020617] transition-all cursor-pointer glow-border">
                    BROWSE SYSTEM
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="video/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setFile(f);
                          setPreviewUrl(URL.createObjectURL(f));
                        }
                      }}
                    />
                  </label>
                </motion.div>
              ) : (
                <motion.div 
                  key="preview"
                  className="absolute inset-0 w-full h-full flex items-center justify-center bg-black"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {previewUrl && (
                    <video 
                      src={previewUrl} 
                      className="w-full h-full object-contain"
                      controls={!isProcessing}
                      autoPlay
                      loop
                      muted
                    />
                  )}
                  
                  {isProcessing && (
                    <div className="absolute inset-0 z-10 pointer-events-none">
                      <div className="scanline" />
                      <div className="absolute inset-0 bg-[#22d3ee]/10 mix-blend-overlay" />
                    </div>
                  )}
                  
                  {result && result.is_fake && (
                    <motion.div 
                      className="absolute inset-0 border-4 border-[#ef4444] pointer-events-none z-20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="absolute top-4 left-4 bg-[#ef4444] text-white font-mono text-xs px-2 py-1 font-bold animate-pulse">
                        MANIPULATION DETECTED
                      </div>
                      
                      {/* Fake bounding boxes for visual effect */}
                      <motion.div 
                        className="absolute top-[20%] left-[30%] w-[40%] h-[50%] border border-[#ef4444] bg-[#ef4444]/10"
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", delay: 0.5 }}
                      >
                        <div className="absolute -top-6 left-0 text-[#ef4444] font-mono text-[10px] bg-[#020617]/80 px-1 border border-[#ef4444]/50">
                          FACIAL_BOUNDARY_MISMATCH [ERR_89]
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-between items-center bg-[#020617]/80 border border-[#22d3ee]/30 p-4 clip-edges">
            <div className="font-mono text-sm text-white/70">
              {file ? file.name : "NO_FILE_SELECTED"}
            </div>
            <button
              onClick={handleAnalyze}
              disabled={!file || isProcessing}
              className={`px-8 py-2 font-display uppercase tracking-widest flex items-center gap-2 transition-all ${
                !file || isProcessing 
                  ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10' 
                  : 'bg-[#22d3ee]/20 text-[#22d3ee] border border-[#22d3ee] hover:bg-[#22d3ee] hover:text-[#020617] glow-border'
              }`}
            >
              <ScanLine className="w-4 h-4" />
              {isProcessing ? "ANALYZING..." : "INITIALIZE SCAN"}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="border border-[#22d3ee]/30 bg-[#020617]/60 backdrop-blur-md flex flex-col clip-edges overflow-hidden">
          <div className="p-4 bg-[#22d3ee]/10 border-b border-[#22d3ee]/30 font-display text-sm tracking-widest uppercase">
            Analysis Results
          </div>
          
          <div className="p-6 flex-grow overflow-y-auto">
            <AnimatePresence mode="wait">
              {!isProcessing && !result && (
                <motion.div 
                  className="h-full flex flex-col items-center justify-center text-center opacity-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                >
                  <Cpu className="w-12 h-12 mb-4 text-[#22d3ee]" />
                  <p className="font-mono text-sm">SYSTEM STANDBY</p>
                </motion.div>
              )}

              {isProcessing && (
                <motion.div 
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col justify-center"
                >
                  <ProcessingCube />
                  
                  <div className="mt-8 space-y-2 font-mono text-xs text-[#22d3ee]/70">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>{">"} Extracting frames...</motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>{">"} Analyzing micro-expressions...</motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>{">"} Computing spectral data...</motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}>{">"} Querying neural model...</motion.div>
                  </div>
                </motion.div>
              )}

              {result && (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className={`p-4 border ${result.is_fake ? 'border-[#ef4444] bg-[#ef4444]/10 glow-border-destructive' : 'border-[#10b981] bg-[#10b981]/10'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      {result.is_fake ? (
                        <AlertTriangle className="w-6 h-6 text-[#ef4444]" />
                      ) : (
                        <CheckCircle className="w-6 h-6 text-[#10b981]" />
                      )}
                      <h2 className={`font-display text-xl ${result.is_fake ? 'text-[#ef4444]' : 'text-[#10b981]'}`}>
                        {result.is_fake ? 'MANIPULATION DETECTED' : 'AUTHENTIC MEDIA'}
                      </h2>
                    </div>
                    <div className="font-mono text-sm">
                      CONFIDENCE LEVEL: <span className="font-bold text-white">{result.confidence.toFixed(1)}%</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display text-[#22d3ee] mb-3 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" /> FORENSIC EVIDENCE
                    </h3>
                    <div className="space-y-2">
                      {result.reasons.map((reason, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + (i * 0.1) }}
                          className="p-3 bg-white/5 border border-white/10 font-mono text-sm flex gap-3"
                        >
                          <span className="text-[#ef4444] shrink-0">[{i+1}]</span>
                          <span className="text-white/80">{reason}</span>
                        </motion.div>
                      ))}
                      {result.reasons.length === 0 && (
                        <div className="text-white/50 font-mono text-sm italic">No anomalies detected.</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display text-[#22d3ee] mb-3 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" /> METADATA
                    </h3>
                    <div className="bg-black/50 border border-white/10 p-3 font-mono text-xs text-[#22d3ee]/80 grid grid-cols-2 gap-2">
                      {Object.entries(result.metadata).map(([key, val], i) => (
                        <div key={key} className="flex flex-col">
                          <span className="text-white/40 uppercase">{key}</span>
                          <span className="truncate">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

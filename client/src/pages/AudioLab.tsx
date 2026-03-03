import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ScanLine, AlertTriangle, CheckCircle, ChevronRight, Volume2 } from "lucide-react";
import { api, type ForensicResponse } from "../lib/api";
import ProcessingCube from "../components/canvas/ProcessingCube";

// Mock canvas waveform visualizer
function WaveformVisualizer({ isProcessing, hasAnomalies }: { isProcessing: boolean, hasAnomalies: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const centerY = height / 2;
      const amplitude = isProcessing ? height * 0.4 : height * 0.1;
      
      // Draw standard wave
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      for (let i = 0; i < width; i++) {
        const freq = isProcessing ? 0.05 : 0.02;
        const wave1 = Math.sin(i * freq + time) * amplitude;
        const wave2 = Math.sin(i * freq * 1.5 - time * 1.2) * amplitude * 0.5;
        ctx.lineTo(i, centerY + wave1 + wave2);
      }
      ctx.strokeStyle = "rgba(34, 211, 238, 0.8)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw anomaly spikes if required
      if (hasAnomalies && !isProcessing) {
        ctx.beginPath();
        for (let i = width * 0.3; i < width * 0.7; i += 40) {
          const noise = (Math.random() - 0.5) * height * 0.8;
          ctx.moveTo(i, centerY);
          ctx.lineTo(i, centerY + noise);
        }
        ctx.strokeStyle = "rgba(239, 68, 68, 0.8)";
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      time += 0.1;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [isProcessing, hasAnomalies]);

  return (
    <div className="w-full h-48 bg-black/40 border border-[#22d3ee]/20 relative overflow-hidden rounded clip-edges">
      <div className="absolute top-2 left-2 font-mono text-[10px] text-[#22d3ee]/50">FREQ_ANALYSIS_V2</div>
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={200} 
        className="w-full h-full object-cover opacity-80"
      />
      {hasAnomalies && !isProcessing && (
        <div className="absolute top-2 right-2 bg-[#ef4444]/20 border border-[#ef4444] px-2 py-1 text-[#ef4444] text-xs font-mono animate-pulse">
          SPECTRAL_ANOMALY
        </div>
      )}
    </div>
  );
}

export default function AudioLab() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ForensicResponse | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("audio/")) {
      setFile(droppedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsProcessing(true);
    setResult(null);
    try {
      const response = await api.post("/analyze/audio/", { file });
      setResult(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <header className="flex justify-between items-end border-b border-[#a855f7]/30 pb-4">
        <div>
          <h1 className="text-3xl font-display text-white glitch-hover" style={{ textShadow: '2px 0 0 #a855f7, -2px 0 0 #ef4444'}}>AUDIO FORENSICS</h1>
          <p className="font-mono text-[#a855f7]/70 text-sm mt-1">MODULE: SPECTRAL_HARMONY_SCAN</p>
        </div>
        <div className="font-mono text-xs text-white/50 text-right">
          <div>MODEL: GTX 1650 TENSOR</div>
          <div>STATUS: <span className="text-[#a855f7]">READY</span></div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div 
            className={`flex-grow relative border-2 border-dashed ${file ? 'border-[#a855f7]/50' : 'border-[#a855f7]/20'} bg-[#020617]/50 backdrop-blur-sm flex flex-col p-6 transition-colors`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="mb-6">
               <WaveformVisualizer isProcessing={isProcessing} hasAnomalies={!!(result && result.is_fake)} />
            </div>

            <div className="flex-grow flex items-center justify-center">
              <AnimatePresence mode="wait">
                {!file ? (
                  <motion.div 
                    key="upload"
                    className="text-center flex flex-col items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-[#a855f7]/10 flex items-center justify-center mb-4 border border-[#a855f7]/30">
                      <Volume2 className="w-8 h-8 text-[#a855f7]" />
                    </div>
                    <h3 className="font-display text-xl mb-2">UPLOAD AUDIO</h3>
                    <p className="text-sm font-mono text-white/50">DRAG AND DROP AUDIO FILE HERE</p>
                    <label className="mt-6 px-6 py-2 bg-[#a855f7]/10 border border-[#a855f7] text-[#a855f7] font-display uppercase hover:bg-[#a855f7] hover:text-[#020617] transition-all cursor-pointer glow-border shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                      BROWSE SYSTEM
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="audio/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) setFile(f);
                        }}
                      />
                    </label>
                  </motion.div>
                ) : (
                  <motion.div
                     key="loaded"
                     className="text-center"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                  >
                     <Volume2 className={`w-16 h-16 mx-auto mb-4 ${isProcessing ? 'text-[#a855f7] animate-pulse' : 'text-white/30'}`} />
                     <div className="font-mono text-[#a855f7] text-xl">{file.name}</div>
                     <div className="font-mono text-sm text-white/50 mt-2">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex justify-between items-center bg-[#020617]/80 border border-[#a855f7]/30 p-4 clip-edges">
            <div className="font-mono text-sm text-white/70">
              {file ? "AUDIO_STREAM_LOADED" : "NO_STREAM_DETECTED"}
            </div>
            <button
              onClick={handleAnalyze}
              disabled={!file || isProcessing}
              className={`px-8 py-2 font-display uppercase tracking-widest flex items-center gap-2 transition-all ${
                !file || isProcessing 
                  ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10' 
                  : 'bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7] hover:bg-[#a855f7] hover:text-[#020617]'
              }`}
              style={file && !isProcessing ? { boxShadow: '0 0 10px rgba(168,85,247,0.2), inset 0 0 10px rgba(168,85,247,0.1)' } : {}}
            >
              <ScanLine className="w-4 h-4" />
              {isProcessing ? "ANALYZING..." : "INITIALIZE SCAN"}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="border border-[#a855f7]/30 bg-[#020617]/60 backdrop-blur-md flex flex-col clip-edges overflow-hidden">
          <div className="p-4 bg-[#a855f7]/10 border-b border-[#a855f7]/30 font-display text-sm tracking-widest uppercase">
            Spectral Results
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
                  <Volume2 className="w-12 h-12 mb-4 text-[#a855f7]" />
                  <p className="font-mono text-sm">AWAITING AUDIO STREAM</p>
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
                  {/* Reuse ProcessingCube but tint it purple via wrapper CSS or just use as is */}
                  <div className="hue-rotate-[60deg]">
                    <ProcessingCube />
                  </div>
                  
                  <div className="mt-8 space-y-2 font-mono text-xs text-[#a855f7]/70">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>{">"} Mapping frequencies...</motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>{">"} Isolating vocal harmonics...</motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>{">"} Detecting AI synthesis patterns...</motion.div>
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
                        {result.is_fake ? 'SYNTHETIC AUDIO DETECTED' : 'NATURAL AUDIO'}
                      </h2>
                    </div>
                    <div className="font-mono text-sm">
                      CONFIDENCE: <span className="font-bold text-white">{result.confidence.toFixed(1)}%</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display text-[#a855f7] mb-3 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" /> FORENSIC MARKERS
                    </h3>
                    <div className="space-y-2">
                      {result.reasons.map((reason, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + (i * 0.1) }}
                          className={`p-3 bg-white/5 border font-mono text-sm flex gap-3 ${result.is_fake ? 'border-[#ef4444]/30' : 'border-[#10b981]/30'}`}
                        >
                          <span className={result.is_fake ? "text-[#ef4444]" : "text-[#10b981]"}>[{i+1}]</span>
                          <span className="text-white/80">{reason}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-display text-[#a855f7] mb-3 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" /> STREAM METADATA
                    </h3>
                    <div className="bg-black/50 border border-white/10 p-3 font-mono text-xs text-[#a855f7]/80 grid grid-cols-2 gap-2">
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

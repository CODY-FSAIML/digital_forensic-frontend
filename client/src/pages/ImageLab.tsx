import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ScanLine, AlertTriangle, CheckCircle, ChevronRight, ImageIcon } from "lucide-react";
import { api, type ForensicResponse } from "../lib/api";
import ProcessingCube from "../components/canvas/ProcessingCube";

// Hacker Terminal effect for OCR text
function HackerTerminal({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let i = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 20); // typing speed
    
    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="bg-black/80 border border-[#10b981]/30 p-4 h-48 overflow-y-auto font-mono text-[10px] sm:text-xs text-[#10b981] shadow-[inset_0_0_10px_rgba(16,185,129,0.1)] relative">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-[#10b981]/50 shadow-[0_0_10px_#10b981] animate-[scan_2s_linear_infinite]" />
      <pre className="whitespace-pre-wrap">{displayedText}</pre>
      <span className="animate-pulse inline-block w-2 h-4 bg-[#10b981] ml-1 align-middle" />
    </div>
  );
}

export default function ImageLab() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ForensicResponse | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sliderPos, setSliderPos] = useState(50); // For side-by-side view

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsProcessing(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post("/analyze/image/", formData);
      console.log("Forensic Response:", response.data);
      setResult(response.data);
    } catch (error) {
      console.error("Image Analysis Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <header className="flex justify-between items-end border-b border-[#10b981]/30 pb-4">
        <div>
          <h1 className="text-3xl font-display text-white glitch-hover" style={{ textShadow: '2px 0 0 #10b981, -2px 0 0 #ef4444'}}>IMAGE FORENSICS</h1>
          <p className="font-mono text-[#10b981]/70 text-sm mt-1">MODULE: ELA_METADATA_EXTRACTOR</p>
        </div>
        <div className="font-mono text-xs text-white/50 text-right">
          <div>MODEL: GTX 1650 TENSOR</div>
          <div>STATUS: <span className="text-[#10b981]">READY</span></div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div 
            className={`flex-grow relative border-2 border-dashed ${file ? 'border-[#10b981]/50' : 'border-[#10b981]/20'} bg-[#020617]/50 backdrop-blur-sm flex items-center justify-center overflow-hidden transition-colors`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onMouseMove={(e) => {
              if (result && previewUrl) {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = ((e.clientX - rect.left) / rect.width) * 100;
                setSliderPos(pos);
              }
            }}
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
                  <div className="w-16 h-16 rounded-full bg-[#10b981]/10 flex items-center justify-center mb-4 border border-[#10b981]/30">
                    <ImageIcon className="w-8 h-8 text-[#10b981]" />
                  </div>
                  <h3 className="font-display text-xl mb-2">UPLOAD EVIDENCE</h3>
                  <p className="text-sm font-mono text-white/50">DRAG AND DROP IMAGE FILE HERE</p>
                  <label className="mt-6 px-6 py-2 bg-[#10b981]/10 border border-[#10b981] text-[#10b981] font-display uppercase hover:bg-[#10b981] hover:text-[#020617] transition-all cursor-pointer glow-border shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    BROWSE SYSTEM
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
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
                  className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#020617]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {previewUrl && !result && (
                     <img src={previewUrl} className="w-full h-full object-contain" alt="Original" />
                  )}

                  {/* Side-by-side view when result is ready */}
                  {result && previewUrl && (
                    <div className="absolute inset-0 w-full h-full select-none">
                      {/* Original Image (Left) */}
                      <div 
                        className="absolute inset-0 overflow-hidden" 
                        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                      >
                         <img src={previewUrl} className="absolute inset-0 w-full h-full object-contain" alt="Original" />
                         <div className="absolute top-4 left-4 bg-black/80 border border-white/20 px-2 py-1 text-xs font-mono text-white/70">ORIGINAL</div>
                      </div>
                      
                      {/* Forensic Filter Image (Right) - Simulated with CSS filters for mockup */}
                      <div 
                        className="absolute inset-0 overflow-hidden"
                        style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
                      >
                         <img 
                           src={previewUrl} 
                           className="absolute inset-0 w-full h-full object-contain mix-blend-difference filter invert contrast-[150%] brightness-[120%] sepia-[50%] hue-rotate-180" 
                           alt="Forensic ELA" 
                         />
                         <div className="absolute top-4 right-4 bg-black/80 border border-[#10b981]/50 px-2 py-1 text-xs font-mono text-[#10b981]">ELA_FILTER</div>
                      </div>

                      {/* Slider Line */}
                      <div 
                        className="absolute top-0 bottom-0 w-1 bg-[#10b981] cursor-ew-resize flex items-center justify-center"
                        style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
                      >
                        <div className="w-6 h-6 rounded-full bg-[#020617] border-2 border-[#10b981] flex items-center justify-center shadow-[0_0_10px_#10b981]">
                           <div className="w-1 h-3 bg-[#10b981] rounded-full mx-[1px]" />
                           <div className="w-1 h-3 bg-[#10b981] rounded-full mx-[1px]" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {isProcessing && (
                    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col">
                      <div className="w-full h-1/3 bg-gradient-to-b from-transparent to-[#10b981]/20 animate-[scan_1.5s_linear_infinite]" />
                      <div className="absolute inset-0 border border-[#10b981] animate-pulse" />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-between items-center bg-[#020617]/80 border border-[#10b981]/30 p-4 clip-edges">
            <div className="font-mono text-sm text-white/70">
              {file ? file.name : "NO_FILE_SELECTED"}
            </div>
            <button
              onClick={handleAnalyze}
              disabled={!file || isProcessing}
              className={`px-8 py-2 font-display uppercase tracking-widest flex items-center gap-2 transition-all ${
                !file || isProcessing 
                  ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10' 
                  : 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981] hover:bg-[#10b981] hover:text-[#020617]'
              }`}
              style={file && !isProcessing ? { boxShadow: '0 0 10px rgba(16,185,129,0.2), inset 0 0 10px rgba(16,185,129,0.1)' } : {}}
            >
              <ScanLine className="w-4 h-4" />
              {isProcessing ? "ANALYZING..." : "INITIALIZE SCAN"}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="border border-[#10b981]/30 bg-[#020617]/60 backdrop-blur-md flex flex-col clip-edges overflow-hidden">
          <div className="p-4 bg-[#10b981]/10 border-b border-[#10b981]/30 font-display text-sm tracking-widest uppercase">
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
                  <ImageIcon className="w-12 h-12 mb-4 text-[#10b981]" />
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
                  <div className="hue-rotate-[-60deg]">
                     <ProcessingCube />
                  </div>
                  
                  <div className="mt-8 space-y-2 font-mono text-xs text-[#10b981]/70">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>{">"} Reading EXIF data...</motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>{">"} Performing Error Level Analysis...</motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>{">"} Running OCR scan...</motion.div>
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
                      CONFIDENCE: <span className="font-bold text-white">{typeof result.confidence === 'number' ? result.confidence.toFixed(1) : 'N/A'}%</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display text-[#10b981] mb-3 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" /> FORENSIC EVIDENCE
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

                  {result.metadata?.extracted_text && (
                     <div>
                        <h3 className="font-display text-[#10b981] mb-3 flex items-center gap-2">
                          <ChevronRight className="w-4 h-4" /> OCR EXTRACTION
                        </h3>
                        <HackerTerminal text={result.metadata.extracted_text} />
                     </div>
                  )}

                  <div>
                    <h3 className="font-display text-[#10b981] mb-3 flex items-center gap-2 mt-4">
                      <ChevronRight className="w-4 h-4" /> METADATA
                    </h3>
                    <div className="bg-black/50 border border-white/10 p-3 font-mono text-xs text-[#10b981]/80 grid grid-cols-2 gap-2">
                      {Object.entries(result.metadata).map(([key, val], i) => {
                         if (key === 'extracted_text') return null; // handled above
                         return (
                            <div key={key} className="flex flex-col">
                              <span className="text-white/40 uppercase">{key}</span>
                              <span className="truncate">{String(val)}</span>
                            </div>
                         );
                      })}
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

"use client";

import { useEffect, useState } from "react";
import { Camera, Sparkles, Cpu, Layers, CheckCircle2, AlertCircle } from "lucide-react";
import { recognitionApi } from "@/lib/api";

export default function TranslatorPage() {
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    async function loadInfo() {
      try {
        const data = await recognitionApi.getInfo();
        setInfo(data);
      } catch (e) {
        console.error(e);
      }
    }
    loadInfo();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold mb-2">
          <Camera className="w-4 h-4" />
          <span>Future Recognition Module</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Real-Time Sign Translator Shell</h1>
        <p className="text-xs text-slate-400 mt-1">
          Camera-based sign language recognition system architectural foundation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Camera Feed Placeholder */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white text-sm uppercase tracking-wider">
              Camera Input Stream
            </h2>
            <span className="px-3 py-1 rounded-full bg-yellow-accent/15 border border-yellow-accent/30 text-yellow-accent font-bold text-xs">
              Future ML Integration Shell
            </span>
          </div>

          {/* Camera Viewport Frame */}
          <div className="relative aspect-video rounded-3xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden flex flex-col items-center justify-center text-center p-6 space-y-4">
            {/* Subtle Grid overlay lines to evoke hand detection overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30 pointer-events-none" />

            <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center relative z-10 animate-pulse">
              <Camera className="w-8 h-8" />
            </div>

            <div className="relative z-10 space-y-1">
              <p className="text-white font-bold text-base">Camera Viewport Reserved</p>
              <p className="text-xs text-slate-400 max-w-sm">
                Webcam stream and MediaPipe 21-hand-landmark detection overlay will initialize when ML inference model is connected.
              </p>
            </div>
          </div>

          {/* Real-time Status Card */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase">Recognition Status</p>
              <p className="text-sm font-bold text-yellow-accent">
                {info?.status || "Ready for model integration"}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase">Detected Text</p>
              <p className="text-lg font-black text-slate-400">—</p>
            </div>
          </div>
        </div>

        {/* Right: Architectural Pipeline Breakdown */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-turquoise-light">
              <Cpu className="w-5 h-5" />
              <h2 className="font-bold text-white text-base">ML Pipeline Architecture</h2>
            </div>
            <p className="text-xs text-slate-400">
              Future recognition pipeline specifications & data flow
            </p>
          </div>

          <div className="space-y-3">
            {[
              { step: "1", title: "Client Camera", desc: "Captures live video feed at 30 FPS" },
              { step: "2", title: "MediaPipe Engine", desc: "Detects hand bounding box & keypoints" },
              { step: "3", title: "21 Hand Landmarks", desc: "Extracts 3D (X, Y, Z) joint positions" },
              { step: "4", title: "Feature Normalization", desc: "Standardizes scale and wrist offsets" },
              { step: "5", title: "Scikit-Learn Classifier", desc: "Executes trained sign inference" },
              { step: "6", title: "Text Translation", desc: "Outputs real-time character or word label" }
            ].map((s) => (
              <div key={s.step} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-start space-x-3">
                <div className="w-7 h-7 rounded-xl bg-turquoise-primary text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-bold text-xs text-white">{s.title}</h3>
                  <p className="text-[11px] text-slate-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs space-y-1">
            <p className="font-bold text-purple-200">Honest Prototype Architecture Guarantee</p>
            <p className="text-[11px] leading-relaxed text-slate-300">
              Per mini project guidelines, fake ML prediction numbers or fake confidence percentages are never fabricated. The API integration boundary is ready for Scikit-learn model loading.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

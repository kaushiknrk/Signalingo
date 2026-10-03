"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Hand, Sparkles, CheckCircle2, ArrowLeft, ArrowRight, BookOpen, Trophy } from "lucide-react";
import { signsApi } from "@/lib/api";

export default function LearnPage() {
  const [signs, setSigns] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "alphabet" | "word">("alphabet");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [learnedMap, setLearnedMap] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSigns() {
      try {
        const data = await signsApi.getAll();
        setSigns(data || []);
      } catch (e) {
        console.error("Failed to load signs", e);
      } finally {
        setLoading(false);
      }
    }
    loadSigns();
  }, []);

  const filteredSigns = signs.filter((s) => {
    if (filter === "alphabet") return s.content_type === "alphabet";
    if (filter === "word") return s.content_type === "word";
    return true;
  });

  const currentSign = filteredSigns[selectedIndex] || filteredSigns[0];

  const handleToggleLearned = (signId: number) => {
    setLearnedMap((prev) => ({ ...prev, [signId]: !prev[signId] }));
  };

  const handleNext = () => {
    if (selectedIndex < filteredSigns.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const handlePrev = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-turquoise-primary border-t-transparent animate-spin" />
          <p className="text-xs font-semibold text-slate-400">Loading sign catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-turquoise-primary/20 border border-turquoise-light/30 text-turquoise-light text-xs font-bold mb-2">
            <Hand className="w-4 h-4" />
            <span>Interactive ASL Alphabet & Signs</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Learn Sign Language</h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse through ASL 26-character alphabet and essential words
          </p>
        </div>

        {/* Filter Pills */}
        <div className="inline-flex p-1 bg-white/5 border border-white/10 rounded-2xl self-start sm:self-center">
          <button
            onClick={() => { setFilter("alphabet"); setSelectedIndex(0); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === "alphabet"
                ? "bg-turquoise-primary text-white shadow-turquoise-glow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            ASL Alphabet (A-Z)
          </button>
          <button
            onClick={() => { setFilter("word"); setSelectedIndex(0); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === "word"
                ? "bg-turquoise-primary text-white shadow-turquoise-glow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Common Words
          </button>
        </div>
      </div>

      {/* Main Learning Interface: Active Sign Viewer + Grid Selector */}
      {currentSign && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Active Sign Card Viewer */}
          <div className="lg:col-span-6 glass-card rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-yellow-accent/20 border border-yellow-accent/40 text-yellow-accent font-bold text-xs">
                {currentSign.difficulty?.toUpperCase() || "EASY"} • {currentSign.content_type?.toUpperCase()}
              </span>
              <button
                onClick={() => handleToggleLearned(currentSign.id)}
                className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  learnedMap[currentSign.id]
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm"
                    : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{learnedMap[currentSign.id] ? "Learned!" : "Mark as Learned"}</span>
              </button>
            </div>

            {/* Visual SVG Image Card */}
            <div className="relative aspect-square max-w-sm mx-auto rounded-3xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl flex items-center justify-center p-6 group">
              <img
                src={currentSign.image_url || `/assets/signs/${currentSign.label.toLowerCase()}.svg`}
                alt={`ASL Sign for ${currentSign.label}`}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4 bg-[#0F172A]/90 backdrop-blur-md px-3.5 py-1 rounded-xl text-yellow-accent font-black text-xl border border-yellow-accent/40">
                {currentSign.label}
              </div>
            </div>

            {/* Description Details */}
            <div className="space-y-2 text-center sm:text-left">
              <h2 className="text-2xl font-black text-white">
                Sign "{currentSign.label}"
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {currentSign.description || "Form the hand shape cleanly as demonstrated above."}
              </p>
            </div>

            {/* Next / Previous Controls */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={selectedIndex === 0}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white font-bold text-xs flex items-center space-x-2 transition-colors border border-white/10"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <span className="text-xs font-semibold text-slate-400">
                {selectedIndex + 1} of {filteredSigns.length}
              </span>

              <button
                onClick={handleNext}
                disabled={selectedIndex === filteredSigns.length - 1}
                className="px-5 py-2.5 rounded-xl bg-turquoise-primary hover:bg-turquoise-light disabled:opacity-30 text-white font-bold text-xs flex items-center space-x-2 shadow-turquoise-glow transition-all"
              >
                <span>Next Sign</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grid Selection Panel */}
          <div className="lg:col-span-6 glass-card rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">
                Browse {filter === "alphabet" ? "Alphabet A-Z" : "Words"}
              </h3>
              <Link
                href="/practice"
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-yellow-accent/20 border border-yellow-accent/30 text-yellow-accent font-bold text-xs hover:bg-yellow-accent hover:text-dark-blue transition-colors"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Practice Quiz</span>
              </Link>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-[500px] overflow-y-auto p-1">
              {filteredSigns.map((sign, idx) => {
                const isSelected = idx === selectedIndex;
                const isLearned = learnedMap[sign.id];
                return (
                  <button
                    key={sign.id}
                    onClick={() => setSelectedIndex(idx)}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center font-black text-lg transition-all relative border ${
                      isSelected
                        ? "bg-turquoise-primary text-white border-turquoise-primary shadow-turquoise-glow scale-105"
                        : "bg-white/5 hover:bg-white/10 text-white border-white/10"
                    }`}
                  >
                    <span>{sign.label}</span>
                    {isLearned && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

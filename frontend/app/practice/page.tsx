"use client";

import { useEffect, useState, useRef } from "react";
import { animate } from "animejs";
import { Trophy, Flame, CheckCircle2, XCircle, RotateCcw, Sparkles, Award } from "lucide-react";
import { signsApi, practiceApi, streaksApi } from "@/lib/api";

export default function PracticePage() {
  const [signs, setSigns] = useState<any[]>([]);
  const [currentSign, setCurrentSign] = useState<any>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const [score, setScore] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function initPractice() {
      try {
        const data = await signsApi.getAll("alphabet");
        setSigns(data || []);
        if (data && data.length > 0) {
          generateQuestion(data);
        }

        const streakData = await streaksApi.getMe().catch(() => null);
        setStreakCount(streakData?.current_streak || 0);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initPractice();
  }, []);

  const generateQuestion = (signList: any[]) => {
    setSelectedOption(null);
    setResult(null);

    const target = signList[Math.floor(Math.random() * signList.length)];
    setCurrentSign(target);

    const optionsSet = new Set<string>([target.label]);
    while (optionsSet.size < 4 && optionsSet.size < signList.length) {
      const rand = signList[Math.floor(Math.random() * signList.length)].label;
      optionsSet.add(rand);
    }
    const shuffled = Array.from(optionsSet).sort(() => Math.random() - 0.5);
    setOptions(shuffled);

    if (cardRef.current) {
      try {
        animate(cardRef.current, {
          scale: [0.95, 1],
          opacity: [0, 1],
          duration: 400,
          easing: "easeOutCubic"
        });
      } catch (e) {}
    }
  };

  const handleSelectOption = async (opt: string) => {
    if (selectedOption !== null || !currentSign) return;
    setSelectedOption(opt);

    const isCorrect = opt.toUpperCase() === currentSign.label.toUpperCase();
    const attemptResult = isCorrect ? "correct" : "incorrect";
    const points = isCorrect ? 20 : 0;

    setResult(attemptResult);
    if (isCorrect) setScore((prev) => prev + points);

    if (isCorrect) {
      try {
        animate(".feedback-badge", {
          scale: [0.8, 1.1, 1],
          rotate: [-5, 5, 0],
          duration: 500,
          easing: "easeOutElastic(1, .5)"
        });
      } catch (e) {}
    }

    try {
      const res = await practiceApi.recordAttempt(currentSign.id, attemptResult, points);
      if (res && isCorrect) {
        setStreakCount((prev) => prev + 1);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-turquoise-primary border-t-transparent animate-spin" />
          <p className="text-xs font-semibold text-slate-400">Loading practice arena...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex items-center justify-between glass-card rounded-3xl p-6 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-yellow-accent/20 text-yellow-accent flex items-center justify-center font-bold">
            <Trophy className="w-6 h-6 fill-yellow-accent text-yellow-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">ASL Recognition Arena</h1>
            <p className="text-xs text-slate-400">Test your sign alphabet recognition speed</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-400 uppercase">Session Score</p>
            <p className="text-xl font-black text-turquoise-light">+{score} pts</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-400 uppercase">Streak</p>
            <p className="text-xl font-black text-yellow-accent">{streakCount} 🔥</p>
          </div>
        </div>
      </div>

      {/* Main Quiz Card */}
      {currentSign && (
        <div ref={cardRef} className="glass-card rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 text-center">
          <div>
            <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 font-bold text-xs">
              Question: What sign is this?
            </span>
          </div>

          <div className="relative aspect-square max-w-xs mx-auto rounded-3xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl p-6">
            <img
              src={currentSign.image_url || `/assets/signs/${currentSign.label.toLowerCase()}.svg`}
              alt="ASL Practice Sign"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto">
            {options.map((opt) => {
              const isSelected = selectedOption === opt;
              const isTarget = opt.toUpperCase() === currentSign.label.toUpperCase();
              
              let btnClass = "bg-white/5 hover:bg-white/10 text-white border-white/10";
              if (selectedOption !== null) {
                if (isTarget) {
                  btnClass = "bg-emerald-500 text-white border-emerald-500 shadow-lg scale-105";
                } else if (isSelected) {
                  btnClass = "bg-rose-500 text-white border-rose-500";
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelectOption(opt)}
                  disabled={selectedOption !== null}
                  className={`py-4 rounded-2xl border font-black text-2xl transition-all shadow-md ${btnClass}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {result && (
            <div className="feedback-badge p-4 rounded-2xl max-w-md mx-auto space-y-3">
              {result === "correct" ? (
                <div className="bg-emerald-500/20 border border-emerald-500/30 p-4 rounded-2xl flex items-center justify-center space-x-2 text-emerald-300 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Correct! You earned +20 points.</span>
                </div>
              ) : (
                <div className="bg-rose-500/20 border border-rose-500/30 p-4 rounded-2xl flex items-center justify-center space-x-2 text-rose-300 font-bold text-sm">
                  <XCircle className="w-5 h-5 text-rose-400" />
                  <span>Incorrect. The sign was "{currentSign.label}".</span>
                </div>
              )}

              <button
                onClick={() => generateQuestion(signs)}
                className="mt-2 px-6 py-3 rounded-xl bg-turquoise-primary hover:bg-turquoise-light text-white font-bold text-sm shadow-turquoise-glow transition-all inline-flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Next Question</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Flame, Trophy, CheckCircle2, Clock, Award, Sparkles, BarChart3 } from "lucide-react";
import { progressApi, practiceApi, streaksApi } from "@/lib/api";

export default function ProgressPage() {
  const [progressList, setProgressList] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [streak, setStreak] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      try {
        const [prog, hist, st] = await Promise.all([
          progressApi.getMe().catch(() => []),
          practiceApi.getHistory().catch(() => []),
          streaksApi.getMe().catch(() => null),
        ]);
        setProgressList(prog || []);
        setHistory(hist || []);
        setStreak(st);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-turquoise-primary border-t-transparent animate-spin" />
          <p className="text-xs font-semibold text-slate-400">Loading progress records...</p>
        </div>
      </div>
    );
  }

  const completedCount = progressList.filter((p) => p.completed).length;
  const totalScore = history.reduce((acc, curr) => acc + (curr.score || 0), 0);
  const totalCorrect = history.filter((h) => h.result === "correct").length;
  const accuracy = history.length > 0 ? Math.round((totalCorrect / history.length) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-turquoise-primary/20 border border-turquoise-light/30 text-turquoise-light text-xs font-bold mb-2">
          <BarChart3 className="w-4 h-4" />
          <span>Verified Database Records</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Learning & Practice Progress</h1>
        <p className="text-xs text-slate-400 mt-1">
          Honest progress tracking powered by FastAPI and SQLite backend
        </p>
      </div>

      {/* Honest Stats Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-3xl p-5 space-y-1">
          <div className="flex items-center space-x-2 text-yellow-accent">
            <Flame className="w-5 h-5 fill-yellow-accent" />
            <span className="text-xs font-bold uppercase text-slate-400">Current Streak</span>
          </div>
          <p className="text-3xl font-black text-white">{streak?.current_streak || 0} Days</p>
        </div>

        <div className="glass-card rounded-3xl p-5 space-y-1">
          <div className="flex items-center space-x-2 text-turquoise-light">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs font-bold uppercase text-slate-400">Lessons Mastered</span>
          </div>
          <p className="text-3xl font-black text-white">{completedCount}</p>
        </div>

        <div className="glass-card rounded-3xl p-5 space-y-1">
          <div className="flex items-center space-x-2 text-purple-400">
            <Trophy className="w-5 h-5" />
            <span className="text-xs font-bold uppercase text-slate-400">Practice Score</span>
          </div>
          <p className="text-3xl font-black text-white">+{totalScore} pts</p>
        </div>

        <div className="glass-card rounded-3xl p-5 space-y-1">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Award className="w-5 h-5" />
            <span className="text-xs font-bold uppercase text-slate-400">Accuracy</span>
          </div>
          <p className="text-3xl font-black text-white">
            {history.length > 0 ? `${accuracy}%` : "—"}
          </p>
        </div>
      </div>

      {/* Detailed Tables: Completed Lessons + Recent Practice Attempts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Completed Lessons */}
        <div className="lg:col-span-6 glass-card rounded-3xl p-6 space-y-4">
          <h2 className="font-bold text-white text-base">Lesson Achievements</h2>
          {progressList.length > 0 ? (
            <div className="space-y-3">
              {progressList.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      {p.lesson_title || `Lesson ${p.lesson_id}`}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {p.completed_at ? `Completed ${new Date(p.completed_at).toLocaleDateString()}` : "In Progress"}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                    p.completed
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  }`}>
                    {p.completed ? `Score ${p.score}%` : "In Progress"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-white/5 border border-dashed border-white/10 space-y-2">
              <p className="text-sm font-bold text-slate-300">No learning activity yet.</p>
              <p className="text-xs text-slate-400">
                Start your first lesson to begin tracking your progress.
              </p>
            </div>
          )}
        </div>

        {/* Practice Attempt Timeline */}
        <div className="lg:col-span-6 glass-card rounded-3xl p-6 space-y-4">
          <h2 className="font-bold text-white text-base">Recent Practice Attempts</h2>
          {history.length > 0 ? (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {history.map((h) => (
                <div key={h.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-300">
                      {new Date(h.attempted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`font-bold uppercase ${
                      h.result === "correct" ? "text-emerald-400" : "text-rose-400"
                    }`}>
                      {h.result}
                    </span>
                    <span className="font-black text-white">+{h.score} pts</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-white/5 border border-dashed border-white/10 space-y-2">
              <p className="text-sm font-bold text-slate-300">No practice attempts recorded yet.</p>
              <p className="text-xs text-slate-400">
                Take quiz practice sessions to build your session score history.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

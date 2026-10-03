"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, ArrowRight, ArrowLeft, Trophy, Sparkles } from "lucide-react";
import { lessonsApi, progressApi } from "@/lib/api";

export default function LessonsPage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [completedMap, setCompletedMap] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const list = await lessonsApi.getAll();
        setLessons(list || []);

        const userProg = await progressApi.getMe().catch(() => []);
        const map: Record<number, boolean> = {};
        (userProg || []).forEach((p: any) => {
          if (p.completed) map[p.lesson_id] = true;
        });
        setCompletedMap(map);

        if (list && list.length > 0) {
          const detail = await lessonsApi.getDetail(list[0].id);
          setActiveLesson(detail);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSelectLesson = async (lessonId: number) => {
    setLoading(true);
    try {
      const detail = await lessonsApi.getDetail(lessonId);
      setActiveLesson(detail);
      setActiveItemIndex(0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLesson = async () => {
    if (!activeLesson) return;
    try {
      await progressApi.update(activeLesson.id, 100, true);
      setCompletedMap((prev) => ({ ...prev, [activeLesson.id]: true }));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading && !activeLesson) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-turquoise-primary border-t-transparent animate-spin" />
          <p className="text-xs font-semibold text-slate-400">Loading learning modules...</p>
        </div>
      </div>
    );
  }

  const items = activeLesson?.items || [];
  const currentItem = items[activeItemIndex];
  const isLessonComplete = completedMap[activeLesson?.id];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-turquoise-primary/20 border border-turquoise-light/30 text-turquoise-light text-xs font-bold mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Structured ASL Curriculum</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Learning Modules</h1>
        <p className="text-xs text-slate-400 mt-1">
          Follow guided lesson paths to master sign alphabet groups and vocabulary
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Lesson Cards List */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Available Modules ({lessons.length})
          </h2>
          {lessons.map((lesson) => {
            const isSelected = activeLesson?.id === lesson.id;
            const isDone = completedMap[lesson.id];
            return (
              <button
                key={lesson.id}
                onClick={() => handleSelectLesson(lesson.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? "bg-turquoise-primary/15 border-turquoise-primary text-white shadow-turquoise-glow"
                    : "glass-card text-white hover:bg-white/10"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-yellow-accent">
                      Lesson {lesson.order_index}
                    </span>
                    {isDone && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[10px]">
                        Completed ✓
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm leading-snug">{lesson.title}</h3>
                  <p className="text-xs text-slate-400">{lesson.items_count} Signs</p>
                </div>
                <ArrowRight className={`w-5 h-5 ${isSelected ? "text-yellow-accent" : "text-slate-400"}`} />
              </button>
            );
          })}
        </div>

        {/* Right: Active Lesson Step Interactive Viewer */}
        <div className="lg:col-span-8 glass-card rounded-3xl p-6 sm:p-8 space-y-6">
          {activeLesson && (
            <>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-bold text-turquoise-light uppercase tracking-wider">
                    Lesson {activeLesson.order_index} • Step {activeItemIndex + 1} of {items.length}
                  </span>
                  <h2 className="text-2xl font-black text-white">{activeLesson.title}</h2>
                </div>
                {isLessonComplete && (
                  <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Completed</span>
                  </div>
                )}
              </div>

              {/* Current Sign Item Frame */}
              {currentItem?.sign && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-6">
                    <div className="aspect-square rounded-3xl bg-slate-900 border border-white/10 p-6 shadow-2xl flex items-center justify-center relative">
                      <img
                        src={currentItem.sign.image_url || `/assets/signs/${currentItem.sign.label.toLowerCase()}.svg`}
                        alt={`Sign ${currentItem.sign.label}`}
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute top-4 left-4 bg-[#0F172A]/90 backdrop-blur-md px-4 py-1.5 rounded-xl font-black text-2xl text-yellow-accent border border-yellow-accent/40">
                        {currentItem.sign.label}
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-white">
                        Sign Character "{currentItem.sign.label}"
                      </h3>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {currentItem.sign.description || "Study the hand shape posture carefully."}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center space-x-3">
                      <button
                        onClick={() => setActiveItemIndex(Math.max(0, activeItemIndex - 1))}
                        disabled={activeItemIndex === 0}
                        className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white font-bold text-xs flex items-center space-x-1 border border-white/10 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Prev</span>
                      </button>

                      {activeItemIndex < items.length - 1 ? (
                        <button
                          onClick={() => setActiveItemIndex(activeItemIndex + 1)}
                          className="flex-1 py-2.5 rounded-xl bg-turquoise-primary hover:bg-turquoise-light text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-turquoise-glow transition-all"
                        >
                          <span>Next Sign</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={handleCompleteLesson}
                          className="flex-1 py-2.5 rounded-xl bg-yellow-accent hover:bg-yellow-hover text-dark-blue font-bold text-xs flex items-center justify-center space-x-2 shadow-yellow-glow transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Complete Lesson (+100 pts)</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}

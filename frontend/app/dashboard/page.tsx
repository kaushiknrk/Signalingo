"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Hand,
  BookOpen,
  Trophy,
  Flame,
  Camera,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Award
} from "lucide-react";
import { authApi, streaksApi, progressApi, lessonsApi } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [streak, setStreak] = useState<any>(null);
  const [progressList, setProgressList] = useState<any[]>([]);
  const [nextLesson, setNextLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const me = await authApi.getMe();
        setUser(me);

        // Fetch real streak
        const streakData = await streaksApi.getMe().catch(() => null);
        setStreak(streakData);

        // Fetch real user progress
        const progData = await progressApi.getMe().catch(() => []);
        setProgressList(progData || []);

        // Fetch lessons to suggest next lesson
        const allLessons = await lessonsApi.getAll().catch(() => []);
        if (allLessons && allLessons.length > 0) {
          const completedIds = new Set((progData || []).filter((p: any) => p.completed).map((p: any) => p.lesson_id));
          const uncompleted = allLessons.find((l: any) => !completedIds.has(l.id));
          setNextLesson(uncompleted || allLessons[0]);
        }
      } catch (err) {
        // If unauthenticated, redirect to login
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-turquoise-primary border-t-transparent animate-spin" />
          <p className="text-xs font-semibold text-slate-400">Loading your learning space...</p>
        </div>
      </div>
    );
  }

  const displayName = user?.profile?.first_name || user?.profile?.display_name || "Learner";
  const completedLessonsCount = progressList.filter((p) => p.completed).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-[#0F172A] to-turquoise-primary/40 border border-white/10 p-6 sm:p-8 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-yellow-accent/20 border border-yellow-accent/40 text-yellow-accent text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ASL Alphabet & Practice Arena</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Welcome back, <span className="text-yellow-accent">{displayName}</span>! 👋
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Ready to continue your sign language journey today? Master the 26 ASL alphabet signs and build your practice streak.
          </p>
        </div>

        {/* Current Streak Badge */}
        <div className="absolute right-6 bottom-6 hidden md:flex items-center space-x-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
          <div className="w-10 h-10 rounded-xl bg-yellow-accent flex items-center justify-center font-bold text-dark-blue">
            <Flame className="w-6 h-6 fill-dark-blue" />
          </div>
          <div>
            <p className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Current Streak</p>
            <p className="text-xl font-black text-yellow-accent">
              {streak?.current_streak || 0} Days
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Learning Path + Streak Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recommended Lesson / Continue Card */}
        <div className="lg:col-span-8 glass-card rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Continue Learning</h2>
              <p className="text-xs text-slate-400">Pick up right where you left off</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-turquoise-primary/20 border border-turquoise-light/30 text-turquoise-light font-bold text-xs">
              Recommended
            </span>
          </div>

          {nextLesson ? (
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 text-xs font-bold text-turquoise-light uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" />
                  <span>Lesson {nextLesson.order_index} • {nextLesson.difficulty}</span>
                </div>
                <h3 className="text-lg font-extrabold text-white">{nextLesson.title}</h3>
                <p className="text-xs text-slate-300 max-w-md">{nextLesson.description}</p>
              </div>

              <Link
                href={`/lessons`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-turquoise-primary hover:bg-turquoise-light text-white font-bold text-sm shadow-turquoise-glow transition-all flex items-center justify-center space-x-2 shrink-0"
              >
                <span>Start Lesson</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white/5 text-center space-y-2 border border-white/5">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-bold text-white">All Available Lessons Completed!</h3>
              <p className="text-xs text-slate-400">Practice your sign alphabet in the practice arena.</p>
            </div>
          )}

          {/* Quick Action Navigation Grid */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              href="/learn"
              className="p-4 rounded-2xl bg-white/5 hover:bg-turquoise-primary/15 border border-white/10 text-center space-y-2 group transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-turquoise-primary/20 text-turquoise-light group-hover:bg-turquoise-primary group-hover:text-white flex items-center justify-center mx-auto transition-colors">
                <Hand className="w-5 h-5" />
              </div>
              <p className="font-bold text-xs text-white">ASL Alphabet</p>
            </Link>

            <Link
              href="/practice"
              className="p-4 rounded-2xl bg-white/5 hover:bg-yellow-accent/15 border border-white/10 text-center space-y-2 group transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-yellow-accent/20 text-yellow-accent group-hover:bg-yellow-accent group-hover:text-dark-blue flex items-center justify-center mx-auto transition-colors">
                <Trophy className="w-5 h-5" />
              </div>
              <p className="font-bold text-xs text-white">Practice Quiz</p>
            </Link>

            <Link
              href="/translator"
              className="p-4 rounded-2xl bg-white/5 hover:bg-purple-500/15 border border-white/10 text-center space-y-2 group transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center mx-auto transition-colors">
                <Camera className="w-5 h-5" />
              </div>
              <p className="font-bold text-xs text-white">Translator Shell</p>
            </Link>

            <Link
              href="/progress"
              className="p-4 rounded-2xl bg-white/5 hover:bg-emerald-500/15 border border-white/10 text-center space-y-2 group transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center mx-auto transition-colors">
                <Flame className="w-5 h-5" />
              </div>
              <p className="font-bold text-xs text-white">My Progress</p>
            </Link>
          </div>
        </div>

        {/* Right Side: Honest Streak & Activity Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-3xl p-6 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-yellow-accent/20 text-yellow-accent flex items-center justify-center">
                <Flame className="w-6 h-6 fill-yellow-accent text-yellow-accent" />
              </div>
              <div>
                <h3 className="font-bold text-white">Activity Streak</h3>
                <p className="text-xs text-slate-400">Tracked honestly from backend database</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-xs font-semibold text-slate-400">Current Streak</p>
                <p className="text-2xl font-black text-turquoise-light mt-1">
                  {streak?.current_streak || 0} 🔥
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-xs font-semibold text-slate-400">Longest Streak</p>
                <p className="text-2xl font-black text-yellow-accent mt-1">
                  {streak?.longest_streak || 0} ⚡
                </p>
              </div>
            </div>

            {/* Honest Progress Status Section */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Lesson Accomplishments
              </h4>
              {progressList.length > 0 ? (
                <div className="space-y-2">
                  {progressList.map((p) => (
                    <div key={p.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300 truncate max-w-[160px]">
                        {p.lesson_title || `Lesson ${p.lesson_id}`}
                      </span>
                      {p.completed ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                          Completed • {p.score}%
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                          In Progress
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white/5 border border-dashed border-white/10 text-center space-y-1">
                  <p className="text-xs font-bold text-slate-300">No learning activity yet.</p>
                  <p className="text-[11px] text-slate-400">
                    Start your first lesson to begin tracking your progress.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Flame,
  BookOpen,
  Trophy,
  ShieldCheck,
  Plus,
  CheckCircle2,
  AlertCircle,
  Eye,
  Hand,
  Award,
  ArrowRight,
  UserCheck,
  Activity,
  Sparkles
} from "lucide-react";
import { familyApi, authApi, progressApi, streaksApi } from "@/lib/api";

export default function FamilyPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [learners, setLearners] = useState<any[]>([]);
  const [selectedLearner, setSelectedLearner] = useState<any>(null);
  const [selectedLearnerProgress, setSelectedLearnerProgress] = useState<any[]>([]);
  const [learnerProgressLoading, setLearnerProgressLoading] = useState(false);

  // Separate "My Learning" State for the Family Member
  const [myStreak, setMyStreak] = useState<any>(null);
  const [myProgress, setMyProgress] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"monitoring" | "my-learning">("monitoring");

  const [requestEmail, setRequestEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const initFamilyData = async () => {
    try {
      const me = await authApi.getMe();
      setCurrentUser(me);

      const [learnersList, streakData, progressData] = await Promise.all([
        familyApi.getLearners().catch(() => []),
        streaksApi.getMe().catch(() => null),
        progressApi.getMe().catch(() => []),
      ]);

      setLearners(learnersList || []);
      setMyStreak(streakData);
      setMyProgress(progressData || []);

      if (learnersList && learnersList.length > 0) {
        // Automatically select first authorized learner to preview
        handleSelectLearner(learnersList[0]);
      }
    } catch (e: any) {
      setErr(e.message || "Failed to load family portal records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initFamilyData();
  }, []);

  const handleSelectLearner = async (learner: any) => {
    setSelectedLearner(learner);
    setLearnerProgressLoading(true);
    try {
      const prog = await progressApi.getUserProgress(learner.learner_id);
      setSelectedLearnerProgress(prog || []);
    } catch (e: any) {
      setSelectedLearnerProgress([]);
    } finally {
      setLearnerProgressLoading(false);
    }
  };

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    try {
      const res = await familyApi.requestAccess(requestEmail.trim());
      setMsg(res.message);
      setRequestEmail("");
      const updated = await familyApi.getLearners();
      setLearners(updated);
      if (updated.length > 0 && !selectedLearner) {
        handleSelectLearner(updated[0]);
      }
    } catch (error: any) {
      setErr(error.message || "Could not link learner access.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-turquoise-primary border-t-transparent animate-spin" />
          <p className="text-xs font-semibold text-slate-400">Loading family portal & authorized learner records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-yellow-accent/15 border border-yellow-accent/30 text-yellow-accent text-xs font-bold mb-2">
            <Users className="w-4 h-4" />
            <span>Authorized Family Access Control</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Family Hub & Learner Supervision</h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor authorized family learner progress with IDOR protection, or practice ASL yourself
          </p>
        </div>

        {/* Tab Switcher: Learner Monitoring vs My Learning */}
        <div className="flex items-center p-1 rounded-2xl bg-white/5 border border-white/10 self-start sm:self-center">
          <button
            onClick={() => setActiveTab("monitoring")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "monitoring"
                ? "bg-yellow-accent text-dark-blue shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Learner Monitoring ({learners.length})
          </button>
          <button
            onClick={() => setActiveTab("my-learning")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "my-learning"
                ? "bg-turquoise-primary text-white shadow-turquoise-glow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            My Learning
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center space-x-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {err && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center space-x-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{err}</span>
        </div>
      )}

      {/* VIEW 1: LEARNER MONITORING (Supervising linked family learners) */}
      {activeTab === "monitoring" && (
        <div className="space-y-8">
          {/* Linked Learners Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-white text-sm uppercase tracking-wider">
                Authorized Linked Learners ({learners.length})
              </h2>
              <span className="text-[11px] text-slate-400">
                Click any learner card to inspect their individual progress
              </span>
            </div>

            {learners.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {learners.map((learner) => {
                  const isSelected = selectedLearner?.learner_id === learner.learner_id;
                  return (
                    <div
                      key={learner.learner_id}
                      onClick={() => handleSelectLearner(learner)}
                      className={`glass-card-interactive rounded-3xl p-6 cursor-pointer space-y-5 ${
                        isSelected ? "ring-2 ring-yellow-accent border-yellow-accent/40 bg-white/10" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-2xl bg-yellow-accent text-dark-blue flex items-center justify-center font-black text-2xl shadow-md">
                          {learner.display_name[0].toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <h3 className="font-bold text-lg text-white truncate">{learner.display_name}</h3>
                          <p className="text-xs text-slate-400 truncate">{learner.email}</p>
                          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[10px]">
                            Access Authorized ✓
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-white/10">
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase">Streak</p>
                          <p className="text-lg font-black text-yellow-accent mt-0.5">
                            {learner.current_streak} 🔥
                          </p>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase">Lessons</p>
                          <p className="text-lg font-black text-turquoise-light mt-0.5">
                            {learner.completed_lessons}
                          </p>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase">Points</p>
                          <p className="text-lg font-black text-purple-400 mt-0.5">
                            +{learner.total_practice_points}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center rounded-3xl glass-card space-y-3">
                <ShieldCheck className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="font-bold text-white">No Authorized Learners Linked Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Request access using your student's email address below to link and monitor their sign language progress.
                </p>
              </div>
            )}
          </div>

          {/* Selected Learner Detailed Progress Inspection */}
          {selectedLearner && (
            <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-bold text-white">
                      Progress Breakdown: {selectedLearner.display_name}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-accent/20 text-yellow-accent font-semibold">
                      Learner #{selectedLearner.learner_id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Authorized backend verification via <code className="text-turquoise-light">/progress/user/{selectedLearner.learner_id}</code>
                  </p>
                </div>

                <div className="text-xs text-slate-400">
                  Last Activity:{" "}
                  <strong className="text-slate-200">
                    {selectedLearner.last_activity
                      ? new Date(selectedLearner.last_activity).toLocaleString()
                      : "No recorded activity yet"}
                  </strong>
                </div>
              </div>

              {learnerProgressLoading ? (
                <div className="py-8 text-center">
                  <div className="w-8 h-8 rounded-full border-2 border-turquoise-primary border-t-transparent animate-spin mx-auto" />
                  <p className="text-xs text-slate-400 mt-2">Loading verified lesson records...</p>
                </div>
              ) : selectedLearnerProgress.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Completed Lessons ({selectedLearnerProgress.filter((p) => p.completed).length})
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedLearnerProgress.map((p) => (
                      <div key={p.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">
                            {p.lesson_title || `Lesson ${p.lesson_id}`}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {p.completed ? "Completed" : "In Progress"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Highest Score: <strong className="text-yellow-accent">{p.score} pts</strong></span>
                          <span>Attempts: {p.attempts}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-slate-400 text-xs">
                  This learner has not completed any structured lesson modules yet.
                </div>
              )}
            </div>
          )}

          {/* Link Learner Request Card */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4 max-w-xl">
            <h2 className="font-bold text-white text-base">Request Access to a Learner</h2>
            <p className="text-xs text-slate-400">
              Enter your family member's registered learner email (e.g., <code className="text-turquoise-light">gowri@signalingo.edu</code>) to authorize access.
            </p>

            <form onSubmit={handleRequestAccess} className="flex gap-3">
              <input
                type="email"
                required
                value={requestEmail}
                onChange={(e) => setRequestEmail(e.target.value)}
                placeholder="gowri@signalingo.edu"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-turquoise-primary"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-turquoise-primary hover:bg-turquoise-light text-white font-bold text-xs shadow-turquoise-glow transition-all flex items-center space-x-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Link Learner</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* VIEW 2: MY LEARNING (Family Member's Own Learning Space) */}
      {activeTab === "my-learning" && (
        <div className="space-y-6">
          {/* Welcome Banner for Personal Learning */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-turquoise-primary/20 text-turquoise-light text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-accent" />
                  <span>Family Member Personal Practice Space</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Learn Sign Language With Your Family</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your personal learning journey is kept completely distinct from the students you monitor. Master alphabet signs, practice words, and build your own streak!
                </p>
              </div>

              <div className="flex items-center space-x-3 p-4 rounded-2xl bg-white/5 border border-white/5 shrink-0">
                <Flame className="w-8 h-8 text-yellow-accent fill-yellow-accent" />
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">My Personal Streak</p>
                  <p className="text-2xl font-black text-yellow-accent">{myStreak?.current_streak || 0} Days</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-wrap gap-4">
              <Link
                href="/learn"
                className="px-5 py-2.5 rounded-xl bg-turquoise-primary hover:bg-turquoise-light text-white font-bold text-xs shadow-turquoise-glow transition-all flex items-center space-x-2"
              >
                <Hand className="w-4 h-4" />
                <span>Learn ASL Alphabet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/practice"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs transition-all flex items-center space-x-2"
              >
                <Trophy className="w-4 h-4 text-yellow-accent" />
                <span>Practice Quiz</span>
              </Link>
            </div>
          </div>

          {/* Personal Progress List */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="font-bold text-white text-base">My Completed Lessons ({myProgress.length})</h3>
            {myProgress.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myProgress.map((p) => (
                  <div key={p.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                    <span className="font-bold text-white text-sm">
                      {p.lesson_title || `Lesson ${p.lesson_id}`}
                    </span>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Score: <strong className="text-yellow-accent">{p.score} pts</strong></span>
                      <span>Attempts: {p.attempts}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-slate-400 text-xs">
                You haven't completed any lessons yet. Start exploring the ASL Alphabet to begin!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

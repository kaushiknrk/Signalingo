"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { animate, stagger, createTimeline } from "animejs";
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import ThreeCanvas from "@/components/ThreeCanvas";
import { authApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    try {
      const tl = createTimeline();
      tl.add(".anime-hero-shape", {
        scale: [0.5, 1],
        opacity: [0, 0.8],
        duration: 900,
        delay: stagger(150),
      })
      .add(".anime-character", {
        translateY: [40, 0],
        opacity: [0, 1],
        duration: 1000,
      }, "-=600")
      .add(".anime-title", {
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 800,
      }, "-=700")
      .add(".anime-form", {
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 800,
      }, "-=600");
    } catch (e) {
      // fallback
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authApi.login(email, password);
      const role = res.user?.role_name?.toLowerCase();
      if (role === "admin") {
        router.push("/admin");
      } else if (role === "family") {
        router.push("/family");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div ref={containerRef} className="min-h-screen relative bg-dark-blue flex items-center justify-center p-4 overflow-hidden">
      {/* Three.js Interactive 3D Canvas Background */}
      <ThreeCanvas />

      {/* Decorative Parallax Circles */}
      <div className="anime-hero-shape absolute -top-24 -left-24 w-96 h-96 rounded-full bg-turquoise-primary filter blur-3xl opacity-20 pointer-events-none" />
      <div className="anime-hero-shape absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-yellow-accent filter blur-3xl opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Product Identity & Character Illustration */}
        <div className="lg:col-span-6 text-center lg:text-left space-y-6 px-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-turquoise-primary/20 border border-turquoise-light/40 text-turquoise-light font-bold text-xs">
            <Sparkles className="w-4 h-4 text-yellow-accent animate-pulse" />
            <span>Academic Mini Project — Security in Computing</span>
          </div>

          <h1 className="anime-title text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Welcome to <span className="text-turquoise-light">Signalingo</span>
          </h1>

          <p className="anime-title text-slate-300 text-base sm:text-lg leading-relaxed">
            A secure, modern sign language learning platform combining gamified ASL alphabet practice, real database progress tracking, and access-controlled monitoring.
          </p>

          {/* Student Illustration Hero Asset */}
          <div className="anime-character relative w-full max-w-md mx-auto lg:mx-0 aspect-square rounded-3xl overflow-hidden p-2 bg-gradient-to-br from-turquoise-primary/20 to-yellow-accent/20 border border-slate-700/50 shadow-2xl">
            <img
              src="/assets/hero/student_illustration.svg"
              alt="Signalingo ASL Learning Character"
              className="w-full h-full object-contain animate-float"
            />
          </div>
        </div>

        {/* Right Side: Login Card Form */}
        <div className="lg:col-span-6">
          <div className="anime-form bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white">Sign In to Your Account</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your credentials to access protected ASL learning modules
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form ref={formRef} onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="gowri@signalingo.edu"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-turquoise-primary focus:ring-1 focus:ring-turquoise-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-turquoise-primary focus:ring-1 focus:ring-turquoise-primary transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-turquoise-primary hover:bg-turquoise-light text-white font-bold text-sm shadow-turquoise-glow transition-all flex items-center justify-center space-x-2"
              >
                <span>{loading ? "Authenticating..." : "Sign In to Signalingo"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Demo Quick Presets */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <p className="text-[11px] font-bold text-yellow-accent uppercase tracking-wider text-center sm:text-left">
                Quick Demo Login Presets:
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin("gowri@signalingo.edu", "Learner@123456")}
                  className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-200 text-center transition-colors"
                >
                  Gowri <span className="block text-[9px] text-turquoise-light">(Learner)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin("family@signalingo.edu", "Family@123456")}
                  className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-200 text-center transition-colors"
                >
                  Priya <span className="block text-[9px] text-yellow-accent">(Family)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin("admin@signalingo.edu", "Admin@123456")}
                  className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-200 text-center transition-colors"
                >
                  Admin <span className="block text-[9px] text-rose-400">(Admin)</span>
                </button>
              </div>
            </div>

            {/* Registration link */}
            <div className="text-center pt-2 text-xs text-slate-400">
              Don't have an account?{" "}
              <Link href="/register" className="text-turquoise-light font-bold hover:underline">
                Create Account
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

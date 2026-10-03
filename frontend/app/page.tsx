"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Hand,
  BookOpen,
  Trophy,
  Flame,
  ShieldCheck,
  Lock,
  Camera,
  Users,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Database,
  Cpu,
  Layers,
  KeyRound,
  FileCheck,
  Eye,
  ChevronRight,
  Play
} from "lucide-react";
import { animate, stagger, createTimeline } from "animejs";
import LandingHero3D from "@/components/LandingHero3D";

export default function LandingPage() {
  const [introFinished, setIntroFinished] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [selectedSign, setSelectedSign] = useState("A");
  const containerRef = useRef<HTMLDivElement>(null);

  // Sample Interactive Signs for Landing Page Showcase
  const sampleSigns: Record<string, { label: string; type: string; desc: string; diff: string; url: string }> = {
    A: {
      label: "A",
      type: "Alphabet",
      desc: "Fist formed with thumb resting vertically against the side of the index finger.",
      diff: "Easy",
      url: "/assets/signs/a.svg",
    },
    B: {
      label: "B",
      type: "Alphabet",
      desc: "Open palm with four fingers straight up together, thumb folded inward across the palm.",
      diff: "Easy",
      url: "/assets/signs/b.svg",
    },
    C: {
      label: "C",
      type: "Alphabet",
      desc: "Curved hand forming a 'C' shape with thumb and fingers separated.",
      diff: "Easy",
      url: "/assets/signs/c.svg",
    },
    L: {
      label: "L",
      type: "Alphabet",
      desc: "Index finger up and thumb extended perpendicular forming an 'L' shape.",
      diff: "Easy",
      url: "/assets/signs/l.svg",
    },
    O: {
      label: "O",
      type: "Alphabet",
      desc: "All fingertips touching thumb tip forming a circular 'O' shape.",
      diff: "Easy",
      url: "/assets/signs/o.svg",
    },
    V: {
      label: "V",
      type: "Alphabet",
      desc: "Index and middle finger extended up forming a 'V' peace sign.",
      diff: "Easy",
      url: "/assets/signs/v.svg",
    },
    HELLO: {
      label: "HELLO",
      type: "Word",
      desc: "Flat hand touches temple then moves outward in a salute motion.",
      diff: "Easy",
      url: "/assets/signs/hello.svg",
    },
    "THANK YOU": {
      label: "THANK YOU",
      type: "Word",
      desc: "Fingertips touch chin then extend forward politely.",
      diff: "Easy",
      url: "/assets/signs/thank_you.svg",
    },
    LOVE: {
      label: "LOVE",
      type: "Word",
      desc: "Both hands crossed over chest in an embrace posture.",
      diff: "Medium",
      url: "/assets/signs/love.svg",
    },
  };

  // Parallax Mouse Tracker
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: clientX / innerWidth,
      y: clientY / innerHeight,
    });
  };

  // 3-Phase Intro Animation Sequence
  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== "undefined") {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        setIntroFinished(true);
        return;
      }
    }

    try {
      const tl = createTimeline();

      // Phase 1 (0 to 2.0s): Dark screen -> 3D Hand enters center & performs sign gesture
      tl.add(".intro-hand-container", {
        scale: [0.6, 1],
        opacity: [0, 1],
        duration: 1100,
        easing: "easeOutExpo",
      })

      // Phase 2 (2.0 to 3.5s): Hand exits subtly, Signalingo logo reveals letter-by-letter in center
      .add(".intro-hand-container", {
        scale: [1, 0.7],
        opacity: [1, 0],
        duration: 650,
        easing: "easeInQuad",
      }, 2000)
      .add(".intro-logo-container", {
        opacity: [0, 1],
        duration: 200,
      }, 2200)
      .add(".intro-logo-char", {
        translateY: [35, 0],
        opacity: [0, 1],
        scale: [0.85, 1],
        duration: 650,
        delay: stagger(55),
        easing: "easeOutBack",
      }, 2300)
      .add(".intro-tagline", {
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 500,
        easing: "easeOutCubic",
      }, 2850)

      // Phase 3 (3.5s onward): Logo transitions upward into header position, hero & parallax content cascades
      .add(".intro-logo-container", {
        translateY: [0, -160],
        scale: [1, 0.65],
        opacity: [1, 0],
        duration: 850,
        easing: "easeInOutCubic",
      }, 3500)
      .add(".intro-overlay", {
        opacity: [1, 0],
        duration: 800,
        easing: "easeInOutQuad",
        complete: () => {
          setIntroFinished(true);
        },
      }, 3650)
      .add(".landing-hero-item", {
        translateY: [25, 0],
        opacity: [0, 1],
        duration: 800,
        delay: stagger(90),
        easing: "easeOutExpo",
      }, 3800);
    } catch (err) {
      setIntroFinished(true);
    }
  }, []);

  const skipIntro = () => {
    setIntroFinished(true);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#0F172A] text-slate-100 selection:bg-turquoise-primary selection:text-white relative overflow-x-hidden"
    >
      {/* ========================================================================= */}
      {/* 1. 3-PHASE INTRO SEQUENCE OVERLAY                                         */}
      {/* ========================================================================= */}
      {!introFinished && (
        <div className="intro-overlay fixed inset-0 z-50 bg-[#0F172A] flex flex-col items-center justify-center p-4 text-center">
          {/* Phase 1: 3D Articulated Hand Gesture Canvas */}
          <div className="intro-hand-container relative w-72 h-72 sm:w-96 sm:h-96 mx-auto mb-2">
            <LandingHero3D isIntro={true} mousePosition={mousePos} />
            <div className="absolute inset-0 rounded-full bg-turquoise-primary/20 filter blur-3xl -z-10 animate-pulse" />
          </div>

          {/* Phase 2: Centered Kinetic Logo & Tagline Reveal */}
          <div className="intro-logo-container space-y-3 opacity-0">
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 text-4xl sm:text-6xl font-black text-white tracking-tight">
              {"SIGNALINGO".split("").map((char, index) => (
                <span
                  key={index}
                  className={`intro-logo-char inline-block ${
                    index < 4 ? "text-turquoise-light" : "text-yellow-accent"
                  }`}
                >
                  {char}
                </span>
              ))}
            </div>

            <p className="intro-tagline text-xs sm:text-sm text-slate-300 font-semibold tracking-wider uppercase max-w-md mx-auto">
              Secure Sign Language Learning and Recognition Platform
            </p>
          </div>

          <button
            onClick={skipIntro}
            className="absolute bottom-8 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 transition-colors backdrop-blur-md"
          >
            Skip Intro →
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. LANDING PAGE NAVBAR (Dark Theme)                                       */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#0F172A]/85 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-turquoise-primary flex items-center justify-center font-black text-xl text-yellow-accent shadow-turquoise-glow group-hover:scale-105 transition-transform">
              🤟
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-turquoise-light transition-colors">
                Signalingo
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-yellow-accent/15 text-yellow-accent border border-yellow-accent/30">
                Security in Computing
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-xs font-bold text-slate-300">
            <a href="#about" className="hover:text-turquoise-light transition-colors">
              Project Overview
            </a>
            <a href="#security" className="hover:text-turquoise-light transition-colors">
              Security Architecture
            </a>
            <a href="#curriculum" className="hover:text-turquoise-light transition-colors">
              ASL Alphabet
            </a>
            <a href="#ml-pipeline" className="hover:text-turquoise-light transition-colors">
              ML Recognition
            </a>
            <a href="#roles" className="hover:text-turquoise-light transition-colors">
              Role Portals
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4.5 py-2.5 rounded-xl bg-turquoise-primary hover:bg-turquoise-light text-white text-xs font-bold shadow-turquoise-glow transition-all flex items-center space-x-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. HERO SECTION WITH 3D HAND & PARALLAX DEPTH                             */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Ambient Subtle Glows */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full bg-turquoise-primary/10 filter blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-[450px] h-[450px] rounded-full bg-yellow-accent/8 filter blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="landing-hero-item inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-turquoise-primary/15 border border-turquoise-light/30 text-turquoise-light font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-yellow-accent" />
                <span>5th-Semester B.E. Computer Science Engineering Mini Project</span>
              </div>

              <h1 className="landing-hero-item text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Master Sign Language. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-turquoise-light to-turquoise-primary">
                  Protected by Computing Security.
                </span>
              </h1>

              <p className="landing-hero-item text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed mx-auto lg:mx-0">
                Signalingo combines gamified 26-character ASL alphabet learning, simple word practice, and access-controlled family monitoring with strict backend security principles.
              </p>

              {/* Action Buttons */}
              <div className="landing-hero-item flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/learn"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-turquoise-primary hover:bg-turquoise-light text-white font-extrabold text-sm shadow-turquoise-glow transition-all flex items-center justify-center space-x-2"
                >
                  <Hand className="w-4 h-4" />
                  <span>Explore ASL Alphabet</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/practice"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-100 font-bold text-sm shadow-xl shadow-black/20 backdrop-blur-md transition-all flex items-center justify-center space-x-2"
                >
                  <Trophy className="w-4 h-4 text-yellow-accent" />
                  <span>Try Recognition Quiz</span>
                </Link>
              </div>

              {/* Verified Features Pills */}
              <div className="landing-hero-item pt-4 grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0 text-left">
                <div className="p-3.5 rounded-2xl glass-card">
                  <p className="text-xl font-black text-turquoise-light">26 + 8</p>
                  <p className="text-[11px] font-semibold text-slate-400">Signs & Words</p>
                </div>
                <div className="p-3.5 rounded-2xl glass-card">
                  <p className="text-xl font-black text-yellow-accent">100%</p>
                  <p className="text-[11px] font-semibold text-slate-400">RBAC Protected</p>
                </div>
                <div className="p-3.5 rounded-2xl glass-card">
                  <p className="text-xl font-black text-slate-100">MediaPipe</p>
                  <p className="text-[11px] font-semibold text-slate-400">21 3D Landmarks</p>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Hand Canvas Frame */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-square max-w-md mx-auto rounded-3xl bg-slate-900/80 p-2 border border-white/10 shadow-2xl overflow-hidden group backdrop-blur-xl">
                <LandingHero3D mousePosition={mousePos} />
                
                {/* Floating HUD Badges */}
                <div className="absolute top-4 left-4 bg-[#0F172A]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-turquoise-primary/40 text-turquoise-light font-bold text-xs flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>3D Kinetic Hand Gesture</span>
                </div>

                <div className="absolute bottom-4 right-4 bg-[#0F172A]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-yellow-accent/40 text-yellow-accent font-black text-xs">
                  ASL "I LOVE YOU" POSTURE
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE ASL SIGN EXPLORER SHOWCASE (Dark Glass)                    */}
      {/* ========================================================================= */}
      <section id="curriculum" className="py-20 bg-[#0B1120] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-yellow-accent/15 border border-yellow-accent/30 text-yellow-accent font-bold text-xs">
              <Hand className="w-3.5 h-3.5" />
              <span>Interactive ASL Alphabet & Vocabulary</span>
            </div>
            <h2 className="text-3xl font-black text-white">
              Explore ASL Handshapes Live
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Click any sign below to inspect its vector hand shape, posture breakdown, and difficulty.
            </p>
          </div>

          {/* Interactive Sign Showcase Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sign Selector Pills */}
            <div className="lg:col-span-7 grid grid-cols-3 sm:grid-cols-5 gap-2.5">
              {Object.keys(sampleSigns).map((key) => {
                const isSelected = selectedSign === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedSign(key)}
                    className={`p-3.5 rounded-2xl font-black text-sm transition-all border text-center ${
                      isSelected
                        ? "bg-turquoise-primary text-white border-turquoise-primary shadow-turquoise-glow scale-105"
                        : "bg-white/5 hover:bg-white/10 text-slate-200 border-white/10"
                    }`}
                  >
                    {key}
                  </button>
                );
              })}
            </div>

            {/* Selected Sign Detailed Card */}
            <div className="lg:col-span-5 glass-card text-white rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-yellow-accent text-dark-blue font-black text-xs uppercase">
                  {sampleSigns[selectedSign].diff} • {sampleSigns[selectedSign].type}
                </span>
                <span className="text-xs text-slate-400 font-semibold">Signalingo Content</span>
              </div>

              <div className="relative aspect-square max-w-xs mx-auto rounded-2xl overflow-hidden bg-slate-900/80 border border-white/10 p-4">
                <img
                  src={sampleSigns[selectedSign].url}
                  alt={`ASL Sign ${sampleSigns[selectedSign].label}`}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-yellow-accent">
                  Sign "{sampleSigns[selectedSign].label}"
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {sampleSigns[selectedSign].desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SECURITY IN COMPUTING ARCHITECTURE PILLARS                             */}
      {/* ========================================================================= */}
      <section id="security" className="py-20 bg-[#0F172A] text-white relative overflow-hidden">
        {/* Subtle Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-turquoise-primary/20 border border-turquoise-light/30 text-turquoise-light font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-yellow-accent" />
              <span>Core Academic Focus: Security in Computing</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Security Built Directly Into the Architecture
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Security is not an afterthought in Signalingo. Every endpoint, database query, and authenticated session demonstrates practical computer security principles.
            </p>
          </div>

          {/* 6 Security Controls Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-3xl glass-card space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-turquoise-primary/20 text-turquoise-light flex items-center justify-center font-bold">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Bcrypt Password Hashing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Passwords are salted and hashed using bcrypt with 12 rounds. Plaintext passwords are never stored, logged, or returned in API payloads.
              </p>
            </div>

            <div className="p-6 rounded-3xl glass-card space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-yellow-accent/20 text-yellow-accent flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Role-Based Access Control</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                RBAC dependencies in FastAPI strictly enforce permissions across Learner, Family Member, and Admin roles on all protected routes.
              </p>
            </div>

            <div className="p-6 rounded-3xl glass-card space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">IDOR Prevention</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Users cannot access other learners' records by modifying URL parameters. Backend validates explicit family relationships before returning progress data.
              </p>
            </div>

            <div className="p-6 rounded-3xl glass-card space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">SQL Injection Immunity</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                100% of SQLite database operations utilize SQLAlchemy ORM parameterized queries, completely preventing raw SQL string concatenation.
              </p>
            </div>

            <div className="p-6 rounded-3xl glass-card space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Secure File Storage</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Avatar uploads validate MIME type, file extension, and 5MB limit while assigning UUID filenames to defeat path traversal attacks.
              </p>
            </div>

            <div className="p-6 rounded-3xl glass-card space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Security Event Logging</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Logs authentication attempts, password changes, admin operations, and 403 access rejections in security audit log files.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FUTURE REAL-TIME ML RECOGNITION PIPELINE                               */}
      {/* ========================================================================= */}
      <section id="ml-pipeline" className="py-20 bg-[#0B1120] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs border border-purple-500/30">
              <Camera className="w-3.5 h-3.5" />
              <span>Future Integration Pipeline</span>
            </div>
            <h2 className="text-3xl font-black text-white">
              Sign-to-Text Recognition Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Clear integration boundary for camera video stream processing with MediaPipe and Scikit-learn.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {[
              { step: "01", title: "Video Feed", desc: "Real-time webcam capture at 30 FPS" },
              { step: "02", title: "MediaPipe", desc: "Hand detection & bounding segmentation" },
              { step: "03", title: "21 Landmarks", desc: "Extract 3D (X,Y,Z) joint coordinates" },
              { step: "04", title: "Normalization", desc: "Scale, angle, and wrist alignment" },
              { step: "05", title: "Scikit-Learn", desc: "Trained ML classification inference" },
              { step: "06", title: "Live Translation", desc: "Instant text output on screen" }
            ].map((p) => (
              <div key={p.step} className="p-4 rounded-3xl glass-card text-center space-y-2">
                <span className="inline-block font-black text-xl text-turquoise-light">
                  {p.step}
                </span>
                <h3 className="font-bold text-xs text-white">{p.title}</h3>
                <p className="text-[11px] text-slate-400 leading-snug">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-[#0F172A] border border-white/10 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-yellow-accent">
                Honest Prototype State Policy
              </h3>
              <p className="text-xs text-slate-300 max-w-xl">
                No fake ML prediction confidence values are ever fabricated. The translator shell displays accurate status until model deployment.
              </p>
            </div>
            <Link
              href="/translator"
              className="px-6 py-3 rounded-xl bg-turquoise-primary hover:bg-turquoise-light text-white font-bold text-xs shadow-turquoise-glow transition-all shrink-0"
            >
              View Translator Shell →
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. ROLE-BASED ACCESS EXPERIENCE (Learner, Family, Admin)                  */}
      {/* ========================================================================= */}
      <section id="roles" className="py-20 bg-[#0F172A] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-turquoise-primary/15 border border-turquoise-light/30 text-turquoise-light font-bold text-xs">
              <Users className="w-3.5 h-3.5" />
              <span>Tailored User Experiences</span>
            </div>
            <h2 className="text-3xl font-black text-white">
              Three Dedicated Role Portals
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Each user role experiences purpose-built dashboards protected at the backend level.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Learner Card */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-turquoise-primary/20 text-turquoise-light flex items-center justify-center font-bold">
                <Hand className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Learner Experience</h3>
              <ul className="text-xs text-slate-300 space-y-2.5">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-turquoise-light shrink-0" />
                  <span>Interactive 26-character ASL alphabet</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-turquoise-light shrink-0" />
                  <span>Gamified quiz practice with immediate scoring</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-turquoise-light shrink-0" />
                  <span>Activity streaks & honest database progress</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-turquoise-light hover:underline"
                >
                  <span>Learner Login</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Family Member Card */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-yellow-accent/20 text-yellow-accent flex items-center justify-center font-bold">
                <Users className="w-6 h-6 text-yellow-accent" />
              </div>
              <h3 className="text-xl font-bold text-white">Family Member Portal</h3>
              <ul className="text-xs text-slate-300 space-y-2.5">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-yellow-accent shrink-0" />
                  <span>Monitor authorized learner progress</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-yellow-accent shrink-0" />
                  <span>Access control prevents unauthorized viewing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-yellow-accent shrink-0" />
                  <span>Track streaks and practice points</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-yellow-accent hover:underline"
                >
                  <span>Family Portal Login</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Admin Card */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">System Administration</h3>
              <ul className="text-xs text-slate-300 space-y-2.5">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Platform user management & deletion</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Create sign & word learning content</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Inspect security audit logs</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-rose-400 hover:underline"
                >
                  <span>Admin Console Login</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. CALL TO ACTION SECTION                                                 */}
      {/* ========================================================================= */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-[#0F172A] to-turquoise-primary/40 border-t border-white/10 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ready to Begin Learning ASL?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Join Signalingo today to master sign language alphabet handshapes and track your learning progress securely.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-yellow-accent hover:bg-yellow-hover text-dark-blue font-black text-sm shadow-yellow-glow transition-all"
            >
              Create Free Account
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/15 backdrop-blur-md transition-all"
            >
              Sign In to Existing Account
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FOOTER & PROJECT DETAILS                                               */}
      {/* ========================================================================= */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-white/10 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-turquoise-primary text-yellow-accent flex items-center justify-center font-black text-base">
              🤟
            </div>
            <div>
              <p className="font-bold text-white text-sm">Signalingo</p>
              <p className="text-[11px] text-slate-400">
                Secure Sign Language Learning and Recognition Platform
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-[11px] font-semibold">
            <Link href="/login" className="hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/register" className="hover:text-white transition-colors">
              Register
            </Link>
            <Link href="/learn" className="hover:text-white transition-colors">
              ASL Alphabet
            </Link>
            <Link href="/translator" className="hover:text-white transition-colors">
              Translator Shell
            </Link>
          </div>

          <p className="text-[11px] text-slate-500">
            5th-Semester B.E. Computer Science Engineering Mini Project
          </p>
        </div>
      </footer>
    </div>
  );
}

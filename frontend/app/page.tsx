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
  Heart,
  Globe,
  Smile,
  Compass,
  Zap,
} from "lucide-react";
import { animate, stagger, createTimeline } from "animejs";
import LandingHero3D from "@/components/LandingHero3D";

export default function LandingPage() {
  const [introFinished, setIntroFinished] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [selectedSign, setSelectedSign] = useState("A");
  const containerRef = useRef<HTMLDivElement>(null);

  // Sample Interactive Signs for Live Visual Showcase
  const sampleSigns: Record<
    string,
    { label: string; type: string; desc: string; diff: string; url: string }
  > = {
    A: {
      label: "A",
      type: "Alphabet",
      desc: "Fist formed with thumb resting vertically along the side of the index finger.",
      diff: "Beginner",
      url: "/assets/signs/a.svg",
    },
    B: {
      label: "B",
      type: "Alphabet",
      desc: "Open palm with four straight fingers held together, thumb folded across palm.",
      diff: "Beginner",
      url: "/assets/signs/b.svg",
    },
    C: {
      label: "C",
      type: "Alphabet",
      desc: "Curved hand creating a visible 'C' profile with thumb and fingers separated.",
      diff: "Beginner",
      url: "/assets/signs/c.svg",
    },
    L: {
      label: "L",
      type: "Alphabet",
      desc: "Index finger raised vertically with thumb extended outward at a 90-degree angle.",
      diff: "Beginner",
      url: "/assets/signs/l.svg",
    },
    O: {
      label: "O",
      type: "Alphabet",
      desc: "All fingertips smoothly curve to touch the thumb pad, forming an 'O' ring.",
      diff: "Beginner",
      url: "/assets/signs/o.svg",
    },
    V: {
      label: "V",
      type: "Alphabet",
      desc: "Index and middle fingers extended apart in a classic peace shape.",
      diff: "Beginner",
      url: "/assets/signs/v.svg",
    },
    HELLO: {
      label: "HELLO",
      type: "Everyday Word",
      desc: "Open flat hand touches near the temple, then moves smoothly outward in a cordial salute.",
      diff: "Everyday",
      url: "/assets/signs/hello.svg",
    },
    "THANK YOU": {
      label: "THANK YOU",
      type: "Everyday Word",
      desc: "Fingertips gently touch the chin and extend forward toward the conversation partner.",
      diff: "Everyday",
      url: "/assets/signs/thank_you.svg",
    },
    LOVE: {
      label: "LOVE",
      type: "Everyday Word",
      desc: "Both forearms crossed across the chest in a warm, heartfelt embrace.",
      diff: "Everyday",
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

  // 7-Phase Cinematic Story Animation
  // DARKNESS -> HOPE -> WELCOMING HANDS -> KINDNESS -> CONNECTION -> SIGNALINGO -> WEBSITE
  useEffect(() => {
    if (typeof window !== "undefined") {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) {
        setIntroFinished(true);
        return;
      }
    }

    try {
      const tl = createTimeline();

      // Phase 1 (0 to 1.0s): Darkness & Soft Warm Yellow Glow
      tl.add(".intro-warm-glow", {
        opacity: [0, 0.85],
        scale: [0.5, 1.2],
        duration: 1000,
        easing: "easeOutCubic",
      })

      // Phase 2 & 3 (1.0 to 2.2s): Welcoming Hands emerge with light & particles
      .add(
        ".intro-hand-stage",
        {
          opacity: [0, 1],
          scale: [0.75, 1],
          duration: 1200,
          easing: "easeOutExpo",
        },
        1000
      )

      // Phase 4 & 5 (2.2 to 3.4s): Welcoming gesture holds, light expands
      .add(
        ".intro-tagline-whisper",
        {
          opacity: [0, 1],
          translateY: [15, 0],
          duration: 700,
          easing: "easeOutQuad",
        },
        2200
      )

      // Phase 6 (3.4 to 4.6s): Brand Reveal — SIGNALINGO letter-by-letter with yellow glow
      .add(
        ".intro-hand-stage",
        {
          scale: [1, 0.88],
          opacity: [1, 0.25],
          duration: 700,
          easing: "easeInOutQuad",
        },
        3200
      )
      .add(
        ".intro-logo-container",
        {
          opacity: [0, 1],
          duration: 300,
        },
        3400
      )
      .add(
        ".intro-logo-char",
        {
          translateY: [35, 0],
          opacity: [0, 1],
          scale: [0.8, 1],
          duration: 650,
          delay: stagger(45),
          easing: "easeOutBack",
        },
        3500
      )
      .add(
        ".intro-subheading",
        {
          opacity: [0, 1],
          translateY: [12, 0],
          duration: 500,
          easing: "easeOutQuad",
        },
        4000
      )

      // Phase 7 (4.6s to 5.4s): Transition into Website Hero
      .add(
        ".intro-logo-container",
        {
          translateY: [0, -120],
          scale: [1, 0.7],
          opacity: [1, 0],
          duration: 750,
          easing: "easeInOutCubic",
        },
        4600
      )
      .add(
        ".intro-overlay",
        {
          opacity: [1, 0],
          duration: 800,
          easing: "easeInOutQuad",
          complete: () => {
            setIntroFinished(true);
          },
        },
        4800
      )

      // Hero Elements Cascading In
      .add(
        ".hero-motion-item",
        {
          translateY: [30, 0],
          opacity: [0, 1],
          duration: 800,
          delay: stagger(80),
          easing: "easeOutExpo",
        },
        5000
      );
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
      className="min-h-screen bg-[#0F172A] text-slate-100 selection:bg-turquoise-primary selection:text-white relative overflow-x-hidden font-sans"
    >
      {/* ========================================================================= */}
      {/* 1. CINEMATIC 7-PHASE INTRO STORY OVERLAY                                  */}
      {/* ========================================================================= */}
      {!introFinished && (
        <div className="intro-overlay fixed inset-0 z-50 bg-[#0F172A] flex flex-col items-center justify-center p-4 text-center select-none">
          {/* Phase 1: Soft Warm Sunburst Yellow Glow (#FFB703) */}
          <div className="intro-warm-glow absolute w-96 h-96 sm:w-[500px] sm:h-[500px] rounded-full bg-[#FFB703]/25 filter blur-[100px] pointer-events-none opacity-0" />
          <div className="absolute w-72 h-72 rounded-full bg-turquoise-primary/20 filter blur-[80px] pointer-events-none animate-pulse" />

          {/* Phase 2 to 5: Welcoming 3D Hands in Center */}
          <div className="intro-hand-stage relative w-80 h-80 sm:w-[460px] sm:h-[460px] mx-auto opacity-0">
            <LandingHero3D isIntro={true} mousePosition={mousePos} />
          </div>

          <p className="intro-tagline-whisper absolute bottom-28 text-xs text-yellow-accent/90 font-bold uppercase tracking-[0.25em] opacity-0">
            A welcoming gesture of hope & human connection
          </p>

          {/* Phase 6: Modern Kinetic Logo Reveal */}
          <div className="intro-logo-container absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-0 z-20">
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 text-4xl sm:text-7xl font-black tracking-tight drop-shadow-[0_10px_25px_rgba(255,183,3,0.3)]">
              {"SIGNALINGO".split("").map((char, index) => {
                // Highlight with alternating Sunburst Yellow (#FFB703) and Turquoise (#00A896)
                const isYellow = index >= 6 || index === 0;
                return (
                  <span
                    key={index}
                    className={`intro-logo-char inline-block ${
                      isYellow ? "text-yellow-accent" : "text-turquoise-light"
                    }`}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
            <p className="intro-subheading text-xs sm:text-sm text-slate-300 font-semibold tracking-wider uppercase mt-4 opacity-0 max-w-md mx-auto">
              Language Beyond Words • ASL Platform
            </p>
          </div>

          {/* Skip Intro Button */}
          <button
            onClick={skipIntro}
            className="absolute bottom-8 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-slate-300 hover:text-white transition-all backdrop-blur-md z-30"
          >
            Skip Intro →
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SECTION 1: HERO SECTION — 3D HAND BLENDED MAIN VISUAL EXPERIENCE       */}
      {/* ========================================================================= */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-12 pb-24 sm:pt-20 sm:pb-32 overflow-hidden">
        {/* Full-bleed 3D Welcoming Hands & Radiant Lights Canvas */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <LandingHero3D settled={true} mousePosition={mousePos} />
        </div>

        {/* Ambient Radiant Glow Accents (Yellow + Turquoise) */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-yellow-accent/15 filter blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-turquoise-primary/15 filter blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#0F172A] to-transparent pointer-events-none" />

        {/* Hero Narrative Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          {/* Hope & Kindness Badge */}
          <div className="hero-motion-item inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/5 border border-yellow-accent/40 shadow-yellow-glow backdrop-blur-md text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-yellow-accent animate-ping" />
            <span className="text-yellow-accent font-extrabold">Signalingo</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-200">Education & Human Connection</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="hero-motion-item text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.08] max-w-4xl mx-auto">
            Learn the language{" "}
            <span className="text-yellow-accent drop-shadow-[0_4px_25px_rgba(255,183,3,0.45)]">
              beyond words
            </span>
            .
          </h1>

          {/* Hopeful & Clear Educational Subheading */}
          <p className="hero-motion-item text-slate-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed font-normal">
            Signalingo helps learners build ASL knowledge through visual learning,
            practice, and future intelligent sign recognition.
          </p>

          {/* Action CTAs */}
          <div className="hero-motion-item flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-yellow-accent hover:bg-yellow-hover text-dark-blue font-black text-sm shadow-yellow-glow transition-all duration-200 flex items-center justify-center space-x-2 group scale-100 hover:scale-[1.02]"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-100 font-bold text-sm backdrop-blur-md transition-all flex items-center justify-center space-x-2 hover:border-turquoise-light/40"
            >
              <Compass className="w-4 h-4 text-turquoise-light" />
              <span>Explore Signalingo</span>
            </a>
          </div>

          {/* Four Core Values Under Hero */}
          <div className="hero-motion-item pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {[
              { icon: Smile, text: "Kindness & Hope", color: "text-yellow-accent" },
              { icon: Globe, text: "Universal Access", color: "text-turquoise-light" },
              { icon: Heart, text: "Human Connection", color: "text-rose-400" },
              { icon: ShieldCheck, text: "Security-First", color: "text-amber-400" },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 backdrop-blur-sm flex items-center justify-center space-x-2"
                >
                  <Icon className={`w-4 h-4 ${item.color} shrink-0`} />
                  <span className="text-xs font-semibold text-slate-300">
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SECTION 2: WHY SIGNALINGO? — 3 SIMPLE CORE PILLARS                     */}
      {/* ========================================================================= */}
      <section id="product" className="py-24 bg-[#0B1120] border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-yellow-accent/15 border border-yellow-accent/30 text-yellow-accent font-extrabold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Core Purpose</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Why Signalingo?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Designed around empathy and communication, Signalingo simplifies sign language
              acquisition into three natural, accessible stages.
            </p>
          </div>

          {/* 3 Simple Concepts: Learn, Practice, Recognize */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* 1. LEARN */}
            <div className="p-8 rounded-3xl glass-card space-y-5 border border-white/10 hover:border-turquoise-light/40 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-turquoise-primary/20 text-turquoise-light flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform">
                <Hand className="w-7 h-7 text-turquoise-light" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-black text-turquoise-light uppercase tracking-wider">
                  Stage 01
                </span>
                <h3 className="text-2xl font-black text-white">Learn</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Build intuitive foundation with clear visual demonstrations of the
                  American Sign Language alphabet and everyday vocabulary. Understand finger
                  curvatures, orientations, and postures with step-by-step guidance.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/learn"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-turquoise-light hover:text-white transition-colors"
                >
                  <span>Explore Signs Catalog</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 2. PRACTICE */}
            <div className="p-8 rounded-3xl glass-card space-y-5 border border-white/10 hover:border-yellow-accent/50 transition-all group relative">
              <div className="w-14 h-14 rounded-2xl bg-yellow-accent/20 text-yellow-accent flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform">
                <Trophy className="w-7 h-7 text-yellow-accent" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-black text-yellow-accent uppercase tracking-wider">
                  Stage 02
                </span>
                <h3 className="text-2xl font-black text-white">Practice</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Turn recognition into muscle memory through interactive active-recall quizzes.
                  Earn points, track your daily practice streaks, and celebrate honest progress
                  milestones in an encouraging, low-pressure environment.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/practice"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-yellow-accent hover:text-white transition-colors"
                >
                  <span>Try Recognition Drills</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 3. RECOGNIZE */}
            <div className="p-8 rounded-3xl glass-card space-y-5 border border-white/10 hover:border-indigo-400/50 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform">
                <Camera className="w-7 h-7 text-indigo-400" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-black text-indigo-400 uppercase tracking-wider">
                  Stage 03
                </span>
                <h3 className="text-2xl font-black text-white">Recognize</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Experience the frontier of sign-to-text accessibility. Our architecture
                  prepares 3D spatial hand landmark coordinates for real-time machine learning
                  classification, translating natural physical gestures into spoken words.
                </p>
              </div>
              <div className="pt-2">
                <a
                  href="#future-recognition"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-400 hover:text-white transition-colors"
                >
                  <span>View Technical Roadmap</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

          {/* Interactive Live ASL Sign Explorer */}
          <div className="pt-10 space-y-8">
            <div className="text-center space-y-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                Interactive Sign Preview
              </h3>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Select a character or phrase below to inspect its posture breakdown and visual demonstration.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
              {/* Sign Selector Buttons */}
              <div className="lg:col-span-7 grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                {Object.keys(sampleSigns).map((key) => {
                  const isSelected = selectedSign === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedSign(key)}
                      className={`p-3.5 rounded-2xl font-black text-sm transition-all border text-center ${
                        isSelected
                          ? "bg-yellow-accent text-dark-blue border-yellow-accent shadow-yellow-glow scale-105"
                          : "bg-white/5 hover:bg-white/10 text-slate-200 border-white/10"
                      }`}
                    >
                      {key}
                    </button>
                  );
                })}
              </div>

              {/* Selected Sign Detailed Card */}
              <div className="lg:col-span-5 glass-card text-white rounded-3xl p-6 sm:p-7 space-y-5 border border-yellow-accent/30 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-yellow-accent text-dark-blue font-extrabold text-xs uppercase">
                    {sampleSigns[selectedSign].diff} • {sampleSigns[selectedSign].type}
                  </span>
                  <span className="text-[11px] text-turquoise-light font-bold">
                    Official ASL Form
                  </span>
                </div>

                <div className="relative aspect-square max-w-[220px] mx-auto rounded-2xl overflow-hidden bg-slate-900/90 border border-white/10 p-4 flex items-center justify-center">
                  <img
                    src={sampleSigns[selectedSign].url}
                    alt={`ASL Sign ${sampleSigns[selectedSign].label}`}
                    className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(255,183,3,0.3)]"
                  />
                </div>

                <div className="space-y-1 text-center">
                  <h4 className="text-xl font-black text-yellow-accent">
                    Sign "{sampleSigns[selectedSign].label}"
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {sampleSigns[selectedSign].desc}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SECTION 3: HOW IT WORKS — THE 4-STEP LEARNING JOURNEY                 */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-24 bg-[#0F172A] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-turquoise-primary/15 border border-turquoise-light/30 text-turquoise-light font-extrabold text-xs">
              <Zap className="w-3.5 h-3.5 text-yellow-accent" />
              <span>Step-by-Step Experience</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              How It Works
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              From your first alphabet letter to natural conversational gestures, Signalingo
              guides you through a four-stage structured journey.
            </p>
          </div>

          {/* 4 Journey Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Learn",
                desc: "Discover hand shapes, thumb placement, and wrist positioning through structured visual lessons.",
                icon: BookOpen,
                accent: "text-turquoise-light",
                bg: "bg-turquoise-primary/15",
              },
              {
                step: "02",
                title: "Practice",
                desc: "Sharpen muscle memory with recall quizzes, test feedback, and consistent daily learning streaks.",
                icon: Trophy,
                accent: "text-yellow-accent",
                bg: "bg-yellow-accent/15",
              },
              {
                step: "03",
                title: "Recognize",
                desc: "Prepare for camera-based sign classification powered by 3D joint landmark extraction.",
                icon: Camera,
                accent: "text-sky-400",
                bg: "bg-sky-500/15",
              },
              {
                step: "04",
                title: "Communicate",
                desc: "Bridge communication barriers and connect deeply with family members, friends, and the community.",
                icon: Heart,
                accent: "text-rose-400",
                bg: "bg-rose-500/15",
              },
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.step}
                  className="p-6 rounded-3xl glass-card space-y-4 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-2xl font-black ${card.accent}`}>
                        {card.step}
                      </span>
                      <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${card.accent}`} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white">{card.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{card.desc}</p>
                  </div>
                  <div className="pt-2 text-[11px] font-semibold text-slate-400">
                    Step {idx + 1} of 4 in Journey
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SECTION 4: SECURITY ARCHITECTURE (Factual, Professional, No Fake Stats)*/}
      {/* ========================================================================= */}
      <section id="security" className="py-24 bg-[#0B1120] border-t border-white/10 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-yellow-accent/15 border border-yellow-accent/30 text-yellow-accent font-extrabold text-xs">
              <ShieldCheck className="w-4 h-4 text-yellow-accent" />
              <span>Academic Engineering: Security in Computing</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Security Built Directly Into the Foundation
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every route, query, and session demonstrates verified security standards.
              We protect learner privacy, enforce role boundaries, and safeguard sensitive data.
            </p>
          </div>

          {/* 4 Factual Security Architecture Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-7 rounded-3xl glass-card space-y-4 border border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-yellow-accent/20 text-yellow-accent flex items-center justify-center font-bold">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Secure Authentication</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Credentials are encrypted using salted bcrypt hashing with 12 computational rounds. Plaintext passwords never enter logs or database tables.
              </p>
            </div>

            <div className="p-7 rounded-3xl glass-card space-y-4 border border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-turquoise-primary/20 text-turquoise-light flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Role-Based Access Control</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                FastAPI security dependencies enforce granular privilege boundaries between Learner, Family Member, and Administrator roles.
              </p>
            </div>

            <div className="p-7 rounded-3xl glass-card space-y-4 border border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Protected Learner Privacy</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Strict IDOR prevention rules ensure family members can only observe designated learners through explicit authenticated permissions.
              </p>
            </div>

            <div className="p-7 rounded-3xl glass-card space-y-4 border border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Secure Media & Queries</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Parameterized ORM queries eliminate SQL injection risks, while UUID filename generators and MIME validation secure avatar media handling.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SECTION 5: FUTURE RECOGNITION PIPELINE (Honest, No Fake ML Results)    */}
      {/* ========================================================================= */}
      <section id="future-recognition" className="py-24 bg-[#0F172A] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-yellow-accent/15 text-yellow-accent font-extrabold text-xs border border-yellow-accent/30">
              <Camera className="w-3.5 h-3.5" />
              <span>Vision Architecture Roadmap</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Future Real-Time Recognition
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our engineering architecture defines a 6-stage computer vision pipeline designed
              to convert real-time video stream landmarks into translated words.
            </p>
          </div>

          {/* 6-Stage Pipeline Sequence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {[
              { step: "01", title: "Camera Feed", desc: "Live video capture via user webcam at 30 FPS" },
              { step: "02", title: "MediaPipe Tracking", desc: "Hand detection & contour bounding" },
              { step: "03", title: "21 Hand Landmarks", desc: "Spatial extraction of 3D (X, Y, Z) joint coordinates" },
              { step: "04", title: "Normalization", desc: "Spatial translation & wrist-relative angle alignment" },
              { step: "05", title: "ML Classification", desc: "Trained inference model mapping coordinates to signs" },
              { step: "06", title: "Sign to Text", desc: "Real-time translated text output for communication" },
            ].map((p, idx) => (
              <div
                key={p.step}
                className="p-5 rounded-3xl glass-card text-center space-y-3 border border-white/10 hover:border-yellow-accent/40 transition-colors"
              >
                <span className="inline-block font-black text-xl text-yellow-accent">
                  {p.step}
                </span>
                <h3 className="font-extrabold text-xs text-white">{p.title}</h3>
                <p className="text-[11px] text-slate-400 leading-snug">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Honest Prototype Roadmap Callout */}
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-white/15 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center space-x-2 text-xs font-bold text-yellow-accent">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Academic Integrity Policy</span>
              </div>
              <h3 className="text-xl font-black text-white">
                Planned Machine Learning Integration
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                We believe in full transparency: machine learning classification models are
                currently undergoing dataset collection and verification. The translator interface is
                accessible in preview mode without fabricating simulated recognition accuracy.
              </p>
            </div>
            <Link
              href="/translator"
              className="px-6 py-3.5 rounded-xl bg-yellow-accent hover:bg-yellow-hover text-dark-blue font-extrabold text-xs shadow-yellow-glow transition-all shrink-0 flex items-center space-x-1.5"
            >
              <span>Explore Translator Shell</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. SECTION 6: FINAL CALL TO ACTION                                        */}
      {/* ========================================================================= */}
      <section className="py-28 bg-gradient-to-b from-[#0F172A] via-[#0B1120] to-[#0F172A] border-t border-white/10 text-white text-center relative overflow-hidden">
        {/* Soft Sunburst Glow at Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-yellow-accent/10 filter blur-[140px] pointer-events-none" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-yellow-accent/20 text-yellow-accent flex items-center justify-center mx-auto text-3xl font-black shadow-yellow-glow">
            🤟
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Ready to start learning?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Begin your journey into American Sign Language today. Discover gestures,
            build muscle memory, and connect beyond spoken words.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/register"
              className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-yellow-accent hover:bg-yellow-hover text-dark-blue font-black text-sm shadow-yellow-glow transition-all scale-100 hover:scale-[1.02]"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/15 backdrop-blur-md transition-all"
            >
              Sign In to Account
            </Link>
          </div>

          <div className="pt-4 flex items-center justify-center space-x-6 text-xs text-slate-400 font-semibold">
            <span>Free to Learn</span>
            <span>•</span>
            <span>Privacy-Protected</span>
            <span>•</span>
            <span>Inclusive by Design</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. SECTION 7: ABOUT & FOOTER                                              */}
      {/* ========================================================================= */}
      <footer id="about" className="bg-slate-950 text-slate-400 py-16 border-t border-white/10 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Column 1: Brand Info */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-turquoise-primary to-turquoise-light text-yellow-accent flex items-center justify-center font-black text-lg shadow-turquoise-glow">
                  🤟
                </div>
                <div>
                  <p className="font-extrabold text-white text-base">Signalingo</p>
                  <p className="text-[11px] text-yellow-accent font-semibold">
                    Language Beyond Words
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                An educational American Sign Language platform engineered for accessibility,
                hope, and computing security.
              </p>
              <div className="inline-block px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-400">
                5th-Semester B.E. Computer Science and Engineering Mini Project
              </div>
            </div>

            {/* Column 2: Platform Links */}
            <div className="space-y-3">
              <p className="font-bold text-white text-xs uppercase tracking-wider">
                Product
              </p>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#product" className="hover:text-yellow-accent transition-colors">
                    Core Pillars
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-yellow-accent transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#security" className="hover:text-yellow-accent transition-colors">
                    Security Architecture
                  </a>
                </li>
                <li>
                  <a href="#future-recognition" className="hover:text-yellow-accent transition-colors">
                    Future Recognition
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Authenticated Portals */}
            <div className="space-y-3">
              <p className="font-bold text-white text-xs uppercase tracking-wider">
                Access Portals
              </p>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/login" className="hover:text-turquoise-light transition-colors">
                    Learner Login
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-yellow-accent transition-colors">
                    Family Portal Login
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-rose-400 transition-colors">
                    Admin Console Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white transition-colors">
                    Register New Account
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} Signalingo. Designed for accessible learning and computing security.</p>
            <p>ASL Curriculum • MediaPipe Landmark Extraction • FastAPI & SQLite</p>
          </div>

        </div>
      </footer>
    </div>
  );
}

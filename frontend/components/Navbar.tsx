"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Hand,
  Flame,
  Target,
  Trophy,
  Camera,
  Users,
  ShieldCheck,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  Compass,
  Layers,
  Info
} from "lucide-react";
import { authApi } from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("signalingo_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          // invalid json
        }
      }
    }
  }, [pathname]);

  const handleLogout = async () => {
    await authApi.logout();
    setUser(null);
    router.push("/login");
  };

  // Hide Navbar completely on dedicated auth pages (they have their own specialized hero form layouts)
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  const isLandingPage = pathname === "/";
  const roleName = user?.role_name || "learner";

  // 1. PUBLIC MARKETING NAVIGATION (Only shown on Landing Page "/")
  const publicNavLinks = [
    { name: "Product", href: "/#product" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Security", href: "/#security" },
    { name: "About", href: "/#about" },
  ];

  // 2. AUTHENTICATED APPLICATION NAVIGATION (Shown inside app routes)
  let appNavLinks: { name: string; href: string; icon: any }[] = [];
  let homeRoute = "/";

  if (roleName === "admin") {
    appNavLinks = [
      { name: "Admin Console", href: "/admin", icon: ShieldCheck },
      { name: "Signs Catalog", href: "/learn", icon: Hand },
      { name: "Curriculum", href: "/lessons", icon: BookOpen },
      { name: "Translator Test", href: "/translator", icon: Camera },
    ];
    homeRoute = "/admin";
  } else if (roleName === "family") {
    appNavLinks = [
      { name: "Family Portal", href: "/family", icon: Users },
      { name: "My Learning", href: "/learn", icon: Hand },
      { name: "Lessons", href: "/lessons", icon: BookOpen },
      { name: "Practice", href: "/practice", icon: Trophy },
      { name: "Translator", href: "/translator", icon: Camera },
    ];
    homeRoute = "/family";
  } else {
    // learner
    appNavLinks = [
      { name: "Dashboard", href: "/dashboard", icon: Target },
      { name: "Learn Signs", href: "/learn", icon: Hand },
      { name: "Lessons", href: "/lessons", icon: BookOpen },
      { name: "Practice", href: "/practice", icon: Trophy },
      { name: "My Progress", href: "/progress", icon: Flame },
      { name: "Translator", href: "/translator", icon: Camera },
    ];
    homeRoute = "/dashboard";
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#0F172A]/85 backdrop-blur-xl text-white shadow-xl border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo */}
          <Link
            href={isLandingPage ? "/" : homeRoute}
            className="flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-turquoise-primary to-turquoise-light flex items-center justify-center font-black text-xl text-yellow-accent shadow-turquoise-glow group-hover:scale-105 transition-transform">
              🤟
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-turquoise-light transition-colors">
                Signalingo
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-yellow-accent/15 text-yellow-accent border border-yellow-accent/30">
                {isLandingPage ? "ASL Platform" : roleName === "admin" ? "Admin" : roleName === "family" ? "Family" : "Learner"}
              </span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden lg:flex items-center space-x-2">
            {isLandingPage ? (
              // PUBLIC MARKETING LINKS
              <div className="flex items-center space-x-7">
                {publicNavLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-xs font-bold text-slate-300 hover:text-yellow-accent transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            ) : (
              // AUTHENTICATED APP LINKS
              appNavLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-turquoise-primary text-white shadow-sm"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-yellow-accent" : ""}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })
            )}
          </div>

          {/* DESKTOP ACTIONS / USER PROFILE */}
          <div className="hidden md:flex items-center space-x-3">
            {isLandingPage ? (
              // PUBLIC LANDING ACTIONS
              user ? (
                // If user is already logged in, provide quick return to their portal
                <div className="flex items-center space-x-3">
                  <Link
                    href={homeRoute}
                    className="px-4 py-2 rounded-xl bg-turquoise-primary hover:bg-turquoise-light text-white font-bold text-xs shadow-turquoise-glow transition-all flex items-center space-x-1.5"
                  >
                    <span>Go to {roleName === "admin" ? "Admin Console" : roleName === "family" ? "Family Portal" : "Dashboard"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-white/10 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2.5 rounded-xl bg-yellow-accent hover:bg-yellow-hover text-dark-blue font-extrabold text-xs shadow-yellow-glow transition-all flex items-center space-x-1.5"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )
            ) : (
              // AUTHENTICATED APP ACTIONS
              user ? (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/settings"
                    className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                  >
                    <div className="w-7 h-7 rounded-full bg-yellow-accent text-dark-blue flex items-center justify-center font-bold text-xs">
                      {user.profile?.first_name?.[0] || user.email[0].toUpperCase()}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-white leading-none">
                        {user.profile?.display_name || user.profile?.first_name || "User"}
                      </p>
                      <p className="text-[10px] text-yellow-accent font-semibold uppercase tracking-wider">
                        {roleName}
                      </p>
                    </div>
                  </Link>

                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl bg-turquoise-primary hover:bg-turquoise-light text-white font-bold text-sm shadow-turquoise-glow transition-all"
                >
                  Login
                </Link>
              )
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0F172A]/95 backdrop-blur-2xl border-b border-white/10 px-4 pt-2 pb-5 space-y-2">
          {isLandingPage ? (
            // Mobile Public Marketing Links
            <div className="space-y-1">
              {publicNavLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl font-bold text-sm text-slate-300 hover:bg-white/5 hover:text-yellow-accent"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-white/5 text-xs font-bold text-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-yellow-accent text-dark-blue font-extrabold text-xs shadow-yellow-glow"
                >
                  Get Started
                </Link>
              </div>
            </div>
          ) : (
            // Mobile App Links
            <div className="space-y-1">
              {appNavLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm ${
                      isActive
                        ? "bg-turquoise-primary text-white"
                        : "text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
              {user && (
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-yellow-accent font-semibold">
                    {user.profile?.display_name || user.email} ({roleName})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-rose-400 hover:underline flex items-center space-x-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

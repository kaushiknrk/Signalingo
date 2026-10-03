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
  Sparkles
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

  if (pathname === "/login" || pathname === "/register") {
    return null; // Login page has its own hero layout
  }

  const roleName = user?.role_name || "learner";

  let navLinks: { name: string; href: string; icon: any }[] = [];
  let homeRoute = "/";

  if (!user) {
    navLinks = [
      { name: "Home", href: "/", icon: Target },
      { name: "Alphabet", href: "/learn", icon: Hand },
      { name: "Lessons", href: "/lessons", icon: BookOpen },
      { name: "Translator", href: "/translator", icon: Camera },
    ];
    homeRoute = "/";
  } else if (roleName === "admin") {
    navLinks = [
      { name: "Admin Console", href: "/admin", icon: ShieldCheck },
      { name: "Signs Catalog", href: "/learn", icon: Hand },
      { name: "Curriculum", href: "/lessons", icon: BookOpen },
      { name: "Translator Test", href: "/translator", icon: Camera },
    ];
    homeRoute = "/admin";
  } else if (roleName === "family") {
    navLinks = [
      { name: "Family Portal", href: "/family", icon: Users },
      { name: "My Learning", href: "/learn", icon: Hand },
      { name: "Lessons", href: "/lessons", icon: BookOpen },
      { name: "Practice", href: "/practice", icon: Trophy },
      { name: "Translator", href: "/translator", icon: Camera },
    ];
    homeRoute = "/family";
  } else {
    // learner
    navLinks = [
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
    <nav className="sticky top-0 z-50 bg-[#0F172A]/90 backdrop-blur-xl text-white shadow-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href={homeRoute} className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-turquoise-primary flex items-center justify-center font-black text-xl text-yellow-accent shadow-turquoise-glow group-hover:scale-105 transition-transform">
              🤟
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-turquoise-light transition-colors">
                Signalingo
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-accent text-dark-blue">
                {roleName === "admin" ? "Admin" : roleName === "family" ? "Family" : "Learner"}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-turquoise-primary text-white shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-dark-blue-light"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-yellow-accent" : ""}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Profile / Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/settings"
                  className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-dark-blue-light hover:bg-slate-800 transition-colors border border-slate-700"
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
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-dark-blue-light transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl bg-turquoise-primary hover:bg-turquoise-light text-white font-bold text-sm shadow-turquoise-glow transition-all"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-dark-blue-light"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-dark-blue-light border-b border-slate-700 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => {
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
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          {user && (
            <div className="pt-3 border-t border-slate-700 flex items-center justify-between">
              <span className="text-xs text-yellow-accent font-semibold">
                Logged in as {user.profile?.display_name || user.email} ({roleName})
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
    </nav>
  );
}

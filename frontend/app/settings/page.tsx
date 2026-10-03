"use client";

import { useEffect, useState } from "react";
import { User, Lock, Upload, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";
import { authApi } from "@/lib/api";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMe() {
      try {
        const data = await authApi.getMe();
        setUser(data);
        if (data.profile) {
          setFirstName(data.profile.first_name || "");
          setLastName(data.profile.last_name || "");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadMe();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    try {
      await authApi.changePassword({ old_password: oldPassword, new_password: newPassword });
      setMsg("Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
    } catch (error: any) {
      setErr(error.message || "Failed to change password.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-turquoise-primary border-t-transparent animate-spin" />
          <p className="text-xs font-semibold text-slate-400">Loading account preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Account & Profile Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your authenticated credentials, display name, and password
        </p>
      </div>

      {msg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{msg}</span>
        </div>
      )}

      {err && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{err}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-yellow-accent text-dark-blue flex items-center justify-center font-black text-2xl shadow-md">
            {firstName?.[0] || user?.email[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {firstName} {lastName}
            </h2>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <span className="inline-block mt-1.5 px-3 py-0.5 rounded-full bg-turquoise-primary/20 border border-turquoise-light/30 text-turquoise-light font-bold text-[10px] uppercase">
              Role: {user?.role_name}
            </span>
          </div>
        </div>
      </div>

      {/* Change Password Security Form */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center space-x-2 text-white">
          <Lock className="w-5 h-5 text-turquoise-light" />
          <h2 className="font-bold text-lg">Change Account Password</h2>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-turquoise-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              New Password (Min 8 Characters)
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-turquoise-primary"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-turquoise-primary hover:bg-turquoise-light text-white font-bold text-xs shadow-turquoise-glow transition-all"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

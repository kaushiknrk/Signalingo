"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Hand,
  BookOpen,
  Activity,
  FileText,
  KeyRound,
  Database,
  Layers,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { adminApi, authApi } from "@/lib/api";

export default function AdminPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "content" | "logs">("overview");

  // Sign Creation Form state
  const [newLabel, setNewLabel] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState("alphabet");
  const [newDiff, setNewDiff] = useState("easy");

  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAllAdminData = async () => {
    try {
      setRefreshing(true);
      const me = await authApi.getMe();
      setCurrentUser(me);

      if (me.role_name !== "admin") {
        setErr("Access denied: You must be an administrator to view this control panel.");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const [statsData, usersData, logsData] = await Promise.all([
        adminApi.getStats().catch(() => null),
        adminApi.getUsers().catch(() => []),
        adminApi.getLogs(50).catch(() => []),
      ]);

      setStats(statsData);
      setUsers(usersData || []);
      setLogs(logsData || []);
    } catch (e: any) {
      setErr(e.message || "Admin authorization required (403 Forbidden).");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const handleCreateSign = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    try {
      const res = await adminApi.createSign({
        label: newLabel.trim().toUpperCase(),
        content_type: newType,
        difficulty: newDiff,
        description: newDesc,
      });
      setMsg(`Sign content '${res.label}' successfully created in database.`);
      setNewLabel("");
      setNewDesc("");
      // Refresh stats
      const updatedStats = await adminApi.getStats();
      setStats(updatedStats);
    } catch (error: any) {
      setErr(error.message || "Failed to create sign content.");
    }
  };

  const handleDeleteUser = async (userId: number, email: string) => {
    if (!confirm(`Are you sure you want to delete user ${email}?`)) return;
    setMsg(null);
    setErr(null);

    try {
      await adminApi.deleteUser(userId);
      setMsg(`User ${email} deleted successfully.`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      // Refresh stats & logs
      const [updatedStats, updatedLogs] = await Promise.all([
        adminApi.getStats().catch(() => null),
        adminApi.getLogs(50).catch(() => []),
      ]);
      if (updatedStats) setStats(updatedStats);
      if (updatedLogs) setLogs(updatedLogs);
    } catch (error: any) {
      setErr(error.message || "Failed to delete user.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-turquoise-primary border-t-transparent animate-spin" />
          <p className="text-xs font-semibold text-slate-400">Verifying administrative credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold mb-2">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span>Dedicated Platform Administration Console</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">System & Security Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative platform metrics, RBAC user auditing, content creation, and security logging
          </p>
        </div>

        <button
          onClick={loadAllAdminData}
          disabled={refreshing}
          className="self-start sm:self-center px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition-all flex items-center space-x-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-turquoise-light" : ""}`} />
          <span>{refreshing ? "Refreshing..." : "Refresh Data"}</span>
        </button>
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

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-3 overflow-x-auto">
        {[
          { id: "overview", label: "Platform Overview", icon: Activity },
          { id: "users", label: `Users & Roles (${users.length})`, icon: Users },
          { id: "content", label: "Content Management", icon: Hand },
          { id: "logs", label: `Security Logs (${logs.length})`, icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-turquoise-primary text-white shadow-turquoise-glow"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PLATFORM OVERVIEW (Real Stats from Database) */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-card p-5 rounded-3xl space-y-1">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Registered</p>
              <p className="text-3xl font-black text-white">{stats?.total_users ?? 0}</p>
              <p className="text-[10px] text-turquoise-light font-semibold">Active accounts</p>
            </div>

            <div className="glass-card p-5 rounded-3xl space-y-1">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Learners</p>
              <p className="text-3xl font-black text-turquoise-light">{stats?.total_learners ?? 0}</p>
              <p className="text-[10px] text-slate-400 font-semibold">Students learning ASL</p>
            </div>

            <div className="glass-card p-5 rounded-3xl space-y-1">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Family Accounts</p>
              <p className="text-3xl font-black text-yellow-accent">{stats?.total_family_members ?? 0}</p>
              <p className="text-[10px] text-slate-400 font-semibold">{stats?.total_family_links ?? 0} active links</p>
            </div>

            <div className="glass-card p-5 rounded-3xl space-y-1">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Administrators</p>
              <p className="text-3xl font-black text-rose-400">{stats?.total_admins ?? 0}</p>
              <p className="text-[10px] text-slate-400 font-semibold">System operators</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-5 rounded-3xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Signs Catalog</span>
                <Hand className="w-4 h-4 text-turquoise-light" />
              </div>
              <p className="text-3xl font-black text-white">{stats?.total_signs ?? 0}</p>
              <p className="text-[10px] text-slate-400 font-semibold">26 Alphabet + Words</p>
            </div>

            <div className="glass-card p-5 rounded-3xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Curriculum Lessons</span>
                <BookOpen className="w-4 h-4 text-yellow-accent" />
              </div>
              <p className="text-3xl font-black text-white">{stats?.total_lessons ?? 0}</p>
              <p className="text-[10px] text-slate-400 font-semibold">Structured modules</p>
            </div>

            <div className="glass-card p-5 rounded-3xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Practice Attempts</span>
                <Activity className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-3xl font-black text-white">{stats?.total_practice_attempts ?? 0}</p>
              <p className="text-[10px] text-slate-400 font-semibold">Logged quiz executions</p>
            </div>
          </div>

          {/* Quick Security Status Summary */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-turquoise-light" />
              <span>Platform Security Parameters & Status</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <p className="text-slate-400 text-[11px]">Database Engine</p>
                <p className="font-bold text-white">SQLite (SQLAlchemy ORM)</p>
                <p className="text-[10px] text-emerald-400">Parameterized queries enforced</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <p className="text-slate-400 text-[11px]">Authentication Scheme</p>
                <p className="font-bold text-white">JWT + Bcrypt (12 Rounds)</p>
                <p className="text-[10px] text-emerald-400">Stateless token validation</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <p className="text-slate-400 text-[11px]">Authorization Mode</p>
                <p className="font-bold text-white">FastAPI RBAC + IDOR Protection</p>
                <p className="text-[10px] text-emerald-400">Family relationship validated</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT TABLE */}
      {activeTab === "users" && (
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-white text-base">Registered System Users ({users.length})</h2>
              <p className="text-xs text-slate-400">All registered platform accounts and role assignments</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => {
                  const isSelf = currentUser && currentUser.id === u.id;
                  return (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-xs text-yellow-accent">
                          {(u.profile?.first_name?.[0] || u.email[0]).toUpperCase()}
                        </div>
                        <span>{u.profile?.display_name || u.profile?.first_name || "User"}</span>
                        {isSelf && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-white/10 text-slate-300">You</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{u.email}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                          u.role_name === "admin"
                            ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                            : u.role_name === "family"
                            ? "bg-yellow-accent/15 text-yellow-accent border border-yellow-accent/30"
                            : "bg-turquoise-primary/15 text-turquoise-light border border-turquoise-primary/30"
                        }`}>
                          {u.role_name}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>Active</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {!isSelf && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            title="Delete User Account"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CONTENT MANAGEMENT (Create Signs) */}
      {activeTab === "content" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 glass-card rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="font-bold text-white text-base">Add Sign to Database</h2>
              <p className="text-xs text-slate-400 mt-1">
                Insert new ASL alphabet letters or words into the platform catalog
              </p>
            </div>

            <form onSubmit={handleCreateSign} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Sign Label
                </label>
                <input
                  type="text"
                  required
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="E.g. WELCOME"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-turquoise-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Content Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-turquoise-primary"
                  >
                    <option value="alphabet">Alphabet</option>
                    <option value="word">Word</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Difficulty
                  </label>
                  <select
                    value={newDiff}
                    onChange={(e) => setNewDiff(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-turquoise-primary"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Hand Posture Description
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe fingers, palm orientation, and movement..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-turquoise-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-turquoise-primary hover:bg-turquoise-light text-white font-bold text-xs shadow-turquoise-glow transition-all flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Save New Sign to SQLite Database</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 glass-card rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="font-bold text-white text-sm">Sign Catalog Summary</h3>
            <p className="text-xs text-slate-400">
              The platform currently maintains {stats?.total_signs ?? 34} total signs across 26 alphabet characters and 8 foundational words.
            </p>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-300 space-y-2">
              <p className="font-bold text-turquoise-light">Database Integrity Rule:</p>
              <p className="text-slate-400 leading-relaxed">
                Labels are automatically normalized to uppercase and unique indexed. Adding duplicate labels will be rejected by the backend validation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE SECURITY AUDIT LOGS */}
      {activeTab === "logs" && (
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-white text-base">Security Audit Log Events ({logs.length})</h2>
              <p className="text-xs text-slate-400">
                Live chronological audit trail recorded from <code className="text-yellow-accent">logs/security.log</code>
              </p>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
              Last 50 Entries
            </span>
          </div>

          {logs.length > 0 ? (
            <div className="space-y-2 font-mono text-xs max-h-[500px] overflow-y-auto pr-2">
              {logs.map((log, idx) => {
                const isFail = log.status === "FAILED" || log.level === "WARNING";
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                      isFail
                        ? "bg-rose-500/10 border-rose-500/25 text-rose-200"
                        : "bg-white/5 border-white/5 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isFail ? "bg-rose-500/20 text-rose-400" : "bg-turquoise-primary/20 text-turquoise-light"
                      }`}>
                        {log.event}
                      </span>
                      <span className="text-[11px] text-slate-400">{log.timestamp}</span>
                    </div>

                    <div className="flex-1 truncate">
                      <span className="text-slate-400 mr-2">User: <strong className="text-slate-200">{log.user}</strong></span>
                      <span className="text-slate-400">Details: {log.details}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold self-start sm:self-center shrink-0 ${
                      isFail ? "bg-rose-500 text-white" : "bg-emerald-500/20 text-emerald-400"
                    }`}>
                      {log.status}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              No security events recorded yet in the log file.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

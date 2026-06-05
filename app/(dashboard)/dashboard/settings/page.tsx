"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  User,
  Mail,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  Disc3,
  Globe,
  Shield,
  Trash2,
  LogOut,
  RefreshCw,
  Monitor,
  Bell,
  BellOff,
  Eye,
  EyeOff,
  Copy,
  Check,
  ChevronRight,
  Zap,
  KeyRound,
  X,
  AlertTriangle,
  Link,
  Smartphone,
} from "lucide-react";

/* ─────────────────────────── helpers ─────────────────────────── */

interface UserProfile {
  userId: number;
  username: string;
  email: string;
  discord_id?: string | null;
  google_id?: string | null;
}

type Toast = { id: number; type: "success" | "error"; message: string };

let toastCounter = 0;

function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((type: "success" | "error", message: string) => {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, push, dismiss };
}

/* ─────────────────────────── sub-components ──────────────────── */

function SectionCard({
  title,
  subtitle,
  icon,
  children,
  accent,
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`rounded-2xl border ${accent ? "border-red-500/20 bg-[#0D0505]/80" : "border-white/[0.06] bg-[#0D0D0D]/80"} p-6 backdrop-blur-xl`}
    >
      <div className="mb-5 flex items-start gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${accent ? "border-red-500/30 bg-red-500/15 text-red-400" : "border-white/[0.08] bg-white/[0.04] text-[#8C8C8C]"}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-[#666]">{subtitle}</p>}
        </div>
      </div>
      {children}
    </motion.div>
  );
}

function InputField({
  label,
  icon,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
  hint,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#555]">
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#444]">
          {icon}
        </div>
        <input
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#111]/80 pl-10 pr-10 text-sm text-white placeholder-[#3A3A3A] transition-all duration-200 focus:border-red-500/30 focus:bg-[#130505]/60 focus:outline-none focus:ring-1 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#444] hover:text-[#888] transition-colors"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {hint && <p className="mt-1.5 text-[11px] text-[#555]">{hint}</p>}
    </div>
  );
}

function ToggleSwitch({
  enabled,
  onChange,
  loading,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => !loading && onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 transition-all duration-300 ${enabled ? "border-red-600/60 bg-red-600" : "border-white/10 bg-[#1A1A1A]"
        } ${loading ? "opacity-60 cursor-wait" : ""}`}
    >
      <motion.span
        animate={{ x: enabled ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="inline-block h-4 w-4 rounded-full bg-white shadow-sm"
      />
    </button>
  );
}

function DangerButton({
  onClick,
  children,
  loading,
}: {
  onClick: () => void;
  children: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex h-10 items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/8 px-4 text-xs font-semibold text-red-400 transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/15 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? <Disc3 className="h-3.5 w-3.5 animate-spin" /> : children}
    </button>
  );
}

/* ─────────────────────────── Modal ───────────────────────────── */

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/[0.08] bg-[#0D0D0D] p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.07] text-[#666] hover:text-white transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────── Main Page ───────────────────────── */

export default function SettingsPage() {
  const router = useRouter();
  const { toasts, push, dismiss } = useToasts();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // ── General Info
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [savingInfo, setSavingInfo] = useState(false);

  // ── Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // ── Language
  const [language, setLanguage] = useState("en-US");

  // ── Email marketing
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [savingMarketing, setSavingMarketing] = useState(false);

  // ── Recovery codes
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [generatingCodes, setGeneratingCodes] = useState(false);
  const [showCodesModal, setShowCodesModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // ── Sessions
  const [invalidatingSessions, setInvalidatingSessions] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionPassword, setSessionPassword] = useState("");

  // ── Delete account
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

  /* ─── fetch user ─── */
  useEffect(() => {
    async function load() {
      try {
        const [meRes, marketingRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/user/marketing"),
        ]);
        const meData = await meRes.json();
        const marketingData = await marketingRes.json();

        if (!meData.user) {
          router.push("/signin");
          return;
        }
        setUser(meData.user);
        setUsername(meData.user.username ?? "");
        setEmail(meData.user.email ?? "");
        setDisplayName(meData.user.display_name ?? "");
        setEmailUpdates(marketingData.emailUpdates ?? true);
      } catch {
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  /* ─── save general info ─── */
  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingInfo(true);
    try {
      const res = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, displayName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      push("success", "General information updated successfully.");
      setUser((prev) => prev ? { ...prev, username, email } : prev);
    } catch (err: any) {
      push("error", err.message ?? "Failed to save.");
    } finally {
      setSavingInfo(false);
    }
  };

  /* ─── save password ─── */
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      push("error", "New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      push("error", "Password must be at least 6 characters.");
      return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      push("success", "Password changed. You have been kept logged in on this device.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      push("error", err.message ?? "Failed to change password.");
    } finally {
      setSavingPassword(false);
    }
  };

  /* ─── email marketing ─── */
  const handleMarketingToggle = async (val: boolean) => {
    setSavingMarketing(true);
    try {
      const res = await fetch("/api/user/marketing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailUpdates: val }),
      });
      if (!res.ok) throw new Error("Failed");
      setEmailUpdates(val);
      push("success", val ? "Email updates enabled." : "Email updates disabled.");
    } catch {
      push("error", "Could not update preference.");
    } finally {
      setSavingMarketing(false);
    }
  };

  /* ─── recovery codes ─── */
  const handleGenerateCodes = async () => {
    setGeneratingCodes(true);
    try {
      const res = await fetch("/api/user/recovery-codes", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRecoveryCodes(data.codes);
      setShowCodesModal(true);
    } catch (err: any) {
      push("error", err.message ?? "Failed to generate codes.");
    } finally {
      setGeneratingCodes(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const copyAllCodes = () => {
    if (!recoveryCodes) return;
    navigator.clipboard.writeText(recoveryCodes.join("\n"));
    push("success", "All codes copied to clipboard.");
  };

  /* ─── session invalidation ─── */
  const handleInvalidateSessions = async () => {
    setInvalidatingSessions(true);
    try {
      const res = await fetch("/api/user/sessions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: sessionPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      push("success", "All other sessions have been signed out.");
      setShowSessionModal(false);
      setSessionPassword("");
    } catch (err: any) {
      push("error", err.message ?? "Failed to invalidate sessions.");
    } finally {
      setInvalidatingSessions(false);
    }
  };

  /* ─── logout ─── */
  const handleLogout = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/signin");
  };

  /* ─── delete account ─── */
  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      const res = await fetch("/api/user/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword, confirmText: deleteConfirmText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/signin?deleted=true");
    } catch (err: any) {
      push("error", err.message ?? "Failed to delete account.");
    } finally {
      setDeletingAccount(false);
    }
  };

  /* ─── loading ─── */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/8"
          >
            <Disc3 className="h-6 w-6 text-red-500" />
          </motion.div>
          <p className="animate-pulse text-xs font-semibold uppercase tracking-[0.2em] text-[#555]">
            Loading settings…
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const languages = [
    { code: "en-US", label: "English (US)" },
    { code: "en-GB", label: "English (UK)" },
    { code: "es-ES", label: "Español" },
    { code: "fr-FR", label: "Français" },
    { code: "de-DE", label: "Deutsch" },
    { code: "ja-JP", label: "日本語" },
    { code: "ko-KR", label: "한국어" },
    { code: "zh-CN", label: "中文 (简体)" },
    { code: "pt-BR", label: "Português (BR)" },
    { code: "ar-SA", label: "العربية" },
  ];

  return (
    <>
      {/* ── Toast rack ─────────────────────────────────────────── */}
      <div className="fixed right-5 top-5 z-[100] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className={`flex max-w-sm items-start gap-2.5 rounded-xl border px-4 py-3 shadow-xl ${t.type === "success"
                  ? "border-green-500/20 bg-[#091209]/90 text-green-400"
                  : "border-red-500/20 bg-[#130505]/90 text-red-400"
                } backdrop-blur-xl`}
            >
              {t.type === "success" ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              <p className="text-xs font-medium leading-snug">{t.message}</p>
              <button onClick={() => dismiss(t.id)} className="ml-auto shrink-0 opacity-60 hover:opacity-100">
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Page ───────────────────────────────────────────────── */}
      <section className="relative min-h-screen overflow-hidden bg-[#0A0A0A] px-4 pb-24 pt-8 md:px-10 md:pt-12">
        {/* bg glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-[-100px] h-[600px] w-[600px] rounded-full bg-red-700/5 blur-[180px]" />
          <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-red-900/4 blur-[140px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl space-y-5">

          {/* ── Header ─────────────────────────── */}
          <div className="border-b border-white/[0.05] pb-8">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-500/70">
              <Settings className="h-3.5 w-3.5" />
              Identity Control
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              Account Settings
            </h1>
            <p className="mt-1.5 text-sm text-[#666]">
              Manage your account details, security, and preferences.
            </p>
          </div>

          {/* ══════════════ SECTION 1 – General Information ══════════════ */}
          <SectionCard
            icon={<User className="h-4 w-4" />}
            title="General Information"
            subtitle="Your public-facing identity and contact details."
          >
            <form onSubmit={handleSaveInfo} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  label="Username"
                  icon={<User className="h-3.5 w-3.5" />}
                  value={username}
                  onChange={setUsername}
                  placeholder="your_handle"
                  hint="Lowercase letters, numbers, underscores, hyphens."
                />
                <InputField
                  label="Display Name"
                  icon={<Zap className="h-3.5 w-3.5" />}
                  value={displayName}
                  onChange={setDisplayName}
                  placeholder="How you appear publicly"
                />
              </div>
              <InputField
                label="Email Address"
                icon={<Mail className="h-3.5 w-3.5" />}
                value={email}
                onChange={setEmail}
                type="email"
                placeholder="you@example.com"
              />
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={savingInfo}
                  className="flex h-10 items-center gap-2 rounded-xl bg-red-600 px-5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_4px_20px_rgba(200,0,0,0.25)] transition-all duration-200 hover:bg-red-500 disabled:opacity-60"
                >
                  {savingInfo ? (
                    <Disc3 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </SectionCard>


          {/* ══════════════ SECTION 3 – Discord Settings ══════════════ */}
          <SectionCard
            icon={
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.04.033.051a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
              </svg>
            }
            title="Discord Settings"
            subtitle="Claim your redr.lol badges and perks as roles on the official Discord server."
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs text-[#666] leading-relaxed">
                  {user.discord_id
                    ? "Your Discord account is connected. Claim your roles on the official server."
                    : "Connect your Discord to unlock exclusive server roles and badges."}
                </p>
                {user.discord_id && (
                  <p className="mt-1 text-[11px] text-green-500/80 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Connected
                  </p>
                )}
              </div>
              <a
                href={user.discord_id ? "https://discord.gg/redr" : "/api/auth/discord/login"}
                target={user.discord_id ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-[#5865F2]/30 bg-[#5865F2]/10 px-4 text-xs font-semibold text-[#7289da] transition-all duration-200 hover:border-[#5865F2]/50 hover:bg-[#5865F2]/20"
              >
                <Zap className="h-3.5 w-3.5" />
                {user.discord_id ? "Claim Now" : "Connect Discord"}
              </a>
            </div>
          </SectionCard>

          {/* ══════════════ SECTION 4 – Active Sessions ══════════════ */}
          <SectionCard
            icon={<Monitor className="h-4 w-4" />}
            title="Active Sessions"
            subtitle="Review every device currently signed in to your account."
          >
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#111]/60 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-[#1A1A1A] text-[#666]">
                <Smartphone className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Current Session</p>
                <p className="text-xs text-[#555]">Active right now · This device</p>
              </div>
              <span className="shrink-0 flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.7)]" />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#555]">
                Sign out all other devices to secure your account.
              </p>
              <DangerButton onClick={() => setShowSessionModal(true)}>
                <Shield className="h-3.5 w-3.5" />
                Invalidate All Sessions
              </DangerButton>
            </div>
          </SectionCard>

          {/* ══════════════ SECTION 5 – Connections ══════════════ */}
          <SectionCard
            icon={<Link className="h-4 w-4" />}
            title="Connections"
            subtitle="Connect your accounts for faster sign-in and easier account access."
          >
            <div className="space-y-3">
              {/* Google */}
              <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#111]/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-[#1A1A1A]">
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Google</p>
                    <p className="text-xs text-[#555]">
                      {user.google_id ? "Connected" : "Lets you sign in with Google"}
                    </p>
                  </div>
                </div>
                {user.google_id ? (
                  <span className="flex items-center gap-1.5 text-xs text-green-500">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Connected
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const width = 500, height = 600;
                      const left = window.screenX + (window.outerWidth - width) / 2;
                      const top = window.screenY + (window.outerHeight - height) / 2;
                      window.open("/api/auth/google/login?action=connect", "GoogleConnect", `width=${width},height=${height},left=${left},top=${top}`);
                      const handler = (e: MessageEvent) => {
                        if (e.data?.type === "oauth_callback") {
                          window.removeEventListener("message", handler);
                          push("success", "Google account connected successfully!");
                          setUser((prev) => prev ? { ...prev, google_id: "connected" } : prev);
                        }
                      };
                      window.addEventListener("message", handler);
                    }}
                    className="flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-xs text-[#888] transition-all hover:border-white/[0.14] hover:text-white"
                  >
                    Connect Google
                    <ChevronRight className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Discord */}
              <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#111]/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#5865F2]/20 bg-[#5865F2]/10">
                    <svg className="h-4 w-4 text-[#7289da]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.04.033.051a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Discord</p>
                    <p className="text-xs text-[#555]">
                      {user.discord_id ? "Connected" : "Lets you sign in with Discord"}
                    </p>
                  </div>
                </div>
                {user.discord_id ? (
                  <span className="flex items-center gap-1.5 text-xs text-green-500">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Connected
                  </span>
                ) : (
                  <a
                    href="/api/auth/discord/login"
                    className="flex h-8 items-center gap-1.5 rounded-lg border border-[#5865F2]/20 bg-[#5865F2]/8 px-3 text-xs text-[#7289da] transition-all hover:border-[#5865F2]/40 hover:bg-[#5865F2]/15"
                  >
                    Connect Discord
                    <ChevronRight className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </SectionCard>

          {/* ══════════════ SECTION 6 – Email Marketing ══════════════ */}
          <SectionCard
            icon={<Bell className="h-4 w-4" />}
            title="Email Marketing"
            subtitle="Manage your email communication preferences."
          >
            <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#111]/60 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {emailUpdates ? (
                    <Bell className="h-4 w-4 text-[#666]" />
                  ) : (
                    <BellOff className="h-4 w-4 text-[#444]" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Email updates</p>
                  <p className="text-xs text-[#555] mt-0.5">
                    Receive occasional emails about launches, features, and product updates.
                  </p>
                </div>
              </div>
              <ToggleSwitch
                enabled={emailUpdates}
                onChange={handleMarketingToggle}
                loading={savingMarketing}
              />
            </div>
          </SectionCard>

          {/* ══════════════ SECTION 7 – Change Password ══════════════ */}
          <SectionCard
            icon={<Lock className="h-4 w-4" />}
            title="Change Password"
            subtitle="By changing your password, you will be logged out of every device."
          >
            <form onSubmit={handleSavePassword} className="space-y-4">
              <InputField
                label="Current Password"
                icon={<Lock className="h-3.5 w-3.5" />}
                value={currentPassword}
                onChange={setCurrentPassword}
                type="password"
                placeholder="••••••••••••"
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  label="New Password"
                  icon={<KeyRound className="h-3.5 w-3.5" />}
                  value={newPassword}
                  onChange={setNewPassword}
                  type="password"
                  placeholder="Min. 6 characters"
                />
                <InputField
                  label="Confirm Password"
                  icon={<KeyRound className="h-3.5 w-3.5" />}
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  type="password"
                  placeholder="Repeat new password"
                />
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={savingPassword || !currentPassword || !newPassword}
                  className="flex h-10 items-center gap-2 rounded-xl border border-orange-500/20 bg-orange-500/8 px-5 text-xs font-bold uppercase tracking-wider text-orange-400 transition-all duration-200 hover:border-orange-500/40 hover:bg-orange-500/15 disabled:opacity-50"
                >
                  {savingPassword ? (
                    <Disc3 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Lock className="h-3.5 w-3.5" />
                  )}
                  Update Password
                </button>
              </div>
            </form>
          </SectionCard>

          {/* ══════════════ SECTION 8 – Account Actions ══════════════ */}
          <SectionCard
            icon={<Shield className="h-4 w-4" />}
            title="Account Actions"
            subtitle="Security tools and critical account operations."
            accent
          >
            <div className="space-y-3">
              {/* Recovery codes */}
              <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#0F0F0F]/80 p-4">
                <div>
                  <p className="text-sm font-medium text-white">Recovery Codes</p>
                  <p className="text-xs text-[#555] mt-0.5">
                    One-time use codes. Used codes cannot be reused.
                  </p>
                </div>
                <DangerButton onClick={handleGenerateCodes} loading={generatingCodes}>
                  <RefreshCw className="h-3.5 w-3.5" />
                  Regenerate
                </DangerButton>
              </div>

              {/* Logout */}
              <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#0F0F0F]/80 p-4">
                <div>
                  <p className="text-sm font-medium text-white">Logout</p>
                  <p className="text-xs text-[#555] mt-0.5">
                    Sign out of your account on this device.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 text-xs font-semibold text-[#888] transition-all duration-200 hover:border-white/[0.14] hover:text-white"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>

              {/* Delete account */}
              <div className="flex items-center justify-between rounded-xl border border-red-500/[0.15] bg-red-500/[0.04] p-4">
                <div>
                  <p className="text-sm font-medium text-red-400">Delete Account</p>
                  <p className="text-xs text-[#555] mt-0.5">
                    Permanently remove your account and all data. This cannot be undone.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="flex h-10 items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 text-xs font-semibold text-red-500 transition-all duration-200 hover:border-red-500/50 hover:bg-red-500/20"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          </SectionCard>

        </div>
      </section>

      {/* ══════════════ MODAL – Recovery Codes ══════════════ */}
      <Modal open={showCodesModal} onClose={() => setShowCodesModal(false)} title="Recovery Codes">
        <div className="mb-3 flex items-start gap-2.5 rounded-xl border border-yellow-500/20 bg-yellow-500/8 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" />
          <p className="text-xs text-yellow-300/80 leading-relaxed">
            Save these codes in a secure place. Each code can only be used once and they won't be shown again.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {recoveryCodes?.map((code) => (
            <button
              key={code}
              onClick={() => copyCode(code)}
              className="group flex items-center justify-between rounded-lg border border-white/[0.07] bg-[#111] px-3 py-2 text-xs font-mono text-[#AAA] transition-all hover:border-white/10 hover:text-white"
            >
              <span>{code}</span>
              {copiedCode === code ? (
                <Check className="h-3 w-3 text-green-400" />
              ) : (
                <Copy className="h-3 w-3 opacity-0 group-hover:opacity-60" />
              )}
            </button>
          ))}
        </div>
        <button
          onClick={copyAllCodes}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 text-xs font-semibold text-[#888] transition-all hover:border-white/[0.14] hover:text-white"
        >
          <Copy className="h-3.5 w-3.5" /> Copy All Codes
        </button>
      </Modal>

      {/* ══════════════ MODAL – Invalidate Sessions ══════════════ */}
      <Modal open={showSessionModal} onClose={() => setShowSessionModal(false)} title="Sign Out All Devices">
        <p className="mb-4 text-xs text-[#666] leading-relaxed">
          This will immediately sign out all other devices. You will remain logged in here.
          Optionally enter your password to confirm.
        </p>
        <InputField
          label="Password (optional)"
          icon={<Lock className="h-3.5 w-3.5" />}
          value={sessionPassword}
          onChange={setSessionPassword}
          type="password"
          placeholder="Confirm with your password"
        />
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => setShowSessionModal(false)}
            className="flex-1 rounded-xl border border-white/[0.07] py-2.5 text-xs font-semibold text-[#666] hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleInvalidateSessions}
            disabled={invalidatingSessions}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 py-2.5 text-xs font-semibold text-red-400 transition-all hover:bg-red-500/20 disabled:opacity-60"
          >
            {invalidatingSessions ? (
              <Disc3 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Shield className="h-3.5 w-3.5" />
            )}
            Invalidate All
          </button>
        </div>
      </Modal>

      {/* ══════════════ MODAL – Delete Account ══════════════ */}
      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Account">
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/8 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <p className="text-xs text-red-300/80 leading-relaxed">
            This will permanently delete your account, all your data, links, media, and analytics. This action is <strong>irreversible</strong>.
          </p>
        </div>
        <div className="space-y-3 mb-4">
          <InputField
            label="Your password"
            icon={<Lock className="h-3.5 w-3.5" />}
            value={deletePassword}
            onChange={setDeletePassword}
            type="password"
            placeholder="Enter your password"
          />
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#555]">
              Type <span className="text-red-400 font-bold">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#111]/80 px-4 text-sm text-white placeholder-[#3A3A3A] transition-all focus:border-red-500/30 focus:outline-none focus:ring-1 focus:ring-red-500/20"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setDeletePassword("");
              setDeleteConfirmText("");
            }}
            className="flex-1 rounded-xl border border-white/[0.07] py-2.5 text-xs font-semibold text-[#666] hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteAccount}
            disabled={deletingAccount || deleteConfirmText !== "DELETE" || !deletePassword}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-600/15 py-2.5 text-xs font-bold text-red-400 transition-all hover:bg-red-600/25 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {deletingAccount ? (
              <Disc3 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            Delete Forever
          </button>
        </div>
      </Modal>
    </>
  );
}

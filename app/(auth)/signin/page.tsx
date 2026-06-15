"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Check,
  LayoutDashboard,
  Loader2,
  Lock,
  Mail,
  Palette,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export default function Signin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignin = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    if (step === "otp" && otpCode.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, ...(step === "otp" ? { otpCode } : {}) }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to sign in.");

      if (data.requiresOtp) {
        setStep("otp");
      } else {
        localStorage.setItem("is_logged_in", "true");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050505] px-5 py-8 text-[#F5F1E8] sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(149,0,0,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(149,0,0,0.08)_1px,transparent_1px)] bg-[size:54px_54px] opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(149,0,0,0.18),transparent_34%),linear-gradient(180deg,rgba(5,5,5,0)_0%,#050505_84%)]" />
        <div className="absolute right-[-12%] top-[-12%] h-[520px] w-[520px] rounded-full bg-red-600/10 blur-[140px]" />
        <div className="absolute bottom-[-18%] left-[-10%] h-[460px] w-[460px] rounded-full bg-white/[0.035] blur-[130px]" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)]">
        <motion.aside
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="hidden min-h-[680px] overflow-hidden rounded-[30px] border border-white/[0.06] bg-[#0A0A0A]/80 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl lg:block"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                <Sparkles className="h-5 w-5 text-red-300" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">redr.lol</p>
                <p className="text-xs text-[#777]">secure identity console</p>
              </div>
            </div>
            <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-200">
              online
            </div>
          </div>

          <div className="mt-14">
            <h1 className="max-w-lg text-6xl font-semibold leading-[0.92] tracking-[-0.06em] text-white">
              Return to your profile command center.
            </h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-[#9A9A9A]">
              Manage your profile chamber, update socials, inspect analytics, tune media, and keep your public identity sharp.
            </p>
          </div>

          <div className="mt-12 rounded-[26px] border border-white/[0.06] bg-[#0D0D0D] p-5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                  <LayoutDashboard className="h-5 w-5 text-red-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Dashboard snapshot</p>
                  <p className="text-xs text-[#777]">Profile health restored</p>
                </div>
              </div>
              <motion.div
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 2.4, repeat: Infinity }}
                className="h-2 w-2 rounded-full bg-emerald-400"
              />
            </div>

            <div className="mt-5 grid gap-4">
              {[
                ["Profile views", "12.8k", BarChart3],
                ["Customize page", "Ready", Palette],
                ["Security", "Protected", ShieldCheck],
              ].map(([label, value, Icon], index) => {
                const RowIcon = Icon as typeof BarChart3;
                return (
                  <motion.div
                    key={label as string}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04]">
                        <RowIcon className="h-4 w-4 text-red-300" />
                      </div>
                      <p className="text-sm font-medium text-[#B0B0B0]">{label as string}</p>
                    </div>
                    <p className="text-sm font-semibold text-white">{value as string}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mt-5 rounded-[26px] border border-red-500/15 bg-[linear-gradient(135deg,rgba(149,0,0,0.18),rgba(255,255,255,0.035))] p-5"
          >
            <p className="text-sm font-semibold text-white">Premium layer active</p>
            <p className="mt-2 text-xs leading-5 text-[#999]">
              Your login returns you directly to customization, analytics, links, badges, templates, and media controls.
            </p>
          </motion.div>
        </motion.aside>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="mx-auto w-full max-w-xl overflow-hidden rounded-[32px] border border-white/[0.07] bg-[#0B0B0B]/92 shadow-[0_24px_110px_rgba(149,0,0,0.10)] backdrop-blur-3xl"
        >
          <div className="border-b border-white/[0.06] px-6 py-5 sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" className="text-sm font-semibold tracking-tight text-white">
                redr<span className="text-red-500">.lol</span>
              </Link>
              <Link href="/signup" className="text-xs font-medium text-[#888] transition-colors hover:text-white">
                Create account
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2">
              {["Identify", "Authenticate", "Dashboard"].map((label, index) => (
                <div key={label} className="space-y-2">
                  <div className={`h-1.5 rounded-full ${index < 2 ? "bg-red-500" : "bg-white/[0.08]"}`} />
                  <p className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${index < 2 ? "text-white" : "text-[#555]"}`}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 py-8 sm:px-8 sm:py-10">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                <Lock className="h-5 w-5 text-red-300" />
              </div>
              <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-white">
                Welcome back.
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#888]">
                Sign in to continue customizing your digital identity and manage your profile experience.
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
              >
                {error}
              </motion.div>
            )}

            {step === "credentials" ? (
              <form onSubmit={handleSignin} className="mt-8 space-y-4">
                <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/20 focus-within:border-red-500/40 focus-within:shadow-[0_0_40px_rgba(239,68,68,0.15)]">

  <div className="pointer-events-none absolute inset-0 z-0 opacity-0 bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5 transition-opacity duration-300 group-focus-within:opacity-100" />

  <div className="relative z-10 flex items-center justify-between">
    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
      Email Address
    </p>

    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
      <Mail className="h-4 w-4 text-zinc-400" />
    </div>
  </div>

  <Input
    autoFocus
    required
    type="email"
    value={email}
    onChange={(event) => setEmail(event.target.value)}
    placeholder="you@example.com"
    className="relative z-10 mt-3 h-14 rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-base font-medium text-white placeholder:text-zinc-500 shadow-none transition-all duration-300 focus:border-red-500/40 focus:bg-white/[0.06] focus-visible:ring-0"
  />

  <div className="relative z-10 mt-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

</div>

              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/20 focus-within:border-red-500/40 focus-within:shadow-[0_0_40px_rgba(239,68,68,0.15)]">

  <div className="pointer-events-none absolute inset-0 z-0 opacity-0 bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5 transition-opacity duration-300 group-focus-within:opacity-100" />

  <div className="relative z-10 flex items-center justify-between">
    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
      Password
    </p>

    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
      <Lock className="h-4 w-4 text-zinc-400" />
    </div>
  </div>

  <Input
    required
    type="password"
    value={password}
    onChange={(event) => setPassword(event.target.value)}
    placeholder="Enter your password"
    className="relative z-10 mt-3 h-14 rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-base font-medium text-white placeholder:text-zinc-500 shadow-none transition-all duration-300 focus:border-red-500/40 focus:bg-white/[0.06] focus-visible:ring-0"
  />

  <div className="relative z-10 mt-4 flex items-center justify-between">
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

    <div className="mx-3 flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1">
      <Lock className="h-3 w-3 text-zinc-500" />
      <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
        Secure
      </span>
    </div>

    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  </div>

</div>

              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-center gap-3 text-sm text-[#8C8C8C]">
                  <Checkbox
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                    className="border-white/20 data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500"
                  />
                  Remember me
                </label>

                <Link href="#" className="text-sm text-[#9A9A9A] transition-colors hover:text-white">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-red-600 text-sm font-semibold text-white transition-all hover:bg-red-500 disabled:pointer-events-none disabled:opacity-50"
              >
                {loading ? (
                  <>
                    Processing <Loader2 className="h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Sign in <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-6">
                <div className="group rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/20 focus-within:border-red-500/40 focus-within:shadow-[0_0_30px_rgba(239,68,68,0.12)]">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      Verification Code
                    </p>
                  </div>

                  <Input
                    autoFocus
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(event) => setOtpCode(event.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="000000"
                    className="mt-4 h-16 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-center text-3xl tracking-[0.3em] font-medium text-white placeholder:text-zinc-600 shadow-none transition-all duration-300 hover:border-white/15 focus:border-red-500/40 focus:bg-white/[0.05] focus-visible:ring-0"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleSignin()}
                  disabled={loading || otpCode.length !== 6}
                  className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-red-600 text-sm font-semibold text-white transition-all hover:bg-red-500 disabled:pointer-events-none disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      Verifying <Loader2 className="h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      Verify & Access <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </motion.div>
            )}

            <div className="relative mt-6 flex items-center py-2">
              <div className="flex-grow border-t border-white/[0.06]"></div>
              <span className="mx-4 text-xs font-medium uppercase tracking-wider text-[#555]">Or</span>
              <div className="flex-grow border-t border-white/[0.06]"></div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const width = 500;
                const height = 600;
                const left = window.screenX + (window.outerWidth - width) / 2;
                const top = window.screenY + (window.outerHeight - height) / 2;
                window.open("/api/auth/google/login", "GoogleOAuth", `width=${width},height=${height},left=${left},top=${top}`);
                
                const handleMessage = (event: MessageEvent) => {
                  if (event.data?.type === "oauth_callback") {
                    window.removeEventListener("message", handleMessage);
                    window.location.href = event.data.dest;
                  }
                };
                window.addEventListener("message", handleMessage);
              }}
              className="mt-4 flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] text-sm font-semibold text-white transition-all hover:bg-white/[0.06]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.055] px-4 py-3">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              <span className="text-xs font-medium text-emerald-100/80">
                Encrypted session handoff, protected by signed cookies.
              </span>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-[#777]">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-medium text-white transition-colors hover:text-red-300">
                  Claim your profile
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

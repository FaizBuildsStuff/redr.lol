"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Edit3, Loader2, Lock, Mail, Sparkles, UserRound, X } from "lucide-react";
import { Input } from "@/components/ui/input";

type SignupStep = "username" | "email" | "password";
type Availability = "idle" | "checking" | "available" | "taken" | "invalid";

const steps: Array<{ id: SignupStep; label: string }> = [
  { id: "username", label: "Claim URL" },
  { id: "email", label: "Secure account" },
  { id: "password", label: "Activate" },
];

const cleanUsername = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 28);

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export default function Signup() {
  const router = useRouter();
  const [step, setStep] = useState<SignupStep>("username");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<Availability>("idle");
  const [usernameMessage, setUsernameMessage] = useState("Choose a public profile handle.");
  const [emailStatus, setEmailStatus] = useState<Availability>("idle");
  const [emailMessage, setEmailMessage] = useState("Use an email you can access.");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const activeIndex = steps.findIndex((item) => item.id === step);
  const profileUrl = useMemo(() => `redr.lol/${username || "username"}`, [username]);

  useEffect(() => {
    setError(null);

    if (!username) {
      setUsernameStatus("idle");
      setUsernameMessage("Choose a public profile handle.");
      return;
    }

    if (username.length < 3) {
      setUsernameStatus("invalid");
      setUsernameMessage("Use at least 3 characters.");
      return;
    }

    const timer = window.setTimeout(async () => {
      setUsernameStatus("checking");
      setUsernameMessage("Checking availability...");

      try {
        const res = await fetch(`/api/auth/signup?username=${encodeURIComponent(username)}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Could not check username.");

        setUsernameStatus(data.available ? "available" : "taken");
        setUsernameMessage(data.available ? "This username is available." : data.reason || "Username is taken.");
      } catch (err: any) {
        setUsernameStatus("invalid");
        setUsernameMessage(err.message || "Could not check username.");
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [username]);

  useEffect(() => {
    setError(null);

    if (!email) {
      setEmailStatus("idle");
      setEmailMessage("Use an email you can access.");
      return;
    }

    if (!isValidEmail(email)) {
      setEmailStatus("invalid");
      setEmailMessage("Enter a valid email address.");
      return;
    }

    const timer = window.setTimeout(async () => {
      setEmailStatus("checking");
      setEmailMessage("Checking email...");

      try {
        const res = await fetch(`/api/auth/signup?email=${encodeURIComponent(email.trim().toLowerCase())}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Could not check email.");

        setEmailStatus(data.available ? "available" : "taken");
        setEmailMessage(data.available ? "Email looks good." : data.reason || "Email is already registered.");
      } catch (err: any) {
        setEmailStatus("invalid");
        setEmailMessage(err.message || "Could not check email.");
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [email]);

  const continueFromUsername = () => {
    if (usernameStatus !== "available") {
      setError("Pick an available username before continuing.");
      return;
    }
    setError(null);
    setStep("email");
  };

  const continueFromEmail = () => {
    if (emailStatus !== "available") {
      setError("Enter an available email before continuing.");
      return;
    }
    setError(null);
    setStep("password");
  };

  const handleSignup = async () => {
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to sign up.");

      localStorage.setItem("is_logged_in", "true");
      router.push("/onboarding");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050505] px-5 py-8 text-[#F5F1E8] sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(149,0,0,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(149,0,0,0.08)_1px,transparent_1px)] bg-[size:54px_54px] opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(149,0,0,0.18),transparent_34%),linear-gradient(180deg,rgba(5,5,5,0)_0%,#050505_84%)]" />
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
                <p className="text-xs text-[#777]">identity launch console</p>
              </div>
            </div>
            <div className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-red-200">
              premium
            </div>
          </div>

          <div className="mt-14">
            <h1 className="max-w-lg text-6xl font-semibold leading-[0.92] tracking-[-0.06em] text-white">
              Claim a profile that feels engineered.
            </h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-[#9A9A9A]">
              Start with a clean public URL, then tune the experience with dashboard controls, profile media, badges, analytics, and Discord presence.
            </p>
          </div>

          <div className="mt-12 grid gap-4">
            {[
              ["Live profile chamber", "Background media, audio, links, and badges."],
              ["Creator dashboard", "Analytics, settings, templates, and social controls."],
              ["Session protected", "Signed cookies and database-backed ownership."],
            ].map(([title, desc], index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.1 }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5"
              >
                <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-red-950 via-red-500 to-white"
                    animate={{ x: ["-100%", "110%"] }}
                    transition={{ duration: 3 + index, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-1 text-xs leading-5 text-[#777]">{desc}</p>
              </motion.div>
            ))}
          </div>
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
              <Link href="/signin" className="text-xs font-medium text-[#888] transition-colors hover:text-white">
                Sign in
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2">
              {steps.map((item, index) => (
                <div key={item.id} className="space-y-2">
                  <div className={`h-1.5 rounded-full ${index <= activeIndex ? "bg-red-500" : "bg-white/[0.08]"}`} />
                  <p className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${index <= activeIndex ? "text-white" : "text-[#555]"}`}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 py-8 sm:px-8 sm:py-10">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
              >
                {error}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {step === "username" && (
                <motion.div key="username" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} className="space-y-7">
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                      <UserRound className="h-5 w-5 text-red-300" />
                    </div>
                    <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-white">Claim your username.</h1>
                    <p className="mt-3 text-sm leading-6 text-[#888]">This becomes your public profile address. Keep it short, clean, and easy to share.</p>
                  </div>

                  <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/20 focus-within:border-red-500/40 focus-within:shadow-[0_0_40px_rgba(239,68,68,0.15)]">

                    <div className="pointer-events-none absolute inset-0 z-0 opacity-0 bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5 transition-opacity duration-300 group-focus-within:opacity-100" />

                    <div className="relative z-10 flex items-center justify-between">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                        Profile URL
                      </p>

                      <div className="rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                          Public
                        </span>
                      </div>
                    </div>

                    <div className="relative z-10 mt-4 flex h-16 items-center rounded-2xl border border-white/10 bg-white/[0.03] px-5 transition-all duration-300 hover:border-white/20 focus-within:border-red-500/40 focus-within:bg-white/[0.05]">
                      <span className="mr-1 bg-gradient-to-r from-zinc-400 to-zinc-600 bg-clip-text text-lg font-medium text-transparent">
                        redr.lol/
                      </span>

                      <Input
                        autoFocus
                        value={username}
                        onChange={(event) => setUsername(cleanUsername(event.target.value))}
                        placeholder="username"
                        className="h-12 flex-1 border-0 bg-transparent px-0 text-[22px] font-bold tracking-[-0.04em] text-white placeholder:font-medium placeholder:text-white/35 shadow-none focus-visible:ring-0"
                      />
                    </div>

                    <div className="relative z-10 mt-4 flex items-center gap-2 text-sm">
                      {usernameStatus === "checking" && (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                          <span className="text-zinc-500">{usernameMessage}</span>
                        </>
                      )}

                      {usernameStatus === "available" && (
                        <>
                          <div className="h-2 w-2 rounded-full bg-emerald-400" />
                          <span className="text-emerald-400">{usernameMessage}</span>
                        </>
                      )}

                      {(usernameStatus === "taken" || usernameStatus === "invalid") && (
                        <>
                          <div className="h-2 w-2 rounded-full bg-red-400" />
                          <span className="text-red-300">{usernameMessage}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={continueFromUsername}
                    disabled={usernameStatus !== "available"}
                    className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white text-sm font-semibold text-black transition-all hover:bg-red-100 disabled:pointer-events-none disabled:opacity-40"
                  >
                    Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </motion.div>
              )}

              {step === "email" && (
                <motion.div key="email" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} className="space-y-7">
                  <div className="rounded-[24px] border border-red-500/15 bg-red-500/[0.05] p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-red-200/70">Reserved domain</p>
                        <p className="mt-2 break-all text-xl font-semibold text-white">{profileUrl}</p>
                      </div>
                      <button onClick={() => setStep("username")} className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#AAA] transition-colors hover:text-white">
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-white">Secure your account.</h1>
                    <p className="mt-3 text-sm leading-6 text-[#888]">Add an email so your profile can be recovered and managed safely.</p>
                  </div>

                  <div className="group rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/20 focus-within:border-red-500/40 focus-within:shadow-[0_0_30px_rgba(239,68,68,0.12)]">

                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                        Email Address
                      </p>

                      <Mail className="h-4 w-4 text-zinc-500 transition-colors duration-300 group-focus-within:text-red-400" />
                    </div>

                    <Input
                      autoFocus
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="mt-4 h-12 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-base font-medium text-white placeholder:text-zinc-600 shadow-none transition-all duration-300 focus:border-red-500/40 focus:bg-white/[0.05] focus-visible:ring-0"
                    />

                    <div className="mt-4 flex items-center gap-2 text-sm">
                      {emailStatus === "checking" && (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-500" />
                          <span className="text-zinc-500">{emailMessage}</span>
                        </>
                      )}

                      {emailStatus === "available" && (
                        <>
                          <div className="h-2 w-2 rounded-full bg-emerald-400" />
                          <span className="text-emerald-400">{emailMessage}</span>
                        </>
                      )}

                      {(emailStatus === "taken" || emailStatus === "invalid") && (
                        <>
                          <div className="h-2 w-2 rounded-full bg-red-400" />
                          <span className="text-red-300">{emailMessage}</span>
                        </>
                      )}
                    </div>

                  </div>

                  {emailStatus === "available" && (
                    <button
                      type="button"
                      onClick={continueFromEmail}
                      className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white text-sm font-semibold text-black transition-all hover:bg-red-100"
                    >
                      Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  )}
                </motion.div>
              )}

              {step === "password" && (
                <motion.div key="password" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} className="space-y-7">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      ["Username", profileUrl, "username"],
                      ["Email", email, "email"],
                    ].map(([label, value, target]) => (
                      <div key={label} className="rounded-[22px] border border-white/[0.07] bg-white/[0.025] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#666]">{label}</p>
                            <p className="mt-2 truncate text-sm font-semibold text-white">{value}</p>
                          </div>
                          <button onClick={() => setStep(target as SignupStep)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[#999] hover:text-white">
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                      <Lock className="h-5 w-5 text-red-300" />
                    </div>
                    <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-white">Create your password.</h1>
                    <p className="mt-3 text-sm leading-6 text-[#888]">One last step, then we will open the premium onboarding flow.</p>
                  </div>

                  <div className="group rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/20 focus-within:border-red-500/40 focus-within:shadow-[0_0_30px_rgba(239,68,68,0.12)]">

  <div className="flex items-center justify-between">
    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
      Password
    </p>

    <Lock className="h-4 w-4 text-zinc-500 transition-colors duration-300 group-focus-within:text-red-400" />
  </div>

  <Input
    autoFocus
    type="password"
    value={password}
    onChange={(event) => setPassword(event.target.value)}
    placeholder="At least 6 characters"
    className="mt-4 h-12 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-base font-medium tracking-tight text-white placeholder:text-zinc-600 shadow-none transition-all duration-300 hover:border-white/15 focus:border-red-500/40 focus:bg-white/[0.05] focus-visible:ring-0"
  />

</div>

                  <button
                    type="button"
                    onClick={handleSignup}
                    disabled={loading}
                    className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-red-600 text-sm font-semibold text-white transition-all hover:bg-red-500 disabled:pointer-events-none disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        Creating account <Loader2 className="h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        Continue to onboarding <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

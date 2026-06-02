"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Copy,
  ExternalLink,
  Gem,
  HelpCircle,
  LayoutDashboard,
  Loader2,
  Mail,
  Palette,
  Sparkles,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const discoveryOptions = [
  "Google, Bing or other search engines",
  "On someone's social media profile",
  "Through a friend",
  "Other",
];

const useOptions = ["Personal Use", "Brand Promotion", "Content Sharing", "Other"];

const stepLabels = ["Discovery", "Goals", "Premium", "Launch"];

function ChoiceCard({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[58px] w-full items-center justify-between rounded-2xl border px-4 text-left text-sm font-medium transition-all ${
        active
          ? "border-red-500/40 bg-red-500/10 text-white shadow-[0_0_24px_rgba(239,68,68,0.10)]"
          : "border-white/[0.07] bg-white/[0.025] text-[#A0A0A0] hover:border-white/15 hover:bg-white/[0.045] hover:text-white"
      }`}
    >
      <span>{label}</span>
      <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${active ? "border-red-300 bg-red-500 text-white" : "border-white/15"}`}>
        {active && <Check className="h-3 w-3" />}
      </span>
    </button>
  );
}

function VisualPanel({ step }: { step: number }) {
  const rows = useMemo(() => [34, 68, 48, 78, 56], []);

  return (
    <aside className="hidden min-h-[720px] overflow-hidden rounded-[30px] border border-white/[0.06] bg-[#0A0A0A]/82 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl lg:block">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">Dashboard preview</p>
          <p className="mt-1 text-xs text-[#777]">Your profile console is being prepared.</p>
        </div>
        <div className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-red-200">
          Step {step}
        </div>
      </div>

      <div className="mt-10 rounded-[26px] border border-white/[0.06] bg-[#0D0D0D] p-5">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
              <LayoutDashboard className="h-5 w-5 text-red-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Creator dashboard</p>
              <p className="text-xs text-[#777]">Analytics, media, badges</p>
            </div>
          </div>
          <motion.div
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="h-2 w-2 rounded-full bg-emerald-400"
          />
        </div>

        <div className="mt-5 grid grid-cols-[0.8fr_1.2fr] gap-4">
          <div className="space-y-3">
            {["Overview", "Customize", "Links", "Templates"].map((item, index) => (
              <motion.div
                key={item}
                animate={{ x: step === index + 1 ? 4 : 0 }}
                className={`rounded-xl px-3 py-3 text-xs font-semibold ${step === index + 1 ? "bg-red-500/12 text-white" : "bg-white/[0.035] text-[#777]"}`}
              >
                {item}
              </motion.div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#777]">Profile signal</p>
              <Sparkles className="h-4 w-4 text-red-300" />
            </div>
            <div className="space-y-3">
              {rows.map((width, index) => (
                <div key={index} className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-red-950 via-red-500 to-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${width + step * 3}%` }}
                    transition={{ duration: 0.8, delay: index * 0.08 }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        {[
          ["Views", "1.2k"],
          ["Links", "8"],
          ["Badges", "4"],
          ["Themes", "12"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
            <p className="text-xs text-[#777]">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">{value}</p>
          </div>
        ))}
      </div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="mt-5 rounded-[26px] border border-red-500/15 bg-[linear-gradient(135deg,rgba(149,0,0,0.18),rgba(255,255,255,0.035))] p-5"
      >
        <p className="text-sm font-semibold text-white">Premium identity layer</p>
        <p className="mt-2 text-xs leading-5 text-[#999]">Animated backgrounds, supporter badge, profile media, and deeper customization sit one click away.</p>
      </motion.div>
    </aside>
  );
}

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [discoverySource, setDiscoverySource] = useState("");
  const [discoveryOther, setDiscoveryOther] = useState("");
  const [plannedUse, setPlannedUse] = useState("");
  const [plannedUseOther, setPlannedUseOther] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const profilePath = `redr.lol/${user?.username || "username"}`;

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!data.user) {
          router.push("/signin");
          return;
        }
        if (data.user.onboarding_completed) {
          router.push("/dashboard");
          return;
        }
        setUser(data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  const next = () => {
    setError(null);
    if (step === 1 && (!discoverySource || (discoverySource === "Other" && !discoveryOther.trim()))) {
      setError("Tell us where you found out about redr.lol to continue.");
      return;
    }
    if (step === 2 && (!plannedUse || (plannedUse === "Other" && !plannedUseOther.trim()))) {
      setError("Choose how you plan to use redr.lol to continue.");
      return;
    }
    setStep((current) => Math.min(current + 1, 4));
  };

  const finish = async () => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discoverySource,
          discoveryOther: discoverySource === "Other" ? discoveryOther : "",
          plannedUse,
          plannedUseOther: plannedUse === "Other" ? plannedUseOther : "",
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Could not finish onboarding.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Could not finish onboarding.");
      setSaving(false);
    }
  };

  const copyProfile = async () => {
    await navigator.clipboard?.writeText(`https://${profilePath}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  if (loading) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/25" />
      </div>
    );
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] items-center gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)]">
      <section className="mx-auto w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/[0.07] bg-[#0B0B0B]/92 shadow-[0_24px_110px_rgba(149,0,0,0.10)] backdrop-blur-3xl">
        <div className="border-b border-white/[0.06] px-6 py-5 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">redr<span className="text-red-500">.lol</span></p>
              <p className="mt-1 text-xs text-[#777]">Profile onboarding</p>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#777]">Step {step} of 4</p>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-2">
            {stepLabels.map((label, index) => (
              <div key={label} className="space-y-2">
                <div className={`h-1.5 rounded-full ${index + 1 <= step ? "bg-red-500" : "bg-white/[0.08]"}`} />
                <p className={`hidden text-[10px] font-semibold uppercase tracking-[0.12em] sm:block ${index + 1 <= step ? "text-white" : "text-[#555]"}`}>
                  {label}
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
            {step === 1 && (
              <motion.div key="discovery" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} className="space-y-7">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                    <Users className="h-5 w-5 text-red-300" />
                  </div>
                  <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-white">Where did you find out about redr.lol?</h1>
                  <p className="mt-3 text-sm leading-6 text-[#888]">Knowing how you discovered us enables us to provide a better experience for you and others.</p>
                </div>

                <div className="grid gap-3">
                  {discoveryOptions.map((option) => (
                    <ChoiceCard key={option} label={option} active={discoverySource === option} onClick={() => setDiscoverySource(option)} />
                  ))}
                </div>

                {discoverySource === "Other" && (
                  <Input
                    autoFocus
                    value={discoveryOther}
                    onChange={(event) => setDiscoveryOther(event.target.value)}
                    placeholder="Tell us where"
                    className="h-14 rounded-2xl border-white/[0.08] bg-[#101010] px-4 text-white placeholder:text-[#555] focus-visible:ring-red-500/20"
                  />
                )}

                <button onClick={next} className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white text-sm font-semibold text-black transition-all hover:bg-red-100">
                  Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="usage" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} className="space-y-7">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                    <Palette className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-white">How are you planning to use redr.lol?</h1>
                  <p className="mt-3 text-sm leading-6 text-[#888]">Understanding your intended use of redr.lol enables us to optimize our platform, ensuring it supports your goals.</p>
                </div>

                <div className="grid gap-3">
                  {useOptions.map((option) => (
                    <ChoiceCard key={option} label={option} active={plannedUse === option} onClick={() => setPlannedUse(option)} />
                  ))}
                </div>

                {plannedUse === "Other" && (
                  <Input
                    autoFocus
                    value={plannedUseOther}
                    onChange={(event) => setPlannedUseOther(event.target.value)}
                    placeholder="Describe your use case"
                    className="h-14 rounded-2xl border-white/[0.08] bg-[#101010] px-4 text-white placeholder:text-[#555] focus-visible:ring-red-500/20"
                  />
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="h-14 w-1/3 rounded-2xl border border-white/[0.08] bg-white/[0.025] text-sm font-semibold text-white transition-all hover:bg-white/[0.05]">
                    Back
                  </button>
                  <button onClick={next} className="group flex h-14 w-2/3 items-center justify-center gap-2 rounded-2xl bg-white text-sm font-semibold text-black transition-all hover:bg-red-100">
                    Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="premium" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} className="space-y-7">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                    <Gem className="h-5 w-5 text-red-300" />
                  </div>
                  <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-white">Unlock the premium profile layer.</h1>
                  <p className="mt-3 text-sm leading-6 text-[#888]">Keep building for free, or upgrade when you want animated identity effects and deeper customization.</p>
                </div>

                <div className="overflow-hidden rounded-[28px] border border-red-500/20 bg-[linear-gradient(135deg,rgba(149,0,0,0.24),rgba(255,255,255,0.04))] p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-red-100/70">redr premium</p>
                      <div className="mt-4 flex items-end gap-2">
                        <span className="text-5xl font-semibold tracking-[-0.06em] text-white">$4.99</span>
                        <span className="pb-2 text-sm text-[#B0B0B0]">/mo</span>
                      </div>
                    </div>
                    <BadgeCheck className="h-8 w-8 text-red-200" />
                  </div>

                  <div className="mt-6 grid gap-3">
                    {["Animated premium themes", "Supporter profile badge", "Background video and audio polish", "Priority visual features"].map((item) => (
                      <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-black/20 px-4 py-3 text-sm text-white">
                        <Check className="h-4 w-4 text-emerald-300" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="h-14 w-1/3 rounded-2xl border border-white/[0.08] bg-white/[0.025] text-sm font-semibold text-white transition-all hover:bg-white/[0.05]">
                    Back
                  </button>
                  <button onClick={next} className="group flex h-14 w-2/3 items-center justify-center gap-2 rounded-2xl bg-white text-sm font-semibold text-black transition-all hover:bg-red-100">
                    Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="finish" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} className="space-y-7">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
                    <Check className="h-5 w-5 text-emerald-300" />
                  </div>
                  <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-white">You've reached the end!</h1>
                  <p className="mt-3 text-sm leading-6 text-[#888]">You can now start customizing your profile. Don't forget to share your page with your friends as well.</p>
                </div>

                <div className="rounded-[24px] border border-red-500/15 bg-red-500/[0.05] p-5">
                  <p className="break-all text-xl font-semibold text-white">{profilePath}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <button onClick={copyProfile} className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm font-semibold text-white transition-all hover:bg-white/[0.07]">
                      <Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy"}
                    </button>
                    <Link href={`/${user?.username}`} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-black transition-all hover:bg-red-100">
                      <ExternalLink className="h-4 w-4" /> Open Page
                    </Link>
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#666]">Quick Links</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      ["Account overview", "redr.lol/account", "/dashboard", LayoutDashboard],
                      ["Customize your page", "redr.lol/customize", "/dashboard/customize", Palette],
                      ["Add your socials", "redr.lol/links", "/dashboard/links", Users],
                      ["Explore profile templates", "redr.lol/templates", "/dashboard/templates", Sparkles],
                    ].map(([title, display, href, Icon]) => {
                      const LinkIcon = Icon as typeof LayoutDashboard;
                      return (
                        <Link key={title as string} href={href as string} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition-all hover:border-white/15 hover:bg-white/[0.045]">
                          <LinkIcon className="h-4 w-4 text-red-300" />
                          <p className="mt-3 text-sm font-semibold text-white">{title as string}</p>
                          <p className="mt-1 text-xs text-[#777]">{display as string}</p>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#666]">Support</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      ["Support Email", Mail],
                      ["Discord Server", Users],
                      ["Help Center", HelpCircle],
                    ].map(([title, Icon]) => {
                      const SupportIcon = Icon as typeof Mail;
                      return (
                        <div key={title as string} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                          <SupportIcon className="h-4 w-4 text-[#AAA]" />
                          <p className="mt-3 text-xs font-semibold text-white">{title as string}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button onClick={finish} disabled={saving} className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-red-600 text-sm font-semibold text-white transition-all hover:bg-red-500 disabled:pointer-events-none disabled:opacity-50">
                  {saving ? (
                    <>
                      Finishing <Loader2 className="h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      Finish <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <VisualPanel step={step} />
    </div>
  );
}

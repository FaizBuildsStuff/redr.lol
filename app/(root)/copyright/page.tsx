'use client'
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  Copyright,
  ShieldAlert,
  Mail,
  FileCheck,
  Undo2,
  RefreshCw,
  AlertTriangle,
  Ban,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function CopyrightPolicy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Premium Entry Stagger for Headers
      gsap.fromTo(
        ".animate-header",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power4.out", stagger: 0.15 }
      );

      // Subtle ambient background pulse
      gsap.to(".ambient-glow-1", {
        scale: 1.2,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".ambient-glow-2", {
        scale: 1.3,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Card hovering visual magnetism
      const cards = document.querySelectorAll(".interactive-card");
      cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            borderColor: "rgba(239, 68, 68, 0.35)",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            y: -6,
            duration: 0.3,
            ease: "power2.out",
          });
          gsap.to(card.querySelector(".icon-box"), {
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            scale: 1.05,
            duration: 0.3,
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            borderColor: "rgba(255, 255, 255, 0.05)",
            backgroundColor: "rgba(255, 255, 255, 0.01)",
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          });
          gsap.to(card.querySelector(".icon-box"), {
            backgroundColor: "rgba(239, 68, 68, 0.08)",
            scale: 1,
            duration: 0.3,
          });
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen text-zinc-300 overflow-hidden bg-[#050507] font-sans selection:bg-red-500/30"
    >
      {/* Premium Cyber Ambient Background */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-500/[0.03] blur-[150px] ambient-glow-1 rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-red-600/[0.02] blur-[180px] ambient-glow-2 rounded-full" />
        {/* Futuristic Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-32 pb-32">
        
        {/* Modernist Split-Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 border-b border-white/5 pb-16 items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/[0.05] px-3 py-1 animate-header">
              <Copyright size={12} className="text-red-400 animate-spin-slow" />
              <span className="text-xs font-semibold tracking-wider text-red-300 uppercase">
                Legal Operations
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl text-white animate-header leading-[1.1]">
              Copyright & <br />
              <span className="bg-gradient-to-r from-red-400 via-orange-400 to-white bg-clip-text text-transparent">
                DMCA Compliance
              </span>
            </h1>

            <p className="mt-6 text-lg text-zinc-400 leading-relaxed max-w-2xl animate-header">
              redr.lol responds swiftly to valid copyright complaints and counter-notifications under the Digital Millennium Copyright Act (DMCA). We preserve platform integrity while safeguarding creator rights.
            </p>
          </div>

          {/* Quick Contact Panel */}
          <div className="animate-header bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-white pointer-events-none">
              <Sparkles size={120} />
            </div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-1">
              Designated Agent
            </h3>
            <p className="text-xs text-zinc-500 mb-4">Strictly for copyright & ownership notices</p>
            
            <a 
              href="mailto:legal@redr.lol" 
              className="flex items-center justify-between w-full bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 text-red-300 rounded-xl px-4 py-3.5 transition group/btn"
            >
              <div className="flex items-center gap-3">
                <Mail size={16} />
                <span className="font-mono text-sm font-medium">legal@redr.lol</span>
              </div>
              <ArrowRight size={14} className="transform group-hover/btn:translate-x-1 transition" />
            </a>
            
            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-[11px] text-zinc-500">
              <span>Response SLA: &lt; 48 Hours</span>
              <span>Electronic Submission Only</span>
            </div>
          </div>
        </div>

        {/* Content Flow Layout */}
        <div className="mt-16 grid gap-12 grid-cols-1 lg:grid-cols-[300px_1fr]">
          
          {/* Quick-Disclaimer Sticky Box */}
          <aside className="hidden lg:block">
            <div ref={sidebarRef} className="sticky top-28 space-y-4">
              <div className="rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.01] to-transparent p-5">
                <div className="flex items-center gap-2 text-zinc-400 font-medium text-xs tracking-wider uppercase mb-3">
                  <ShieldAlert size={14} className="text-amber-500" />
                  <span>Legal Disclaimer</span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Nothing within this protocol constitutes formalized legal advice. If you are uncertain whether hosted materials are genuinely infringing, we highly recommend seeking custom legal counsel before executing a filing.
                </p>
              </div>
            </div>
          </aside>

          {/* Main Legal Components Block */}
          <div className="space-y-6">
            
            {/* Overview Card */}
            <div className="interactive-card border border-white/5 bg-white/[0.01] rounded-[24px] p-8 transition-all">
              <div className="flex items-start gap-4">
                <div className="icon-box bg-red-500/10 p-3.5 rounded-xl text-red-400 transition-all">
                  <Copyright size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white tracking-tight">Overview</h2>
                  <p className="mt-4 text-zinc-400 leading-relaxed">
                    redr.lol respects intellectual property rights and expects users to do the same. This policy describes how to submit copyright notices, how we handle counter-notifications, and how we address repeat infringement. We follow the requirements of the Digital Millennium Copyright Act (DMCA) and comparable laws where applicable.
                  </p>
                </div>
              </div>
            </div>

            {/* Twin Interactive Requirements Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Takedown Column */}
              <div className="interactive-card border border-white/5 bg-white/[0.01] rounded-[24px] p-8 transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="icon-box bg-red-500/10 p-3 rounded-xl text-red-400">
                    <FileCheck size={20} />
                  </div>
                  <h2 className="text-lg font-semibold text-white tracking-tight">DMCA Takedown Notice</h2>
                </div>
                <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                  To successfully register an intellectual property infringement claim, your notice must include:
                </p>
                <ul className="space-y-3.5 text-xs text-zinc-400">
                  <li className="flex items-start gap-2"><span className="text-red-400 font-bold">01.</span> Identification of the protected work or representative directory lists.</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 font-bold">02.</span> Direct platform URLs mapping precisely to the location of the target material.</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 font-bold">03.</span> Valid applicant contact specifications, including operational email protocols.</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 font-bold">04.</span> Formally integrated statement detailing a strict good-faith belief of bad authorization.</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 font-bold">05.</span> Perjury penalty clause claiming structural clarity and authorization details.</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 font-bold">06.</span> Authentic physical or digital cryptographic signature configurations.</li>
                </ul>
                <p className="mt-6 pt-4 border-t border-white/5 text-[11px] text-zinc-500 leading-normal">
                  By executing a notice submission, you agree we may forward contents safely to the targeted system user.
                </p>
              </div>

              {/* Counter Notice Column */}
              <div className="interactive-card border border-white/5 bg-white/[0.01] rounded-[24px] p-8 transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="icon-box bg-red-500/10 p-3 rounded-xl text-red-400">
                    <Undo2 size={20} />
                  </div>
                  <h2 className="text-lg font-semibold text-white tracking-tight">Counter-Notification</h2>
                </div>
                <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                  If your content was removed due to error or misidentification, submit a claim detailing:
                </p>
                <ul className="space-y-3.5 text-xs text-zinc-400">
                  <li className="flex items-start gap-2"><span className="text-red-400 font-bold">01.</span> Specific identification of deleted content alongside pre-removal URL targets.</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 font-bold">02.</span> Legal full name and accurate administrative digital response parameters.</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 font-bold">03.</span> Explicit statement, certified under penalty of perjury, confirming mistake/misidentification.</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 font-bold">04.</span> Signed jurisdictional judicial consent regarding local domestic or regulatory court limits.</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 font-bold">05.</span> A verified physical or certified cryptographic signature framework.</li>
                </ul>
                <p className="mt-14 pt-4 border-t border-white/5 text-[11px] text-zinc-500 leading-normal">
                  Claimants have a set period to response with active lawsuit data before material restoration cycles initiate.
                </p>
              </div>

            </div>

            {/* Tri-Grid Supplementary Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Box 1 */}
              <div className="interactive-card border border-white/5 bg-white/[0.01] rounded-2xl p-6">
                <div className="icon-box inline-flex bg-red-500/10 p-2.5 rounded-lg text-red-400 mb-4">
                  <RefreshCw size={16} />
                </div>
                <h3 className="text-white font-medium text-sm">Preservation Rules</h3>
                <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                  We restore material following legal timelines unless court processing is formally initiated. Server files may be safely held in secure caches temporarily for historical dispute evidence requirements.
                </p>
              </div>

              {/* Box 2 */}
              <div className="interactive-card border border-white/5 bg-white/[0.01] rounded-2xl p-6">
                <div className="icon-box inline-flex bg-red-500/10 p-2.5 rounded-lg text-red-400 mb-4">
                  <AlertTriangle size={16} />
                </div>
                <h3 className="text-white font-medium text-sm">Repeat Infringers</h3>
                <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                  Profiles logging repeated, structural, or malicious copyright violations face permanent account limitations, linked infrastructure disconnection, or global profile removal.
                </p>
              </div>

              {/* Box 3 */}
              <div className="interactive-card border border-white/5 bg-white/[0.01] rounded-2xl p-6">
                <div className="icon-box inline-flex bg-red-500/10 p-2.5 rounded-lg text-red-400 mb-4">
                  <Ban size={16} />
                </div>
                <h3 className="text-white font-medium text-sm">Abuse of Process</h3>
                <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                  Deceptive, bad-faith, or highly automated bulk takedown attempts sent purely to disrupt legitimate user profiles will be rejected, and sender protocols may be systemically blacklisted.
                </p>
              </div>

            </div>

            {/* Elegant Modern Support Communication Footer */}
            <div className="rounded-[24px] border border-white/5 bg-gradient-to-r from-zinc-950 to-zinc-900 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-white font-semibold text-base">Have generic support inquiries?</h4>
                <p className="text-xs text-zinc-400 mt-1">For standard questions not linked to copyright processes, reach out below.</p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <a 
                  href="mailto:support@redr.lol" 
                  className="w-full sm:w-auto text-center rounded-xl border border-white/10 bg-white/[0.02] px-5 py-2.5 text-xs text-zinc-300 hover:bg-white/[0.06] hover:border-white/20 transition"
                >
                  support@redr.lol
                </a>
              </div>
            </div>

            <div className="text-center text-[11px] text-zinc-600 pt-6">
              Last updated: 10/25/2025 • Policy ID: GL-DMCA-2026
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
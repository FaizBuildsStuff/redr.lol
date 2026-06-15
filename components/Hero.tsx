"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, CheckCircle, MousePointer2 } from "lucide-react";
import gsap from "gsap";
import Link from "next/link";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [authState, setAuthState] = useState<"loading" | "loggedIn" | "loggedOut">("loading");
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data?.user) {
          setAuthState("loggedIn");
          setUsername(data.user.username || "");
        } else {
          setAuthState("loggedOut");
        }
      } catch {
        setAuthState("loggedOut");
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Core Content Reveal Matrix
      const tl = gsap.timeline({ delay: 0.2 });
      
      tl.fromTo(
        ".hero-reveal",
        { opacity: 0, y: 40, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: "expo.out",
        }
      );

      // Selection box "drawing" frame effect
      tl.fromTo(
        ".selection-box",
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1.2, ease: "power4.out" },
        "-=0.8"
      );

      // 2. Cinematic Auto-Cursor & Button Macro-Interaction Sequence
      const ctaTl = gsap.timeline({ delay: 1.5 });

      ctaTl
        // Cursor swoops in dynamically from the bottom right quadrant
        .fromTo(
          ".auto-cursor",
          { opacity: 0, x: 250, y: 300, scale: 1.4 },
          { opacity: 1, x: 50, y: 25, scale: 1, duration: 1.4, ease: "power3.out" }
        )
        // Subtle deceleration adjustment as it locks onto the button target
        .to(".auto-cursor", {
          x: 20,
          y: 10,
          duration: 0.6,
          ease: "power2.out"
        })
        // Click Down Simulation: Button compresses slightly, cursor shrinks
        .to(".cta-btn", { scale: 0.94, duration: 0.15, ease: "power1.in" })
        .to(".auto-cursor", { scale: 0.8, duration: 0.15, ease: "power1.in" }, "-=0.15")
        
        // Click Release & Structural Shockwave Visual Trigger
        .to(".cta-btn", { 
          scale: 1.03, 
          borderColor: "rgba(239,68,68,0.4)",
          boxShadow: "0 0 50px rgba(239,68,68,0.25)",
          duration: 0.2, 
          ease: "back.out(2)" 
        })
        .to(".auto-cursor", { scale: 1, duration: 0.2, ease: "back.out(2)" }, "-=0.2")
        // Flash the expanding click-pulse ring element
        .fromTo(".click-pulse", 
          { scale: 0.5, opacity: 1 },
          { scale: 3, opacity: 0, duration: 0.6, ease: "power2.out" },
          "-=0.2"
        )
        
        // Reveal Premium Visual Feedback Drop: Dynamic URL Claim Tag
        .fromTo(".success-card",
          { opacity: 0, y: 15, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.5)" },
          "-=0.1"
        )
        // Internal success card spark animation
        .fromTo(".success-sparkle",
          { rotate: -45, scale: 0 },
          { rotate: 0, scale: 1, duration: 0.4, ease: "power2.out" },
          "-=0.3"
        )

        // Cursor glides away into its floating ambient loop coordinate
        .to(".auto-cursor", {
          x: -60,
          y: 80,
          duration: 1.2,
          ease: "power2.inOut"
        });

      // 3. Persistent Low-Frequency Floating Ambient Motions
      gsap.to(".floating-tag", {
        y: 12,
        rotation: 3,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.5, from: "random" },
      });

      // Constant infinite breathing of the custom URL validation popup card
      gsap.to(".success-card", {
        y: -6,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 3
      });

      // Ambient background volumetric crimson pulse
      gsap.to(".main-glow", {
        scale: 1.08,
        opacity: 0.85,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-[92vh] text-white bg-[#0A0A0A] selection:bg-red-500/30 overflow-x-clip"
    >
      {/* BACKGROUND ARCHITECTURE */}
      <div className="absolute inset-0 pointer-events-none transform-gpu will-change-transform">
        {/* Main Vibrant Glow - Cyber Crimson */}
        <div
          className="main-glow absolute left-1/2 top-[-15%] h-[1000px] w-[1800px] -translate-x-1/2 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(239,68,68,0.18) 0%, rgba(153,27,27,0.03) 45%, transparent 75%)",
            filter: "blur(90px)",
            opacity: 0.75,
          }}
        />

        {/* Linear Ambient Shade */}
        <div className="absolute inset-x-0 top-0 h-screen bg-gradient-to-b from-red-500/5 to-transparent" />

        {/* Noise Texture */}
        <div
          className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/noise.png')" }}
        />

        {/* Dark Grounding Layer */}
        <div className="absolute bottom-[-10%] left-0 h-[45%] w-full bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/90 to-transparent blur-[20px]" />
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-20 mx-auto flex min-h-[92vh] max-w-[1000px] flex-col items-center justify-center px-6 pt-24 pb-16 text-center">

        {/* HERO HEADING */}
        <div className="hero-reveal relative mb-6">
          <h1 className="text-[2.5rem] font-black leading-[0.95] tracking-[-0.06em] text-white sm:text-[4rem] md:text-[5.5rem] lg:text-[80px] uppercase">
            The ultimate{" "}
            <br />
            <span className="selection-box relative my-2 inline-block px-4 py-1 text-red-500 italic font-serif tracking-normal lowercase">
              
              {/* SELECTION BOX ARTIFACT */}
              <div className="absolute inset-0 border-[1.5px] border-red-500/30 bg-red-500/[0.02] rounded-xl pointer-events-none">
                {/* Corner Handles */}
                <div className="handle absolute -left-[3px] -top-[3px] h-[6px] w-[6px] bg-red-500 rounded-full" />
                <div className="handle absolute -right-[3px] -top-[3px] h-[6px] w-[6px] bg-red-500 rounded-full" />
                <div className="handle absolute -left-[3px] -bottom-[3px] h-[6px] w-[6px] bg-red-500 rounded-full" />
                <div className="handle absolute -right-[3px] -bottom-[3px] h-[6px] w-[6px] bg-red-500 rounded-full" />
              </div>

              creator bio-link

              {/* MINI LABEL */}
              <div className="absolute -right-10 -top-3 scale-90 sm:scale-100">
                <div className="relative rounded-full bg-red-500 px-2 py-0.5 text-[9px] font-black tracking-widest text-white uppercase shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                  Live
                  <div className="cursor-animate absolute -left-3 -top-3 rotate-[-20deg]">
                    <MousePointer2 className="h-4 w-4 fill-white text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                  </div>
                </div>
              </div>
            </span>
            <br />
            built to stand out.
          </h1>
        </div>

        {/* DESCRIPTION SUBTEXT */}
        <p className="mx-auto mt-4 max-w-xl text-[15px] sm:text-base leading-relaxed text-zinc-400 font-medium tracking-wide hero-reveal">
          One sleek link to share your entire digital world. Showcase live activity, host media, and customize your aesthetic with complete creative freedom.
        </p>

        {/* ================= INTERACTIVE CTA SECTION ================= */}
        <div className="hero-reveal mt-12 relative flex flex-col items-center justify-center min-h-[140px] w-full">
          
          {/* THE MASTER BUTTON */}
          <Link
            href={
              authState === "loggedIn"
                ? "/dashboard"
                : "/signup"
            }
            className="cta-btn group relative flex items-center overflow-hidden rounded-full border border-white/5 bg-white p-1 pl-6 shadow-[0_0_50px_rgba(255,255,255,0.02)] transition-all duration-300 hover:scale-[1.03] z-20"
          >
            {/* Dynamic Click Pulse Ring Expandable Layer */}
            <div className="click-pulse absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-20 rounded-full bg-red-500/40 pointer-events-none opacity-0 z-0" />

            <span className="text-xs font-bold tracking-widest text-black uppercase relative z-10">
              {authState === "loading"
                ? "Loading..."
                : authState === "loggedIn"
                ? `Go to Dashboard`
                : "Claim your link"}
            </span>
            <div className="ml-5 flex h-[46px] w-[46px] items-center justify-center rounded-full bg-red-500 text-white transition-all duration-300 group-hover:bg-red-400 relative z-10">
              <ArrowUpRight className="h-4 w-4 stroke-[3px]" />
            </div>
          </Link>

          {/* CINEMATIC AUTOMATED ACTUATOR CURSOR */}
          <div className="auto-cursor absolute pointer-events-none z-30 opacity-0 transform-gpu mix-blend-difference">
            <MousePointer2 className="h-6 w-6 fill-white text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]" />
          </div>

          {/* PREMIUM VISUAL FEEDBACK GRAPHIC: DYNAMIC POPUP CARD */}
          <div className="success-card absolute top-[75px] opacity-0 z-10 select-none pointer-events-none">
            <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/20 bg-zinc-950/90 px-4 py-2.5 shadow-[0_20px_40px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-xl">
              <div className="success-sparkle flex text-emerald-400">
                <CheckCircle size={14} className="stroke-[2.5px]" />
              </div>
              <span className="font-mono text-xs text-zinc-400">
                redr.lol<span className="text-white font-semibold">/{username || "you"}</span>
              </span>
              <div className="rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[9px] font-black tracking-wider font-mono text-emerald-400 uppercase">
                Available
              </div>
            </div>
          </div>

        </div>

        {/* FLOATING INTERACTIVE TAGS */}
        {/* Discord Live Status Tag */}
        <div className="floating-tag absolute left-[6%] bottom-[38%] hidden lg:block select-none">
          <div className="relative flex items-center gap-2.5 rounded-xl border border-white/5 bg-zinc-900/40 px-4 py-2.5 text-xs font-medium tracking-wide text-zinc-300 backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span>Discord Status</span>
            <div className="cursor-animate absolute right-[-10px] top-[-10px] rotate-[15deg] pointer-events-none opacity-60">
              <MousePointer2 className="h-3.5 w-3.5 fill-white text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
            </div>
          </div>
        </div>

        {/* Next.js Core Architecture Tag */}
        <div className="floating-tag absolute right-[6%] bottom-[42%] hidden lg:block select-none">
          <div className="relative flex items-center gap-2 rounded-xl border border-white/5 bg-zinc-900/40 px-4 py-2.5 text-xs font-medium tracking-wide text-zinc-300 backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)]">
            <span className="rounded bg-red-500/10 border border-red-500/20 px-1 py-0.5 text-[9px] font-bold font-mono text-red-400">
              v15
            </span>
            <span>Premium Profiles</span>
            
            {/* Repositioned Cursor Artifact (Bottom-Left Side) */}
            <div className="cursor-animate absolute left-[-10px] bottom-[-14px] rotate-[245deg] pointer-events-none opacity-60">
              <MousePointer2 className="h-3.5 w-3.5 fill-white text-white drop-shadow-[0_-2px_4px_rgba(0,0,0,0.3)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
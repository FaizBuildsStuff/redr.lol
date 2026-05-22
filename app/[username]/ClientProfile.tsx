"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Award, ShieldCheck, CheckCircle2, Gem, Crown, Shield, ShieldAlert,
  Code, Palette, Heart, HeartHandshake, Gift, Image as ImageIcon,
  Globe, Rocket, Bug, Snowflake, Trophy, Medal, TestTube, Star, Sparkles, Tv
} from "lucide-react";
import { useLanyard } from "@/hooks/use-lanyard";

// ========================================
// Inline SVG Controls
// ========================================
const Volume2 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

const VolumeX = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="22" y1="9" x2="16" y2="15" />
    <line x1="16" y1="9" x2="22" y2="15" />
  </svg>
);

const Sun = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" /><path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" /><path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const Moon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const Disc3 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 12a0 0 0 1 0 0" />
    <path d="M12 2a10 10 0 0 1 10 10" />
  </svg>
);

const LockOpen = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </svg>
);

// ========================================
// Oneko (Neko) Tracker Component
// ========================================
type SpriteDirection = 'idle' | 'alert' | 'scratch' | 'tired' | 'sleeping' | 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

const spriteSets: Record<SpriteDirection, number[][]> = {
  idle: [[-3, -3]],
  alert: [[-7, -3]],
  scratch: [[-5, 0], [-6, 0], [-7, 0]],
  tired: [[-3, -2]],
  sleeping: [[-2, 0], [-2, -1]],
  N: [[-1, -2], [-1, -3]],
  NE: [[0, -2], [0, -3]],
  E: [[-3, 0], [-3, -1]],
  SE: [[-5, -1], [-5, -2]],
  S: [[-6, -3], [-7, -2]],
  SW: [[-5, -3], [-6, -1]],
  W: [[-4, -2], [-4, -3]],
  NW: [[-1, 0], [-1, -1]],
};

function NekoTracker() {
  const onekoRef = useRef<HTMLDivElement>(null);
  const nekoPosX = useRef(32);
  const nekoPosY = useRef(32);
  const mousePosX = useRef(0);
  const mousePosY = useRef(0);
  const frameCount = useRef(0);
  const idleTime = useRef(0);
  const idleAnimation = useRef<string | null>(null);
  const idleAnimationFrame = useRef(0);
  const nekoSpeed = 10;

  useEffect(() => {
    nekoPosX.current = window.innerWidth / 2;
    nekoPosY.current = window.innerHeight / 2;

    const handleMouseMove = (event: MouseEvent) => {
      mousePosX.current = event.clientX;
      mousePosY.current = event.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const setSprite = (name: SpriteDirection, frame: number) => {
      const spriteArr = spriteSets[name];
      const sprite = spriteArr[frame % spriteArr.length];
      if (onekoRef.current) {
        onekoRef.current.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
      }
    };

    const resetIdleAnimation = () => {
      idleAnimation.current = null;
      idleAnimationFrame.current = 0;
    };

    const idle = () => {
      idleTime.current += 1;
      const currentIdleTime = idleTime.current;
      const currentIdleAnimation = idleAnimation.current;
      const currentIdleAnimationFrame = idleAnimationFrame.current;

      if (currentIdleTime > 10 && Math.floor(Math.random() * 200) === 0 && currentIdleAnimation === null) {
        idleAnimation.current = ['sleeping', 'scratch'][Math.floor(Math.random() * 2)];
      }

      switch (idleAnimation.current) {
        case 'sleeping':
          if (currentIdleAnimationFrame < 8) { setSprite('tired', 0); break; }
          setSprite('sleeping', Math.floor(currentIdleAnimationFrame / 4));
          if (currentIdleAnimationFrame > 192) resetIdleAnimation();
          break;
        case 'scratch':
          setSprite('scratch', currentIdleAnimationFrame);
          if (currentIdleAnimationFrame > 9) resetIdleAnimation();
          break;
        default:
          setSprite('idle', 0);
          return;
      }
      idleAnimationFrame.current += 1;
    };

    const interval = setInterval(() => {
      frameCount.current += 1;
      const diffX = nekoPosX.current - mousePosX.current;
      const diffY = nekoPosY.current - mousePosY.current;
      const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

      if (distance < nekoSpeed || distance < 48) { idle(); return; }

      idleAnimation.current = null;
      idleAnimationFrame.current = 0;

      const currentIdleTime = idleTime.current;
      if (currentIdleTime > 1) {
        setSprite('alert', 0);
        idleTime.current = Math.min(currentIdleTime, 7) - 1;
        return;
      }

      let direction = diffY / distance > 0.5 ? 'N' : '';
      direction += diffY / distance < -0.5 ? 'S' : '';
      direction += diffX / distance > 0.5 ? 'W' : '';
      direction += diffX / distance < -0.5 ? 'E' : '';

      setSprite(direction as SpriteDirection, frameCount.current);
      nekoPosX.current -= (diffX / distance) * nekoSpeed;
      nekoPosY.current -= (diffY / distance) * nekoSpeed;

      if (onekoRef.current) {
        onekoRef.current.style.left = `${nekoPosX.current - 16}px`;
        onekoRef.current.style.top = `${nekoPosY.current - 16}px`;
      }
    }, 100);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      ref={onekoRef}
      id="oneko"
      style={{
        width: '32px', height: '32px', position: 'fixed',
        backgroundImage: 'url(/assets/images/oneko.gif)',
        imageRendering: 'pixelated', zIndex: 9999,
        left: '32px', top: '32px', pointerEvents: 'none',
      }}
    />
  );
}

// ========================================
// High-Fidelity Ethereal Shadow Background
// ========================================
function EtherealShadow() {
  const [hueRotate, setHueRotate] = useState(180);
  const filterId = useRef(`shadowoverlay-${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const cycleDurationMs = 1.6 * 1000;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % cycleDurationMs) / cycleDurationMs;
      setHueRotate(progress * 360);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden w-full h-full pointer-events-none select-none z-0">
      <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
        <defs>
          <filter id={filterId.current} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feTurbulence result="undulation" numOctaves={2} baseFrequency="0.0005,0.002" seed={0} type="turbulence" />
            <feColorMatrix in="undulation" type="hueRotate" values={String(hueRotate)} result="hueShifted" />
            <feColorMatrix in="hueShifted" result="circulation" type="matrix" values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0" />
            <feDisplacementMap in="SourceGraphic" in2="circulation" scale={100} result="dist" />
            <feDisplacementMap in="dist" in2="hueShifted" scale={100} result="output" />
          </filter>
        </defs>
      </svg>
      <div
        className="absolute w-full h-full bg-[#808080] dark:bg-[#404040]"
        style={{
          inset: "-100px",
          filter: `url(#${filterId.current}) blur(4px)`,
          maskImage: 'url(/assets/images/ethereal-shadow/ceBGguIpUU8luwByxuQz79t7To.png)',
          maskSize: 'cover', maskRepeat: 'no-repeat', maskPosition: 'center',
          WebkitMaskImage: 'url(/assets/images/ethereal-shadow/ceBGguIpUU8luwByxuQz79t7To.png)',
          WebkitMaskSize: 'cover', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: 'url(/assets/images/ethereal-shadow/g0QcWrxr87K0ufOxIUFBakwYA8.png)',
          backgroundSize: '240px', backgroundRepeat: 'repeat', opacity: 0.5,
        }}
      />
    </div>
  );
}

// ========================================
// Premium 3D Interactive Card Component
// ========================================
interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  isProfile?: boolean;
}

function InteractiveCard({ children, className = "", isProfile = false }: InteractiveCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: -1000, y: -1000 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || window.innerWidth <= 768) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    const maxRotation = isProfile ? 12 : 5;
    const scale = 1.005;
    const perspective = isProfile ? 1200 : 1000;
    const rotateY = (mouseX / (rect.width / 2)) * maxRotation;
    const rotateX = -(mouseY / (rect.height / 2)) * maxRotation;
    cardRef.current.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
  };

  const handleMouseEnter = () => {
    if (window.innerWidth <= 768) return;
    if (cardRef.current) {
      cardRef.current.style.transition = "transform 0.2s ease-out, box-shadow 0.4s ease, border-color 0.4s ease";
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      const perspective = isProfile ? 1200 : 1000;
      cardRef.current.style.transition = "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease, border-color 0.4s ease";
      cardRef.current.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`;
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ "--mouse-x": `${coords.x}px`, "--mouse-y": `${coords.y}px` } as React.CSSProperties}
      className={`${isProfile ? "aesthetic-card" : "widget-card"} ${className}`}
    >
      {children}
    </div>
  );
}

// ========================================
// Clock Widget Component
// ========================================
function ClockWidget() {
  const [time, setTime] = useState({ hours: '00', minutes: '00', seconds: '00', ampm: '', day: '', fullDate: '' });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let h = now.getHours();
      const m = now.getMinutes();
      const s = now.getSeconds();
      const ampmVal = h >= 12 ? 'PM' : 'AM';
      h = h % 12; h = h ? h : 12;
      setTime({
        hours: h < 10 ? '0' + h : h.toString(),
        minutes: m < 10 ? '0' + m : m.toString(),
        seconds: s < 10 ? '0' + s : s.toString(),
        ampm: ampmVal,
        day: now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase(),
        fullDate: now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase(),
      });
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveCard className="clock-card min-h-[150px] flex flex-col justify-center items-center">
      <div className="clock-content py-6 w-full h-full flex justify-center items-center">
        <div className="clock-container flex justify-center items-center w-full">
          <div className="clock-inner flex flex-col items-center select-none">
            <div className="time-section flex items-baseline font-sans text-stone-900 dark:text-white leading-none">
              <div className="main-time flex font-bold tracking-tight text-[3.5rem] md:text-[3.8rem] text-stone-900 dark:text-white leading-none">
                <span className="digit">{time.hours}</span>
                <span className="blink animate-[pulse_1.5s_infinite] mx-1">:</span>
                <span className="digit">{time.minutes}</span>
              </div>
              <div className="secondary-time flex flex-col justify-center ml-2.5">
                <span className="seconds text-xs font-semibold opacity-80 leading-none">{time.seconds}</span>
                <span className="ampm text-[9px] font-bold tracking-widest uppercase opacity-60 leading-none mt-1">{time.ampm}</span>
              </div>
            </div>
            <div className="date-section flex items-center mt-3 text-[10px] tracking-[2px] uppercase text-stone-500 dark:text-stone-400 font-bold font-sans opacity-95">
              <span className="day font-semibold">{time.day}</span>
              <span className="divider mx-2 opacity-50">•</span>
              <span className="date">{time.fullDate}</span>
            </div>
          </div>
        </div>
      </div>
    </InteractiveCard>
  );
}

// ========================================
// Shadow/Terminal Quote Widget Component
// ========================================
function ShadowWidget({ heading, quotesProp }: { heading?: string; quotesProp?: string[] }) {
  const quotes = quotesProp && quotesProp.length > 0 ? quotesProp : [
    "The world doesn't need heroes, it needs someone to pull the strings from the shadows.",
    "True power lies not in being seen, but in orchestrating the unseen.",
    "A masterpiece is never rushed, it is carefully constructed layer by layer.",
    "You only see what I allow you to see.",
  ];
  const [currentQuote, setCurrentQuote] = useState('');
  const quoteIndex = useRef(0);
  const charIndex = useRef(0);
  const isDeleting = useRef(false);

  useEffect(() => {
    let typeTimeout: NodeJS.Timeout;
    const startTyping = () => {
      const currentFullQuote = quotes[quoteIndex.current];
      const deleting = isDeleting.current;
      const charIdx = charIndex.current;
      if (deleting) { setCurrentQuote(currentFullQuote.substring(0, charIdx - 1)); charIndex.current = charIdx - 1; }
      else { setCurrentQuote(currentFullQuote.substring(0, charIdx + 1)); charIndex.current = charIdx + 1; }
      let typeSpeed = deleting ? 20 : 50;
      if (!deleting) typeSpeed += Math.random() * 20;
      const newCharIdx = charIndex.current;
      if (!deleting && newCharIdx === currentFullQuote.length) { typeSpeed = 4000; isDeleting.current = true; }
      else if (deleting && newCharIdx === 0) { isDeleting.current = false; quoteIndex.current = (quoteIndex.current + 1) % quotes.length; typeSpeed = 500; }
      typeTimeout = setTimeout(startTyping, typeSpeed);
    };
    startTyping();
    return () => clearTimeout(typeTimeout);
  }, []);

  return (
    <InteractiveCard className="shadow-card min-h-[160px] flex flex-col justify-center text-left">
      <div
        className="shadow-bg absolute inset-0 bg-cover bg-center transition-all duration-500 z-0 brightness-[var(--shadow-brightness)] hover:brightness-[var(--shadow-brightness-hover)] scale-100 hover:scale-105 filter"
        style={{ backgroundImage: 'url(/assets/images/shadow.webp)', backgroundPosition: 'center 55%' }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-black/10 z-[1] dark:from-black/80 dark:via-black/50 dark:to-black/30 pointer-events-none" />
      <div className="shadow-content relative z-10 p-6 flex flex-col justify-center h-full">
        <div className="shadow-role flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-stone-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3" />
          </svg>
          <span className="font-['Cinzel'] font-bold text-[0.85rem] tracking-[2px] uppercase text-stone-900 dark:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
            {heading || "Web Designer & Developer"}
          </span>
        </div>
        <div className="shadow-quote font-['Playfair_Display'] italic text-[0.95rem] md:text-[1rem] leading-relaxed text-stone-900 dark:text-white border-l-[3px] border-stone-400 dark:border-white/20 pl-4 opacity-95 min-h-[4.5em] flex items-center select-none">
          <span>
            &ldquo;{currentQuote}
            <span className="typewriter-cursor inline-block font-normal ml-0.5 animate-[pulse_1s_infinite] select-none">|</span>&rdquo;
          </span>
        </div>
      </div>
    </InteractiveCard>
  );
}

// ========================================
// Badge Registry & BadgeChip Component
// ========================================
const BADGE_REGISTRY = {
  owner: { name: "Owner", desc: "Creator and Owner of redr.lol.", tier: "Creator", gradient: "linear-gradient(135deg, #facc15, #ca8a04)", glow: "rgba(250, 204, 21, 0.55)", bg: "rgba(250, 204, 21, 0.10)", border: "rgba(250, 204, 21, 0.30)", Icon: Crown, color: "#facc15" },
  admin: { name: "Admin", desc: "System Administrator.", tier: "Admin", gradient: "linear-gradient(135deg, #ef4444, #b91c1c)", glow: "rgba(239, 68, 68, 0.55)", bg: "rgba(239, 68, 68, 0.10)", border: "rgba(239, 68, 68, 0.30)", Icon: Shield, color: "#ef4444" },
  staff: { name: "Staff", desc: "Be a part of the redr.lol staff team.", tier: "Staff", gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)", glow: "rgba(59, 130, 246, 0.55)", bg: "rgba(59, 130, 246, 0.10)", border: "rgba(59, 130, 246, 0.30)", Icon: ShieldAlert, color: "#3b82f6" },
  moderator: { name: "Moderator", desc: "Community Moderator.", tier: "Moderator", gradient: "linear-gradient(135deg, #22c55e, #15803d)", glow: "rgba(34, 197, 94, 0.55)", bg: "rgba(34, 197, 94, 0.10)", border: "rgba(34, 197, 94, 0.30)", Icon: ShieldCheck, color: "#22c55e" },
  developer: { name: "Developer", desc: "Core contributor to the redr.lol codebase.", tier: "Developer", gradient: "linear-gradient(135deg, #6366f1, #4338ca)", glow: "rgba(99, 102, 241, 0.55)", bg: "rgba(99, 102, 241, 0.10)", border: "rgba(99, 102, 241, 0.30)", Icon: Code, color: "#6366f1" },
  designer: { name: "Designer", desc: "Creator of redr.lol aesthetics.", tier: "Designer", gradient: "linear-gradient(135deg, #ec4899, #be185d)", glow: "rgba(236, 72, 153, 0.55)", bg: "rgba(236, 72, 153, 0.10)", border: "rgba(236, 72, 153, 0.30)", Icon: Palette, color: "#ec4899" },
  helper: { name: "Helper", desc: "Be active and help users in the community.", tier: "Helper", gradient: "linear-gradient(135deg, #fb7185, #e11d48)", glow: "rgba(244, 63, 94, 0.55)", bg: "rgba(244, 63, 94, 0.10)", border: "rgba(244, 63, 94, 0.30)", Icon: Heart, color: "#fb7185" },
  premium: { name: "Premium", desc: "Purchase the premium package.", tier: "Premium", gradient: "linear-gradient(135deg, #a855f7, #c026d3)", glow: "rgba(168, 85, 247, 0.55)", bg: "rgba(168, 85, 247, 0.10)", border: "rgba(168, 85, 247, 0.30)", Icon: Gem, color: "#a855f7" },
  verified: { name: "Verified", desc: "Purchase or be a known content creator.", tier: "Verified", gradient: "linear-gradient(135deg, #38bdf8, #2563eb)", glow: "rgba(56, 189, 248, 0.55)", bg: "rgba(56, 189, 248, 0.10)", border: "rgba(56, 189, 248, 0.30)", Icon: CheckCircle2, color: "#38bdf8" },
  donor: { name: "Donor", desc: "Donate at least 10€ to redr.lol.", tier: "Donor", gradient: "linear-gradient(135deg, #34d399, #059669)", glow: "rgba(52, 211, 153, 0.55)", bg: "rgba(52, 211, 153, 0.10)", border: "rgba(52, 211, 153, 0.30)", Icon: HeartHandshake, color: "#34d399" },
  gifter: { name: "Gifter", desc: "Gift a redr.lol product to another user.", tier: "Gifter", gradient: "linear-gradient(135deg, #e879f9, #c026d3)", glow: "rgba(232, 121, 249, 0.55)", bg: "rgba(232, 121, 249, 0.10)", border: "rgba(232, 121, 249, 0.30)", Icon: Gift, color: "#e879f9" },
  image_host: { name: "Image Host", desc: "Purchase the Image Host.", tier: "User", gradient: "linear-gradient(135deg, #22d3ee, #0891b2)", glow: "rgba(34, 211, 238, 0.55)", bg: "rgba(34, 211, 238, 0.10)", border: "rgba(34, 211, 238, 0.30)", Icon: ImageIcon, color: "#22d3ee" },
  domain_legend: { name: "Domain Legend", desc: "Add a public custom domain to redr.lol Image Host.", tier: "Legend", gradient: "linear-gradient(135deg, #60a5fa, #4f46e5)", glow: "rgba(96, 165, 250, 0.55)", bg: "rgba(96, 165, 250, 0.10)", border: "rgba(96, 165, 250, 0.30)", Icon: Globe, color: "#60a5fa" },
  og: { name: "OG", desc: "Be an early supporter of redr.lol.", tier: "OG", gradient: "linear-gradient(135deg, #f59e0b, #d97706)", glow: "rgba(245, 158, 11, 0.55)", bg: "rgba(245, 158, 11, 0.10)", border: "rgba(245, 158, 11, 0.30)", Icon: Award, color: "#f59e0b" },
  server_booster: { name: "Server Booster", desc: "Boost the redr.lol discord server.", tier: "Booster", gradient: "linear-gradient(135deg, #a78bfa, #7c3aed)", glow: "rgba(167, 139, 250, 0.55)", bg: "rgba(167, 139, 250, 0.10)", border: "rgba(167, 139, 250, 0.30)", Icon: Rocket, color: "#a78bfa" },
  bug_hunter: { name: "Bug Hunter", desc: "Report a bug to the redr.lol team.", tier: "Hunter", gradient: "linear-gradient(135deg, #f87171, #dc2626)", glow: "rgba(248, 113, 113, 0.55)", bg: "rgba(248, 113, 113, 0.10)", border: "rgba(248, 113, 113, 0.30)", Icon: Bug, color: "#f87171" },
  easter_2026: { name: "Easter 2026", desc: "Exclusive badge from the 2026 easter sale.", tier: "Event", gradient: "linear-gradient(135deg, #f9a8d4, #ec4899)", glow: "rgba(249, 168, 212, 0.55)", bg: "rgba(249, 168, 212, 0.10)", border: "rgba(249, 168, 212, 0.30)", Icon: Sparkles, color: "#f9a8d4" },
  christmas_2025: { name: "Christmas 2025", desc: "Exclusive badge from the 2025 winter sale.", tier: "Event", gradient: "linear-gradient(135deg, #a5f3fc, #06b6d4)", glow: "rgba(165, 243, 252, 0.55)", bg: "rgba(165, 243, 252, 0.10)", border: "rgba(165, 243, 252, 0.30)", Icon: Snowflake, color: "#a5f3fc" },
  easter_2025: { name: "Easter 2025", desc: "Exclusive badge from the 2025 easter sale.", tier: "Event", gradient: "linear-gradient(135deg, #f472b6, #db2777)", glow: "rgba(244, 114, 182, 0.55)", bg: "rgba(244, 114, 182, 0.10)", border: "rgba(244, 114, 182, 0.30)", Icon: Sparkles, color: "#f472b6" },
  christmas_2024: { name: "Christmas 2024", desc: "Exclusive badge from the 2024 winter sale.", tier: "Event", gradient: "linear-gradient(135deg, #bfdbfe, #3b82f6)", glow: "rgba(191, 219, 254, 0.55)", bg: "rgba(191, 219, 254, 0.10)", border: "rgba(191, 219, 254, 0.30)", Icon: Snowflake, color: "#bfdbfe" },
  the_million: { name: "The Million", desc: "Celebration badge for 1M users.", tier: "Event", gradient: "linear-gradient(135deg, #fde047, #eab308)", glow: "rgba(253, 224, 71, 0.55)", bg: "rgba(253, 224, 71, 0.10)", border: "rgba(253, 224, 71, 0.30)", Icon: Crown, color: "#fde047" },
  winner: { name: "Winner", desc: "Win a guns.lol event.", tier: "Event", gradient: "linear-gradient(135deg, #facc15, #ca8a04)", glow: "rgba(250, 204, 21, 0.55)", bg: "rgba(250, 204, 21, 0.10)", border: "rgba(250, 204, 21, 0.30)", Icon: Trophy, color: "#facc15" },
  second_place: { name: "Second Place", desc: "Get second place in a redr.lol event.", tier: "Event", gradient: "linear-gradient(135deg, #cbd5e1, #64748b)", glow: "rgba(203, 213, 225, 0.55)", bg: "rgba(203, 213, 225, 0.10)", border: "rgba(203, 213, 225, 0.30)", Icon: Medal, color: "#cbd5e1" },
  third_place: { name: "Third Place", desc: "Get third place in a redr.lol event.", tier: "Event", gradient: "linear-gradient(135deg, #fb923c, #ea580c)", glow: "rgba(251, 146, 60, 0.55)", bg: "rgba(251, 146, 60, 0.10)", border: "rgba(251, 146, 60, 0.30)", Icon: Medal, color: "#fb923c" },
  beta_tester: { name: "Beta Tester", desc: "Helped test unreleased features.", tier: "Tester", gradient: "linear-gradient(135deg, #2dd4bf, #0f766e)", glow: "rgba(45, 212, 191, 0.55)", bg: "rgba(45, 212, 191, 0.10)", border: "rgba(45, 212, 191, 0.30)", Icon: TestTube, color: "#2dd4bf" },
  vip: { name: "VIP", desc: "Very Important Person.", tier: "VIP", gradient: "linear-gradient(135deg, #fbbf24, #d97706)", glow: "rgba(251, 191, 36, 0.55)", bg: "rgba(251, 191, 36, 0.10)", border: "rgba(251, 191, 36, 0.30)", Icon: Star, color: "#fbbf24" },
};

// ========================================
// Badge Icon Only (marquee — icon only, hover card for details)
// ========================================
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

function BadgeIconOnly({ badgeId }: { badgeId: string }) {
  const badge = BADGE_REGISTRY[badgeId as keyof typeof BADGE_REGISTRY];
  if (!badge) return null;

  const { name, desc, tier, gradient, glow, bg, border, Icon, color } = badge;
  const [hovered, setHovered] = useState(false);

  return (
    <HoverCard openDelay={50} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div
          className="relative flex-shrink-0 cursor-default"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Icon-only circle */}
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full select-none"
            style={{
              background: bg,
              border: `1.5px solid ${hovered ? color : border}`,
              transform: hovered ? 'scale(1.18)' : 'scale(1)',
              boxShadow: hovered ? `0 0 18px ${glow}, 0 0 6px ${glow}` : 'none',
              transition: 'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.22s ease, border-color 0.22s ease',
            }}
          >
            <Icon
              className="h-5 w-5"
              style={{
                color,
                filter: hovered ? `drop-shadow(0 0 6px ${glow})` : 'none',
                transition: 'filter 0.2s ease',
              }}
            />
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        side="top"
        align="center"
        sideOffset={14}
        className="z-[9999] w-52 rounded-2xl p-3.5 shadow-2xl border-none"
        style={{
          background: 'rgba(8, 8, 8, 0.97)',
          border: `1px solid ${border}`,
          boxShadow: `0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px ${border}, 0 0 24px ${glow}`,
          backdropFilter: 'blur(24px)',
        }}
      >
        <div className="flex items-center gap-2.5 mb-2">
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl"
            style={{ background: gradient, boxShadow: `0 0 18px ${glow}` }}
          >
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-white leading-tight">{name}</p>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] mt-0.5" style={{ color }}>{tier}</p>
          </div>
        </div>
        <div className="h-px mb-2" style={{ background: border }} />
        <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(160,160,160,0.9)' }}>{desc}</p>
      </HoverCardContent>
    </HoverCard>
  );
}

// ========================================
// Social Connection Scramble Link Component
// ========================================
interface ScrambleLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  title: string;
}

function ScrambleLink({ href, label, icon, title }: ScrambleLinkProps) {
  const [text, setText] = useState(label);
  const intervalId = useRef<any>(null);

  const handleMouseEnter = () => {
    const chars = '!<>-/[]{}—=+*^?#________';
    let iterations = 0;
    if (intervalId.current) clearInterval(intervalId.current);
    intervalId.current = setInterval(() => {
      setText(
        label.split('').map((letter, index) => {
          if (index < iterations) return label[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
      if (iterations >= label.length) { clearInterval(intervalId.current); intervalId.current = null; }
      iterations += 1 / 3;
    }, 30);
  };

  const handleMouseLeave = () => {
    if (intervalId.current) clearInterval(intervalId.current);
    setText(label);
  };

  useEffect(() => {
    return () => { if (intervalId.current) clearInterval(intervalId.current); };
  }, [label]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="social-item relative flex items-center gap-3 px-4 py-3.5 bg-stone-50/50 dark:bg-black/20 border border-stone-200/60 dark:border-white/5 hover:border-stone-400 dark:hover:border-white/20 rounded-lg overflow-hidden text-xs font-semibold text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-all duration-200 select-none hover:translate-x-0.5 cursor-pointer group"
      title={title}
    >
      <div className="item-bg absolute inset-0 bg-gradient-to-r from-stone-200/30 to-transparent dark:from-white/[0.04] dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-0 pointer-events-none" />
      <span className="relative z-10 scale-110 group-hover:scale-120 group-hover:text-stone-955 dark:group-hover:text-white transition-all duration-250 text-[1.1rem]">{icon}</span>
      <span className="relative z-10 font-sans tracking-[1px] uppercase text-[0.8rem] font-medium group-hover:text-stone-955 dark:group-hover:text-white transition-colors duration-250">{text}</span>
    </a>
  );
}

// ========================================
// Social Connection Grid Widget Component
// ========================================
function SocialWidget({ customLinks }: { customLinks?: any[] }) {
  const links = customLinks && customLinks.length > 0 ? customLinks.filter(l => l.active !== false) : [
    { title: "GitHub", url: "https://github.com/Camilo404", iconType: "github" },
    { title: "YouTube", url: "https://www.youtube.com/channel/UChzlaSE1adSPVGYBBOQ1ibg", iconType: "youtube" },
    { title: "Instagram", url: "https://www.instagram.com/camiloxtz/", iconType: "instagram" },
    { title: "Steam", url: "https://steamcommunity.com/profiles/76561198832154348/", iconType: "steam" },
  ];

  const renderIcon = (type: string) => {
    switch (type) {
      case "twitter": return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>;
      case "github": return <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>;
      case "discord": return <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 127.14 96.36"><path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c1-.73,2-1.51,2.94-2.31A75.52,75.52,0,0,0,96,78.2c1,.8,1.94,1.58,2.94,2.31a68.17,68.17,0,0,1-10.5,5A77.7,77.7,0,0,0,95.12,96.36a105.73,105.73,0,0,0,31.06-18.83C129.87,50.7,123.36,27.83,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" /></svg>;
      case "youtube": return <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>;
      case "instagram": return <svg className="h-4.5 w-4.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>;
      case "steam": return <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.54 3.03 8.375 7.153 9.605l.937-2.612a2.385 2.385 0 0 1-.09-.597 2.395 2.395 0 1 1 4.79 0c0 .416-.107.807-.294 1.15l.904 2.523C18.847 20.672 22 16.71 22 12c0-5.523-4.477-10-10-10zm0 1.25c4.832 0 8.75 3.918 8.75 8.75 0 3.826-2.454 7.08-5.883 8.243l-.936-2.61a2.393 2.393 0 0 1 .069-.533 2.395 2.395 0 0 1-4.79 0c0-.184.02-.363.059-.536l-.968-2.702A4.79 4.79 0 0 0 12 3.25zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 1.25a2.75 2.75 0 1 1 0 5.5 2.75 2.75 0 0 1 0-5.5zm0 .75a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 .75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z" /></svg>;
      default: return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>;
    }
  };

  return (
    <InteractiveCard className="social-card-container flex flex-col p-6 w-full text-left">
      <div className="social-header flex items-center gap-4 opacity-80 w-full mb-4">
        <span className="line flex-grow h-[1px] bg-gradient-to-r from-transparent via-stone-300 dark:via-white/20 to-transparent" />
        <span className="social-title font-sans text-[10px] tracking-[4px] uppercase text-stone-500 dark:text-stone-400 font-bold select-none">Connect</span>
        <span className="line flex-grow h-[1px] bg-gradient-to-r from-transparent via-stone-300 dark:via-white/20 to-transparent" />
      </div>
      <div className="social-grid grid grid-cols-2 gap-3 w-full">
        {links.map((link, idx) => (
          <ScrambleLink key={idx} href={link.url} label={link.title} title={link.title} icon={renderIcon(link.iconType)} />
        ))}
      </div>
    </InteractiveCard>
  );
}

// ========================================
// Badges Showcase Card — icon-only marquee
// ========================================
function BadgesShowcase({ activeBadges }: { activeBadges?: string[] }) {
  const badgesToShow = activeBadges && activeBadges.length > 0 ? activeBadges : [];
  if (badgesToShow.length === 0) return null;

  // Repeat badges for smooth infinite scroll
  const repeatedBadges = [
    ...badgesToShow, ...badgesToShow, ...badgesToShow,
    ...badgesToShow, ...badgesToShow, ...badgesToShow,
  ];

  return (
    <InteractiveCard className="badges-showcase-card flex flex-col w-full py-4">
      <style>{`
        @keyframes badgeMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 6)); }
        }
        .badge-marquee-track {
          display: flex;
          gap: 0.85rem;
          width: max-content;
          animation: badgeMarquee 16s linear infinite;
          align-items: center;
        }
        .badge-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="badges-header flex items-center gap-4 opacity-80 w-full mb-3 px-5">
        <span className="line flex-grow h-[1px] bg-gradient-to-r from-transparent via-stone-300 dark:via-white/20 to-transparent" />
        <span className="font-sans text-[10px] tracking-[4px] uppercase text-stone-500 dark:text-stone-400 font-bold select-none">Badges</span>
        <span className="line flex-grow h-[1px] bg-gradient-to-r from-transparent via-stone-300 dark:via-white/20 to-transparent" />
      </div>

      {/* Marquee with edge fade */}
      <div className="w-full overflow-hidden py-1 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="badge-marquee-track">
          {repeatedBadges.map((badgeId, index) => (
            <BadgeIconOnly key={`${badgeId}-${index}`} badgeId={badgeId} />
          ))}
        </div>
      </div>
    </InteractiveCard>
  );
}

// ========================================
// Discord Badge Icon (for Discord card — icon only w/ hover card)
// ========================================
function DiscordBadgeIcon({ badge }: { badge: { id: string; icon: string; description: string; link?: string } }) {
  const [hovered, setHovered] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setHovered(true);
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
    }
  };

  return (
    <div ref={ref} className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={() => setHovered(false)}>
      <div
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-100/50 dark:bg-white/5 border border-stone-200/30 dark:border-white/5 hover:bg-stone-200 dark:hover:bg-white/10 transition-all duration-200 cursor-default hover:-translate-y-0.5"
        style={{ transition: 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1), background 0.18s ease' }}
      >
        <img 
          src={`https://cdn.discordapp.com/badge-icons/${badge.icon}.png`} 
          alt={badge.id}
          className="h-5 w-5 object-contain drop-shadow-sm"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.94 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            className="fixed z-[9999] pointer-events-none"
            style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y - 8}px`, transform: 'translate(-50%, -100%)' }}
          >
            <div
              className="px-3 py-2 rounded-xl text-center"
              style={{
                background: 'rgba(8,8,8,0.97)',
                border: '1px solid rgba(255,255,255,0.09)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.75)',
                backdropFilter: 'blur(20px)',
                minWidth: '110px',
                maxWidth: '190px',
              }}
            >
              <p className="text-[11px] font-semibold text-white/90 leading-snug">{badge.description}</p>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0" style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid rgba(255,255,255,0.09)' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ========================================
// Discord Profile Card Component
// ========================================
interface DiscordProfileCardProps {
  user: {
    id: number;
    username: string;
    email: string;
    created_at: string;
    discord_id?: string;
    active_badges?: string[];
  };
  discordData: DiscordData | null;
  connections: OAuthConnection[];
}

interface OAuthConnection {
  type: string;
  name: string;
  id?: string;
  verified?: boolean;
  visibility?: number;
}

interface DiscordData {
  user?: {
    global_name?: string;
    username?: string;
    avatar_decoration_data?: { asset?: string; sku_id?: string };
    avatar?: string;
    banner?: string;
    collectibles?: { nameplate?: { asset?: string } };
    clan?: { tag?: string; badge?: string; identity_guild_id?: string };
    primary_guild?: { tag?: string; badge?: string; identity_guild_id?: string };
    profile_effect?: { id?: string };
  };
  user_profile?: {
    pronouns?: string;
    bio?: string;
    banner?: string;
    theme_colors?: number[];
    profile_effect?: { id?: string };
  };
  badges?: Array<{ id: string; icon: string; description: string; link?: string }>;
  connected_accounts?: Array<{ type: string; name: string }>;
}

// Placeholder interface — kept for backwards-compat in activities type
interface _ActivityEntry {
    name: string;
    type?: number;
    state?: string;
    details?: string;
    emoji?: { id?: string; name?: string; animated?: boolean };
    assets?: {
      large_image?: string;
      large_text?: string;
      small_image?: string;
      small_text?: string;
    };
    application_id?: string;
    timestamps?: { start?: number; end?: number };
}

const statusColors: Record<string, string> = {
  online: "#43b581",
  idle: "#faa61a",
  dnd: "#f04747",
  streaming: "#593695",
  offline: "#747f8d",
};

function DiscordProfileCard({ user, discordData, connections }: DiscordProfileCardProps) {
  const { data: lanyard } = useLanyard(user.discord_id || "");
  const [message, setMessage] = useState('');
  const [bannerError, setBannerError] = useState(false);
  const [bannerLoaded, setBannerLoaded] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.discord_id) return;
    window.open(`https://discord.com/users/${user.discord_id}`, '_blank');
    setMessage('');
  };

  // Real-time presence via Lanyard
  const status = lanyard?.discord_status || 'offline';
  const statusColor = statusColors[status];

  const themeColors = discordData?.user_profile?.theme_colors || [];
  const primaryAccent = themeColors.length > 0
    ? '#' + themeColors[0].toString(16).padStart(6, '0').toUpperCase()
    : '#950000';
  const secondaryAccent = themeColors.length > 1
    ? '#' + themeColors[1].toString(16).padStart(6, '0').toUpperCase()
    : primaryAccent;

  const badges = discordData?.badges || [];

  // Name resolution from proxy API
  const displayName = discordData?.user?.global_name
    || discordData?.user?.username
    || user.username || "Unknown";
  const userTag = discordData?.user?.username || user.username || "unknown";
  const bio = discordData?.user_profile?.bio || "";
  const pronouns = discordData?.user_profile?.pronouns || "";

  // Guild tag from discord data (primary_guild fallback as per Camilo404)
  const guildTag = discordData?.user?.clan?.tag || discordData?.user?.primary_guild?.tag;
  const guildBadge = discordData?.user?.clan?.badge || discordData?.user?.primary_guild?.badge;
  const guildId = discordData?.user?.clan?.identity_guild_id || discordData?.user?.primary_guild?.identity_guild_id;

  // Avatar decoration
  const avatarDecoration = discordData?.user?.avatar_decoration_data?.asset;

  // Profile effect
  const profileEffectId = discordData?.user_profile?.profile_effect?.id
    || discordData?.user?.profile_effect?.id;

  // Banner URL — use discord CDN
  const bannerHash = discordData?.user?.banner;
  const bannerUrl = bannerHash && user.discord_id ? `https://cdn.discordapp.com/banners/${user.discord_id}/${bannerHash}.png?size=512` : null;

  // OAuth connections (from Discord API via access token)
  const oauthConnections = connections || [];

  if (!discordData) {
    return (
      <InteractiveCard isProfile={true} className="text-left w-[400px]">
        <div className="w-full h-[140px] bg-stone-200/50 dark:bg-stone-800/50 animate-pulse rounded-t-2xl"></div>
        <div className="px-5 pb-5 mt-[-52px] relative z-10">
          <div className="w-[90px] h-[90px] bg-stone-300/50 dark:bg-stone-700/50 rounded-full border-[5px] border-white/10 dark:border-[#0A0A0A]/95 animate-pulse"></div>
          <div className="mt-4 flex flex-col gap-2">
            <div className="w-1/2 h-6 bg-stone-200/50 dark:bg-stone-800/50 rounded animate-pulse"></div>
            <div className="w-1/3 h-4 bg-stone-200/50 dark:bg-stone-800/50 rounded animate-pulse"></div>
            <div className="w-full h-12 bg-stone-200/50 dark:bg-stone-800/50 rounded-xl mt-4 animate-pulse"></div>
            <div className="w-full h-12 bg-stone-200/50 dark:bg-stone-800/50 rounded-xl mt-2 animate-pulse"></div>
          </div>
        </div>
      </InteractiveCard>
    );
  }

  return (
    <InteractiveCard isProfile={true} className="text-left w-[400px]">
      <style>{`
        .aesthetic-card { --accent-color: ${primaryAccent}; }
      `}</style>

      {/* Banner */}
      <div
        className="card-cover h-[140px] relative overflow-hidden"
        style={{
          background: !bannerUrl || bannerError
            ? `linear-gradient(135deg, ${primaryAccent}cc, ${secondaryAccent}88)`
            : undefined,
        }}
      >
        {bannerUrl && !bannerError && (
          <img
            src={bannerUrl}
            alt="Discord Banner"
            className="w-full h-full object-cover"
            style={{ display: bannerLoaded ? 'block' : 'none' }}
            onLoad={() => setBannerLoaded(true)}
            onError={() => setBannerError(true)}
          />
        )}
        {bannerUrl && !bannerLoaded && !bannerError && (
          <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${primaryAccent}cc, ${secondaryAccent}88)` }} />
        )}

        {/* Profile Effect Overlay */}
        {profileEffectId && (
          <img
            src={`https://cdn.discordapp.com/profile-effects/${profileEffectId}/e1.png`}
            alt="Profile Effect"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ zIndex: 2, mixBlendMode: 'screen', opacity: 0.75 }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}

        <div className="cover-overlay absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/25 z-[3]" />
      </div>

      <div className="card-content relative z-10 px-5 pb-5 mt-[-52px]">
        {/* Profile Header */}
        <div className="header-section flex flex-col gap-3 mb-5">
          <div className="avatar-wrapper flex items-end justify-between relative">
            {/* Avatar */}
            <div className="avatar-container relative h-[90px] w-[90px] overflow-visible">
              {discordData?.user?.avatar && user.discord_id ? (
                <img
                  className="w-full h-full rounded-full object-cover border-[5px] border-white/10 dark:border-[#0A0A0A]/95 relative z-10"
                  src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${discordData.user.avatar}.png?size=512`}
                  onError={(e) => { (e.target as HTMLImageElement).src = "/assets/images/no-image-found.jpg"; }}
                  alt="Avatar"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-stone-700 border-[5px] border-white/10 dark:border-[#0A0A0A]/95 relative z-10" />
              )}

              {/* Avatar Decoration / PFP Effect */}
              {avatarDecoration && (
                <img
                  src={`https://cdn.discordapp.com/avatar-decoration-presets/${avatarDecoration}.png?size=256&passthrough=true`}
                  alt=""
                  className="absolute pointer-events-none select-none z-20"
                  style={{
                    width: '148px',
                    height: 'auto',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}

              {/* Status dot */}
              <div
                className="absolute bottom-[6px] right-[6px] h-[14px] w-[14px] rounded-full z-30 border-2 border-white/10 dark:border-[#0A0A0A]/95"
                style={{ backgroundColor: statusColor, boxShadow: `0 0 6px ${statusColor}` }}
              />
            </div>

            {/* Right side: status + guild tag */}
            <div className="flex flex-col items-end gap-1.5 mb-1">
              <div
                className="status-badge flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-white select-none border border-white/10"
                style={{ background: "rgba(0,0,0,0.52)", backdropFilter: "blur(12px)" }}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: statusColor, boxShadow: `0 0 5px ${statusColor}` }} />
                <span className="uppercase text-[9px] tracking-wider font-mono">{status}</span>
              </div>

            </div>
          </div>

          <div className="user-info space-y-1">
            <div className="name-row flex items-center gap-2 flex-wrap">
              <h1 className="display-name text-xl font-bold tracking-tight text-stone-900 dark:text-white leading-none">
                {lanyard?.discord_user?.global_name || lanyard?.discord_user?.username || displayName}
              </h1>
              {guildTag && (
                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full select-none border border-stone-200/50 dark:border-white/10"
                  style={{ background: "rgba(0,0,0,0.05)" }}
                >
                  {guildBadge && guildId && (
                    <img
                      src={`https://cdn.discordapp.com/clan-badges/${guildId}/${guildBadge}.png?size=16`}
                      alt="Guild Badge"
                      className="h-3 w-3 object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                  <span className="text-[9px] font-black uppercase tracking-widest text-stone-600 dark:text-white/80">{guildTag}</span>
                </div>
              )}
            </div>

            <div className="username-row flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 font-medium flex-wrap">
              <span className="username">@{userTag}</span>
              {pronouns && (
                <>
                  <span className="divider opacity-50">•</span>
                  <span className="pronouns text-red-500/80 dark:text-red-400/80 font-bold">{pronouns}</span>
                </>
              )}
              {/* Platform indicators — hidden until bot gateway */}
              <div className="platform-indicators flex items-center gap-1 ml-1" />
            </div>
          </div>

            {/* Discord Badges — icon only */}
            {badges.length > 0 && (
              <div className="discord-badges flex flex-wrap gap-1 pt-1.5">
                {badges.map((badge, idx) => (
                  <DiscordBadgeIcon key={idx} badge={badge} />
                ))}
              </div>
            )}
        </div>

        <div className="scrollable-content flex flex-col gap-4 pt-4 border-t border-stone-250/20 dark:border-white/5">

          {/* Custom Status */}
          {lanyard?.activities?.find((a: any) => a.type === 4) && (() => {
            const customStatus = lanyard.activities.find((a: any) => a.type === 4);
            return (
              <div className="text-xs pb-3 border-b border-stone-200/50 dark:border-white/5 flex items-center gap-2 text-stone-700 dark:text-stone-300">
                {customStatus.emoji && (
                  <img 
                    src={customStatus.emoji.id 
                      ? `https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${customStatus.emoji.animated ? 'gif' : 'png'}?size=24`
                      : ""
                    } 
                    alt="" 
                    className="w-4 h-4 object-contain"
                  />
                )}
                <span>{customStatus.state}</span>
              </div>
            );
          })()}

          {/* Bio */}
          {bio && (
            <section className="section bio-section">
              <h3 className="section-title text-[10px] font-bold text-stone-400 dark:text-stone-400 uppercase tracking-widest mb-2">About Me</h3>
              <p className="markdown-content text-xs text-stone-600 dark:text-stone-350 leading-relaxed font-medium whitespace-pre-wrap">{bio}</p>
            </section>
          )}

          {/* Activities / Rich Presence */}
          {lanyard?.activities?.filter((a: any) => a.type !== 4).map((activity: any, idx: number) => (
            <div key={idx} className="section activity-section mt-2">
              <h3 className="section-title text-[10px] font-bold uppercase text-stone-400 dark:text-stone-400 tracking-widest mb-2">
                {activity.type === 0 ? "Playing a game" : activity.type === 2 ? "Listening to Spotify" : activity.type === 3 ? "Watching" : "Activity"}
              </h3>
              <div className="flex gap-3 items-center p-2 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5">
                <div className="w-14 h-14 rounded-lg bg-stone-200 dark:bg-neutral-800 flex-shrink-0 overflow-hidden relative">
                  {activity.assets?.large_image ? (
                    <img 
                      src={activity.assets.large_image.startsWith("spotify:") 
                        ? `https://i.scdn.co/image/${activity.assets.large_image.replace("spotify:", "")}`
                        : activity.assets.large_image.startsWith("mp:")
                        ? `https://media.discordapp.net/${activity.assets.large_image.replace("mp:", "")}`
                        : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`}
                      alt={activity.assets?.large_text || activity.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black/10 dark:bg-black/40">
                       <Tv className="w-5 h-5 text-stone-400 dark:text-white/20" />
                    </div>
                  )}
                  {activity.assets?.small_image && (
                    <img 
                      src={activity.assets.small_image.startsWith("mp:")
                        ? `https://media.discordapp.net/${activity.assets.small_image.replace("mp:", "")}`
                        : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.png`}
                      alt={activity.assets?.small_text}
                      className="absolute bottom-[-2px] right-[-2px] w-5 h-5 rounded-full border-2 border-stone-50 dark:border-[#111214] bg-stone-100 dark:bg-[#111214]"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-stone-900 dark:text-white truncate">{activity.name}</div>
                  {activity.details && <div className="text-xs text-stone-500 dark:text-[#b5bac1] truncate">{activity.details}</div>}
                  {activity.state && <div className="text-xs text-stone-500 dark:text-[#b5bac1] truncate">{activity.state}</div>}
                </div>
              </div>
            </div>
          ))}

          {/* OAuth Connections — shown if user connected via Discord OAuth */}
          {oauthConnections.length > 0 && (
            <section className="section connections-section">
              <h3 className="section-title text-[10px] font-bold text-stone-400 dark:text-stone-400 uppercase tracking-widest mb-2">Connections</h3>
              <div className="connections-grid flex flex-wrap gap-2">
                {oauthConnections.map((account, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="connection-item flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-250/30 hover:border-stone-400/40 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10 transition-all duration-200 hover:-translate-y-0.5"
                    title={`${account.name} (${account.type})`}
                  >
                    <img
                      src={`/assets/images/connections/${account.type.toLowerCase()}.svg`}
                      alt={account.type}
                      className="h-4 w-4 opacity-80 hover:opacity-100 transition-opacity"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/assets/images/no-image-found.jpg"; }}
                    />
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Message Input */}
          <div className="message-section">
            <form onSubmit={handleSendMessage}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Send a message..."
                className="aesthetic-input w-full bg-stone-100 dark:bg-black/30 border border-stone-250/40 dark:border-white/5 hover:border-stone-400 dark:hover:border-white/15 focus:border-red-500 dark:focus:border-red-500 rounded-xl px-4 py-2.5 text-xs text-stone-900 dark:text-white focus:outline-none transition-all placeholder-stone-400"
              />
            </form>
          </div>
        </div>
      </div>
      
    </InteractiveCard>
      
  );
}

// ========================================
// ClientProfile Main Page Component
// ========================================
interface ClientProfileProps {
  user: {
    id: number;
    username: string;
    email: string;
    created_at: string;
    discord_id?: string;
    typewriter_heading?: string;
    typewriter_quotes?: string[];
    custom_links?: any[];
    active_badges?: string[];
  };
  initialDiscordData?: DiscordData | null;
  initialConnections?: OAuthConnection[];
}

export default function ClientProfile({ user, initialDiscordData, initialConnections }: ClientProfileProps) {
  const [entered, setEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showVolumeDropdown, setShowVolumeDropdown] = useState(false);
  const prevVolumeRef = useRef(0.3);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [discordData, setDiscordData] = useState<DiscordData | null>(initialDiscordData || null);
  const [connections] = useState<OAuthConnection[]>(initialConnections || []);

  useEffect(() => { setMounted(true); }, []);

  // Note: We've removed the redroseapi client-side fallback. 
  // We rely exclusively on the data passed via initialDiscordData from the server.

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
  }, []);

  // Sync volume to audio element
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handleEnterChamber = () => {
    setEntered(true);
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log("Audio autoplay prevented:", err));
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error); }
  };

  // Volume toggle: if muted restore prev; if unmuted mute
  const toggleMute = () => {
    if (volume === 0) {
      const restore = prevVolumeRef.current > 0 ? prevVolumeRef.current : 0.3;
      setVolume(restore);
    } else {
      prevVolumeRef.current = volume;
      setVolume(0);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (newVol > 0) prevVolumeRef.current = newVol;
  };

  const isMuted = volume === 0;

  const toggleTheme = () => {
    const currentTheme = theme === "system" ? "dark" : theme;
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    const doc = document as any;
    if (!doc.startViewTransition) { setTheme(nextTheme); return; }
    doc.startViewTransition(() => {
      if (nextTheme === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      setTheme(nextTheme);
    });
  };

  return (
    <div className="relative min-h-screen bg-[#F5F5F5] dark:bg-[#0A0A0A] text-stone-900 dark:text-[#F5F1E8] font-sans flex items-center justify-center overflow-x-hidden transition-colors duration-500 z-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Roboto:wght@300;400;500;700&display=swap');

        :root {
          --bg-primary: #f5f5f5;
          --bg-secondary: #e8e8e8;
          --bg-card: rgba(255, 255, 255, 0.75);
          --bg-card-hover: rgba(255, 255, 255, 0.9);
          --bg-card-solid: #ffffff;
          --bg-glass: rgba(255, 255, 255, 0.6);
          --bg-glass-strong: rgba(255, 255, 255, 0.9);
          --bg-overlay: rgba(0, 0, 0, 0.5);
          --bg-input: rgba(0, 0, 0, 0.04);
          --bg-input-focus: rgba(0, 0, 0, 0.06);
          --text-primary: #1a1a1a;
          --text-secondary: #555555;
          --text-muted: #888888;
          --text-inverse: #ffffff;
          --text-on-image: #ffffff;
          --border-primary: rgba(0, 0, 0, 0.12);
          --border-hover: rgba(0, 0, 0, 0.22);
          --border-glass: rgba(0, 0, 0, 0.1);
          --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
          --shadow-md: 0 4px 24px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 20px 40px rgba(0, 0, 0, 0.12);
          --shadow-card: 0 4px 16px -1px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.06) inset;
          --shadow-card-hover: 0 20px 40px -5px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.1) inset;
          --accent-glow: rgba(149, 0, 0, 0.15);
          --mouse-glow: rgba(149, 0, 0, 0.06);
          --status-badge-bg: rgba(0, 0, 0, 0.4);
          --connection-item-bg: rgba(0, 0, 0, 0.04);
          --connection-item-bg-hover: rgba(0, 0, 0, 0.08);
          --shadow-brightness: 0.9;
          --shadow-brightness-hover: 1;
          --shadow-overlay: linear-gradient(to right, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 100%);
        }

        .dark {
          --bg-primary: #0A0A0A;
          --bg-secondary: #0F0F0F;
          --bg-card: rgba(15, 15, 15, 0.45);
          --bg-card-hover: rgba(149, 0, 0, 0.05);
          --bg-card-solid: #0F0F0F;
          --bg-glass: rgba(10, 10, 10, 0.4);
          --bg-glass-strong: rgba(10, 10, 10, 0.80);
          --bg-overlay: rgba(0, 0, 0, 0.6);
          --bg-input: rgba(0, 0, 0, 0.25);
          --bg-input-focus: rgba(0, 0, 0, 0.45);
          --text-primary: #ffffff;
          --text-secondary: rgba(245, 241, 232, 0.75);
          --text-muted: rgba(245, 241, 232, 0.45);
          --text-inverse: #0A0A0A;
          --text-on-image: #ffffff;
          --border-primary: rgba(255, 255, 255, 0.05);
          --border-hover: rgba(149, 0, 0, 0.25);
          --border-glass: rgba(255, 255, 255, 0.08);
          --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.2);
          --shadow-md: 0 4px 24px rgba(0, 0, 0, 0.3);
          --shadow-lg: 0 20px 40px rgba(0, 0, 0, 0.35);
          --shadow-card: 0 4px 24px -1px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
          --shadow-card-hover: 0 20px 40px -5px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(149, 0, 0, 0.15) inset;
          --accent-glow: rgba(149, 0, 0, 0.2);
          --mouse-glow: rgba(149, 0, 0, 0.08);
          --status-badge-bg: rgba(0, 0, 0, 0.3);
          --connection-item-bg: rgba(255, 255, 255, 0.05);
          --connection-item-bg-hover: rgba(255, 255, 255, 0.1);
          --shadow-brightness: 0.6;
          --shadow-brightness-hover: 0.8;
          --shadow-overlay: linear-gradient(to right, var(--bg-overlay) 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.4) 100%);
        }

        .widget-card {
          position: relative;
          width: 100%;
          transform-style: preserve-3d;
          background: var(--bg-card);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid var(--border-primary);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: var(--shadow-card);
          transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease, border-color 0.4s ease;
        }
        .widget-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(800px circle at var(--mouse-x, -50%) var(--mouse-y, -50%), var(--mouse-glow), transparent 40%);
          opacity: 0;
          transition: opacity 0.5s ease;
          z-index: 2;
          pointer-events: none;
        }
        .widget-card:hover {
          transform: translateY(-4px) scale(1.005);
          box-shadow: var(--shadow-card-hover);
          border-color: var(--border-hover);
          z-index: 10;
        }
        .widget-card:hover::before { opacity: 1; }

        /* Discord card — slight glass effect */
        .aesthetic-card {
          position: relative;
          width: 400px;
          background: rgba(255, 255, 255, 0.40);
          backdrop-filter: blur(48px);
          -webkit-backdrop-filter: blur(48px);
          border: 1px solid var(--border-primary);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: var(--shadow-lg), 0 0 0 1px var(--border-primary) inset;
          color: var(--text-primary);
          transform-style: preserve-3d;
          transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease, border-color 0.4s ease;
        }
        .dark .aesthetic-card {
          background: rgba(12, 12, 12, 0.40);
        }
        .aesthetic-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top right, var(--accent-color), transparent 70%);
          opacity: 0.12;
          pointer-events: none;
          z-index: 0;
        }
        .aesthetic-card:hover {
          transform: translateY(-4px) scale(1.005);
          box-shadow: var(--shadow-card-hover);
          border-color: var(--border-hover);
        }

        /* Volume slider vertical */
        .volume-slider-vert {
          -webkit-appearance: slider-vertical;
          writing-mode: vertical-lr;
          direction: rtl;
          width: 6px;
          height: 80px;
          cursor: pointer;
          accent-color: #ef4444;
          background: transparent;
        }
        .volume-slider-vert::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #ef4444; box-shadow: 0 0 6px rgba(239,68,68,0.5); }
        .volume-slider-vert::-webkit-slider-runnable-track { width: 4px; border-radius: 4px; background: rgba(255,255,255,0.15); }
      `}</style>

      {/* Ethereal Shadow Background */}
      <EtherealShadow />

      {/* Oneko Cursor Tracker */}
      <NekoTracker />

      {/* Ambient background blur circles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none">
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-red-650/[0.02] dark:bg-red-600/[0.015] blur-[150px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-red-550/[0.012] dark:bg-red-500/[0.008] blur-[130px]" />
      </div>

      {/* FLOATING CONTROLS */}
      {mounted && (
        <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/40 dark:bg-black/40 border border-stone-200/50 dark:border-white/5 hover:bg-stone-200/40 dark:hover:bg-white/[0.06] text-amber-500 dark:text-indigo-400 transition-all duration-300 shadow-sm cursor-pointer select-none"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          {/* Audio controls */}
          <AnimatePresence>
            {entered && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 bg-white/40 dark:bg-black/40 border border-stone-200/50 dark:border-white/5 p-2 rounded-2xl backdrop-blur-md select-none"
              >
                {/* Play/Pause */}
                <button
                  onClick={togglePlayback}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-all duration-200"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    /* Pause icon */
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    /* Play icon */
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  )}
                </button>

                {/* Volume control with hover dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setShowVolumeDropdown(true)}
                  onMouseLeave={() => setShowVolumeDropdown(false)}
                >
                  <button
                    onClick={toggleMute}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] text-red-400 hover:text-red-300 transition-all duration-200"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted
                      ? <VolumeX className="h-4 w-4" />
                      : <Volume2 className="h-4 w-4" />
                    }
                  </button>

                  {/* Volume dropdown panel */}
                  <AnimatePresence>
                    {showVolumeDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50"
                      >
                        <div
                          className="flex flex-col items-center gap-2 px-3 py-3 rounded-2xl"
                          style={{
                            background: 'rgba(10,10,10,0.92)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                          }}
                        >
                          {/* Volume percentage */}
                          <span className="text-[10px] font-bold text-white/70 tracking-wider tabular-nums">
                            {Math.round(volume * 100)}%
                          </span>
                          {/* Vertical slider */}
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={volume}
                            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                            className="volume-slider-vert"
                          />
                          {/* Low/High labels */}
                          <span className="text-[8px] text-white/40 uppercase tracking-widest">Low</span>
                        </div>
                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
                          style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid rgba(255,255,255,0.08)' }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* INTRO SCREEN */}
        {!entered ? (
          <motion.div
            key="intro-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.08 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            onClick={handleEnterChamber}
            className="absolute inset-0 z-40 bg-[#F5F5F5] dark:bg-[#0A0A0A] flex flex-col items-center justify-center cursor-pointer p-6 transition-colors duration-500 select-none z-30"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-[100px] animate-pulse" />
            </div>

            <div className="relative z-10 text-center space-y-8 flex flex-col items-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1], borderColor: ["rgba(239,68,68,0.2)", "rgba(239,68,68,0.5)", "rgba(239,68,68,0.2)"] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-24 w-24 items-center justify-center rounded-full border border-red-500/20 bg-[#0A0303] shadow-[0_0_40px_rgba(239,68,68,0.1)] relative"
              >
                <Disc3 className="h-10 w-10 text-red-500 animate-spin" style={{ animationDuration: "8s" }} />
                <div className="absolute -inset-2 rounded-full border border-dashed border-red-500/5 animate-spin" style={{ animationDuration: "12s" }} />
              </motion.div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">Chamber Security Active</p>
                <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-stone-900 dark:text-white">
                  Unlock @{discordData?.user?.username || user.username}
                </h1>
                <p className="text-xs text-stone-600 dark:text-[#8C8C8C] max-w-[280px] leading-relaxed mx-auto">
                  Tapping the chamber de-crypts visual styles and streams background wave frequencies.
                </p>
              </div>

              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center gap-2 rounded-full border border-red-500/20 dark:border-red-500/10 bg-red-500/5 px-6 py-2.5"
              >
                <LockOpen className="h-3.5 w-3.5 text-red-450 dark:text-red-400" />
                <span className="text-[10px] uppercase font-bold tracking-[0.18em] text-red-500 dark:text-red-400">Tap to Decipher</span>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* BENTO GRID */
          <motion.div
            key="bento-grid"
            initial={{ opacity: 0, y: 35, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 120, delay: 0.15 }}
            className="w-full max-w-5xl relative z-10 px-4 py-20 flex flex-col items-center z-20"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[400px_400px] gap-6 justify-center items-start w-fit mx-auto">
              {/* Left Column: Discord Profile Card */}
              <div className="flex justify-center w-full">
                <DiscordProfileCard user={user} discordData={discordData} connections={connections} />
              </div>

              {/* Right Column: Stacked Bento Widgets */}
              <div className="flex flex-col gap-[0.9rem] w-full max-w-[400px] mx-auto lg:mx-0">
                <ClockWidget />
                <ShadowWidget heading={user.typewriter_heading} quotesProp={user.typewriter_quotes} />
                <SocialWidget customLinks={user.custom_links} />
                <BadgesShowcase activeBadges={user.active_badges} />
              </div>
            </div>

            {/* Design Brand Sign */}
            <div className="mt-12 flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest text-stone-400 dark:text-[#444] transition-colors w-full justify-center select-none">
              <span>Designed by redr.lol</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

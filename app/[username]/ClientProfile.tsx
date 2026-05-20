"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

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
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
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
  scratch: [
    [-5, 0],
    [-6, 0],
    [-7, 0],
  ],
  tired: [[-3, -2]],
  sleeping: [
    [-2, 0],
    [-2, -1],
  ],
  N: [
    [-1, -2],
    [-1, -3],
  ],
  NE: [
    [0, -2],
    [0, -3],
  ],
  E: [
    [-3, 0],
    [-3, -1],
  ],
  SE: [
    [-5, -1],
    [-5, -2],
  ],
  S: [
    [-6, -3],
    [-7, -2],
  ],
  SW: [
    [-5, -3],
    [-6, -1],
  ],
  W: [
    [-4, -2],
    [-4, -3],
  ],
  NW: [
    [-1, 0],
    [-1, -1],
  ],
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
          if (currentIdleAnimationFrame < 8) {
            setSprite('tired', 0);
            break;
          }
          setSprite('sleeping', Math.floor(currentIdleAnimationFrame / 4));
          if (currentIdleAnimationFrame > 192) {
            resetIdleAnimation();
          }
          break;
        case 'scratch':
          setSprite('scratch', currentIdleAnimationFrame);
          if (currentIdleAnimationFrame > 9) {
            resetIdleAnimation();
          }
          break;
        default:
          setSprite('idle', 0);
          return;
      }
      idleAnimationFrame.current += 1;
    };

    const interval = setInterval(() => {
      frameCount.current += 1;
      const currNekoX = nekoPosX.current;
      const currNekoY = nekoPosY.current;
      const currMouseX = mousePosX.current;
      const currMouseY = mousePosY.current;
      
      const diffX = currNekoX - currMouseX;
      const diffY = currNekoY - currMouseY;
      const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

      if (distance < nekoSpeed || distance < 48) {
        idle();
        return;
      }

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
        width: '32px',
        height: '32px',
        position: 'fixed',
        backgroundImage: 'url(/assets/images/oneko.gif)',
        imageRendering: 'pixelated',
        zIndex: 9999,
        left: '32px',
        top: '32px',
        pointerEvents: 'none',
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
    const cycleDurationMs = 1.6 * 1000; // Animate speed mapped

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
            <feTurbulence
              result="undulation"
              numOctaves={2}
              baseFrequency="0.0005,0.002"
              seed={0}
              type="turbulence"
            />
            <feColorMatrix
              in="undulation"
              type="hueRotate"
              values={String(hueRotate)}
              result="hueShifted"
            />
            <feColorMatrix
              in="hueShifted"
              result="circulation"
              type="matrix"
              values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="circulation"
              scale={100}
              result="dist"
            />
            <feDisplacementMap
              in="dist"
              in2="hueShifted"
              scale={100}
              result="output"
            />
          </filter>
        </defs>
      </svg>

      {/* Main masked crow element */}
      <div
        className="absolute w-full h-full bg-[#808080] dark:bg-[#404040]"
        style={{
          inset: "-100px",
          filter: `url(#${filterId.current}) blur(4px)`,
          maskImage: 'url(/assets/images/ethereal-shadow/ceBGguIpUU8luwByxuQz79t7To.png)',
          maskSize: 'cover',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskImage: 'url(/assets/images/ethereal-shadow/ceBGguIpUU8luwByxuQz79t7To.png)',
          WebkitMaskSize: 'cover',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
        }}
      />

      {/* Noise layer */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: 'url(/assets/images/ethereal-shadow/g0QcWrxr87K0ufOxIUFBakwYA8.png)',
          backgroundSize: '240px',
          backgroundRepeat: 'repeat',
          opacity: 0.5,
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
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || window.innerWidth <= 768) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCoords({ x, y });

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const maxRotation = isProfile ? 12 : 5;
    const scale = isProfile ? 1.005 : 1.005;
    const perspective = isProfile ? 1200 : 1000;

    const rotateY = (mouseX / (rect.width / 2)) * maxRotation;
    const rotateX = -(mouseY / (rect.height / 2)) * maxRotation;

    cardRef.current.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
  };

  const handleMouseEnter = () => {
    if (window.innerWidth <= 768) return;
    setIsHovered(true);
    if (cardRef.current) {
      cardRef.current.style.transition = "transform 0.2s ease-out, box-shadow 0.4s ease, border-color 0.4s ease";
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
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
      style={{
        "--mouse-x": `${coords.x}px`,
        "--mouse-y": `${coords.y}px`,
      } as React.CSSProperties}
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
  const [time, setTime] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
    ampm: '',
    day: '',
    fullDate: '',
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let h = now.getHours();
      const m = now.getMinutes();
      const s = now.getSeconds();

      const ampmVal = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      h = h ? h : 12;

      const dayStr = now.toLocaleDateString('en-US', { weekday: 'long' });
      const fullDateStr = now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

      setTime({
        hours: h < 10 ? '0' + h : h.toString(),
        minutes: m < 10 ? '0' + m : m.toString(),
        seconds: s < 10 ? '0' + s : s.toString(),
        ampm: ampmVal,
        day: dayStr.toUpperCase(),
        fullDate: fullDateStr.toUpperCase(),
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
const quotes = [
  "The world doesn't need heroes, it needs someone to pull the strings from the shadows.",
  "I am the one who lurks in the shadows to hunt the shadows.",
  "I seek neither power nor glory. I only seek to be the Eminence in Shadow.",
  "True power is not in the light, but in the darkness that swallows it.",
  "The hour of awakening is at hand.",
  "I am Atomic."
];

function ShadowWidget() {
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

      if (deleting) {
        setCurrentQuote(currentFullQuote.substring(0, charIdx - 1));
        charIndex.current = charIdx - 1;
      } else {
        setCurrentQuote(currentFullQuote.substring(0, charIdx + 1));
        charIndex.current = charIdx + 1;
      }

      let typeSpeed = deleting ? 20 : 50;
      if (!deleting) {
        typeSpeed += Math.random() * 20;
      }

      const newCharIdx = charIndex.current;
      if (!deleting && newCharIdx === currentFullQuote.length) {
        typeSpeed = 4000;
        isDeleting.current = true;
      } else if (deleting && newCharIdx === 0) {
        isDeleting.current = false;
        quoteIndex.current = (quoteIndex.current + 1) % quotes.length;
        typeSpeed = 500;
      }

      typeTimeout = setTimeout(startTyping, typeSpeed);
    };

    startTyping();
    return () => clearTimeout(typeTimeout);
  }, []);

  return (
    <InteractiveCard className="shadow-card min-h-[160px] flex flex-col justify-center text-left">
      <div
        className="shadow-bg absolute inset-0 bg-cover bg-center transition-all duration-500 z-0 brightness-[var(--shadow-brightness)] hover:brightness-[var(--shadow-brightness-hover)] scale-100 hover:scale-105 filter"
        style={{
          backgroundImage: 'url(/assets/images/shadow.webp)',
          backgroundPosition: 'center 55%',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-black/10 z-[1] dark:from-black/80 dark:via-black/50 dark:to-black/30 pointer-events-none" />
      
      <div className="shadow-content relative z-10 p-6 flex flex-col justify-center h-full">
        <div className="shadow-role flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-stone-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3" />
          </svg>
          <span className="font-['Cinzel'] font-bold text-[0.85rem] tracking-[2px] uppercase text-stone-900 dark:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
            Web Designer &amp; Developer
          </span>
        </div>
        <div className="shadow-quote font-['Playfair_Display'] italic text-[0.95rem] md:text-[1rem] leading-relaxed text-stone-900 dark:text-white border-l-[3px] border-stone-400 dark:border-white/20 pl-4 opacity-95 min-h-[4.5em] flex items-center select-none">
          <span>
            "{currentQuote}
            <span className="typewriter-cursor inline-block font-normal ml-0.5 animate-[pulse_1s_infinite] select-none">|</span>"
          </span>
        </div>
      </div>
    </InteractiveCard>
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
        label
          .split('')
          .map((letter, index) => {
            if (index < iterations) {
              return label[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iterations >= label.length) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }

      iterations += 1 / 3;
    }, 30);
  };

  const handleMouseLeave = () => {
    if (intervalId.current) clearInterval(intervalId.current);
    setText(label);
  };

  useEffect(() => {
    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
    };
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
      
      <span className="relative z-10 scale-110 group-hover:scale-120 group-hover:text-stone-955 dark:group-hover:text-white transition-all duration-250 text-[1.1rem]">
        {icon}
      </span>
      <span className="relative z-10 font-sans tracking-[1px] uppercase text-[0.8rem] font-medium group-hover:text-stone-955 dark:group-hover:text-white transition-colors duration-250">
        {text}
      </span>
    </a>
  );
}

// ========================================
// Social Connection Grid Widget Component
// ========================================
function SocialWidget() {
  return (
    <InteractiveCard className="social-card-container flex flex-col p-6 w-full text-left">
      <div className="social-header flex items-center gap-4 opacity-80 w-full mb-4">
        <span className="line flex-grow h-[1px] bg-gradient-to-r from-transparent via-stone-300 dark:via-white/20 to-transparent" />
        <span className="social-title font-sans text-[10px] tracking-[4px] uppercase text-stone-500 dark:text-stone-400 font-bold select-none">
          Connect
        </span>
        <span className="line flex-grow h-[1px] bg-gradient-to-r from-transparent via-stone-300 dark:via-white/20 to-transparent" />
      </div>

      <div className="social-grid grid grid-cols-2 gap-3 w-full">
        <ScrambleLink
          href="https://github.com/Camilo404"
          label="GitHub"
          title="GitHub"
          icon={
            <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          }
        />
        <ScrambleLink
          href="https://www.youtube.com/channel/UChzlaSE1adSPVGYBBOQ1ibg"
          label="YouTube"
          title="YouTube"
          icon={
            <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          }
        />
        <ScrambleLink
          href="https://www.instagram.com/camiloxtz/"
          label="Instagram"
          title="Instagram"
          icon={
            <svg className="h-4.5 w-4.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          }
        />
        <ScrambleLink
          href="https://steamcommunity.com/profiles/76561198832154348/"
          label="Steam"
          title="Steam"
          icon={
            <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.54 3.03 8.375 7.153 9.605l.937-2.612a2.385 2.385 0 0 1-.09-.597 2.395 2.395 0 1 1 4.79 0c0 .416-.107.807-.294 1.15l.904 2.523C18.847 20.672 22 16.71 22 12c0-5.523-4.477-10-10-10zm0 1.25c4.832 0 8.75 3.918 8.75 8.75 0 3.826-2.454 7.08-5.883 8.243l-.936-2.61a2.393 2.393 0 0 1 .069-.533 2.395 2.395 0 0 1-4.79 0c0-.184.02-.363.059-.536l-.968-2.702A4.79 4.79 0 0 0 12 3.25zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 1.25a2.75 2.75 0 1 1 0 5.5 2.75 2.75 0 0 1 0-5.5zm0 .75a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 .75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z" />
            </svg>
          }
        />
      </div>
    </InteractiveCard>
  );
}

// ========================================
// Tech Stack Infinite Marquee Slider
// ========================================
interface TechItem {
  name: string;
  color: string;
  icon: React.ReactNode;
}

function TechStackMarquee() {
  const techs: TechItem[] = [
    {
      name: 'React',
      color: '#61dafb',
      icon: (
        <svg className="w-7 h-7" viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor">
          <circle r="2.05" fill="currentColor"/>
          <g fill="none" stroke="currentColor" strokeWidth="1">
            <ellipse rx="11" ry="4.2"/>
            <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
            <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
          </g>
        </svg>
      )
    },
    {
      name: 'Angular',
      color: '#dd0031',
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 250 250" fill="currentColor">
          <polygon points="125,30 125,30 125,30 31.9,63.2 46.1,186.3 125,230 125,230 125,230 203.9,186.3 218.1,63.2" />
          <polygon fill="#FFFFFF" points="125,52.2 125,52.2 125,52.2 125,95.1 125,95.1 146.6,143.4 125,143.4" />
          <polygon fill="#FFFFFF" points="125,153.8 125,153.8 163.6,153.8 125,52.2" />
          <polygon fill="#B3B3B3" points="125,52.2 86.4,153.8 125,153.8 125,143.4 103.4,143.4 125,95.1" />
        </svg>
      )
    },
    {
      name: 'Bootstrap',
      color: '#7952b3',
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.76 13.06c0 .79-.31 1.43-.93 1.9-.62.48-1.49.72-2.61.72H9.06V6.36h3.11c1.01 0 1.8.21 2.37.64.57.43.86 1.02.86 1.77 0 .58-.17 1.07-.5 1.48-.33.4-.82.68-1.45.83v.1c.8.12 1.42.44 1.84.96.43.52.64 1.16.64 1.92zm-5.26-6.18V10.7h1.6c.45 0 .8-.1 1.05-.3.26-.2.38-.49.38-.86 0-.36-.12-.64-.37-.84-.24-.2-.59-.3-1.04-.3H10.5zm0 4.67v2.64h1.79c.47 0 .84-.11 1.1-.34.26-.23.4-.55.4-.97 0-.41-.13-.73-.39-.96-.26-.23-.63-.34-1.12-.34H10.5z" />
        </svg>
      )
    },
    {
      name: 'Python',
      color: '#3776ab',
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.93 2C6.39 2 6.55 4.39 6.55 4.39l.01 2.05h5.45v.77H6.56S4 6.84 4 12.07c0 5.24 2.23 5.09 2.23 5.09l1.32-.01v-1.87s-.06-2.22 2.18-2.22h5.45c2.24 0 2.08-2.12 2.08-2.12V5.72S17.56 2 11.93 2zm-2.2 1.47a.91.91 0 1 1 0 1.82.91.91 0 0 1 0-1.82zm4.34 16.03c5.54 0 5.38-2.39 5.38-2.39l-.01-2.05h-5.46v-.77h5.46s2.56.37 2.56-4.86c0-5.23-2.23-5.09-2.23-5.09l-1.32.01v1.87s.06 2.22-2.18 2.22h-5.45c-2.24 0-2.08 2.12-2.08 2.12v5.39S6.44 22 12.07 22zm2.2-1.47a.91.91 0 1 1 0-1.82.91.91 0 0 1 0 1.82z" />
        </svg>
      )
    },
    {
      name: 'JavaScript',
      color: '#f0db4f',
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 3h18v18H3V3zm12.54 13.064c-.11-.478-.445-.885-.826-1.127-.457-.282-1.026-.412-1.68-.412-.456 0-.853.076-1.114.217-.37.217-.61.5-.61.94 0 .43.239.73.71.93.38.163.953.282 1.625.385l.89.14c1.196.185 2.011.49 2.506.994.576.57.859 1.348.859 2.32 0 1.25-.49 2.222-1.446 2.87-1 .684-2.424 1.01-4.228 1.01-2.109 0-3.663-.6-4.522-1.74-.478-.63-.71-1.391-.77-2.315l3.19-.19c.07.61.321 1.05.69 1.33.472.35 1.25.5 2.18.5 1.15 0 1.837-.32 1.837-1.06 0-.3-.157-.55-.478-.71-.282-.14-.77-.25-1.353-.34l-1.065-.17c-1.358-.22-2.228-.54-2.734-1.033-.598-.59-.875-1.385-.875-2.358 0-1.22.46-2.15 1.348-2.74C10.15 10.22 11.45 9.9 12.98 9.9c1.69 0 3.016.4 3.864 1.2.73.68 1.092 1.58 1.114 2.56l-3.418.4zm-7.662-.163h3.532v9.645c0 1.24-.315 2.15-.968 2.69-.64.54-1.61.81-2.92.81-1.43 0-2.43-.37-2.94-1.1-.38-.54-.53-1.26-.53-2.12h3.31v.09c0 .41.09.7.27.87.19.17.5.25.96.25.43 0 .71-.12.87-.36.19-.24.27-.63.27-1.18V15.9zm0 0" />
        </svg>
      )
    },
    {
      name: 'TypeScript',
      color: '#3178c6',
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 3h18v18H3V3zm12.54 13.064c-.11-.478-.445-.885-.826-1.127-.457-.282-1.026-.412-1.68-.412-.456 0-.853.076-1.114.217-.37.217-.61.5-.61.94 0 .43.239.73.71.93.38.163.953.282 1.625.385l.89.14c1.196.185 2.011.49 2.506.994.576.57.859 1.348.859 2.32 0 1.25-.49 2.222-1.446 2.87-1 .684-2.424 1.01-4.228 1.01-2.109 0-3.663-.6-4.522-1.74-.478-.63-.71-1.391-.77-2.315l3.19-.19c.07.61.321 1.05.69 1.33.472.35 1.25.5 2.18.5 1.15 0 1.837-.32 1.837-1.06 0-.3-.157-.55-.478-.71-.282-.14-.77-.25-1.353-.34l-1.065-.17c-1.358-.22-2.228-.54-2.734-1.033-.598-.59-.875-1.385-.875-2.358 0-1.22.46-2.15 1.348-2.74C10.15 10.22 11.45 9.9 12.98 9.9c1.69 0 3.016.4 3.864 1.2.73.68 1.092 1.58 1.114 2.56l-3.418.4zm-7.662-.163h3.532v9.645c0 1.24-.315 2.15-.968 2.69-.64.54-1.61.81-2.92.81-1.43 0-2.43-.37-2.94-1.1-.38-.54-.53-1.26-.53-2.12h3.31v.09c0 .41.09.7.27.87.19.17.5.25.96.25.43 0 .71-.12.87-.36.19-.24.27-.63.27-1.18V15.9zm0 0" />
        </svg>
      )
    },
    {
      name: 'Sass',
      color: '#cc6699',
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.01 22c-5.52 0-9.99-4.48-9.99-10S6.49 2 12.01 2s10 4.48 10 10-4.48 10-10 10zm-1.87-8.08c-.7-.5-1.27-1.12-1.27-2.1 0-1.46 1.15-2.26 2.82-2.26 1.55 0 2.53.64 2.89 1.77l-1.74.5c-.18-.55-.61-.83-1.18-.83-.67 0-1.06.31-1.06.84 0 .42.34.69.96 1.09l1.19.78c1 .66 1.72 1.34 1.72 2.5 0 1.59-1.23 2.45-3.08 2.45-1.92 0-2.88-.82-3.23-2.09l1.79-.53c.2.64.67 1.03 1.4 1.03.79 0 1.21-.37 1.21-.92 0-.49-.3-.8-1.04-1.27l-1.61-1.18z" />
        </svg>
      )
    },
    {
      name: 'HTML5',
      color: '#e34f26',
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0zm10.5 17.8l3.7-1.2.4-4.4H8.3l-.2-2.4h8.2l.2-2.4H5.6l.6 7 5.8 2v1z" />
        </svg>
      )
    },
    {
      name: 'CSS3',
      color: '#264de4',
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0zm5.6 15.6l.4-4.4h6.4L13.7 9H6.7l.2-2.4h9.6l-.6 7H9.2l.2 2 4.4-1.4.3-3.2h2.5l-.6 6.8L12 19l-4.9-3.4z" />
        </svg>
      )
    },
    {
      name: 'Node.js',
      color: '#339933',
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7.75v11.5L12 25l10-5.75v-11.5L12 2zm-1.25 18.25L4.5 16.5v-7.5l6.25 3.75v7.5zm1.25-8.25L5.75 8.25 12 4.75l6.25 3.5L12 12zm7.5 4.5l-6.25 3.75v-7.5l6.25-3.75v7.5z" />
        </svg>
      )
    },
    {
      name: 'Git',
      color: '#f05032',
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.3 10.9L13.1.7C12.7.3 12 .3 11.6.7L8.7 3.6l3.3 3.3c.4-.1.8 0 1.1.3.4.4.4 1 0 1.4-.4.4-1 .4-1.4 0-.3-.3-.4-.7-.3-1.1l-3.3-3.3v7.4c.1.3.3.6.6.7.4.4.4 1 0 1.4-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4.3-.3.6-.4.9-.3V7.2c-.3-.1-.6-.3-.9-.6L5 9.4c-.4.4-.4 1.1 0 1.5l10.2 10.2c.4.4 1.1.4 1.5 0l6.6-6.6c.4-.4.4-1.2 0-1.6z" />
        </svg>
      )
    },
    {
      name: 'Docker',
      color: '#2496ed',
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.983 11.078h2.119c.102 0 .186-.083.186-.185V8.99c0-.101-.084-.186-.186-.186h-2.119c-.103 0-.186.085-.186.186v1.903c0 .102.083.185.186.185zM11.261 11.078h2.119c.102 0 .185-.083.185-.185V8.99c0-.101-.083-.186-.185-.186h-2.119c-.101 0-.186.085-.186.186v1.903c0 .102.085.185.186.185zM8.539 11.078h2.12c.101 0 .185-.083.185-.185V8.99c0-.101-.084-.186-.185-.186h-2.12c-.102 0-.186.085-.186.186v1.903c0 .102.084.185.186.185zM5.817 11.078h2.118c.102 0 .187-.083.187-.185V8.99c0-.101-.085-.186-.187-.186H5.817c-.101 0-.185.085-.185.186v1.903c0 .102.084.185.185.185zM11.261 8.214h2.119c.102 0 .185-.083.185-.185V6.126c0-.101-.083-.186-.185-.186h-2.119c-.101 0-.186.085-.186.186V8.03c0 .101.085.184.186.184zM8.539 8.214h2.12c.101 0 .185-.083.185-.185V6.126c0-.101-.084-.186-.185-.186h-2.12c-.102 0-.186.085-.186.186V8.03c0 .101.084.184.186.184zM5.817 8.214h2.118c.102 0 .187-.083.187-.185V6.126c0-.101-.085-.186-.187-.186H5.817c-.101 0-.185.085-.185.186V8.03c0 .101.084.184.185.184zM8.539 5.352h2.12c.101 0 .185-.083.185-.186V3.264c0-.101-.084-.186-.185-.186h-2.12c-.102 0-.186.085-.186.186V5.16c0 .103.084.186.186.186zM23.99 11.28c-.5-.544-1.246-.838-2.03-.838H19.43v2.852h1.614c.264 0 .524-.047.772-.14.254-.096.485-.24.685-.43a2.53 2.53 0 0 0 .61-.926c.15-.373.226-.773.226-1.188c0-.126-.013-.25-.037-.369l-.31.04zm-.507-.367c.007.037.01.077.01.116c0 .546-.101 1.071-.295 1.558a3.52 3.52 0 0 1-.82 1.258c-.287.27-.619.48-1 .62c-.378.143-.775.215-1.185.215h-1.687V17.5h-1.109v-7.262H12.98v1.905c0 .101-.083.185-.185.185H10.68v-1.9c0-.103-.083-.186-.185-.186H5.568v1.9c0 .102-.083.185-.185.185H2.404v-1.9c0-.103-.083-.186-.186-.186H.1h-.1c0 2.23.61 4.12 1.9 5.762C3.12 19.34 4.887 20.5 7.46 20.5c5.3 0 9.75-3.8 11.56-8.835a7.3 7.3 0 0 0 3.73-1.026c.39-.234.737-.532 1.028-.887l-.3-.04z" />
        </svg>
      )
    }
  ];

  const repeatedTechs = [...techs, ...techs, ...techs];

  return (
    <InteractiveCard className="tech-stack-card flex items-center w-full min-h-[70px] py-3.5">
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        .marquee-track {
          display: flex;
          gap: 3rem;
          width: max-content;
          animation: marqueeScroll 20s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] z-10">
        <div className="marquee-track">
          {repeatedTechs.map((tech, index) => (
            <div
              key={index}
              className="tech-item flex justify-center items-center select-none"
              title={tech.name}
            >
              <span
                style={{ color: tech.color } as React.CSSProperties}
                className="grayscale-[100%] opacity-60 brightness-[0.7] dark:brightness-[0.7] hover:grayscale-0 hover:opacity-100 hover:brightness-[1.2] hover:scale-120 hover:drop-shadow-[0_0_8px_currentColor] transition-all duration-300 transform cursor-pointer"
              >
                {tech.icon}
              </span>
            </div>
          ))}
        </div>
      </div>
    </InteractiveCard>
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
  };
  discordData: DiscordData | null;
  lanyardData: LanyardPresence | null;
}

interface DiscordData {
  user?: {
    global_name?: string;
    username?: string;
    avatar_decoration_data?: { asset?: string };
    avatar?: string;
    collectibles?: { nameplate?: { asset?: string } };
  };
  user_profile?: {
    pronouns?: string;
    bio?: string;
    theme_colors?: number[];
  };
  badges?: Array<{
    id: string;
    icon: string;
    description: string;
    link?: string;
  }>;
  connected_accounts?: Array<{
    type: string;
    name: string;
  }>;
}

interface LanyardPresence {
  discord_status?: 'online' | 'idle' | 'dnd' | 'offline';
  active_on_discord_desktop?: boolean;
  active_on_discord_web?: boolean;
  active_on_discord_mobile?: boolean;
  activities?: Array<{
    name: string;
    state?: string;
    emoji?: { id?: string, name?: string, animated?: boolean };
  }>;
}

const statusColors: Record<string, string> = {
  online: "#43b581",
  idle: "#faa61a",
  dnd: "#f04747",
  streaming: "#593695",
  offline: "#747f8d"
};

function DiscordProfileCard({ user, discordData, lanyardData }: DiscordProfileCardProps) {
  const [message, setMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(`https://discord.com/users/201796217292718080`, '_blank');
    setMessage('');
  };

  const status = lanyardData?.discord_status || 'offline';
  const statusColor = statusColors[status] || statusColors.offline;
  
  // Custom status
  const customStatusActivity = lanyardData?.activities?.find(act => act.name === 'Custom Status');
  
  // Theme color from profile
  const themeColors = discordData?.user_profile?.theme_colors || [];
  const primaryAccent = themeColors.length > 0 
    ? '#' + themeColors[0].toString(16).padStart(6, '0').toUpperCase()
    : '#950000';

  const fallbackConnections = [
    { type: "github", name: "Camilo404" },
    { type: "leagueoflegends", name: "Camilo404" },
    { type: "spotify", name: "spotify" },
    { type: "steam", name: "Camilo404" },
    { type: "xbox", name: "Camilo404" }
  ];

  const connections = discordData?.connected_accounts && discordData.connected_accounts.length > 0
    ? discordData.connected_accounts
    : fallbackConnections;

  const fallbackBadges = [
    { id: "partner", icon: "partner", description: "Partnered Server Owner" },
    { id: "early_supporter", icon: "early_supporter", description: "Early Supporter" },
    { id: "active_developer", icon: "active_developer", description: "Active Developer" }
  ];

  const badges = discordData?.badges && discordData.badges.length > 0
    ? discordData.badges
    : fallbackBadges;

  const displayName = discordData?.user?.global_name || discordData?.user?.username || user.username || "404";
  const userTag = discordData?.user?.username || user.username || "camilo404";
  const bio = discordData?.user_profile?.bio || "Welcome to my digital profile! I customize creative styles, layouts, and interactive media arrays. Seeking to pull the strings from the shadows.";
  const pronouns = discordData?.user_profile?.pronouns || "they/them";

  return (
    <InteractiveCard isProfile={true} className="text-left w-[400px]">
      <style>{`
        .aesthetic-card {
          --accent-color: ${primaryAccent};
        }
      `}</style>

      {/* Cover Image */}
      <div
        className="card-cover h-[160px] bg-cover bg-center relative"
        style={{
          backgroundImage: `url(https://camilo404.azurewebsites.net/v1/banner/201796217292718080)`,
        }}
      >
        <div className="cover-overlay absolute inset-0 bg-gradient-to-b from-transparent via-[#ffffff]/20 to-[#ffffff] dark:via-black/20 dark:to-[#0D0D0D]"></div>
      </div>

      <div className="card-content relative z-10 px-6 pb-6 mt-[-60px]">
        {/* Profile Header */}
        <div className="header-section flex flex-col gap-4 mb-6">
          <div className="avatar-wrapper flex items-end justify-between relative">
            <div className="avatar-container relative h-[100px] w-[100px] rounded-full bg-[#1e1e1e]">
              {discordData?.user?.avatar_decoration_data?.asset && (
                <img
                  src={`https://cdn.discordapp.com/avatar-decoration-presets/${discordData.user.avatar_decoration_data.asset}.png`}
                  alt="Avatar Decoration"
                  className="avatar-decoration absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
                />
              )}
              <img
                class="avatar-img w-full h-full rounded-full border-4 border-stone-200 dark:border-[#050505] relative z-10"
                src={`https://camilo404.azurewebsites.net/v1/avatar/201796217292718080`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/assets/images/no-image-found.jpg";
                }}
                alt="Avatar"
              />
            </div>

            {/* Status Badge */}
            <div className="status-badge flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-sm border border-stone-300/30 dark:border-white/10 select-none z-10" style={{ background: "rgba(0, 0, 0, 0.45)", backdropFilter: "blur(8px)" }}>
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: statusColor, boxShadow: `0 0 8px ${statusColor}` }} />
              <span className="uppercase text-[9px] tracking-wider font-mono">{status}</span>
            </div>
          </div>

          <div className="user-info space-y-1">
            <div className="name-row flex items-center gap-2">
              <h1 className="display-name text-2xl font-bold tracking-tight text-stone-900 dark:text-white leading-none">
                {displayName}
              </h1>
              <div className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-white shadow-[0_0_8px_rgba(239,68,68,0.4)] flex-shrink-0">
                <svg className="h-3 w-3 stroke-[4px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
            <div className="username-row flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 font-medium">
              <span className="username">@{userTag}</span>
              <span className="divider opacity-50">•</span>
              <span className="pronouns text-red-500/80 dark:text-red-400/80 font-bold">{pronouns}</span>

              {/* Platform indicators */}
              <div className="platform-indicators flex items-center gap-1.5 ml-2">
                {lanyardData?.active_on_discord_desktop && (
                  <i className="platform-icon text-[#d3f258] opacity-75 hover:opacity-100 transition-opacity" title="Desktop">
                    <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                      <path d="M4 2.5c-1.103 0-2 .897-2 2v11c0 1.104.897 2 2 2h7v2H7v2h10v-2h-4v-2h7c1.103 0 2-.896 2-2v-11c0-1.103-.897-2-2-2H4Zm16 2v9H4v-9h16Z" />
                    </svg>
                  </i>
                )}
                {lanyardData?.active_on_discord_web && (
                  <i className="platform-icon text-[#00A8FC] opacity-75 hover:opacity-100 transition-opacity" title="Web">
                    <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93Zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39Z" />
                    </svg>
                  </i>
                )}
                {lanyardData?.active_on_discord_mobile && (
                  <i className="platform-icon text-[#3BA55D] opacity-75 hover:opacity-100 transition-opacity" title="Mobile">
                    <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                      <path d="M15.5 1h-8A2.5 2.5 0 0 0 5 3.5v17A2.5 2.5 0 0 0 7.5 23h8a2.5 2.5 0 0 0 2.5-2.5v-17A2.5 2.5 0 0 0 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z" />
                    </svg>
                  </i>
                )}
              </div>
            </div>

            {/* Badges */}
            <div className="badges-list flex flex-wrap gap-1.5 pt-2">
              {badges.map((badge, idx) => (
                <a
                  key={idx}
                  href={badge.link || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="badge-item h-[22px] w-[22px] hover:scale-115 transition-transform duration-200"
                  title={badge.description}
                >
                  <img
                    src={`/assets/images/badges/${badge.icon}.svg`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://camilo404.azurewebsites.net/v1/badge/${badge.icon}.png`;
                    }}
                    alt={badge.id}
                    className="h-full w-full object-contain"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="scrollable-content flex flex-col gap-5 pt-4 border-t border-stone-250/20 dark:border-white/5">
          {/* Custom Status */}
          {customStatusActivity && customStatusActivity.state && (
            <div className="custom-status-card flex items-center gap-2.5 bg-stone-100/50 dark:bg-black/25 border border-stone-250/20 dark:border-white/5 px-3.5 py-2.5 rounded-xl text-xs text-stone-750 dark:text-stone-300">
              {customStatusActivity.emoji && (
                customStatusActivity.emoji.id ? (
                  <img
                    src={`https://cdn.discordapp.com/emojis/${customStatusActivity.emoji.id}.${customStatusActivity.emoji.animated ? 'gif' : 'png'}?size=24&quality=lossless`}
                    alt="Status Emoji"
                    className="status-emoji h-5 w-5"
                  />
                ) : (
                  <span className="status-emoji-text text-base select-none">{customStatusActivity.emoji.name}</span>
                )
              )}
              <span className="status-text italic font-medium">{customStatusActivity.state}</span>
            </div>
          )}

          {/* Bio */}
          <section className="section bio-section">
            <h3 className="section-title text-[10px] font-bold text-stone-400 dark:text-stone-400 uppercase tracking-widest mb-2.5">About Me</h3>
            <p className="markdown-content text-xs text-stone-600 dark:text-stone-350 leading-relaxed font-medium">
              {bio}
            </p>
          </section>

          {/* Connections */}
          <section className="section connections-section">
            <h3 className="section-title text-[10px] font-bold text-stone-400 dark:text-stone-400 uppercase tracking-widest mb-2.5">Connections</h3>
            <div className="connections-grid flex flex-wrap gap-2">
              {connections.map((account, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="connection-item flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-250/30 hover:border-stone-400/40 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10 transition-all duration-200 hover:-translate-y-0.5"
                  title={`${account.name} (${account.type})`}
                >
                  <img
                    src={`/assets/images/connections/${account.type.toLowerCase()}.svg`}
                    alt={account.type}
                    className="h-5 w-5 opacity-80 hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/assets/images/no-image-found.jpg";
                    }}
                  />
                </a>
              ))}
            </div>
          </section>

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
  };
}

export default function ClientProfile({ user }: ClientProfileProps) {
  const [entered, setEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Dynamic Discord/Lanyard States
  const [discordData, setDiscordData] = useState<DiscordData | null>(null);
  const [lanyardData, setLanyardData] = useState<LanyardPresence | null>(null);

  // Initialize mounting state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize dynamic fetches
  useEffect(() => {
    const fetchDiscord = async () => {
      try {
        const res = await fetch("https://camilo404.azurewebsites.net/v1/user/201796217292718080");
        if (res.ok) {
          const data = await res.json();
          setDiscordData(data);
        }
      } catch (e) {
        console.error("Failed to fetch Discord proxy:", e);
      }
    };

    const fetchLanyard = async () => {
      try {
        const res = await fetch("https://api.lanyard.rest/v1/users/201796217292718080");
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setLanyardData(json.data);
          }
        }
      } catch (e) {
        console.error("Failed to fetch Lanyard data:", e);
      }
    };

    fetchDiscord();
    fetchLanyard();

    // Lanyard WS stream
    const ws = new WebSocket("wss://api.lanyard.rest/socket");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.op === 1) {
          ws.send(JSON.stringify({
            op: 2,
            d: {
              subscribe_to_id: "201796217292718080"
            }
          }));
        } else if (data.t === "PRESENCE_UPDATE") {
          setLanyardData(data.d);
        }
      } catch (err) {
        console.error("Lanyard socket error:", err);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
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
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error(err));
    }
  };

  const toggleTheme = () => {
    const currentTheme = theme === "system" ? "dark" : theme;
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    const doc = document as any;
    
    if (!doc.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    doc.startViewTransition(() => {
      if (nextTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      setTheme(nextTheme);
    });
  };

  return (
    <div className="relative min-h-screen bg-[#F5F5F5] dark:bg-[#050505] text-stone-900 dark:text-[#F5F1E8] font-sans flex items-center justify-center overflow-x-hidden transition-colors duration-500 z-10">
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
          --shadow-overlay: linear-gradient(to right,
              rgba(255, 255, 255, 0.5) 0%,
              rgba(255, 255, 255, 0.2) 50%,
              rgba(255, 255, 255, 0.1) 100%);
        }

        .dark {
          --bg-primary: #050505;
          --bg-secondary: #0D0D0D;
          --bg-card: rgba(13, 13, 13, 0.6);
          --bg-card-hover: rgba(149, 0, 0, 0.08);
          --bg-card-solid: #0D0D0D;
          --bg-glass: rgba(13, 13, 13, 0.5);
          --bg-glass-strong: rgba(13, 13, 13, 0.85);
          --bg-overlay: rgba(0, 0, 0, 0.7);
          --bg-input: rgba(0, 0, 0, 0.3);
          --bg-input-focus: rgba(0, 0, 0, 0.5);
          --text-primary: #ffffff;
          --text-secondary: rgba(245, 241, 232, 0.7);
          --text-muted: rgba(245, 241, 232, 0.4);
          --text-inverse: #0D0D0D;
          --text-on-image: #ffffff;
          --border-primary: rgba(255, 255, 255, 0.08);
          --border-hover: rgba(149, 0, 0, 0.3);
          --border-glass: rgba(255, 255, 255, 0.1);
          --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
          --shadow-md: 0 4px 24px rgba(0, 0, 0, 0.4);
          --shadow-lg: 0 20px 40px rgba(0, 0, 0, 0.4);
          --shadow-card: 0 4px 24px -1px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
          --shadow-card-hover: 0 20px 40px -5px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(149, 0, 0, 0.15) inset;
          --accent-glow: rgba(149, 0, 0, 0.2);
          --mouse-glow: rgba(149, 0, 0, 0.08);
          --status-badge-bg: rgba(0, 0, 0, 0.3);
          --connection-item-bg: rgba(255, 255, 255, 0.05);
          --connection-item-bg-hover: rgba(255, 255, 255, 0.1);
          --shadow-brightness: 0.6;
          --shadow-brightness-hover: 0.8;
          --shadow-overlay: linear-gradient(to right,
              var(--bg-overlay) 0%,
              rgba(0, 0, 0, 0.6) 50%,
              rgba(0, 0, 0, 0.4) 100%);
        }

        .widget-card {
          position: relative;
          width: 100%;
          transform-style: preserve-3d;
          background: var(--bg-card);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
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
          background: radial-gradient(800px circle at var(--mouse-x, -50%) var(--mouse-y, -50%),
              var(--mouse-glow),
              transparent 40%);
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

        .widget-card:hover::before {
          opacity: 1;
        }

        .aesthetic-card {
          position: relative;
          width: 400px;
          background: var(--bg-card-solid);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--border-primary);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: var(--shadow-lg), 0 0 0 1px var(--border-primary) inset;
          color: var(--text-primary);
          transform-style: preserve-3d;
          transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease, border-color 0.4s ease;
        }

        .aesthetic-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top right, var(--accent-color), transparent 70%);
          opacity: 0.15;
          pointer-events: none;
          z-index: 0;
        }

        .aesthetic-card:hover {
          transform: translateY(-4px) scale(1.005);
          box-shadow: var(--shadow-card-hover);
          border-color: var(--border-hover);
        }
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

      {/* FLOATING CONTROLS (Unified theme switcher & audio controls) */}
      {mounted && (
        <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/40 dark:bg-black/40 border border-stone-200/50 dark:border-white/5 hover:bg-stone-200/40 dark:hover:bg-white/[0.06] text-amber-500 dark:text-indigo-400 transition-all duration-300 shadow-sm cursor-pointer select-none"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          {/* Audio controls (visible only if entered) */}
          <AnimatePresence>
            {entered && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 bg-white/40 dark:bg-black/40 border border-stone-200/50 dark:border-white/5 p-2 rounded-2xl backdrop-blur-md select-none"
              >
                <button
                  onClick={togglePlayback}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] text-red-400 hover:text-red-300 transition-all duration-200"
                >
                  {isPlaying ? <Volume2 className="h-4.5 w-4.5" /> : <VolumeX className="h-4.5 w-4.5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-16 h-1 bg-black/10 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-red-500"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* INTRO SCREEN (TAP TO ENTER GATES) */}
        {!entered ? (
          <motion.div
            key="intro-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.08 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            onClick={handleEnterChamber}
            className="absolute inset-0 z-40 bg-[#F5F5F5] dark:bg-[#050505] flex flex-col items-center justify-center cursor-pointer p-6 transition-colors duration-500 select-none z-30"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-[100px] animate-pulse" />
            </div>

            <div className="relative z-10 text-center space-y-8 flex flex-col items-center">
              
              {/* Pulsating Chamber Logo */}
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  borderColor: ["rgba(239,68,68,0.2)", "rgba(239,68,68,0.5)", "rgba(239,68,68,0.2)"]
                }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-24 w-24 items-center justify-center rounded-full border border-red-500/20 bg-[#0A0303] shadow-[0_0_40px_rgba(239,68,68,0.1)] relative"
              >
                <Disc3 className="h-10 w-10 text-red-500 animate-spin" style={{ animationDuration: "8s" }} />
                
                {/* Tech rings decoration */}
                <div className="absolute -inset-2 rounded-full border border-dashed border-red-500/5 animate-spin" style={{ animationDuration: "12s" }} />
              </motion.div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">
                  Chamber Security Active
                </p>
                <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-stone-900 dark:text-white">
                  Unlock @{discordData?.user?.username || user.username}
                </h1>
                <p className="text-xs text-stone-600 dark:text-[#8C8C8C] max-w-[280px] leading-relaxed mx-auto">
                  Tapping the chamber de-crypts visual styles and streams background wave frequencies.
                </p>
              </div>

              {/* Enter Trigger indicator */}
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center gap-2 rounded-full border border-red-500/20 dark:border-red-500/10 bg-red-500/5 px-6 py-2.5"
              >
                <LockOpen className="h-3.5 w-3.5 text-red-450 dark:text-red-400" />
                <span className="text-[10px] uppercase font-bold tracking-[0.18em] text-red-500 dark:text-red-400">
                  Tap to Decipher
                </span>
              </motion.div>

            </div>
          </motion.div>
        ) : (
          /* BENTO GRID DETAILS INTERFACE */
          <motion.div
            key="bento-grid"
            initial={{ opacity: 0, y: 35, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 120, delay: 0.15 }}
            className="w-full max-w-5xl relative z-10 px-4 py-20 flex flex-col items-center z-20"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[auto_minmax(400px,480px)] gap-[0.9rem] justify-center items-start w-full">
              {/* Left Column: Discord Profile Card */}
              <div className="flex justify-center w-full">
                <DiscordProfileCard user={user} discordData={discordData} lanyardData={lanyardData} />
              </div>

              {/* Right Column: Stacked Bento Widgets */}
              <div className="flex flex-col gap-[0.9rem] w-full max-w-[480px] mx-auto lg:mx-0">
                <ClockWidget />
                <ShadowWidget />
                <SocialWidget />
                <TechStackMarquee />
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

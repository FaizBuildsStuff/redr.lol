"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  const [username, setUsername] = useState("");
const [isLoggedIn, setIsLoggedIn] = useState(false);

React.useEffect(() => {

  const checkAuth = async () => {
    try {

      const res = await fetch("/api/auth/me");

      const data = await res.json();

      if (data?.user) {

        setIsLoggedIn(true);

        setUsername(
          data.user.username || ""
        );

      } else {

        setIsLoggedIn(false);

      }

    } catch (error) {

      console.error(error);

      setIsLoggedIn(false);

    }
  };

  checkAuth();

}, []);
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-[#F5F1E8]">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base */}
        <div className="absolute inset-0 bg-[#0A0A0A]" />

        {/* Huge Center Glow */}
        <div className="absolute left-1/2 top-1/2 h-[950px] w-[950px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-[190px]" />

        {/* Massive Floating Blurs */}
        <motion.div
          animate={{
            y: [0, -40, 0],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[5%] top-[8%] h-[380px] w-[380px] rounded-full bg-red-500/10 blur-[120px]"
        />

        <motion.div
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[5%] right-[5%] h-[420px] w-[420px] rounded-full bg-red-700/10 blur-[140px]"
        />

        {/* Floating Tiny Stars */}
        {[...Array(35)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0.2, 1, 0.2],
              y: [0, -12, 0],
            }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Infinity,
            }}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            <div className="h-[2px] w-[2px] rounded-full bg-red-300 blur-[1px]" />
          </motion.div>
        ))}

        {/* Large Doodle Circle */}
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[8%] top-[18%] hidden xl:block"
        >
          <svg
            width="240"
            height="240"
            viewBox="0 0 240 240"
            fill="none"
            className="opacity-[0.14]"
          >
            <path
              d="M50 120C50 60 190 60 190 120C190 180 50 180 50 120Z"
              stroke="#ef4444"
              strokeWidth="4"
              strokeDasharray="10 12"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        {/* Arrow Doodle */}
        <motion.div
          animate={{
            y: [0, -18, 0],
            rotate: [0, 8, -8, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[10%] top-[16%] hidden xl:block"
        >
          <svg
            width="220"
            height="220"
            viewBox="0 0 220 220"
            fill="none"
            className="opacity-[0.12]"
          >
            <path
              d="M40 120C90 20 180 70 130 180"
              stroke="#ef4444"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="12 12"
            />

            <path
              d="M115 160L130 180L155 168"
              stroke="#ef4444"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        {/* Mesh Gradient */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
        radial-gradient(circle at top left, rgba(239,68,68,0.14), transparent 25%),
        radial-gradient(circle at bottom right, rgba(220,38,38,0.12), transparent 30%)
      `,
          }}
        />

        {/* Elegant Grid */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
              backgroundSize: "90px 90px",
            }}
          />
        </div>

        {/* Noise */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "url('https://grainy-gradients.vercel.app/noise.svg')",
            }}
          />
        </div>

        {/* Vertical Beam */}
        <motion.div
          animate={{
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
          }}
          className="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 bg-red-500/20 blur-sm"
        />
      </div>

      {/* Floating Doodles */}

      {/* Left Large Scribble */}
      <motion.div
        animate={{
          y: [0, -18, 0],
          rotate: [0, 4, -4, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[5%] top-[14%] hidden lg:block"
      >
        <svg
          width="220"
          height="220"
          viewBox="0 0 220 220"
          fill="none"
          className="opacity-70"
        >
          <path
            d="M40 110C40 50 180 50 180 110C180 170 40 170 40 110Z"
            stroke="#ef4444"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="12 12"
          />

          <path
            d="M60 70C80 50 140 50 160 70"
            stroke="#ef4444"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Right Arrow Doodle */}
      <motion.div
        animate={{
          y: [0, -12, 0],
          rotate: [0, 8, -8, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[7%] top-[20%] hidden lg:block"
      >
        <svg
          width="180"
          height="180"
          viewBox="0 0 180 180"
          fill="none"
          className="opacity-60"
        >
          <path
            d="M30 90C80 10 150 50 110 150"
            stroke="#dc2626"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="10 10"
          />

          <path
            d="M95 135L110 150L128 140"
            stroke="#dc2626"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Top Mini Doodle */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 6, -6, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
        }}
        className="absolute right-[20%] top-[12%] hidden lg:block"
      >
        <svg
          width="90"
          height="90"
          viewBox="0 0 100 100"
          fill="none"
          className="opacity-50"
        >
          <path
            d="M20 50C20 35 35 20 50 20C65 20 80 35 80 50C80 65 65 80 50 80"
            stroke="#ef4444"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="8 10"
          />
        </svg>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-28 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 rounded-full border border-red-500/20 bg-red-500/10 px-5 py-2 backdrop-blur-xl"
        >
          <span className="text-sm font-medium tracking-wide text-red-200">
            expressive profiles for the modern internet
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative mx-auto max-w-6xl text-center text-[3.7rem] font-medium leading-[0.84] tracking-[-0.11em] text-[#F5F1E8] sm:text-[5rem] md:text-[7rem]"
        >
          <span className="relative inline-block">
            <span className="inline-block pr-2">b</span>
            <span className="inline-block pr-2">u</span>
            <span className="inline-block pr-2">i</span>
            <span className="inline-block pr-2">l</span>
            <span className="inline-block">d</span>

            <span className="mx-5" />

            <span className="inline-block pr-2">y</span>
            <span className="inline-block pr-2">o</span>
            <span className="inline-block pr-2">u</span>
            <span className="inline-block">r</span>
          </span>

          <br />

          <span className="relative inline-block text-white">
            <span className="inline-block pr-2">i</span>
            <span className="inline-block pr-2">n</span>
            <span className="inline-block pr-2">t</span>
            <span className="inline-block pr-2">e</span>
            <span className="inline-block pr-2">r</span>
            <span className="inline-block pr-2">n</span>
            <span className="inline-block pr-2">e</span>
            <span className="inline-block">t</span>
          </span>

          <br />

          <span className="relative inline-block text-red-500">
            <span className="inline-block pr-2">i</span>
            <span className="inline-block pr-2">d</span>
            <span className="inline-block pr-2">e</span>
            <span className="inline-block pr-2">n</span>
            <span className="inline-block pr-2">t</span>
            <span className="inline-block pr-2">i</span>
            <span className="inline-block pr-2">t</span>
            <span className="inline-block">y</span>

            {/* Hand Drawn Underline */}
            <svg
              className="absolute -bottom-7 left-0 w-full"
              viewBox="0 0 400 40"
              fill="none"
            >
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 2,
                  delay: 0.4,
                }}
                d="M5 25C80 5 180 38 395 18"
                stroke="#ef4444"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            delay: 0.15,
          }}
          className="mt-14 max-w-2xl text-[15px] leading-[1.9] tracking-[0.03em] text-[#A1A1A1] sm:text-lg"
        >
          Create beautifully crafted profile pages with custom themes, smooth
          animations, social links, music, and complete creative freedom —
          designed to make your internet presence unforgettable.
        </motion.p>

        {/* Buttons */}
<motion.div
  initial={{ opacity: 0, y: 25 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    duration: 1,
    delay: 0.25,
  }}
  className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
>

  {/* MAIN BUTTON */}
  <Link href={isLoggedIn ? "/dashboard" : "/signup"}>
    <button className="group relative flex h-14 items-center justify-center overflow-hidden rounded-2xl bg-red-600 px-8 text-sm font-medium text-white transition-all duration-500 hover:-translate-y-[2px] hover:bg-red-500 hover:shadow-[0_0_40px_rgba(239,68,68,0.35)]">

      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-400 to-red-700 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Shine */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute left-[-120%] top-0 h-full w-[60%] rotate-[20deg] bg-white/20 blur-xl transition-all duration-1000 group-hover:left-[140%]" />
      </div>

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2 tracking-[0.04em]">

        {isLoggedIn
          ? "View dashboard"
          : "Create your profile"}

        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />

      </span>

    </button>
  </Link>

  {/* SECONDARY BUTTON */}
  <Link href="/explore">
    <button
      className="
      rounded-2xl
      border
      border-white/10
      bg-white/[0.03]
      px-8
      py-4
      text-sm
      font-medium
      text-[#d8d8d8]
      backdrop-blur-xl
      transition-all
      duration-300
      hover:border-red-500/20
      hover:bg-red-500/10
      hover:text-white
    "
    >
      explore profiles
    </button>
  </Link>

</motion.div>
      </div>
    </section>
  );
};

export default Hero;

"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="relative overflow-hidden bg-[#050505] px-6 pb-24 text-[#F5F1E8]">
      {/* HANDDRAWN BACKGROUND ELEMENTS */}

      {/* Large Rose Scribble */}
      <motion.div
        animate={{
          rotate: [0, 8, -8, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[-60px] top-[-40px] opacity-[0.07]"
      >
        <svg width="320" height="320" viewBox="0 0 320 320" fill="none">
          <path
            d="M80 160C80 90 240 90 240 160C240 230 80 230 80 160Z"
            stroke="#ef4444"
            strokeWidth="5"
            strokeDasharray="14 14"
            strokeLinecap="round"
          />

          <path
            d="M110 130C130 110 190 110 210 130"
            stroke="#ef4444"
            strokeWidth="5"
            strokeLinecap="round"
          />

          <path
            d="M120 170C145 200 175 200 200 170"
            stroke="#ef4444"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Handdrawn Arrow */}
      <motion.div
        animate={{
          y: [0, -18, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[6%] top-[10%] hidden xl:block opacity-[0.08]"
      >
        <svg width="220" height="220" viewBox="0 0 220 220" fill="none">
          <path
            d="M40 120C90 30 190 70 140 180"
            stroke="#ef4444"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="12 14"
          />

          <path
            d="M125 155L140 180L168 165"
            stroke="#ef4444"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Floating Handdrawn Stars */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -12, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.04, 0.1, 0.04],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute hidden lg:block"
          style={{
            top: `${8 + i * 7}%`,
            left: `${5 + i * 8}%`,
          }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M14 2L16 11L26 14L16 17L14 26L12 17L2 14L12 11L14 2Z"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      ))}

      {/* Floating Doodle Circles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            rotate: [0, 12, -12, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 7 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute hidden xl:block opacity-[0.05]"
          style={{
            bottom: `${5 + i * 8}%`,
            right: `${5 + i * 9}%`,
          }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <path
              d="M10 30C10 15 50 15 50 30C50 45 10 45 10 30Z"
              stroke="#ef4444"
              strokeWidth="3"
              strokeDasharray="8 10"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      ))}

      {/* Giant Background Rose Blur */}
      <motion.div
        animate={{
          scale: [1, 1.06, 1],
          rotate: [0, 4, -4, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-[160px]"
      />

      {/* Animated Handdrawn Wave */}
      <motion.div
        animate={{
          x: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[10%] left-[10%] hidden xl:block opacity-[0.06]"
      >
        <svg width="320" height="120" viewBox="0 0 320 120" fill="none">
          <path
            d="M10 60C40 20 80 100 120 60C160 20 200 100 240 60C270 30 290 40 310 60"
            stroke="#ef4444"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="10 12"
          />
        </svg>
      </motion.div>

      {/* Tiny Floating Particles */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [0.2, 1, 0.2],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3 + i * 0.2,
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

      <div className="mx-auto max-w-7xl">
        {/* Card */}
        <div className="group relative overflow-hidden rounded-[42px] border border-white/10 bg-gradient-to-br from-[#160909] via-[#120808] to-[#070707] p-[1px]">
          {/* Animated Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-transparent to-transparent opacity-70" />

          {/* Inner */}
          <div className="relative overflow-hidden rounded-[42px] bg-[#0A0606]/95 px-7 py-14 sm:px-12 sm:py-16">
            {/* Massive Glow */}
            <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-[140px]" />

            {/* Rose Shapes */}

            {/* Top Left */}
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                y: [0, -12, 0],
              }}
              transition={{
                duration: 14,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-[-20px] top-[-20px] opacity-[0.08]"
            >
              <svg width="220" height="220" viewBox="0 0 220 220" fill="none">
                <path
                  d="M50 110C50 60 170 60 170 110C170 160 50 160 50 110Z"
                  stroke="#ef4444"
                  strokeWidth="5"
                  strokeDasharray="12 12"
                  strokeLinecap="round"
                />

                <path
                  d="M80 80C95 65 125 65 140 80"
                  stroke="#ef4444"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>

            {/* Bottom Right */}
            <motion.div
              animate={{
                rotate: [0, -12, 12, 0],
                y: [0, 10, 0],
              }}
              transition={{
                duration: 16,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-[-30px] right-[-20px] opacity-[0.08]"
            >
              <svg width="240" height="240" viewBox="0 0 240 240" fill="none">
                <path
                  d="M60 120C60 60 180 60 180 120C180 180 60 180 60 120Z"
                  stroke="#ef4444"
                  strokeWidth="5"
                  strokeDasharray="12 12"
                  strokeLinecap="round"
                />

                <path
                  d="M90 90C105 75 135 75 150 90"
                  stroke="#ef4444"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>

            {/* Floating Mini Roses */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 8, -8, 0],
                }}
                transition={{
                  duration: 5 + i,
                  repeat: Infinity,
                }}
                className="absolute opacity-[0.05]"
                style={{
                  top: `${10 + i * 10}%`,
                  left: `${5 + i * 11}%`,
                }}
              >
                <div className="h-10 w-10 rounded-full border border-red-500/20" />
              </motion.div>
            ))}

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

            {/* Content */}
            <div className="relative z-10 max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-5 py-2 backdrop-blur-xl">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />

                <span className="text-sm tracking-[0.14em] text-red-200 uppercase">
                  create your identity
                </span>
              </div>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}
                viewport={{ once: true }}
                className="relative mt-8 text-[3rem] font-medium leading-[0.84] tracking-[-0.11em] sm:text-[4rem] md:text-[5.5rem]"
              >
                {/* Glow Layer */}
                <span className="absolute inset-0 blur-3xl text-red-500/20">
                  build your presence
                </span>

                {/* Main */}
                <span className="relative text-[#F5F1E8]">build your</span>

                <br />

                <span className="relative text-red-500">presence</span>
              </motion.h2>

              {/* Description */}
              <p className="mt-8 max-w-2xl text-[15px] leading-[1.9] tracking-[0.03em] text-[#B1B1B1] sm:text-lg">
                Join creators building expressive profiles with modern
                customization, smooth animations, social integrations, and
                premium identity tools.
              </p>

              {/* Input + Button */}
              <div className="mt-12 flex w-full max-w-2xl flex-col gap-4 sm:flex-row">
                {/* Input */}
                <div className="group relative flex h-[64px] flex-1 items-center overflow-hidden rounded-2xl border border-white/10 bg-black/40 px-5 backdrop-blur-2xl transition-all duration-300 focus-within:border-red-500/30">
                  {/* Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-focus-within:opacity-100" />

                  {/* Prefix */}
                  <span className="relative mr-1 text-sm text-[#777]">
                    redr.lol/
                  </span>

                  {/* Input */}
                  <input
                    type="text"
                    placeholder="username"
                    className="relative h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-[#555]"
                  />

                  {/* Dot */}
                  <div className="absolute right-5 h-2 w-2 rounded-full bg-red-500" />
                </div>

                {/* Button */}
                <button className="group relative flex h-[64px] items-center justify-center overflow-hidden rounded-2xl bg-red-600 px-8 text-sm font-medium text-white transition-all duration-500 hover:-translate-y-[2px] hover:bg-red-500">
                  {/* Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-400 to-red-700 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Shine */}
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <div className="absolute left-[-120%] top-0 h-full w-[60%] rotate-[20deg] bg-white/20 blur-xl transition-all duration-1000 group-hover:left-[140%]" />
                  </div>

                  {/* Content */}
                  <span className="relative z-10 flex items-center gap-2 tracking-[0.04em]">
                    claim now
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </button>
              </div>

              {/* Bottom Text */}
              <div className="mt-6 flex items-center gap-2 text-sm text-[#777]">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                usernames are claimed instantly
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;

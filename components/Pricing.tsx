"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Crown } from "lucide-react";

const PricingSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#0A0A0A] px-6 py-36 text-[#F5F1E8]">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main Glow */}
        <div className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-[180px]" />

        {/* Mesh */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              radial-gradient(circle at top left, rgba(239,68,68,0.12), transparent 30%),
              radial-gradient(circle at bottom right, rgba(220,38,38,0.1), transparent 30%)
            `,
          }}
        />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
              backgroundSize: "85px 85px",
            }}
          />
        </div>

        {/* Floating Doodles */}
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[6%] top-[14%] hidden xl:block"
        >
          <svg
            width="240"
            height="240"
            viewBox="0 0 240 240"
            fill="none"
            className="opacity-[0.1]"
          >
            <path
              d="M50 120C50 60 190 60 190 120C190 180 50 180 50 120Z"
              stroke="#ef4444"
              strokeWidth="4"
              strokeDasharray="12 12"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        <motion.div
          animate={{
            y: [0, -18, 0],
            rotate: [0, 12, -12, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
          }}
          className="absolute right-[8%] top-[16%] hidden xl:block"
        >
          <svg
            width="180"
            height="180"
            viewBox="0 0 180 180"
            fill="none"
            className="opacity-[0.1]"
          >
            <path
              d="M30 90C70 20 160 50 120 150"
              stroke="#dc2626"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="10 12"
            />

            <path
              d="M108 130L120 150L145 138"
              stroke="#dc2626"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-5 py-2 backdrop-blur-xl"
          >
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />

            <span className="text-sm tracking-[0.12em] text-red-200 uppercase">
              simple & powerful pricing
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
            className="relative text-[3rem] font-medium leading-[0.82] tracking-[-0.11em] sm:text-[4.5rem] md:text-[6.5rem]"
          >
            {/* Background Layer */}
            <span className="absolute left-1/2 top-[42%] -z-10 hidden -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[3.5rem] font-medium tracking-[-0.1em] text-red-500/10 blur-[2px] sm:block md:text-[7rem]">
              creative freedom
            </span>

            {/* Top */}
            <span className="text-[#F5F1E8]">unlock your</span>

            <br />

            {/* Bottom */}
            <span className="relative inline-block">
              {/* Outline Layer */}
              <span className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 scale-[1.08] whitespace-nowrap text-transparent [-webkit-text-stroke:1px_rgba(239,68,68,0.28)]">
                creative freedom
              </span>

              {/* Glow */}
              <span className="absolute inset-0 blur-3xl text-red-500/30">
                creative freedom
              </span>

              {/* Main */}
              <span className="relative text-red-500">creative freedom</span>
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.15,
            }}
            viewport={{ once: true }}
            className="mx-auto mt-14 max-w-2xl text-[15px] leading-[1.9] tracking-[0.03em] text-[#9A9A9A] sm:text-lg"
          >
            Start for free and upgrade whenever you want more customization,
            effects, layouts, animations, and premium profile features.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="relative mt-28 grid grid-cols-1 gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          {/* Floating Background Blur */}
          <div className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-[140px]" />

          {/* FREE PLAN */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-[42px] border border-white/10 bg-[#0A0A0A]/80 p-[1px] backdrop-blur-3xl"
          >
            {/* Border Glow */}
            <div className="absolute inset-0 rounded-[42px] bg-gradient-to-br from-white/[0.08] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Inner */}
            <div className="relative flex h-full flex-col rounded-[42px] bg-[#080808]/95 p-8">
              <div className="flex-1">
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

                {/* Top */}
                <div className="relative flex items-start justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                      <div className="h-2 w-2 rounded-full bg-white/60" />

                      <span className="text-xs tracking-[0.18em] text-[#A1A1A1] uppercase">
                        starter
                      </span>
                    </div>

                    <h3 className="mt-8 text-[4rem] font-medium leading-none tracking-[-0.12em] text-white">
                      Free
                    </h3>

                    <div className="mt-5 flex items-end gap-2">
                      <span className="text-[5rem] font-medium leading-none tracking-[-0.12em] text-white">
                        €0
                      </span>

                      <span className="mb-3 text-[#777]">forever</span>
                    </div>
                  </div>

                  {/* Floating Shape */}
                  <motion.div
                    animate={{
                      rotate: [0, 12, -12, 0],
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                    }}
                    className="opacity-[0.08]"
                  >
                    <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
                      <path
                        d="M20 45C20 25 70 25 70 45C70 65 20 65 20 45Z"
                        stroke="#ffffff"
                        strokeWidth="4"
                        strokeDasharray="8 10"
                        strokeLinecap="round"
                      />
                    </svg>
                  </motion.div>
                </div>

                {/* Description */}
                <p className="relative mt-8 max-w-sm text-[15px] leading-[1.9] tracking-[0.03em] text-[#8F8F8F]">
                  Perfect for creators starting their online presence with
                  smooth customization and modern profile tools.
                </p>

                {/* Features */}
                <div className="relative mt-12 space-y-5">
                  {[
                    "Basic Customization",
                    "Profile Analytics",
                    "Basic Effects",
                    "Add Your Socials",
                  ].map((feature, i) => (
                    <div key={i} className="group/item flex items-center gap-4">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] transition-all duration-300 group-hover/item:border-white/20">
                        <Check className="h-3.5 w-3.5 text-white" />
                      </div>

                      <span className="text-[#D4D4D4]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-14">
                <button className="group relative flex h-[62px] w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-6 text-sm font-medium text-white backdrop-blur-2xl transition-all duration-500 hover:-translate-y-[2px] hover:border-red-500/20 hover:bg-red-500/[0.08]">
                  {/* Premium Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-red-400/[0.03] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Shine */}
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <div className="absolute left-[-120%] top-0 h-full w-[60%] rotate-[20deg] bg-white/10 blur-xl transition-all duration-1000 group-hover:left-[140%]" />
                  </div>

                  {/* Border Glow */}
                  <div className="absolute inset-[1px] rounded-2xl border border-white/[0.03]" />

                  {/* Text */}
                  <span className="relative z-10 tracking-[0.04em] text-[#F5F5F5] transition-all duration-300 group-hover:text-white">
                    get started for free
                  </span>

                  {/* Tiny Dot */}
                  <div className="absolute right-5 h-2 w-2 rounded-full bg-white/40 transition-all duration-300 group-hover:bg-red-400" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* PREMIUM PLAN */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.1,
            }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-[42px] border border-red-500/20 bg-[#140909]/90 p-[1px] backdrop-blur-3xl"
          >
            {/* Animated Border */}
            <div className="absolute inset-0 rounded-[42px] bg-gradient-to-br from-red-500/30 via-transparent to-transparent opacity-70" />

            {/* Massive Glow */}
            <div className="absolute right-[-20%] top-[-20%] h-[300px] w-[300px] rounded-full bg-red-500/20 blur-[120px]" />

            {/* Inner */}
            <div className="relative flex h-full flex-col rounded-[42px] bg-[#0A0505]/95 p-8 md:p-10">
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

              {/* Top Bar */}
              <div className="relative flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                    <Crown className="h-5 w-5 text-red-400" />
                  </div>

                  <div>
                    <p className="text-xs tracking-[0.18em] text-red-200 uppercase">
                      premium
                    </p>

                    <h3 className="mt-1 text-2xl font-medium tracking-[-0.08em] text-white">
                      red.rose+
                    </h3>
                  </div>
                </div>

                {/* Badge */}
                <div className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs tracking-[0.18em] text-red-200 uppercase">
                  most popular
                </div>
              </div>

              {/* Price */}
              <div className="relative mt-12 flex flex-wrap items-end gap-3">
                <span className="text-[5rem] font-medium leading-none tracking-[-0.12em] text-white">
                  €4.99
                </span>

                <span className="mb-3 text-red-200">every 2 months</span>
              </div>

              {/* Description */}
              <p className="relative mt-7 max-w-xl text-[15px] leading-[1.9] tracking-[0.03em] text-[#E8C6C6]">
                Unlock the complete creative experience with advanced layouts,
                premium effects, custom badges, banner customization, typewriter
                animations, and exclusive profile styling.
              </p>

              {/* Features Grid */}
              <div className="relative mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
                {[
                  "Exclusive Badge",
                  "Profile Layouts",
                  "Custom Fonts",
                  "Typewriter Animation",
                  "Special Profile Effects",
                  "Advanced Customization",
                  "Metadata & SEO",
                  "Banner Customization",
                  "Custom Nameplates",
                  "Premium Badges",
                ].map((feature, i) => (
                  <div key={i} className="group/item flex items-center gap-4">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 transition-all duration-300 group-hover/item:scale-110">
                      <Check className="h-3.5 w-3.5 text-red-300" />
                    </div>

                    <span className="text-[#F5E7E7]">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-14">
                <button className="group relative flex h-[62px] w-full items-center justify-center overflow-hidden rounded-2xl bg-red-600 px-6 text-sm font-medium text-white transition-all duration-500 hover:-translate-y-[2px] hover:bg-red-500">
                  {/* Premium Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-400 to-red-700 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Soft Radial Glow */}
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute left-1/2 top-1/2 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
                  </div>

                  {/* Shine Sweep */}
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <div className="absolute left-[-120%] top-0 h-full w-[60%] rotate-[20deg] bg-white/20 blur-xl transition-all duration-1000 group-hover:left-[140%]" />
                  </div>

                  {/* Inner Border */}
                  <div className="absolute inset-[1px] rounded-2xl border border-white/10" />

                  {/* Content */}
                  <span className="relative z-10 tracking-[0.04em] text-white">
                    upgrade to premium
                  </span>

                  {/* Status Dot */}
                  <div className="absolute right-5 h-2 w-2 rounded-full bg-white/60 transition-all duration-300 group-hover:bg-white" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

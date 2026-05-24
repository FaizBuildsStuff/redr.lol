"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";


const StatsSection = () => {

  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {

    const checkAuth = async () => {
      try {

        const res = await fetch("/api/auth/me");

        const data = await res.json();

        if (data?.user) {

          setIsLoggedIn(true);

          setUsername(
            data.user.username || ""
          );

        }

      } catch (error) {

        console.error(error);

      }
    };

    checkAuth();

  }, []);
  return (
    <section className="relative overflow-hidden bg-[#0A0A0A] px-6 py-32 text-[#F5F1E8]">

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">

        {/* Glow */}
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-[170px]" />

        {/* Mesh */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              radial-gradient(circle at top left, rgba(239,68,68,0.12), transparent 25%),
              radial-gradient(circle at bottom right, rgba(220,38,38,0.08), transparent 30%)
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
              backgroundSize: "90px 90px",
            }}
          />
        </div>

        {/* Floating Doodles */}
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[8%] top-[15%] hidden lg:block"
        >
          <svg
            width="170"
            height="170"
            viewBox="0 0 170 170"
            fill="none"
            className="opacity-[0.13]"
          >
            <path
              d="M35 85C35 40 135 40 135 85C135 130 35 130 35 85Z"
              stroke="#ef4444"
              strokeWidth="4"
              strokeDasharray="10 12"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
          className="absolute right-[10%] top-[18%] hidden lg:block"
        >
          <svg
            width="140"
            height="140"
            viewBox="0 0 140 140"
            fill="none"
            className="opacity-[0.12]"
          >
            <path
              d="M20 70C50 10 120 40 95 120"
              stroke="#dc2626"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="10 10"
            />

            <path
              d="M85 105L95 120L112 112"
              stroke="#dc2626"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl">

        {/* Top */}
        <div className="mx-auto max-w-4xl text-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-5 py-2 backdrop-blur-xl"
          >
            <span className="text-sm tracking-wide text-red-200">
              growing every single day
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-[3rem] font-medium leading-[0.9] tracking-[-0.08em] text-[#F5F1E8] sm:text-[4rem] md:text-[5.5rem]"
          >
            join the next
            <br />

            <span className="relative inline-block text-red-500">
              generation

              {/* Underline */}
              <svg
                className="absolute -bottom-5 left-0 w-full"
                viewBox="0 0 300 30"
                fill="none"
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{
                    duration: 1.8,
                    delay: 0.2,
                  }}
                  viewport={{ once: true }}
                  d="M5 20C60 10 120 28 295 15"
                  stroke="#ef4444"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <br />

            of online profiles
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.1,
            }}
            viewport={{ once: true }}
            className="mx-auto mt-10 max-w-2xl text-[15px] leading-[1.9] tracking-[0.03em] text-[#A1A1A1] sm:text-lg"
          >
            Create beautifully designed profile pages with smooth animations,
            custom themes, social links, and complete creative freedom —
            all crafted for the modern internet.
          </motion.p>
        </div>

        {/* Stats */}
        <div className="mt-24 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

          {[
            {
              number: "120K+",
              label: "Profile Views",
            },
            {
              number: "1K+",
              label: "Active Users",
            },
            {
              number: "8K+",
              label: "Links Created",
            },
            {
              number: "240+",
              label: "Premium Members",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
              }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:border-red-500/20 hover:bg-red-500/[0.03]"
            >

              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Number */}
              <h3 className="relative text-[3rem] font-medium tracking-[-0.08em] text-[#F5F1E8]">
                {item.number}
              </h3>

              {/* Label */}
              <p className="relative mt-3 text-sm tracking-[0.03em] text-[#9d9d9d]">
                {item.label}
              </p>

              {/* Tiny Doodle */}
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                }}
                className="absolute right-5 top-5 opacity-[0.12]"
              >
                <svg
                  width="50"
                  height="50"
                  viewBox="0 0 50 50"
                  fill="none"
                >
                  <path
                    d="M10 25C10 15 40 15 40 25C40 35 10 35 10 25Z"
                    stroke="#ef4444"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="6 6"
                  />
                </svg>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
<motion.div
  initial={{ opacity: 0, y: 35 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{
    duration: 1,
    delay: 0.2,
  }}
  viewport={{ once: true }}
  className="relative mt-24 flex flex-col items-center justify-center overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.03] px-6 py-14 backdrop-blur-3xl"
>

  {/* Glow */}
  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent" />

  {/* Doodle */}
  <motion.div
    animate={{
      rotate: [0, 10, -10, 0],
      y: [0, -12, 0],
    }}
    transition={{
      duration: 12,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="absolute left-8 top-8 hidden lg:block opacity-[0.12]"
  >
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
    >
      <path
        d="M20 60C20 25 100 25 100 60C100 95 20 95 20 60Z"
        stroke="#ef4444"
        strokeWidth="4"
        strokeDasharray="10 10"
        strokeLinecap="round"
      />
    </svg>
  </motion.div>

  {/* Text */}
  <div className="relative text-center">

    <p className="mb-4 text-sm tracking-[0.2em] text-red-300 uppercase">
      create your identity
    </p>

    <h3 className="text-[2.5rem] font-medium leading-[0.9] tracking-[-0.09em] text-[#F5F1E8] sm:text-[4rem]">
      claim your
      <br />

      <span className="relative inline-block text-red-500">
        username

        {/* Underline */}
        <svg
          className="absolute -bottom-4 left-0 w-full"
          viewBox="0 0 260 30"
          fill="none"
        >
          <motion.path
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{
              duration: 1.8,
              delay: 0.2,
            }}
            viewport={{ once: true }}
            d="M5 18C60 5 130 28 255 15"
            stroke="#ef4444"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </h3>

    <p className="mx-auto mt-8 max-w-xl text-[15px] leading-[1.9] tracking-[0.03em] text-[#949494] sm:text-lg">
      create your profile in minutes with smooth customization,
      social links, music, animations, and more.
    </p>
  </div>

  {/* Username Field */}
<motion.div
  initial={{ opacity: 0, y: 25 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    duration: 1,
    delay: 0.35,
  }}
  className="relative mt-14 flex w-full max-w-3xl flex-col gap-4 sm:flex-row"
>

  {/* INPUT CONTAINER */}
  <motion.div
    whileHover={{
      scale: 1.01,
    }}
    className="
    group
    relative
    flex
    h-[68px]
    flex-1
    items-center
    overflow-hidden
    rounded-[24px]
    border
    border-white/10
    bg-[#0A0A0A]/80
    px-6
    backdrop-blur-3xl
    transition-all
    duration-500
    focus-within:border-red-500/30
    focus-within:shadow-[0_0_40px_rgba(239,68,68,0.12)]
  "
  >

    {/* Animated Glow */}
    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-focus-within:opacity-100" />

    {/* Floating Gradient */}
    <div className="absolute inset-0 opacity-[0.04]">
      <div
        className="h-full w-full"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>

    {/* DOMAIN */}
    <span className="relative mr-2 whitespace-nowrap text-sm font-medium tracking-[0.04em] text-[#777]">
      redr.lol/
    </span>

    {/* INPUT */}
    <input
      type="text"
      value={username}
      onChange={(e) =>
        setUsername(e.target.value)
      }
      placeholder="username"
      className="
      relative
      h-full
      w-full
      bg-transparent
      text-sm
      text-[#F5F1E8]
      outline-none
      placeholder:text-[#5e5e5e]
    "
    />

    {/* Status Dot */}
    <motion.div
      animate={{
        opacity: [0.4, 1, 0.4],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
      }}
      className="absolute right-5 h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]"
    />

  </motion.div>

  {/* BUTTON */}
  <Link
    href={
      isLoggedIn
        ? "/dashboard"
        : "/signup"
    }
  >
    <button
      className="
      group
      relative
      flex
      h-[68px]
      w-full
      items-center
      justify-center
      overflow-hidden
      rounded-[24px]
      bg-red-600
      px-9
      text-sm
      font-medium
      text-white
      transition-all
      duration-500
      hover:-translate-y-[2px]
      hover:scale-[1.02]
      hover:bg-red-500
      hover:shadow-[0_0_50px_rgba(239,68,68,0.35)]
      sm:w-auto
    "
    >

      {/* Animated Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-400 to-red-700 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Shine */}
      <div className="absolute inset-0 overflow-hidden rounded-[24px]">
        <div className="absolute left-[-120%] top-0 h-full w-[60%] rotate-[20deg] bg-white/20 blur-xl transition-all duration-1000 group-hover:left-[140%]" />
      </div>

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2 tracking-[0.05em]">

        {isLoggedIn
          ? "open dashboard"
          : "claim now"}

        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />

      </span>

    </button>
  </Link>

</motion.div>

  {/* Bottom Tiny Text */}
  <div className="mt-6 flex items-center gap-2 text-sm text-[#777]">

    <motion.div
      animate={{
        opacity: [0.3, 1, 0.3],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
      className="h-2 w-2 rounded-full bg-red-500"
    />

    usernames are claimed instantly
  </div>
</motion.div>
      </div>
    </section>
  );
};

export default StatsSection;

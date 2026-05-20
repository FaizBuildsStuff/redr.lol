"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowRight,
  Disc3,
  ShieldCheck,
  Loader2,
} from "lucide-react";

const Signin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form validation
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign in.");
      }

      // Store in local storage to track login status
      localStorage.setItem("is_logged_in", "true");

      // Redirect user to the dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-5 py-14 text-[#F5F1E8] sm:px-6 sm:py-20">

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Main Glow */}
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[140px]" />

        {/* Bottom Glow */}
        <div className="absolute bottom-[-10%] right-[-5%] h-[400px] w-[400px] rounded-full bg-red-500/10 blur-[120px]" />

        {/* Mesh */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              radial-gradient(circle at top left, rgba(239,68,68,0.10), transparent 25%),
              radial-gradient(circle at bottom right, rgba(220,38,38,0.08), transparent 30%)
            `,
          }}
        />

        {/* Noise */}
        <div className="absolute inset-0 opacity-[0.025] mix-blend-soft-light">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "url('https://grainy-gradients.vercel.app/noise.svg')",
            }}
          />
        </div>

        {/* Doodle Ring */}
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[6%] top-[10%] hidden xl:block opacity-[0.06]"
        >
          <svg
            width="220"
            height="220"
            viewBox="0 0 220 220"
            fill="none"
          >
            <path
              d="M40 110C40 60 180 60 180 110C180 160 40 160 40 110Z"
              stroke="#ef4444"
              strokeWidth="4"
              strokeDasharray="12 12"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        {/* Doodle Arrow */}
        <motion.div
          animate={{
            y: [0, -14, 0],
            rotate: [0, 8, -8, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[7%] top-[12%] hidden xl:block opacity-[0.06]"
        >
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
          >
            <path
              d="M35 100C80 25 170 60 130 165"
              stroke="#ef4444"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="10 12"
            />

            <path
              d="M118 143L130 165L154 151"
              stroke="#ef4444"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      </div>

      {/* Card */}
      <motion.div
        initial={{
          opacity: 0,
          y: 24,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
        }}
        className="relative w-full max-w-[500px] overflow-hidden rounded-[30px] border border-white/[0.06] bg-[#0B0B0B]/90 shadow-[0_0_120px_rgba(255,0,0,0.05)] backdrop-blur-3xl"
      >

        {/* Glow */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-500/[0.07] via-transparent to-transparent" />

        {/* Inner */}
        <div className="relative px-6 py-6 sm:px-8 sm:py-8">

          {/* Top */}
          <div className="flex items-center justify-between">

            {/* Logo */}
            <div className="flex items-center gap-4">

              <motion.div
                animate={{
                  rotate: [0, 6, -6, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10"
              >
                <Disc3 className="h-6 w-6 text-red-400" />
              </motion.div>

              <div>

                <h2 className="text-[1.7rem] font-medium tracking-[-0.08em] text-white">
                  redr.lol
                </h2>

                <p className="mt-1 text-sm text-[#787878]">
                  welcome back
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="hidden items-center gap-2 rounded-full border border-green-500/10 bg-green-500/10 px-3 py-1.5 sm:flex">

              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />

              <span className="text-[11px] uppercase tracking-[0.14em] text-green-200">
                secure
              </span>
            </div>
          </div>

          {/* Heading */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            className="mt-10"
          >

            <h1 className="text-[2.7rem] font-medium leading-[0.84] tracking-[-0.09em] text-[#F5F1E8] sm:text-[3.7rem]">

              <span className="tracking-[-0.05em]">
                welcome
              </span>

              <br />

              <motion.span
                animate={{
                  opacity: [0.92, 1, 0.92],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
                className="tracking-[-0.06em] text-red-500"
              >
                back
              </motion.span>
            </h1>

            <p className="mt-7 max-w-md text-[15.5px] font-normal leading-[1.85] tracking-[0.012em] text-[#A1A1A1] [text-rendering:optimizeLegibility] [-webkit-font-smoothing:antialiased]">
              Sign in to continue customizing your digital identity
              and manage your profile experience.
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSignin}>
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.1,
              }}
              className="mt-10 space-y-3"
            >

              {/* Email */}
              <div className="group relative overflow-hidden rounded-[24px] border border-white/[0.05] bg-[#111111] transition-all duration-300 focus-within:border-red-500/20 focus-within:bg-[#131313]">

                {/* Glow */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-red-500/[0.07] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-focus-within:opacity-100" />

                {/* Label */}
                <div className="flex items-center justify-between px-5 pt-4">

                  <span className="text-[10px] uppercase tracking-[0.18em] text-[#707070]">
                    email address
                  </span>

                  <motion.div
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="h-1.5 w-1.5 rounded-full bg-red-500"
                  />
                </div>

                {/* Input */}
                <div className="px-5 pb-4 pt-2">

                  <Input
                    required
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-auto border-0 bg-transparent p-0 text-[15px] font-normal tracking-[0.01em] text-white shadow-none outline-none focus-visible:ring-0 placeholder:text-[#5C5C5C]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="group relative overflow-hidden rounded-[24px] border border-white/[0.05] bg-[#111111] transition-all duration-300 focus-within:border-red-500/20 focus-within:bg-[#131313]">

                {/* Glow */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-red-500/[0.07] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-focus-within:opacity-100" />

                {/* Label */}
                <div className="flex items-center justify-between px-5 pt-4">

                  <span className="text-[10px] uppercase tracking-[0.18em] text-[#707070]">
                    password
                  </span>

                  <motion.div
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="h-1.5 w-1.5 rounded-full bg-red-500"
                  />
                </div>

                {/* Input */}
                <div className="px-5 pb-4 pt-2">

                  <Input
                    required
                    type="password"
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-auto border-0 bg-transparent p-0 text-[15px] font-normal tracking-[0.01em] text-white shadow-none outline-none focus-visible:ring-0 placeholder:text-[#5C5C5C]"
                  />
                </div>
              </div>

              {/* Row */}
              <div className="flex items-center justify-between px-1 pt-2">

                {/* Remember */}
                <div className="flex items-center gap-3">

                  <Checkbox
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                    className="border-white/20 data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500"
                  />

                  <span className="text-sm text-[#8C8C8C]">
                    remember me
                  </span>
                </div>

                {/* Forgot */}
                <Link
                  href="#"
                  className="text-sm text-[#9A9A9A] transition-colors duration-300 hover:text-white"
                >
                  forgot password?
                </Link>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative mt-3 flex h-[64px] w-full items-center justify-center overflow-hidden rounded-[22px] bg-red-600 text-sm font-medium text-white transition-all duration-500 hover:-translate-y-[2px] hover:bg-red-500 disabled:opacity-50 disabled:pointer-events-none"
              >

                {/* Glow */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-red-500 via-red-400 to-red-700 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Shine */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[22px]">
                  <div className="absolute left-[-120%] top-0 h-full w-[60%] rotate-[20deg] bg-white/20 blur-xl transition-all duration-1000 group-hover:left-[140%]" />
                </div>

                {/* Text */}
                {loading ? (
                  <span className="relative z-10 flex items-center gap-2 tracking-[0.04em]">
                    signing in...
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </span>
                ) : (
                  <span className="relative z-10 flex items-center gap-2 tracking-[0.04em]">
                    sign in

                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                )}
              </button>

              {/* Security */}
              <div className="flex items-center justify-center gap-2 pt-2">

                <ShieldCheck className="h-4 w-4 text-green-400" />

                <span className="text-[13px] tracking-[0.03em] text-[#777]">
                  encrypted and securely protected
                </span>
              </div>
            </motion.div>
          </form>

          {/* Bottom */}
          <div className="mt-8 text-center">

            <p className="text-sm text-[#777]">
              don&apos;t have an account?{" "}

              <Link
                href="/signup"
                className="font-medium text-white transition-colors duration-300 hover:text-red-300"
              >
                create one
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Signin;
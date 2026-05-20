"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Disc3,
  Loader2,
} from "lucide-react";

const Signup = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedTOS, setAgreedTOS] = useState(false);
  const [agreedOffers, setAgreedOffers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form validation
    if (!username.trim()) {
      setError("Username is required.");
      return;
    }
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!agreedTOS) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign up.");
      }

      // Store in local storage to track login status
      localStorage.setItem("is_logged_in", "true");

      // Redirect user to the dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
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

        {/* Soft Mesh */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              radial-gradient(circle at top left, rgba(239,68,68,0.10), transparent 25%),
              radial-gradient(circle at bottom right, rgba(220,38,38,0.08), transparent 30%)
            `,
          }}
        />

        {/* Grain */}
        <div className="absolute inset-0 opacity-[0.025] mix-blend-soft-light">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "url('https://grainy-gradients.vercel.app/noise.svg')",
            }}
          />
        </div>
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
        className="relative w-full max-w-[560px] overflow-hidden rounded-[34px] border border-white/[0.06] bg-[#0B0B0B]/90 shadow-[0_0_120px_rgba(255,0,0,0.05)] backdrop-blur-3xl"
      >

        {/* Glow */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-500/[0.07] via-transparent to-transparent" />

        {/* Inner */}
        <div className="relative px-7 py-8 sm:px-10 sm:py-10">

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
                profiles with personality
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="mt-12">

            <h1 className="text-[3.1rem] font-medium leading-[0.84] tracking-[-0.09em] text-[#F5F1E8] sm:text-[4.2rem]">

              <span className="tracking-[-0.06em]">
                create your
              </span>

              <br />

              <span className="tracking-[-0.07em] text-red-500">
                identity
              </span>
            </h1>

            <p className="mt-6 max-w-md text-[16px] font-[400] leading-[1.85] tracking-[0.01em] text-[#9A9A9A] antialiased [text-rendering:geometricPrecision] [-webkit-font-smoothing:antialiased] [-moz-osx-font-smoothing:grayscale]">
              Create a modern profile with smooth customization,
              layouts, effects, socials, and complete creative freedom.
            </p>
          </div>

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
          <form onSubmit={handleSignup} className="mt-12 space-y-4">

            {/* Username */}
            <div className="group rounded-[22px] border border-white/[0.06] bg-[#101010] transition-all duration-300 focus-within:border-red-500/20 focus-within:bg-[#121212]">

              {/* Label */}
              <div className="flex items-center justify-between px-5 pt-4">

                <span className="text-[11px] uppercase tracking-[0.16em] text-[#666]">
                  username
                </span>

                <div className="h-1.5 w-1.5 rounded-full bg-red-500/70" />
              </div>

              {/* Input */}
              <div className="flex items-center px-5 pb-4 pt-2">

                <span className="mr-1 text-[15px] text-[#666]">
                  redr.lol/
                </span>

                <Input
                  required
                  placeholder="yourname"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-auto border-0 bg-transparent p-0 text-[15px] text-white shadow-none outline-none focus-visible:ring-0 placeholder:text-[#5E5E5E]"
                />
              </div>
            </div>

            {/* Email */}
            <div className="group rounded-[22px] border border-white/[0.06] bg-[#101010] transition-all duration-300 focus-within:border-red-500/20 focus-within:bg-[#121212]">

              {/* Label */}
              <div className="flex items-center justify-between px-5 pt-4">

                <span className="text-[11px] uppercase tracking-[0.16em] text-[#666]">
                  email address
                </span>

                <div className="h-1.5 w-1.5 rounded-full bg-red-500/70" />
              </div>

              {/* Input */}
              <div className="px-5 pb-4 pt-2">

                <Input
                  required
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-auto border-0 bg-transparent p-0 text-[15px] text-white shadow-none outline-none focus-visible:ring-0 placeholder:text-[#5E5E5E]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="group rounded-[22px] border border-white/[0.06] bg-[#101010] transition-all duration-300 focus-within:border-red-500/20 focus-within:bg-[#121212]">

              {/* Label */}
              <div className="flex items-center justify-between px-5 pt-4">

                <span className="text-[11px] uppercase tracking-[0.16em] text-[#666]">
                  password
                </span>

                <div className="h-1.5 w-1.5 rounded-full bg-red-500/70" />
              </div>

              {/* Input */}
              <div className="px-5 pb-4 pt-2">

                <Input
                  required
                  type="password"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-auto border-0 bg-transparent p-0 text-[15px] text-white shadow-none outline-none focus-visible:ring-0 placeholder:text-[#5E5E5E]"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4 pt-3">

              {/* TOS */}
              <div className="flex items-start gap-4 rounded-[22px] border border-white/[0.04] bg-[#0F0F0F] px-5 py-4">

                <Checkbox
                  checked={agreedTOS}
                  onCheckedChange={(checked) => setAgreedTOS(!!checked)}
                  className="mt-1 border-white/20 data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500"
                />

                <p className="text-sm leading-[1.8] text-[#8C8C8C]">
                  I agree to the{" "}

                  <Link
                    href="#"
                    className="font-medium text-white transition-colors duration-300 hover:text-red-300"
                  >
                    Terms of Service
                  </Link>{" "}

                  and{" "}

                  <Link
                    href="#"
                    className="font-medium text-white transition-colors duration-300 hover:text-red-300"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>

              {/* Offers */}
              <div className="flex items-start gap-4 rounded-[22px] border border-white/[0.04] bg-[#0F0F0F] px-5 py-4">

                <Checkbox
                  checked={agreedOffers}
                  onCheckedChange={(checked) => setAgreedOffers(!!checked)}
                  className="mt-1 border-white/20 data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500"
                />

                <p className="text-sm leading-[1.8] text-[#8C8C8C]">
                  I agree to receive updates, announcements,
                  and product news from redr.lol.
                </p>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative mt-2 flex h-[64px] w-full items-center justify-center overflow-hidden rounded-[22px] bg-red-600 text-sm font-medium text-white transition-all duration-500 hover:-translate-y-[2px] hover:bg-red-500 disabled:opacity-50 disabled:pointer-events-none"
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
                  creating account...
                  <Loader2 className="h-4 w-4 animate-spin" />
                </span>
              ) : (
                <span className="relative z-10 flex items-center gap-2 tracking-[0.04em]">
                  create account

                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              )}
            </button>
          </form>
          {/* Form End */}

          {/* Bottom */}
          <div className="mt-8 text-center">

            <p className="text-sm text-[#777]">
              already have an account?{" "}

              <Link
                href="/signin"
                className="font-medium text-white transition-colors duration-300 hover:text-red-300"
              >
                login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Signup;
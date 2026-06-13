"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Disc3,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const navLinks = [
  {
    label: "help center",
    href: "help-center",
  },
  {
    label: "discord",
    href: "https://discord.gg/ECvnDYQQFx",
  },
  {
    label: "leaderboard",
    href: "leaderboard",
  },
  {
    label: "pricing",
    href: "pricing",
  },
];

const Header = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Synchronous local storage check to avoid delay
    const localLogged = localStorage.getItem("is_logged_in") === "true";
    setIsLoggedIn(localLogged);

    // Call API to verify active session cookie and get user details
    async function checkUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setIsLoggedIn(true);
          setUsername(data.user.username);
          localStorage.setItem("is_logged_in", "true");
        } else {
          setIsLoggedIn(false);
          setUsername("");
          localStorage.removeItem("is_logged_in");
        }
      } catch (err) {
        console.error("Failed to verify user session in Header:", err);
      }
    }

    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      localStorage.removeItem("is_logged_in");
      setIsLoggedIn(false);
      setUsername("");
      setOpen(false);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout error in Header:", err);
    }
  };

  return (
    <>
      <header className="fixed left-0 top-0 z-50 w-full px-4 pt-4 sm:px-6">

        {/* Wrapper */}
        <div className="mx-auto max-w-7xl">

          {/* Main Navbar */}
          <motion.div
            initial={{
              opacity: 0,
              y: -30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-[#080808]/80 backdrop-blur-3xl"
          >

            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-transparent opacity-70" />

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

            {/* Doodle Glow */}
            <motion.div
              animate={{
                rotate: [0, 8, -8, 0],
              }}
              transition={{
                duration: 14,
                repeat: Infinity,
              }}
              className="absolute right-[-20px] top-[-20px] opacity-[0.06]"
            >
              <svg
                width="160"
                height="160"
                viewBox="0 0 160 160"
                fill="none"
              >
                <path
                  d="M30 80C30 40 130 40 130 80C130 120 30 120 30 80Z"
                  stroke="#ef4444"
                  strokeWidth="4"
                  strokeDasharray="10 12"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>

            {/* Content */}
            <div className="relative flex h-[76px] items-center justify-between px-5 sm:px-7">

              {/* LEFT */}
              <Link
                href="/"
                className="flex items-center gap-3"
              >
                {/* Logo */}
                <motion.div
                  animate={{
                    y: [0, -4, 0],
                    rotate: [0, 4, -4, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border  border-red-500/15  bg-red-500/5 backdrop-blur-2xl shadow-[0_0_30px_rgba(239,68,68,0.12)]">

                  {/* Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent opacity-80" />

                  {/* Logo Image */}
                  <img
                    src="/Logo.png"
                    alt="redr logo"
                    className="relative z-10 h-7 w-7 object-contain drop-shadow-[0_0_14px_rgba(239,68,68,0.45)]"
                  />
                </motion.div>
                {/* Text */}
                <div>
                  <h2 className="text-lg font-medium tracking-[-0.06em] text-white">
                    red.rose
                  </h2>
                </div>
              </Link>

              {/* CENTER LINKS */}
              <div className="hidden items-center gap-2 lg:flex">

                {navLinks.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className="group/link relative overflow-hidden rounded-2xl px-5 py-3 text-sm text-[#A1A1A1] transition-all duration-300 hover:text-white"
                  >

                    {/* Hover BG */}
                    <div className="absolute inset-0 rounded-2xl bg-white/[0.03] opacity-0 transition-opacity duration-300 group-hover/link:opacity-100" />

                    <span className="relative z-10 flex items-center gap-2 tracking-[0.03em]">

                      {item.label}

                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover/link:translate-x-[2px] group-hover/link:-translate-y-[2px] group-hover/link:opacity-100" />
                    </span>
                  </Link>
                ))}
              </div>

              {/* RIGHT */}
              <div className="hidden items-center gap-3 lg:flex">
                {isLoggedIn ? (
                  <>
                    {/* Dashboard/Profile */}
                    <Link href="/dashboard">
                      <Button
                        variant="ghost"
                        className="h-12 rounded-2xl px-6 text-sm text-red-400 hover:bg-white/[0.03] hover:text-red-300 transition-all duration-300"
                      >
                        {username ? `@${username}` : "dashboard"}
                      </Button>
                    </Link>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="group relative flex h-12 items-center justify-center overflow-hidden rounded-2xl bg-red-600 px-7 text-sm font-medium text-white transition-all duration-500 hover:-translate-y-[2px] hover:bg-red-500"
                    >
                      {/* Glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-400 to-red-700 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                      {/* Shine */}
                      <div className="absolute inset-0 overflow-hidden rounded-2xl">
                        <div className="absolute left-[-120%] top-0 h-full w-[60%] rotate-[20deg] bg-white/20 blur-xl transition-all duration-1000 group-hover:left-[140%]" />
                      </div>

                      {/* Content */}
                      <span className="relative z-10 tracking-[0.04em] capitalize">
                        logout
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    {/* Login */}
                    <Button
                      asChild
                      variant="ghost"
                      className="h-12 rounded-2xl px-6 text-sm text-[#B0B0B0] transition-all duration-300 hover:bg-white/[0.03] hover:text-white"
                    >
                      <Link href="/signin">login</Link>
                    </Button>

                    {/* Signup */}
                    <Button asChild className="group relative flex h-12 items-center justify-center overflow-hidden rounded-2xl bg-red-600 px-7 text-sm font-medium text-white transition-all duration-500 hover:-translate-y-[2px] hover:bg-red-500">
                      <Link href="/signup">
                        {/* Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-400 to-red-700 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                        {/* Shine */}
                        <div className="absolute inset-0 overflow-hidden rounded-2xl">
                          <div className="absolute left-[-120%] top-0 h-full w-[60%] rotate-[20deg] bg-white/20 blur-xl transition-all duration-1000 group-hover:left-[140%]" />
                        </div>

                        {/* Content */}
                        <span className="relative z-10 tracking-[0.04em]">
                          sign up
                        </span>
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              {/* MOBILE BUTTON */}
              <button
                onClick={() => setOpen(!open)}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] lg:hidden"
              >
                {open ? (
                  <X className="h-5 w-5 text-white" />
                ) : (
                  <Menu className="h-5 w-5 text-white" />
                )}
              </button>
            </div>
          </motion.div>

          {/* MOBILE MENU */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                }}
                transition={{
                  duration: 0.3,
                }}
                className="relative mt-4 overflow-hidden rounded-[30px] border border-white/10 bg-[#080808]/95 p-5 backdrop-blur-3xl lg:hidden"
              >

                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent" />

                {/* Links */}
                <div className="relative space-y-2">

                  {navLinks.map((item, i) => (
                    <Link
                      key={i}
                      href={item.href}
                      className="flex items-center justify-between rounded-2xl border border-transparent bg-white/[0.03] px-5 py-4 text-sm text-[#C1C1C1] transition-all duration-300 hover:border-red-500/10 hover:bg-red-500/[0.05] hover:text-white"
                    >
                      <span>
                        {item.label}
                      </span>

                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>

                {/* Bottom */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {isLoggedIn ? (
                    <>
                      <Link href="/dashboard" className="w-full">
                        <Button
                          variant="ghost"
                          onClick={() => setOpen(false)}
                          className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] text-red-400 hover:bg-white/[0.05] hover:text-red-300 transition-all duration-300"
                        >
                          {username ? `@${username}` : "dashboard"}
                        </Button>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-2xl bg-red-600 text-sm font-medium text-white"
                      >
                        {/* Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-400 to-red-700 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                        <span className="relative z-10">
                          logout
                        </span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Button
                        asChild
                        variant="ghost"
                        onClick={() => setOpen(false)}
                        className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.05]"
                      >
                        <Link href="/signin" onClick={() => setOpen(false)}>
                          login
                        </Link>
                      </Button>

                      <Button asChild className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-2xl bg-red-600 text-sm font-medium text-white">
                        <Link href="/signup" onClick={() => setOpen(false)}>
                          {/* Glow */}
                          <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-400 to-red-700 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                          <span className="relative z-10">
                            sign up
                          </span>
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
};

export default Header;

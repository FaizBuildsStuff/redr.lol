"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Disc3,
} from "lucide-react";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[#0A0A0A] px-6 pb-10 pt-28 text-[#F5F1E8]">

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">

        {/* Massive Glow */}
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[140px]" />

        {/* Mesh */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              radial-gradient(circle at top left, rgba(239,68,68,0.12), transparent 30%),
              radial-gradient(circle at bottom right, rgba(220,38,38,0.1), transparent 30%)
            `,
          }}
        />

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

        {/* Doodle Circle */}
        <motion.div
          animate={{
            rotate: [0, 12, -12, 0],
            y: [0, -18, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[5%] top-[10%] hidden xl:block opacity-[0.07]"
        >
          <svg
            width="240"
            height="240"
            viewBox="0 0 240 240"
            fill="none"
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

        {/* Doodle Arrow */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[8%] top-[8%] hidden xl:block opacity-[0.07]"
        >
          <svg
            width="220"
            height="220"
            viewBox="0 0 220 220"
            fill="none"
          >
            <path
              d="M40 120C90 30 190 70 140 180"
              stroke="#ef4444"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="12 14"
            />

            <path
              d="M125 155L140 180L168 165"
              stroke="#ef4444"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0.2, 1, 0.2],
              y: [0, -10, 0],
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
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl">

        {/* Top */}
        <div className="grid grid-cols-1 gap-16 border-b border-white/5 pb-16 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.8fr]">

          {/* Brand */}
          <div>

            {/* Logo */}
            <div className="flex items-center gap-4">

              {/* Icon */}
              <motion.div
                animate={{
                  rotate: [0, 8, -8, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10"
              >
                <Disc3 className="h-6 w-6 text-red-400" />
              </motion.div>

              {/* Name */}
              <div>

                <h3 className="text-2xl font-medium tracking-[-0.08em]">
                  red.rose
                </h3>

                <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/10 px-3 py-1">

                  <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />

                  <span className="text-xs tracking-[0.12em] text-green-200 uppercase">
                    all systems online
                  </span>
                </div>
              </div>
            </div>

            {/* Desc */}
            <p className="mt-8 max-w-sm text-[15px] leading-[1.9] tracking-[0.03em] text-[#9A9A9A]">
              Create expressive digital identities with smooth animations,
              modern customization, profile effects, and creative freedom.
            </p>

          </div>

          {/* Links */}
          {[
            {
              title: "General",
              links: [
                { label: "Login", href: "/signin" },
                { label: "Sign Up", href: "/signup" },
                { label: "Pricing", href: "/pricing" },
                { label: "Leaderboard", href: "/leaderboard" },
                { label: "Status", href: "/status" },
              ],
            },
            {
              title: "Resources",
              links: [
                { label: "Help Center", href: "/help-center" },
                { label: "Changelog", href: "/changelog" },
                { label: "Custom Themes", href: "/themes" },
                { label: "Documentation", href: "/docs" },
                { label: "Partners", href: "/partners" },
              ],
            },
            {
              title: "Contact",
              links: [
                { label: "Discord", href: "https://discord.gg/redrose" },
                { label: "Support Email", href: "mailto:support@redr.lol" },
                { label: "Business Email", href: "mailto:business@redr.lol" },
                { label: "Twitter", href: "https://twitter.com/redrlol" },
                { label: "Instagram", href: "https://instagram.com/redrlol" },
              ],
            },
            {
              title: "Legal",
              links: [
                { label: "Terms", href: "/terms" },
                { label: "Privacy", href: "/privacy" },
                { label: "Copyright", href: "/copyright" },
                { label: "Cookies", href: "/cookies" },
                { label: "Guidelines", href: "/guidelines" },
              ],
            },
          ].map((group, i) => (
            <div key={i}>

              <h4 className="text-lg font-medium tracking-[-0.05em] text-white">
                {group.title}
              </h4>

              <div className="mt-7 space-y-4">

                {group.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.href}
                    className="group/link flex items-center gap-2 text-[#8F8F8F] transition-all duration-300 hover:text-white"
                  >
                    <span>
                      {link.label}
                    </span>

                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover/link:translate-x-[2px] group-hover/link:-translate-y-[2px] group-hover/link:opacity-100" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-8 pt-10 md:flex-row">

          {/* Copyright */}
          <p className="text-sm tracking-[0.03em] text-[#6F6F6F]">
            © 2026 red.rose — crafted for the modern internet.
          </p>

          {/* Socials */}
          <div className="flex items-center gap-3">

            {[
              {
                icon: GithubIcon,
              },
              {
                icon: TwitterIcon,
              },
              {
                icon: InstagramIcon,
              },
            ].map((item, i) => {
              const Icon = item.icon;

              return (
                <motion.a
                  whileHover={{
                    y: -3,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  key={i}
                  href="#"
                  className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all duration-300 hover:border-red-500/20 hover:bg-red-500/10"
                >
                  <Icon className="h-5 w-5 text-[#9A9A9A] transition-colors duration-300 group-hover:text-white" />
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

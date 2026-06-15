"use client";

import React from "react";
import Link from "next/link";
import { ChevronDown, Disc3 } from "lucide-react";

const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const Footer = () => {
  return (
    <footer className="w-full bg-[#050505] pt-20 pb-8 px-6 text-[#A1A1A1] border-t border-white/[0.05] font-sans relative z-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 border-b border-white/[0.05] pb-16">
          
          {/* Left Column */}
          <div className="flex flex-col gap-5 max-w-sm">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-white hover:text-white transition-colors">
                <Disc3 className="h-[22px] w-[22px] text-red-500" />
                <span className="text-[19px] font-bold tracking-tight">redr.lol</span>
              </Link>

              <Link href="/status" className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 hover:bg-white/10 transition-colors">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[11px] font-medium text-[#A1A1A1] transition-colors hover:text-white">System Status</span>
              </Link>
            </div>

            <p className="text-[14px] leading-relaxed text-[#8F8F8F]">
              Create feature-rich, customizable and modern link-in-bio pages with redr.lol.
            </p>

            <button className="mt-2 flex w-max items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-[13px] font-medium text-[#D4D4D4] hover:bg-white/10 transition-colors">
              <span className="text-base leading-none mr-0.5">🇺🇸</span>
              English (US)
              <ChevronDown className="h-4 w-4 text-[#8F8F8F] ml-1" />
            </button>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:gap-x-16">
            {[
              {
                title: "General",
                links: [
                  { label: "Login", href: "/signin" },
                  { label: "Sign Up", href: "/signup" },
                  { label: "Pricing", href: "/#pricing" },
                  { label: "Recover Account", href: "/recovery" },
                  { label: "Leaderboard", href: "/leaderboard" },
                  { label: "Website Status", href: "/status" },
                ],
              },
              {
                title: "Resources",
                links: [
                  { label: "Help Center", href: "/help-center" },
                  { label: "Changelog", href: "/changelog" },
                  { label: "Redeem Code", href: "/redeem" },
                  { label: "Documentation", href: "/docs" },
                  { label: "Partners", href: "/partners" },
                ],
              },
              {
                title: "Contact",
                links: [
                  { label: "Discord Server", href: "https://discord.gg/redrose" },
                  { label: "Support Email", href: "mailto:support@redr.lol" },
                  { label: "Business Email", href: "mailto:business@redr.lol" },
                  { label: "Legal Email", href: "mailto:legal@redr.lol" },
                ],
              },
              {
                title: "Legal",
                links: [
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Copyright Policy", href: "/copyright" },
                ],
              },
            ].map((group, i) => (
              <div key={i}>
                <h4 className="text-[15px] font-medium text-white mb-5">
                  {group.title}
                </h4>
                <div className="flex flex-col gap-3.5">
                  {group.links.map((link, idx) => (
                    <Link
                      key={idx}
                      href={link.href}
                      className="text-[13px] text-[#8F8F8F] hover:text-[#D4D4D4] transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-[13px] text-[#8F8F8F]">
            Copyright © 2026 redr.lol - All Rights Reserved.
          </p>

          <div className="flex items-center gap-4.5">
            <Link href="https://discord.gg/redrose" target="_blank" className="text-[#8F8F8F] hover:text-[#D4D4D4] transition-colors">
              <DiscordIcon className="h-[17px] w-[17px]" />
            </Link>
            <Link href="https://tiktok.com/@redr.lol" target="_blank" className="text-[#8F8F8F] hover:text-[#D4D4D4] transition-colors ml-4">
              <TikTokIcon className="h-[17px] w-[17px]" />
            </Link>
            <Link href="https://x.com/redr_lol" target="_blank" className="text-[#8F8F8F] hover:text-[#D4D4D4] transition-colors ml-4">
              <TwitterIcon className="h-[17px] w-[17px]" />
            </Link>
            <Link href="https://t.me/redrlol" target="_blank" className="text-[#8F8F8F] hover:text-[#D4D4D4] transition-colors ml-4">
              <TelegramIcon className="h-[17px] w-[17px]" />
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

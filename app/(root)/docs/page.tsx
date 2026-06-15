"use client";

import {
  BookOpen,
  Sparkles,
  ArrowRight,
  User,
  BarChart3,
  Crown,
  Shield,
  Music2,
  BadgeCheck,
  MessageCircle,
} from "lucide-react";

export default function Docs() {
  const sections = [
    {
      icon: User,
      title: "Profiles",
      description:
        "Create a personalized profile chamber with links, media, badges, Discord presence and custom branding.",
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description:
        "Track profile views, clicks, CTR, referrers, devices and engagement insights.",
    },
    {
      icon: Music2,
      title: "Audio System",
      description:
        "Upload tracks, customize playback and create immersive profile experiences.",
    },
    {
      icon: BadgeCheck,
      title: "Badges",
      description:
        "Unlock exclusive profile badges and customize your public identity.",
    },
    {
      icon: Shield,
      title: "Discord Presence",
      description:
        "Show real-time Discord status, activities and social connections.",
    },
    {
      icon: Crown,
      title: "Premium",
      description:
        "Unlock advanced profile customization, rewards and future creator tools.",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#09090b]" />

        <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-red-500/[0.06] blur-[180px]" />

        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-red-500/[0.04] blur-[160px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-32 pb-24">
        {/* Hero */}
        <section className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/10 bg-red-500/5 px-4 py-2">
            <Sparkles size={15} />
            <span className="text-sm text-zinc-300">
              Documentation
            </span>
          </div>

          <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl">
            Everything you need
            <br />
            to use redr.lol
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            Learn how to build your profile, connect your
            accounts, grow your audience and unlock the full
            power of redr.lol.
          </p>
        </section>

        {/* Quick Navigation */}
        <section className="mt-20">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
            <h2 className="text-xl font-semibold">
              Quick Navigation
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {[
                "Getting Started",
                "Features",
                "Premium",
                "Analytics",
                "FAQ",
                "Support",
                "Discord",
                "Profile Setup",
              ].map((item) => (
                <button
                  key={item}
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-left transition hover:border-red-500/20 hover:bg-red-500/[0.03]"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section className="mt-20">
          <div className="flex items-center gap-3">
            <BookOpen size={24} />
            <h2 className="text-3xl font-semibold">
              Getting Started
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {[
              {
                step: "01",
                title: "Create Account",
                desc: "Sign up and secure your username.",
              },
              {
                step: "02",
                title: "Connect Discord",
                desc: "Sync presence and social identity.",
              },
              {
                step: "03",
                title: "Customize Profile",
                desc: "Add links, badges and media.",
              },
              {
                step: "04",
                title: "Go Live",
                desc: "Share your profile with everyone.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
              >
                <span className="text-red-400">
                  {item.step}
                </span>

                <h3 className="mt-4 font-semibold text-xl">
                  {item.title}
                </h3>

                <p className="mt-3 text-zinc-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mt-24">
          <h2 className="text-3xl font-semibold">
            Core Features
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sections.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-red-500/20"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10">
                    <Icon size={20} />
                  </div>

                  <h3 className="mt-5 text-xl font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-zinc-400">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Premium */}
        <section className="mt-24">
          <div className="rounded-[32px] border border-red-500/10 bg-red-500/[0.03] p-8">
            <div className="flex items-center gap-3">
              <Crown className="text-red-400" />
              <h2 className="text-3xl font-semibold">
                redr.lol Premium
              </h2>
            </div>

            <p className="mt-5 max-w-3xl text-zinc-400">
              Premium unlocks enhanced customization,
              exclusive badges, profile upgrades, advanced
              features and future creator-focused tools.
            </p>

            <button className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-medium text-black">
              Explore Premium
              <ArrowRight size={18} />
            </button>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-24">
          <h2 className="text-3xl font-semibold">
            Frequently Asked Questions
          </h2>

          <div className="mt-8 space-y-4">
            {[
              {
                q: "Is redr.lol free?",
                a: "Yes. Core profile functionality is available for free.",
              },
              {
                q: "Can I connect Discord?",
                a: "Yes. Discord integration supports presence and connections.",
              },
              {
                q: "Can I upload audio?",
                a: "Yes. Profiles support audio uploads and playback.",
              },
              {
                q: "Do you offer Premium?",
                a: "Yes. Premium unlocks additional customization and rewards.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <h3 className="font-medium">
                  {faq.q}
                </h3>

                <p className="mt-3 text-zinc-400">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Support */}
        <section className="mt-24">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-10 text-center">
            <MessageCircle className="mx-auto" size={40} />

            <h2 className="mt-5 text-3xl font-semibold">
              Need Help?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              Contact support or join the community if you
              have questions, issues or feedback.
            </p>

            <button className="mt-8 rounded-2xl border border-white/10 px-6 py-3 transition hover:border-red-500/20">
              Contact Support
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
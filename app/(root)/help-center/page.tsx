import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bot,
  Compass,
  Crown,
  Gamepad2,
  Gem,
  Image,
  LayoutTemplate,
  Music4,
  Palette,
  Search,
  ShieldCheck,
  Sparkle,
  Sparkles,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  const quickStarts = [
    { title: "Create your profile", description: "Set up your public identity in minutes.", icon: Sparkles },
    { title: "Connect Discord", description: "Bring your presence and avatar into your chamber.", icon: Bot },
    { title: "Customize your look", description: "Tune themes, media, badges, and more.", icon: Wand2 },
  ];

  const featuredArticles = [
    {
      title: "How to claim your profile",
      blurb: "Secure your profile and unlock the full creator experience.",
      time: "3 min read",
      category: "Setup",
      icon: BadgeCheck,
    },
    {
      title: "Getting verified on Redr",
      blurb: "Learn what verification unlocks and how to get started.",
      time: "4 min read",
      category: "Verification",
      icon: ShieldCheck,
    },
    {
      title: "Setting up a custom domain",
      blurb: "Create a cleaner, more memorable public presence.",
      time: "6 min read",
      category: "Branding",
      icon: Compass,
    },
  ];

  const categories = [
    { title: "Customization", description: "Themes, text, fonts, layout, and visual identity.", articles: 32, icon: Palette },
    { title: "Discord", description: "Presence, OAuth, cards, avatars, and connections.", articles: 18, icon: Gamepad2 },
    { title: "Analytics", description: "Views, clicks, CTR, and traffic insights.", articles: 15, icon: BarChart3 },
    { title: "Audio", description: "Music, background audio, playback controls, and more.", articles: 11, icon: Music4 },
    { title: "Premium", description: "Unlock advanced tools and exclusive creator features.", articles: 14, icon: Crown },
    { title: "Templates", description: "Browse polished profile layouts and starter templates.", articles: 7, icon: LayoutTemplate },
    { title: "Image Host", description: "Upload and manage media hosted directly in your chamber.", articles: 6, icon: Image },
    { title: "Badges", description: "Manage your owned badges and active showcase selection.", articles: 9, icon: Gem },
  ];

  const faqs = [
    {
      question: "How do I claim my profile?",
      answer: "Create an account and verify ownership through the available verification methods in your dashboard.",
    },
    {
      question: "Can I change my username?",
      answer: "Yes, username changes are available from account settings when supported by your plan and account state.",
    },
    {
      question: "How do I report a user?",
      answer: "Open the creator profile and use the report action available from the profile menu.",
    },
    {
      question: "What is Redr Premium?",
      answer: "Premium unlocks richer customization, upgraded analytics, and exclusive creative tools.",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] pt-32 pb-20 text-[#f5f1e8]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-20 h-130 w-130 -translate-x-1/2 rounded-full bg-[#ff4d4d]/12 blur-[140px]" />
        <div className="absolute left-8 top-48 h-70 w-70 rounded-full bg-white/8 blur-[120px]" />
        <div className="absolute right-12 bottom-16 h-80 w-80 rounded-full bg-[#ff4d4d]/10 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 px-6 py-8 shadow-[0_0_80px_rgba(220,38,38,0.16)] backdrop-blur-xl sm:px-8 lg:px-10 lg:py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ff5c5c]/25 bg-[#ff5c5c]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#ffb3b3]">
                <Sparkles className="h-3.5 w-3.5" />
                Redr help center
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Find answers with calm, premium clarity.
                </h1>
                <p className="max-w-xl text-sm leading-7 text-[#c9c2b5] sm:text-base">
                  Search guides, browse smart categories, and get to the right answer quickly without leaving the experience.
                </p>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 sm:min-w-65">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#8e887d]">Need a fast start?</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#f5f1e8]">
                  <BadgeCheck className="h-4 w-4 text-[#ff7b7b]" />
                  Secure your profile
                </div>
                <div className="flex items-center gap-2 text-sm text-[#f5f1e8]">
                  <ShieldCheck className="h-4 w-4 text-[#ff7b7b]" />
                  Verify your account
                </div>
                <div className="flex items-center gap-2 text-sm text-[#f5f1e8]">
                  <Sparkle className="h-4 w-4 text-[#ff7b7b]" />
                  Personalize every detail
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:flex-row sm:items-center sm:gap-4 sm:p-4">
            <div className="flex flex-1 items-center gap-3 rounded-[1rem] border border-white/10 bg-black/30 px-4 py-3">
              <Search className="h-4 w-4 text-[#9b9387]" />
              <input
                placeholder="Search help articles, setup guides, and support topics"
                className="w-full bg-transparent text-sm text-[#f5f1e8] outline-none placeholder:text-[#7a756b]"
              />
            </div>
            <Button className="border-[#ff6b6b]/30 bg-[#ff6b6b]/10 text-[#ffd8d8] hover:bg-[#ff6b6b]/20">
              Search now
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {quickStarts.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="border-white/10 bg-[#0c0c0d]/85 backdrop-blur-xl">
                <CardHeader>
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-[#ff7b7b]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-white">{item.title}</CardTitle>
                  <CardDescription className="text-[#9b9387]">{item.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#ff7b7b]">Featured answers</p>
                <h2 className="text-2xl font-semibold text-white">Most useful guides this week</h2>
              </div>
            </div>
            <div className="space-y-3">
              {featuredArticles.map((article) => {
                const Icon = article.icon;
                return (
                  <Card key={article.title} className="border-white/10 bg-[#0c0c0d]/85 backdrop-blur-xl">
                    <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-[#ff7b7b]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="mb-1 inline-flex rounded-full border border-[#ff6b6b]/20 bg-[#ff6b6b]/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-[#ffb3b3]">
                            {article.category}
                          </div>
                          <h3 className="text-lg font-semibold text-white">{article.title}</h3>
                          <p className="mt-1 text-sm text-[#9b9387]">{article.blurb}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#8e887d]">
                        <span>{article.time}</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="border-white/10 bg-[#0c0c0d]/85 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Browse by category</CardTitle>
              <CardDescription className="text-[#9b9387]">Everything you need to customize, grow, and master your chamber.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {categories.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start justify-between rounded-[1.1rem] border border-white/10 bg-white/5 px-3 py-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-[#ff7b7b]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{item.title}</p>
                        <p className="text-xs leading-5 text-[#8e887d]">{item.description}</p>
                      </div>
                    </div>
                    <span className="text-xs uppercase tracking-[0.24em] text-[#ffb3b3]">{item.articles}+</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-black/30 p-6 backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#ff7b7b]">FAQ</p>
              <h2 className="text-2xl font-semibold text-white">The questions creators ask most</h2>
            </div>
            <Button asChild variant="outline" className="border-[#ff6b6b]/30 bg-[#ff6b6b]/10 text-[#ffd8d8] hover:bg-[#ff6b6b]/20">
              <Link href="/" className="inline-flex items-center gap-2">
                Visit support
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <details key={faq.question} className="rounded-[1.2rem] border border-white/10 bg-white/5 p-5">
                <summary className="cursor-pointer list-none text-sm font-semibold text-white">{faq.question}</summary>
                <p className="mt-3 text-sm leading-6 text-[#9b9387]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

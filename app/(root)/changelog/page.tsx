import { Sparkles } from "lucide-react";

export default function ChangelogPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] pt-32 pb-20 text-[#f5f1e8]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#ff4d4d]/10 blur-[140px]" />
      </div>
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-black/40 px-6 py-12 shadow-[0_0_80px_rgba(220,38,38,0.1)] backdrop-blur-xl sm:px-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ff5c5c]/25 bg-[#ff5c5c]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#ffb3b3] mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Changelog
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white mb-4">Product Updates</h1>
          <p className="text-[#9b9387] mb-8">Latest improvements and features shipped to redr.lol.</p>
          <div className="space-y-8">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <span className="text-[#ff7b7b] text-sm font-medium mb-2 block">June 2026</span>
              <h2 className="text-xl font-semibold text-white mb-2">Modern Command Palette</h2>
              <p className="text-[#c9c2b5]">Added a sleek global command palette with instant search functionality across all dashboard areas. We also added full coverage for all footer pages including terms, guidelines, and status.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

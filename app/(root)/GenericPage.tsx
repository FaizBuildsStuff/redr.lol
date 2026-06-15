import { Sparkles } from "lucide-react";

export default function GenericPage({ title, description, content }: { title: string, description: string, content: string }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] pt-32 pb-20 text-[#f5f1e8]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#ff4d4d]/10 blur-[140px]" />
      </div>
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-black/40 px-6 py-12 shadow-[0_0_80px_rgba(220,38,38,0.1)] backdrop-blur-xl sm:px-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ff5c5c]/25 bg-[#ff5c5c]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#ffb3b3] mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Information
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white mb-4">{title}</h1>
          <p className="text-[#9b9387] mb-8">{description}</p>
          <div className="prose prose-invert max-w-none text-[#c9c2b5]">
            <p>{content}</p>
          </div>
        </div>
      </div>
    </main>
  );
}

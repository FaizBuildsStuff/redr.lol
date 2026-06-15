import { Sparkles } from "lucide-react";

export default function StatusPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] pt-32 pb-20 text-[#f5f1e8]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-green-500/10 blur-[140px]" />
      </div>
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-black/40 px-6 py-12 shadow-[0_0_80px_rgba(34,197,94,0.1)] backdrop-blur-xl sm:px-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-500/25 bg-green-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-green-300 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            System Status
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white mb-4">All systems operational</h1>
          <p className="text-[#9b9387] mb-8">redr.lol is running smoothly with no reported issues.</p>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="flex justify-between border-b border-white/10 pb-4 mb-4">
              <span className="text-white font-medium">API</span>
              <span className="text-green-400">Operational</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-4 mb-4">
              <span className="text-white font-medium">Dashboard</span>
              <span className="text-green-400">Operational</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white font-medium">Profile Delivery</span>
              <span className="text-green-400">Operational</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

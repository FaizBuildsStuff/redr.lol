import React from "react";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#050505] text-[#F5F1E8] font-['Satoshi'] antialiased">
      {/* Background aesthetics */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Glow */}
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-red-600/5 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-5%] h-[400px] w-[400px] rounded-full bg-white/5 blur-[120px]" />
        
        {/* Soft Mesh */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              radial-gradient(circle at top left, rgba(255,255,255,0.05), transparent 25%),
              radial-gradient(circle at bottom right, rgba(220,38,38,0.03), transparent 30%)
            `,
          }}
        />
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.025] mix-blend-soft-light">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
            }}
          />
        </div>
      </div>
      
      <main className="relative z-10 w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        {children}
      </main>
    </div>
  );
}

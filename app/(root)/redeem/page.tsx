"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Gift, ArrowRight, Sparkles } from "lucide-react";

const RedeemCodee = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".redeem-badge", {
        opacity: 0,
        y: 20,
        duration: 0.8,
      });

      gsap.from(".redeem-title", {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.1,
      });

      gsap.from(".redeem-description", {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 0.2,
      });

      gsap.from(".redeem-card", {
        opacity: 0,
        y: 40,
        scale: 0.96,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={heroRef}
      className="relative min-h-screen overflow-hidden text-white"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#09090b]" />

        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-red-500/10 blur-[180px]" />

        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-red-500/5 blur-[200px]" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 pt-32 pb-20">
        <div className="w-full max-w-2xl">
          {/* Badge */}
          <div className="redeem-badge mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-red-500/10 bg-red-500/5 px-4 py-2">
            <Sparkles size={15} />
            <span className="text-sm text-zinc-300">
              Premium Rewards
            </span>
          </div>

          {/* Title */}
          <h1 className="redeem-title text-center text-5xl font-semibold tracking-tight md:text-6xl">
            Redeem Code
          </h1>

          <p className="redeem-description mx-auto mt-5 max-w-xl text-center text-zinc-400">
            Redeem your redr.lol Premium promo code to instantly
            unlock exclusive rewards, upgrades and premium features.
          </p>

          {/* Card */}
          <div className="redeem-card mt-12 rounded-[32px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
            {/* Premium */}
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
                <Gift className="h-6 w-6 text-red-400" />
              </div>

              <div>
                <h2 className="font-semibold text-xl">
                  redr.lol Premium
                </h2>

                <p className="text-sm text-zinc-500">
                  Unlock premium rewards instantly.
                </p>
              </div>
            </div>

            {/* Input */}
            <div>
              <label className="mb-3 block text-sm text-zinc-400">
                Premium Code
              </label>

              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  type="text"
                  placeholder="XXXX-XXXX-XXXX"
                  className="h-14 flex-1 rounded-2xl border border-white/10 bg-black/40 px-5 outline-none transition-all placeholder:text-zinc-600 focus:border-red-500/40"
                />

                <button className="group flex h-14 items-center justify-center gap-2 rounded-2xl bg-white px-6 font-medium text-black transition-all hover:scale-[1.02]">
                  Redeem Code

                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-sm text-zinc-500">
                Premium codes can unlock subscriptions,
                exclusive badges, profile enhancements and
                future creator rewards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RedeemCodee;
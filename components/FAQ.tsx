"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const faqItems = [
  {
    question: "What is red.rose?",
    answer:
      "red.rose is a modern profile platform where you can create expressive digital identities with custom layouts, animations, social links, music, and personalized designs.",
  },
  {
    question: "Is red.rose free to use?",
    answer:
      "Yes. You can create and customize your profile completely free. Premium unlocks advanced customization, effects, layouts, badges, and exclusive features.",
  },
  {
    question: "What can I customize?",
    answer:
      "You can customize your profile layout, fonts, banners, social links, animations, effects, metadata, SEO settings, and much more.",
  },
  {
    question: "Why use red.rose over other platforms?",
    answer:
      "Unlike traditional link-in-bio tools, red.rose focuses on identity, aesthetics, motion, and personalization — giving creators full creative freedom.",
  },
  {
    question: "Is red.rose secure?",
    answer:
      "Yes. Profiles are hosted securely with modern infrastructure, optimized performance, and reliable uptime for smooth experiences.",
  },
  {
    question: "How long does setup take?",
    answer:
      "Usually less than 2 minutes. Pick your username, customize your profile, add socials, and publish instantly.",
  },
];

const FAQSection = () => {
  const [active, setActive] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden bg-[#050505] px-6 py-36 text-[#F5F1E8]">

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">

        {/* Giant Glow */}
        <div className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-[180px]" />

        {/* Animated Orb */}
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[10%] top-[15%] h-[260px] w-[260px] rounded-full bg-red-500/10 blur-[100px]"
        />

        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[10%] right-[8%] h-[320px] w-[320px] rounded-full bg-red-700/10 blur-[120px]"
        />

        {/* Doodle Ring */}
        <motion.div
          animate={{
            rotate: [0, 12, -12, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[6%] top-[18%] hidden xl:block opacity-[0.08]"
        >
          <svg
            width="260"
            height="260"
            viewBox="0 0 260 260"
            fill="none"
          >
            <path
              d="M50 130C50 70 210 70 210 130C210 190 50 190 50 130Z"
              stroke="#ef4444"
              strokeWidth="4"
              strokeDasharray="12 12"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        {/* Floating Arrow */}
        <motion.div
          animate={{
            y: [0, -18, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[10%] top-[16%] hidden xl:block opacity-[0.08]"
        >
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
          >
            <path
              d="M40 100C90 20 180 70 140 170"
              stroke="#ef4444"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="10 12"
            />

            <path
              d="M128 148L140 170L165 158"
              stroke="#ef4444"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

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
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl">

        {/* Top */}
        <div className="mx-auto max-w-5xl text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-5 py-2 backdrop-blur-xl"
          >
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />

            <span className="text-sm tracking-[0.14em] text-red-200 uppercase">
              frequently asked questions
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
            className="relative text-[3rem] font-medium leading-[0.82] tracking-[-0.11em] sm:text-[4.5rem] md:text-[6.5rem]"
          >

            {/* Background Text */}
            <span className="absolute left-1/2 top-[40%] -z-10 hidden -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[6rem] tracking-[-0.1em] text-red-500/10 blur-[3px] md:block">
              everything here
            </span>

            <span className="text-[#F5F1E8]">
              everything you
            </span>

            <br />

            <span className="relative inline-block">

              {/* Outline */}
              <span className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 scale-[1.08] whitespace-nowrap text-transparent [-webkit-text-stroke:1px_rgba(239,68,68,0.3)]">
                want, right here
              </span>

              {/* Glow */}
              <span className="absolute inset-0 blur-3xl text-red-500/30">
                want, right here
              </span>

              {/* Main */}
              <span className="relative text-red-500">
                want, right here
              </span>
            </span>
          </motion.h2>

          {/* Desc */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.15,
            }}
            viewport={{ once: true }}
            className="mx-auto mt-14 max-w-2xl text-[15px] leading-[1.9] tracking-[0.03em] text-[#9A9A9A] sm:text-lg"
          >
            Everything you need to know about building your digital identity
            with red.rose.
          </motion.p>
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-24 max-w-4xl">

          <div className="space-y-5">

            {faqItems.map((item, index) => {
              const isOpen = active === index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.05,
                  }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-3xl"
                >

                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <button
                    onClick={() =>
                      setActive(isOpen ? null : index)
                    }
                    className="relative flex w-full items-center justify-between gap-6 px-7 py-7 text-left"
                  >

                    <div>

                      <h3 className="text-[1.1rem] font-medium tracking-[-0.04em] text-[#F5F1E8] sm:text-[1.2rem]">
                        {item.question}
                      </h3>
                    </div>

                    {/* Plus */}
                    <motion.div
                      animate={{
                        rotate: isOpen ? 45 : 0,
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]"
                    >
                      <Plus className="h-5 w-5 text-red-300" />
                    </motion.div>
                  </button>

                  {/* Answer */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.4,
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-7 pb-7">

                          <div className="mb-6 h-px w-full bg-gradient-to-r from-red-500/20 via-white/10 to-transparent" />

                          <p className="max-w-3xl text-[15px] leading-[1.9] tracking-[0.03em] text-[#A1A1A1]">
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
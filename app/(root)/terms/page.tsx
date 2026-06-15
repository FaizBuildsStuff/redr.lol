'use client'
import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Scale,
  Shield,
  CreditCard,
  Users,
  AlertTriangle,
} from "lucide-react";

// Helper type for sections
interface Section {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  content: React.ReactNode;
}

const sections: Section[] = [
  {
    id: "overview",
    icon: FileText,
    title: "Overview",
    content: (
      <>
        <p>By accessing and using redr.lol, you agree to comply with these Terms of Service and all applicable laws and regulations.</p>
        <p className="mt-4">If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.</p>
      </>
    ),
  },
  {
    id: "accounts",
    icon: Users,
    title: "Accounts & Usernames",
    content: (
      <>
        <p>You are responsible for maintaining the security of your account and ensuring your username does not violate our policies.</p>
        <ul className="mt-4 list-disc pl-5 space-y-2 text-zinc-400">
          <li>Usernames that mimic staff, infringe trademarks, or impersonate public figures are strictly prohibited.</li>
          <li>You are solely responsible for all activities that occur under your account credentials.</li>
        </ul>
      </>
    ),
  },
  {
    id: "content-safety",
    icon: Shield,
    title: "Content & Safety",
    content: (
      <>
        <p>Users retain ownership of their content but grant redr.lol permission to host and display it for operation of the service.</p>
        <p className="mt-4">You may not post content that is illegal, malicious, defamatory, or violates the privacy and safety of others. We reserve the right to remove any content at our sole discretion.</p>
      </>
    ),
  },
  {
    id: "premium-billing",
    icon: CreditCard,
    title: "Premium & Billing",
    content: (
      <>
        <p>Premium subscriptions renew automatically unless cancelled. All purchases are subject to our billing policies.</p>
        <p className="mt-4">Refunds are processed case-by-case at our team's discretion unless required by local consumer protection laws. You can manage or cancel your subscription at any time via your account settings.</p>
      </>
    ),
  },
  {
    id: "termination",
    icon: AlertTriangle,
    title: "Termination",
    content: (
      <>
        <p>Accounts may be suspended or terminated if they violate our Terms, harm users, or threaten platform integrity.</p>
        <p className="mt-4">Upon termination, your right to use the service will cease immediately. Any data associated with your account may be permanently deleted unless legal holding requirements apply.</p>
      </>
    ),
  },
  {
    id: "legal-liability",
    icon: Scale,
    title: "Legal & Liability",
    content: (
      <>
        <p>The service is provided "as-is" and "as available". Liability is limited to the fullest extent permitted by applicable law.</p>
        <p className="mt-4">In no event shall redr.lol or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the platform.</p>
      </>
    ),
  },
];

export default function Terms() {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Handle smooth scrolling to target section
  const scrollToSection = (id: string) => {
    const element = sectionRefs.current[id];
    if (element) {
      const offset = 100; // Account for any fixed headers or margins
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveSection(id);
    }
  };

  // Track which section is currently on-screen to update the sidebar active class
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140; // Adjust tracking threshold

      // Find the current section in view
      for (const section of sections) {
        const el = sectionRefs.current[section.id];
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="relative min-h-screen text-white overflow-hidden selection:bg-red-500/30">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#09090b]" />
        <div className="absolute left-1/2 top-0 h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-red-500/[0.05] blur-[240px]" />
        <div className="absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full bg-red-500/[0.03] blur-[180px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-32 pb-24">
        {/* Hero */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/10 bg-red-500/[0.04] px-4 py-2">
            <FileText size={14} className="text-red-400" />
            <span className="text-sm font-medium text-zinc-300">
              Legal Documentation
            </span>
          </div>

          <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
            Terms of Service
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-zinc-400 text-lg leading-relaxed">
            These terms govern your access to and use of redr.lol, including profiles, premium features, creator tools, and related services.
          </p>

          <div className="mt-8 inline-flex rounded-full border border-white/5 bg-white/[0.02] px-4 py-1.5 text-xs font-medium text-zinc-500">
            Last Updated • June 2026
          </div>
        </div>

        {/* Layout */}
        <div className="mt-20 grid gap-10 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-5">
              <h3 className="font-medium text-sm text-zinc-300 px-3 uppercase tracking-wider">
                Table of Contents
              </h3>

              <div className="mt-5 space-y-1">
                {sections.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-red-500/10 text-red-400"
                          : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                      }`}
                    >
                      {section.title}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="space-y-6">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <div
                  key={section.id}
                  ref={(el) => { sectionRefs.current[section.id] = el; }}
                  className={`rounded-[28px] border p-8 transition-all duration-300 ${
                    activeSection === section.id 
                      ? "border-red-500/20 bg-white/[0.04]" 
                      : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`rounded-2xl p-3 transition-colors duration-300 ${
                      activeSection === section.id ? "bg-red-500/15" : "bg-red-500/10"
                    }`}>
                      <Icon
                        size={20}
                        className={activeSection === section.id ? "text-red-400" : "text-red-400/80"}
                      />
                    </div>

                    <h2 className="text-2xl font-semibold text-zinc-100">
                      {section.title}
                    </h2>
                  </div>

                  <div className="mt-6 leading-7 text-zinc-400 text-[15px]">
                    {section.content}
                  </div>
                </div>
              );
            })}

            {/* Contact Card */}
            <div className="rounded-[32px] border border-red-500/10 bg-gradient-to-b from-red-500/[0.04] to-transparent p-10">
              <h2 className="text-3xl font-semibold text-zinc-100">
                Questions?
              </h2>

              <p className="mt-4 max-w-2xl text-zinc-400 leading-relaxed">
                If you have any questions regarding these Terms of Service, billing, privacy, or legal matters, please contact the redr.lol team.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a 
                  href="mailto:support@redr.lol" 
                  className="rounded-xl border border-white/10 bg-white/[0.02] px-5 py-3 text-sm text-zinc-300 hover:bg-white/[0.06] hover:border-white/20 transition"
                >
                  support@redr.lol
                </a>

                <a 
                  href="mailto:legal@redr.lol" 
                  className="rounded-xl border border-white/10 bg-white/[0.02] px-5 py-3 text-sm text-zinc-300 hover:bg-white/[0.06] hover:border-white/20 transition"
                >
                  legal@redr.lol
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
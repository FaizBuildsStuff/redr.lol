'use client'
import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  Eye,
  Cookie,
  Activity,
  Mail,
  Scale,
  Trash2,
  Share2,
  CreditCard,
  Globe,
  Lock,
  UserCheck,
  Baby,
} from "lucide-react";

interface PolicySection {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  content: React.ReactNode;
}

const policySections: PolicySection[] = [
  {
    id: "changes",
    icon: Activity,
    title: "Changes To Privacy Policy",
    content: (
      <p>
        redr.lol may update this Privacy Policy from time to time. Changes take effect when posted on the Service or otherwise communicated to you. Your continued use of the Service after the effective date constitutes acceptance of the updated Policy, so please review it periodically.
      </p>
    ),
  },
  {
    id: "collection",
    icon: Eye,
    title: "Information We Collect",
    content: (
      <div className="space-y-4">
        <p>
          We collect only the information needed to operate redr.lol securely and reliably. When you create or manage an account, we receive the details you provide, along with security signals captured at the time of account actions to help prevent abuse. Passwords are stored using industry-standard hashing. We may also record the network address used at signup or login for fraud prevention and account safety. When you update your account email, we may retain previous email addresses for a limited period for account integrity, fraud prevention, or legal compliance purposes. These are not used for communication and are permanently deleted once no longer necessary.
        </p>
        <p>
          When you are signed in, we maintain a server-side session so you can stay authenticated across requests. That session record contains a session identifier tied to your account and limited context such as the device or browser type, an approximate country derived from your network address, and the network address itself. This information is used to provide secure sign-in, detect unusual activity, and help you manage active sessions.
        </p>
        <p>
          We run lightweight, cookie-free analytics to understand how public profile pages perform and to attribute clicks on links inside those pages. When a visitor views a page or clicks a link, we log a minimal event that associates the action with the page owner, notes the referring site where available, captures an approximate country, identifies the general device type, and records the time of the event. We do not use cookies for analytics and we do not attempt to identify individual visitors beyond the signals described here.
        </p>
        <p>
          Website diagnostics and error logging: when the site encounters an error or other unusual behavior, we record a small diagnostic event. This may include the user's account ID if signed in, a session identifier, the network address, and the browser or device type. This information helps us detect and fix problems, improve site stability, and protect against abuse. We do not use these logs for advertising, analytics, or behavioral tracking.
        </p>
        <p>
          If you upload to the image host, we store information necessary to deliver and manage the file: the uploading account, descriptive and technical details about the file (such as name shown, size, and type) and when it was uploaded. We also record limited upload metadata such as the uploader's network address, browser, and device information.
        </p>
        <p>
          If you contact us or receive service emails, we process your communications and related metadata so we can respond, provide support, and keep you informed about important changes to your account or to the Service.
        </p>
      </div>
    ),
  },
  {
    id: "cookies",
    icon: Cookie,
    title: "Cookies",
    content: (
      <div className="space-y-4">
        <p>
          redr.lol does not use cookies for analytics. We may use strictly necessary cookies or similar technologies to keep you signed in, protect your account, prevent abuse, and enable core functionality. These cookies are essential to the functioning of the Service and cannot be turned off in our systems.
        </p>
        <p>
          Our infrastructure is served and protected by{" "}
          <span className="text-zinc-200 font-medium">Cloudflare</span>, which may set its own cookies or use other identifiers for essential purposes such as load balancing, network routing, security, and DDoS protection. These Cloudflare cookies are technically necessary to maintain availability and protect against malicious traffic. You can review Cloudflare's cookie and privacy practices at{" "}
          <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline inline-flex items-center gap-1 transition">
            cloudflare.com/privacypolicy
          </a>.
        </p>
        <p>
          You can control non-essential cookies in your browser settings, but disabling essential cookies or Cloudflare security cookies may affect access or performance of the Service.
        </p>
      </div>
    ),
  },
  {
    id: "usage",
    icon: Shield,
    title: "How We Use Your Information",
    content: (
      <p>
        We use the information described above to operate and improve redr.lol; authenticate users and maintain secure sessions; display public profiles and links; measure page views and link performance without cookies; detect and debug website errors; monitor service health and reliability; prevent fraud, spam, and abuse; provide support; process purchases and subscriptions; comply with legal obligations; and enforce our Terms of Service. Diagnostic and telemetry data are used only to maintain and improve performance and security.
      </p>
    ),
  },
  {
    id: "marketing",
    icon: Mail,
    title: "Marketing and Communications",
    content: (
      <div className="space-y-4">
        <p>
          If you choose to receive updates from us, we may send you occasional emails about new features, product updates, promotions, or other information related to redr.lol. We only send marketing communications where permitted by law or where you have given explicit consent.
        </p>
        <p>
          You can opt out of marketing emails at any time by clicking the unsubscribe link included in every message or by contacting{" "}
          <a href="mailto:support@redr.lol" className="text-red-400 hover:underline">support@redr.lol</a>. Opting out will not affect essential service communications, such as transactional or account-related emails.
        </p>
        <p>
          We use reputable email service providers to deliver communications and track limited engagement metrics (such as open rates or link clicks) to understand effectiveness and prevent abuse. This data is processed in accordance with this Privacy Policy and applicable law.
        </p>
      </div>
    ),
  },
  {
    id: "legal",
    icon: Scale,
    title: "Legal Bases",
    content: (
      <p>
        Where required by law, we process personal data on the following bases: to perform a contract with you (providing the Service and paid features); for our legitimate interests (security, abuse prevention, service analytics without cookies, product improvement); with your consent where requested; and to comply with legal obligations and lawful requests.
      </p>
    ),
  },
  {
    id: "retention",
    icon: Trash2,
    title: "Data Retention and Deletion",
    content: (
      <div className="space-y-4">
        <p>
          We keep personal data only as long as needed for the purposes described in this Policy or as required by law. Analytics events are stored with an automatic lifetime and are removed when they expire. Session records end when they expire or are revoked. Image-hosting records remain while files are active or until their configured lifetime ends.
        </p>
        <p>
          When you request account deletion and the request is verified, we permanently delete your personal account data and user-generated content from active systems. This process is irreversible. Limited system logs and backup copies may temporarily persist for security, integrity, or legal compliance, after which they are automatically purged. We do not retain deleted user data for business, analytical, or operational use once deletion is complete.
        </p>
      </div>
    ),
  },
  {
    id: "disclosure",
    icon: Share2,
    title: "Disclosure of Your Information",
    content: (
      <div className="space-y-4">
        <p>
          We do not sell personal data. We share information with service providers who process it for us to deliver the Service—for example, cloud hosting, content delivery and security, payment processing and billing, email delivery, and anti-abuse tooling. These providers are bound by confidentiality and use limitations.
        </p>
        <p>
          We may disclose information if required by law or legal process; to protect the rights, safety, or integrity of users, the public, or the Service; or in connection with a corporate transaction involving the Service, in which case the successor will be bound by terms no less protective than those stated here.
        </p>
      </div>
    ),
  },
  {
    id: "thirdparty",
    icon: Globe,
    title: "Third-Party Links and Services",
    content: (
      <div className="space-y-4">
        <p>
          redr.lol may contain links to third-party websites, services, or profiles that are not operated or controlled by us. When you follow a link or interact with content from another platform, any personal information you provide is subject to that third party's own privacy policy, terms, and data practices—not ours. We do not monitor, endorse, or assume responsibility for how these external services collect, use, or protect your information.
        </p>
        <p>
          This includes links or embeds that users choose to display on their redr.lol pages, as well as integrations or external platforms you connect to your account. We recommend reviewing the privacy policies of any third-party websites or services before interacting with them or submitting personal data.
        </p>
      </div>
    ),
  },
  {
    id: "payments",
    icon: CreditCard,
    title: "Payments and Billing",
    content: (
      <div className="space-y-4">
        <p>
          All purchases and paid upgrades on redr.lol are processed securely through{" "}
          <span className="text-zinc-200 font-medium">Lemon Squeezy</span>, our authorized payment and merchant-of-record partner. Lemon Squeezy handles all billing, payment processing, and tax compliance on our behalf. This means your payment details such as card information, billing address, and transaction data are collected and stored by Lemon Squeezy in accordance with their own privacy and security policies.
        </p>
        <p>
          redr.lol does not receive or store full payment card details. We only retain limited transaction records necessary for verifying your purchase, activating your account features, preventing fraud, and providing support. All sensitive payment information is transmitted directly between you and Lemon Squeezy over an encrypted connection.
        </p>
        <p>
          For more information on how Lemon Squeezy processes your personal and payment data, please review their Privacy Policy at{" "}
          <a href="https://www.lemonsqueezy.com/privacy" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline transition">
            lemonsqueezy.com/privacy
          </a>.
        </p>
      </div>
    ),
  },
  {
    id: "international",
    icon: Globe,
    title: "International Transfers",
    content: (
      <p>
        Our infrastructure and service providers may operate in multiple countries. Where required, we implement safeguards for cross-border transfers and apply technical and organizational measures designed to protect your information regardless of where it is processed.
      </p>
    ),
  },
  {
    id: "security",
    icon: Lock,
    title: "Security",
    content: (
      <p>
        We use administrative, technical, and physical safeguards designed to protect personal data, including encrypted transport, access controls, and routine monitoring. No method of transmission or storage is entirely secure, and we cannot guarantee absolute security. If you suspect unauthorized access to your account, contact{" "}
        <a href="mailto:support@redr.lol" className="text-red-400 hover:underline">support@redr.lol</a> immediately.
      </p>
    ),
  },
  {
    id: "rights",
    icon: UserCheck,
    title: "Data Protection Rights",
    content: (
      <div className="space-y-4">
        <p>
          Depending on your location, you may be entitled to certain rights under data protection laws such as the General Data Protection Regulation (GDPR), the United Kingdom's Data Protection Act, or comparable privacy laws in other jurisdictions. redr.lol recognizes these principles globally and allows all users, where applicable, to exercise similar rights regarding their personal data. You have the right to know whether we hold information about you, to request a copy of that data, and to obtain it in a commonly used digital format. If any of the information we hold about you is inaccurate or incomplete, you may request that it be corrected or updated.
        </p>
        <p>
          You may also request that your data be deleted entirely from our systems. Once your identity has been verified and your request confirmed, we will permanently remove your personal information and user-generated content from active systems, except where limited retention is required to comply with legal obligations, prevent fraud, resolve disputes, or maintain service integrity. If you believe we are processing your information unlawfully or beyond the scope of your consent, you may request that we restrict or suspend certain types of processing, or object entirely where the processing is based on legitimate interest.
        </p>
        <p>
          Where our use of your information relies on your consent, you may withdraw that consent at any time without affecting the legality of any processing carried out before withdrawal. redr.lol does not engage in automated decision-making or profiling that would have a significant legal or personal effect on you. If you are unsatisfied with how we handle your data, you have the right to file a complaint with your local data protection authority. However, we encourage you to contact us first so we can attempt to resolve the matter directly and transparently.
        </p>
        <p>
          To access, edit, correct, or delete your personal information, you can use your account settings or contact{" "}
          <a href="mailto:support@redr.lol" className="text-red-400 hover:underline">support@redr.lol</a>. If you cannot access your account, contact support and we can process a manual deletion request. We will respond to all verified data requests within the time limits required by applicable law and may ask for reasonable proof of identity before taking action to protect your account and data.
        </p>
      </div>
    ),
  },
  {
    id: "children",
    icon: Baby,
    title: "Children's Information",
    content: (
      <p>
        The Service is not intended for children under 13, or the minimum age required in your jurisdiction if higher. We do not knowingly collect personal information from children below the applicable age. If you believe a child has provided personal information to us, contact{" "}
        <a href="mailto:support@redr.lol" className="text-red-400 hover:underline">support@redr.lol</a> and we will take appropriate action.
      </p>
    ),
  },
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState<string>("changes");
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const scrollToSection = (id: string) => {
    const element = sectionRefs.current[id];
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

      for (const section of policySections) {
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
      {/* Background Micro-glows */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#09090b]" />
        <div className="absolute left-1/2 top-0 h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-red-500/[0.04] blur-[240px]" />
        <div className="absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full bg-red-500/[0.02] blur-[180px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-32 pb-24">
        {/* Header Hero Section */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/10 bg-red-500/[0.04] px-4 py-2">
            <Shield size={14} className="text-red-400" />
            <span className="text-sm font-medium text-zinc-300">
              Privacy Framework
            </span>
          </div>

          <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-zinc-400 text-lg leading-relaxed">
            This Policy explains what we collect, why we collect it, and how we handle it when you create profiles, share links, and host images on <span className="text-zinc-200">redr.lol</span>. We keep analytics lightweight and do not use cookies for analytics. By using the Service, you consent to the practices described here.
          </p>

          <div className="mt-8 inline-flex rounded-full border border-white/5 bg-white/[0.02] px-4 py-1.5 text-xs font-medium text-zinc-500">
            Last updated: 11/09/2025
          </div>
        </div>

        {/* Content Layout */}
        <div className="mt-20 grid gap-10 lg:grid-cols-[300px_1fr]">
          {/* Sticky Table of Contents Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 max-h-[75vh] overflow-y-auto no-scrollbar rounded-3xl border border-white/10 bg-white/[0.01] backdrop-blur-sm p-5">
              <h3 className="font-medium text-xs text-zinc-500 px-3 uppercase tracking-wider">
                Documentation
              </h3>

              <div className="mt-4 space-y-1">
                {policySections.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-red-500/10 text-red-400 shadow-sm shadow-red-500/5"
                          : "text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200"
                      }`}
                    >
                      {section.title}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Privacy Cards Stack */}
          <div className="space-y-6">
            {policySections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <div
                  key={section.id}
                  ref={(el) => {
                    sectionRefs.current[section.id] = el;
                  }}
                  className={`rounded-[28px] border p-8 transition-all duration-300 ${
                    isActive
                      ? "border-red-500/20 bg-white/[0.03] shadow-lg shadow-red-500/[0.01]"
                      : "border-white/5 bg-white/[0.01]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`rounded-2xl p-3 transition-colors duration-300 ${
                        isActive ? "bg-red-500/15" : "bg-red-500/10"
                      }`}
                    >
                      <Icon
                        size={20}
                        className={isActive ? "text-red-400" : "text-red-400/80"}
                      />
                    </div>

                    <h2 className="text-2xl font-semibold text-zinc-100 tracking-tight">
                      {section.title}
                    </h2>
                  </div>

                  <div className="mt-6 leading-7 text-zinc-400 text-[15px] space-y-4">
                    {section.content}
                  </div>
                </div>
              );
            })}

            {/* Premium End Support Callout Card */}
            <div className="rounded-[32px] border border-red-500/10 bg-gradient-to-b from-red-500/[0.03] to-transparent p-10 text-center lg:text-left">
              <h2 className="text-3xl font-semibold text-zinc-100 tracking-tight">
                Any questions or concerns?
              </h2>

              <p className="mt-4 max-w-2xl text-zinc-400 leading-relaxed">
                If you have queries regarding your personal data rights, international data pipelines, or security standards at redr.lol, don't hesitate to message us.
              </p>

              <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
                <a
                  href="mailto:support@redr.lol"
                  className="rounded-xl border border-white/10 bg-white/[0.02] px-6 py-3.5 text-sm font-medium text-zinc-200 hover:bg-white/[0.06] hover:border-white/20 transition duration-200 shadow-sm"
                >
                  support@redr.lol
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
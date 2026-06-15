import {
  ArrowUpRight,
  Calendar,
  Sparkles,
} from "lucide-react";

const changelogs = [
  {
    version: "v1.4.0",
    date: "June 15, 2026",
    title: "Profile Performance Upgrade",
    description:
      "Improved profile loading speeds, optimized image delivery and reduced database query times across all creator pages.",
    tags: [
      "Performance",
      "Database",
      "Profiles",
    ],
  },
  {
    version: "v1.3.0",
    date: "June 10, 2026",
    title: "Audio System Overhaul",
    description:
      "Added improved audio streaming, better buffering and smoother playback controls.",
    tags: [
      "Audio",
      "Player",
      "UX",
    ],
  },
  {
    version: "v1.2.0",
    date: "June 5, 2026",
    title: "Discord Presence Improvements",
    description:
      "Presence updates are now faster and more reliable with improved websocket handling.",
    tags: [
      "Discord",
      "Presence",
      "Infrastructure",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#09090b]" />

        <div className="absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-red-500/[0.07] blur-[160px]" />

        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-red-500/[0.03] blur-[180px]" />
      </div>

      <div className="mx-auto max-w-5xl px-5 pt-32 pb-20 md:px-8 md:pt-40">
        {/* Hero */}
        <section>
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/10 bg-red-500/5 px-4 py-2">
            <Sparkles size={15} />
            <span className="text-sm text-zinc-300">
              Product Updates
            </span>
          </div>

          <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-6xl">
            Changelog
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-zinc-400">
            Follow every improvement, release and
            infrastructure update shipped to redr.lol.
          </p>
        </section>

        {/* Timeline */}
        <section className="mt-20">
          <div className="relative border-l border-zinc-800 pl-8">
            {changelogs.map((item, index) => (
              <div
                key={index}
                className="relative mb-16"
              >
                {/* Dot */}
                <div className="absolute -left-[41px] top-2 h-4 w-4 rounded-full border border-red-500/40 bg-red-500" />

                {/* Date */}
                <div className="mb-4 flex items-center gap-2 text-sm text-zinc-500">
                  <Calendar size={14} />
                  {item.date}
                </div>

                {/* Version */}
                <div className="inline-flex rounded-full border border-red-500/15 bg-red-500/5 px-3 py-1 text-xs font-medium text-red-300">
                  {item.version}
                </div>

                {/* Content */}
                <h2 className="mt-4 text-2xl font-semibold">
                  {item.title}
                </h2>

                <p className="mt-4 max-w-3xl leading-7 text-zinc-400">
                  {item.description}
                </p>

                {/* Tags */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1 text-xs text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Read More */}
                <button className="mt-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white">
                  Learn More
                  <ArrowUpRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
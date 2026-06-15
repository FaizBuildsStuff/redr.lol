import {
  ArrowRight,
  BadgeCheck,
  Crown,
  Gift,
  Sparkles,
  Users,
} from "lucide-react";

const partnerServers = [
  {
    name: "Redr Community",
    description: "Official creator and community network.",
    members: "42K+",
    online: "3.1K",
  },
  {
    name: "Creator Hub",
    description: "A community for creators and developers.",
    members: "18K+",
    online: "1.4K",
  },
  {
    name: "Design Society",
    description: "Creative designers and visual artists.",
    members: "12K+",
    online: "900+",
  },
];

const creators = [
  {
    name: "Max",
    role: "Founder",
    followers: "12K Followers",
  },
  {
    name: "Crypto - FaizuRrehman",
    role: "Developer",
    followers: "8K Followers",
  },
  {
    name: "Harry",
    role: "2nd Owner",
    followers: "15K Followers",
  },
];

export default function Partners() {
  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#09090b]" />

        <div className="absolute left-1/2 top-0 h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-red-500/[0.05] blur-[220px]" />

        <div className="absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full bg-red-500/[0.04] blur-[180px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-32 pb-24">
        {/* Hero */}
        <section className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/10 bg-red-500/[0.04] px-4 py-2">
            <Sparkles size={15} />
            <span className="text-sm text-zinc-300">
              Trusted Communities
            </span>
          </div>

          <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl">
            Partners
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            Discover the communities, creators, and organizations
            helping shape the redr.lol ecosystem.
          </p>
        </section>

        {/* Featured Partner */}
        <section className="mt-20">
          <div className="group relative overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.03] p-8 md:p-12">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/[0.06] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/10 bg-red-500/[0.04] px-4 py-2">
                <Crown size={15} />
                <span className="text-sm">
                  Featured Partner
                </span>
              </div>

              <h2 className="mt-6 text-4xl font-semibold">
                Redr Community
              </h2>

              <p className="mt-4 max-w-2xl text-zinc-400">
                The official community for creators, developers,
                designers, and ambitious builders using redr.lol.
              </p>

              <div className="mt-10 grid gap-6 md:grid-cols-3">
                <div>
                  <p className="text-sm text-zinc-500">
                    Members
                  </p>
                  <h3 className="mt-2 text-3xl font-semibold">
                    42K+
                  </h3>
                </div>

                <div>
                  <p className="text-sm text-zinc-500">
                    Online
                  </p>
                  <h3 className="mt-2 text-3xl font-semibold">
                    3.1K
                  </h3>
                </div>

                <div>
                  <p className="text-sm text-zinc-500">
                    Founded
                  </p>
                  <h3 className="mt-2 text-3xl font-semibold">
                    2025
                  </h3>
                </div>
              </div>

              <button className="mt-10 flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-medium text-black transition hover:scale-[1.02]">
                Join Community
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* Partner Servers */}
        <section className="mt-24">
          <h2 className="text-3xl font-semibold">
            Discord Partners
          </h2>

          <p className="mt-3 text-zinc-500">
            Trusted communities connected to the redr network.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {partnerServers.map((server) => (
              <div
                key={server.name}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-red-500/20 hover:bg-white/[0.05]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
                    <Users size={24} />
                  </div>

                  <BadgeCheck
                    className="text-red-400"
                    size={20}
                  />
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  {server.name}
                </h3>

                <p className="mt-3 text-zinc-400">
                  {server.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6">
                  <div>
                    <p className="text-xs text-zinc-500">
                      Members
                    </p>
                    <p className="font-medium">
                      {server.members}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">
                      Online
                    </p>
                    <p className="font-medium">
                      {server.online}
                    </p>
                  </div>
                </div>

                <button className="mt-6 flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white">
                  View Community
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Creator Partners */}
        <section className="mt-24">
          <h2 className="text-3xl font-semibold">
            Creator Network
          </h2>

          <p className="mt-3 text-zinc-500">
            Creators building and growing with redr.lol.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {creators.map((creator) => (
              <div
                key={creator.name}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-500/5" />

                <h3 className="mt-5 text-xl font-semibold">
                  {creator.name}
                </h3>

                <p className="mt-1 text-zinc-500">
                  {creator.role}
                </p>

                <p className="mt-4 text-sm text-zinc-400">
                  {creator.followers}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mt-24">
          <h2 className="text-3xl font-semibold">
            Partner Benefits
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <Users size={24} />
              <h3 className="mt-5 text-xl font-semibold">
                Community Growth
              </h3>
              <p className="mt-3 text-zinc-400">
                Reach new audiences through our trusted
                creator and community ecosystem.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <Gift size={24} />
              <h3 className="mt-5 text-xl font-semibold">
                Giveaways & Events
              </h3>
              <p className="mt-3 text-zinc-400">
                Participate in premium campaigns,
                rewards, and collaborative events.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <Crown size={24} />
              <h3 className="mt-5 text-xl font-semibold">
                Exclusive Perks
              </h3>
              <p className="mt-3 text-zinc-400">
                Unlock partner-only features and future
                premium opportunities.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-24">
          <div className="rounded-[40px] border border-red-500/10 bg-red-500/[0.03] p-10 text-center">
            <h2 className="text-4xl font-semibold">
              Become a Partner
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-zinc-400">
              Join the redr.lol partner ecosystem and connect
              your community with creators, developers,
              and audiences worldwide.
            </p>

            <button className="mt-8 rounded-2xl bg-white px-6 py-3 font-medium text-black transition hover:scale-[1.02]">
              Apply for Partnership
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
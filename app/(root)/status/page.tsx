import {
  Activity,
  CheckCircle2,
  Cloud,
  Database,
  Shield,
} from "lucide-react";

export default function StatusPage() {
  const services = [
    {
      name: "Database",
      icon: Database,
      status: "Operational",
      latency: "12ms",
    },
    {
      name: "Image Host",
      icon: Cloud,
      status: "Operational",
      latency: "38ms",
    },
    {
      name: "Authentication",
      icon: Shield,
      status: "Operational",
      latency: "25ms",
    },
    {
      name: "API",
      icon: Activity,
      status: "Operational",
      latency: "17ms",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-5 pt-32 pb-16 md:px-8 md:pt-40">
        {/* Header */}
        <section className="border-b border-zinc-900 pb-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-zinc-500">
                redr.lol infrastructure
              </p>

              <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
                System Status
              </h1>

              <p className="mt-4 max-w-2xl text-zinc-400">
                Real-time availability and performance monitoring for
                Redr services, APIs, uploads, analytics, creator
                infrastructure, and integrations.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-60" />
                </div>

                <div>
                  <p className="font-medium">
                    All Systems Operational
                  </p>

                  <p className="text-sm text-zinc-500">
                    Last updated just now
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-500">
              Global Uptime
            </p>

            <h2 className="mt-3 text-3xl font-semibold">
              99.99%
            </h2>
          </div>

          <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-500">
              Average Latency
            </p>

            <h2 className="mt-3 text-3xl font-semibold">
              18ms
            </h2>
          </div>

          <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-500">
              Last Incident
            </p>

            <h2 className="mt-3 text-3xl font-semibold">
              127 days ago
            </h2>
          </div>
        </section>

        {/* Services */}
        <section className="mt-10">
          <div className="rounded-3xl border border-zinc-900 bg-zinc-950 overflow-hidden">
            <div className="border-b border-zinc-900 px-6 py-5">
              <h2 className="font-medium">
                Infrastructure Services
              </h2>
            </div>

            <div>
              {services.map((service) => {
                const Icon = service.icon;

                return (
                  <div
                    key={service.name}
                    className="flex flex-col gap-4 border-b border-zinc-900 px-6 py-5 transition-colors hover:bg-zinc-900/40 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-xl border border-zinc-800 p-3">
                        <Icon size={18} />
                      </div>

                      <div>
                        <h3 className="font-medium">
                          {service.name}
                        </h3>

                        <p className="text-sm text-zinc-500">
                          Response time {service.latency}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        size={16}
                        className="text-emerald-500"
                      />

                      <span className="text-sm text-emerald-400">
                        {service.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Uptime */}
        <section className="mt-10 rounded-3xl border border-zinc-900 bg-zinc-950 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">
              90-Day Uptime
            </h2>

            <span className="text-sm text-zinc-500">
              99.99% uptime
            </span>
          </div>

          <div className="mt-6 flex gap-[3px] overflow-hidden">
            {Array.from({ length: 90 }).map((_, i) => (
              <div
                key={i}
                className="h-10 flex-1 rounded-sm bg-emerald-500/80"
              />
            ))}
          </div>
        </section>

        {/* Incident History */}
        <section className="mt-10 rounded-3xl border border-zinc-900 bg-zinc-950">
          <div className="border-b border-zinc-900 px-6 py-5">
            <h2 className="font-medium">
              Incident History
            </h2>
          </div>

          <div className="px-6 py-6">
            <div className="flex gap-4">
              <div className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />

              <div>
                <p className="font-medium">
                  No active incidents
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  All systems are currently operating normally.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
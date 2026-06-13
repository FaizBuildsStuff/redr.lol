import Link from 'next/link';
import { ArrowUpRight, Crown, Eye, Medal, Sparkles, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LeaderboardAnimated } from '@/components/leaderboard-animated';
import UserAvatar from '@/components/UserAvatar';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

type LeaderboardUser = {
  id: number;
  username: string;
  display_name: string | null;
  views: number;
  active_badges: unknown;
  discord_id: string | null;
  discord_avatar: string | null;
  google_avatar: string | null;
};

const formatViews = (views: number) =>
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(views);

export default async function LeaderboardPage() {
  const users = (await sql`
    SELECT id, username, display_name, views, active_badges, discord_id, discord_avatar, google_avatar
    FROM users
    WHERE views > 0
    ORDER BY views DESC, id ASC;
  `) as LeaderboardUser[];

  const topUsers = users ?? [];
  const topThree = topUsers.slice(0, 3);
  const rest = topUsers.slice(3);

  return (
    <LeaderboardAnimated className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,82,82,0.16),transparent_45%),linear-gradient(135deg,#040404_0%,#080808_50%,#060606_100%)] px-4 py-8 text-[#f5f1e8] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 pt-24 sm:pt-28 lg:pt-32">
        <section
          data-animate="hero"
          className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 px-6 py-8 shadow-[0_0_80px_rgba(220,38,38,0.16)] backdrop-blur-xl sm:px-8 lg:px-10"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ff5c5c]/25 bg-[#ff5c5c]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#ffb3b3]">
                <Sparkles className="h-3.5 w-3.5" />
                Live creator leaderboard
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  The most watched profiles, ranked in real time.
                </h1>
                <p className="max-w-xl text-sm leading-7 text-[#c9c2b5] sm:text-base">
                  Discover the creators with the strongest momentum, from the top three premium showcases to the rest of the rising community.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Active creators', value: topUsers.length.toString(), icon: Users },
                { label: 'Top spotlight', value: topThree[0] ? `#${topThree[0].views.toLocaleString()}` : '—', icon: Crown },
                { label: 'Pulse', value: 'Live', icon: TrendingUp },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  data-animate="hero"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <stat.icon className="h-4 w-4 text-[#ff6b6b]" />
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#9b9387]">0{index + 1}</span>
                  </div>
                  <p className="text-lg font-semibold text-white">{stat.value}</p>
                  <p className="text-xs text-[#9b9387]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#ff7b7b]">Premium podium</p>
                <h2 className="text-xl font-semibold text-white">Top performers</h2>
              </div>
            </div>

            <div className="space-y-4">
              {topThree.map((user, index) => {
                const rank = index + 1;
                const isTopOne = rank === 1;
                const isTopTwo = rank === 2;
                const isTopThree = rank === 3;

                return (
                  <Card
                    key={user.id}
                    data-animate="card"
                    className={[
                      'relative overflow-hidden border bg-[#0c0c0d]/90 shadow-[0_20px_80px_rgba(0,0,0,0.34)]',
                      isTopOne && 'border-[#ffd36b]/40 bg-[linear-gradient(135deg,rgba(255,195,77,0.14),rgba(255,92,92,0.08))] shadow-[0_0_80px_rgba(255,122,122,0.14)]',
                      isTopTwo && 'border-[#d9e2f5]/25 bg-[linear-gradient(135deg,rgba(188,204,226,0.12),rgba(255,92,92,0.05))]',
                      isTopThree && 'border-[#c18a5b]/30 bg-[linear-gradient(135deg,rgba(193,138,91,0.12),rgba(255,92,92,0.04))]',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-[#ff6b6b] to-transparent" />
                    <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <UserAvatar
                          discordId={user.discord_id}
                          discordAvatar={user.discord_avatar}
                          googleAvatar={user.google_avatar}
                          username={user.username}
                          size={56}
                          rounded="rounded-2xl"
                          className="border border-white/10 bg-white/10"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {isTopOne ? <Crown className="h-4 w-4 text-[#ffd36b]" /> : <Medal className="h-4 w-4 text-[#ff8f8f]" />}
                            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8e887d]">Rank {rank}</p>
                          </div>
                          <h3 className="text-lg font-semibold text-white">{user.display_name || user.username}</h3>
                          <p className="text-sm text-[#b5af9f]">@{user.username}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                        <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-[#ffb0b0]">
                          {rank === 1 ? 'Premium' : rank === 2 ? 'Rising' : 'Momentum'}
                        </div>
                        <div className="min-w-26 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
                          <p className="text-[10px] uppercase tracking-[0.28em] text-[#8e887d]">Views</p>
                          <p className="text-base font-semibold text-white">{formatViews(user.views)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <aside className="space-y-4">
            <Card className="border-white/10 bg-[#0c0c0d]/85 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Community pulse</CardTitle>
                <CardDescription className="text-[#9b9387]">
                  A minimalist snapshot of the creators gaining the most attention.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#ff8f8f]">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-medium">Live views</span>
                    </div>
                    <span className="text-sm font-semibold text-white">{topUsers[0]?.views ? formatViews(topUsers[0].views) : '0'}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className="h-2 w-[82%] rounded-full bg-linear-to-r from-[#ff7b7b] to-[#ffd36b]" />
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-[#9b9387]">Showing the latest ranked set from the database.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#0c0c0d]/85 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Rising creators</CardTitle>
                <CardDescription className="text-[#9b9387]">The next wave beyond the podium.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {rest.length > 0 ? (
                  rest.slice(0, 6).map((user, index) => (
                    <Link href={`/${user.username}`} key={user.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-3 transition hover:border-[#ff7b7b]/40 hover:bg-white/10">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          discordId={user.discord_id}
                          discordAvatar={user.discord_avatar}
                          googleAvatar={user.google_avatar}
                          username={user.username}
                          size={36}
                          rounded="rounded-xl"
                          className="bg-white/10"
                        />
                        <div>
                          <p className="text-sm font-medium text-white">{user.display_name || user.username}</p>
                          <p className="text-xs text-[#8e887d]">@{user.username}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-white">{formatViews(user.views)}</p>
                        <p className="text-[10px] uppercase tracking-[0.25em] text-[#8e887d]">views</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-[#9b9387]">
                    No additional creators are ranked yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-black/30 p-5 backdrop-blur-xl sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#ff8f8f]">Ranking details</p>
              <h2 className="text-xl font-semibold text-white">Profiles are ordered by live database view counts.</h2>
            </div>
            <Button asChild variant="outline" className="border-[#ff6b6b]/30 bg-[#ff6b6b]/10 text-[#ffd8d8] hover:bg-[#ff6b6b]/20">
              <Link href="/" className="inline-flex items-center gap-2">
                Explore profile experience
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-3 sm:p-4">
            <div className="mb-3 flex items-center justify-between px-2">
              <div>
                <h3 className="text-lg font-semibold text-white">All active users</h3>
                <p className="text-sm text-[#9b9387]">Full live ranking with views.</p>
              </div>
              <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.25em] text-[#ffb0b0]">
                {topUsers.length} users
              </div>
            </div>

            <div className="space-y-2">
              {topUsers.map((user, index) => (
                <Link
                  key={user.id}
                  href={`/${user.username}`}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/30 px-3 py-3 transition hover:border-[#ff7b7b]/40 hover:bg-white/10 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-sm font-semibold text-white">
                      #{index + 1}
                    </div>
                    <UserAvatar
                      discordId={user.discord_id}
                      discordAvatar={user.discord_avatar}
                      googleAvatar={user.google_avatar}
                      username={user.username}
                      size={40}
                      rounded="rounded-full"
                      className="border border-white/10 bg-white/10"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">{user.display_name || user.username}</p>
                      <p className="text-xs text-[#8e887d]">@{user.username}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:justify-end">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">{formatViews(user.views)}</p>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-[#8e887d]">views</p>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[#ffb0b0]">
                      {index < 3 ? 'Top tier' : 'Active'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </LeaderboardAnimated>
  );
}
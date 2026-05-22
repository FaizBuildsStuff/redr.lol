"use client";

import React, { useEffect, useState } from "react";
import { useLanyard } from "@/hooks/use-lanyard";
import { Tv } from "lucide-react";

interface DiscordProfileProps {
  discordId: string;
}

export function DiscordProfile({ discordId }: DiscordProfileProps) {
  const { data: lanyard } = useLanyard(discordId);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDiscordProfile() {
      try {
        setLoading(true);
        const res = await fetch(`https://dcdn.dstn.to/profile/${discordId}`);
        if (res.ok) {
          const data = await res.json();
          setProfileData(data);
        }
      } catch (error) {
        console.error("Failed to fetch Discord profile from proxy:", error);
      } finally {
        setLoading(false);
      }
    }
    if (discordId) fetchDiscordProfile();
  }, [discordId]);

  if (!discordId) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-[#8C8C8C] uppercase tracking-wider font-semibold p-6 text-center border-2 border-dashed border-white/5 rounded-3xl bg-black/20">
        No Discord Account Connected
      </div>
    );
  }

  // Theme / accent colours
  const themeColors = profileData?.user_profile?.theme_colors?.length
    ? profileData.user_profile.theme_colors.map(
        (color: number) => "#" + color.toString(16).padStart(6, "0").toUpperCase()
      )
    : ["#111214", "#111214"];
  const accentColor = themeColors[0];

  // Status
  const statusColorMap: Record<string, string> = {
    online: "#23a559",
    idle: "#f0b232",
    dnd:  "#f23f43",
    offline: "#80848e",
  };
  const currentStatus = lanyard?.discord_status || "offline";
  const statusColor = statusColorMap[currentStatus] ?? "#80848e";

  // Avatar
  const avatarHash = lanyard?.discord_user?.avatar || profileData?.user?.avatar;
  const avatarUrl = avatarHash
    ? `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.${avatarHash.startsWith("a_") ? "gif" : "png"}?size=256`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(discordId) % 5}.png`;

  // Banner — Lanyard doesn't expose banner hash; use profileData
  const bannerHash = profileData?.user_profile?.banner || profileData?.user?.banner;
  const bannerUrl = bannerHash
    ? `https://cdn.discordapp.com/banners/${discordId}/${bannerHash}.${bannerHash.startsWith("a_") ? "gif" : "png"}?size=600`
    : null;

  // Avatar decoration
  const decoAsset =
    profileData?.user?.avatar_decoration_data?.asset ||
    lanyard?.discord_user?.avatar_decoration_data?.asset;

  // Badges
  const badges: any[] = profileData?.badges || [];

  // Custom status (type 4)
  const customStatus = lanyard?.activities?.find((a: any) => a.type === 4);

  // Bio
  const bio = profileData?.user_profile?.bio || profileData?.user?.bio || "";

  // Display name
  const displayName =
    lanyard?.discord_user?.global_name ||
    profileData?.user?.global_name ||
    lanyard?.discord_user?.username ||
    profileData?.user?.username ||
    "Unknown";
  const username = lanyard?.discord_user?.username || profileData?.user?.username || "";

  return (
    <div className="relative w-full max-w-[340px] mx-auto rounded-2xl overflow-hidden bg-[#111214] shadow-2xl border border-white/5 text-[#dbdee1] flex flex-col">

      {/* ── Banner ── */}
      <div
        className="h-[120px] w-full flex-shrink-0 bg-cover bg-center"
        style={{
          backgroundColor: accentColor,
          backgroundImage: bannerUrl ? `url(${bannerUrl})` : undefined,
        }}
      />

      {/* ── Body ── */}
      <div className="relative px-4 pb-4 flex-1">

        {/* Avatar group — sits half over the banner */}
        <div className="absolute -top-11 left-4">
          {/* Outer ring (provides the dark border effect) */}
          <div className="relative w-[88px] h-[88px]">
            {/* Avatar image */}
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-[88px] h-[88px] rounded-full object-cover ring-4 ring-[#111214]"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://cdn.discordapp.com/embed/avatars/0.png`;
              }}
            />

            {/* Avatar decoration — layered on top, NOT inside the avatar ring div */}
            {decoAsset && (
              <img
                src={`https://cdn.discordapp.com/avatar-decoration-presets/${decoAsset}.png?size=256&passthrough=true`}
                alt=""
                draggable={false}
                style={{
                  position: "absolute",
                  width: "140px",
                  height: "auto",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                  userSelect: "none",
                  zIndex: 10,
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}

            {/* Status dot */}
            <span
              className="absolute bottom-0.5 right-0.5 block w-4 h-4 rounded-full ring-2 ring-[#111214]"
              style={{ backgroundColor: statusColor }}
            />
          </div>
        </div>

        {/* Badges — top-right of body */}
        {badges.length > 0 && (
          <div className="absolute top-3 right-4 flex gap-1 bg-black/40 p-1.5 rounded-lg border border-white/5">
            {badges.map((badge: any, idx: number) => (
              <img
                key={idx}
                src={`https://cdn.discordapp.com/badge-icons/${badge.icon}.png`}
                alt={badge.id}
                title={badge.description}
                className="w-5 h-5 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ))}
          </div>
        )}

        {/* ── Profile info ── */}
        <div className="mt-14 space-y-2">

          {/* Name + username */}
          <div>
            <h1 className="text-[17px] font-bold text-white leading-tight tracking-tight">
              {displayName}
            </h1>
            {username && (
              <p className="text-[13px] text-[#b5bac1] font-medium leading-snug">
                {username}
              </p>
            )}
          </div>

          {/* Custom status */}
          {customStatus && (
            <div className="flex items-center gap-1.5 text-[13px] text-[#b5bac1]">
              {customStatus.emoji?.id ? (
                <img
                  src={`https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${customStatus.emoji.animated ? "gif" : "png"}?size=24`}
                  alt=""
                  className="w-4 h-4 object-contain flex-shrink-0"
                />
              ) : customStatus.emoji?.name ? (
                <span className="text-sm">{customStatus.emoji.name}</span>
              ) : null}
              <span className="truncate">{customStatus.state}</span>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-white/5 pt-3 space-y-3">

            {/* Bio */}
            {bio && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#b5bac1] mb-1">
                  About Me
                </p>
                <p className="text-[13px] text-[#dbdee1] whitespace-pre-wrap leading-relaxed opacity-90">
                  {bio}
                </p>
              </div>
            )}

            {/* Rich Presence activities (exclude custom status type 4) */}
            {lanyard?.activities
              ?.filter((a: any) => a.type !== 4)
              .map((activity: any, idx: number) => (
                <div key={idx}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#b5bac1] mb-1.5">
                    {activity.type === 0
                      ? "Playing a game"
                      : activity.type === 2
                      ? "Listening to Spotify"
                      : activity.type === 3
                      ? "Watching"
                      : "Activity"}
                  </p>
                  <div className="flex gap-3 items-start">
                    {/* Activity image */}
                    <div className="w-16 h-16 rounded-xl bg-neutral-800 flex-shrink-0 overflow-hidden relative">
                      {activity.assets?.large_image ? (
                        <img
                          src={
                            activity.assets.large_image.startsWith("spotify:")
                              ? `https://i.scdn.co/image/${activity.assets.large_image.replace("spotify:", "")}`
                              : activity.assets.large_image.startsWith("mp:")
                              ? `https://media.discordapp.net/${activity.assets.large_image.replace("mp:", "")}`
                              : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`
                          }
                          alt={activity.assets?.large_text || activity.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Tv className="w-6 h-6 text-white/20" />
                        </div>
                      )}
                      {/* Small image badge */}
                      {activity.assets?.small_image && (
                        <img
                          src={
                            activity.assets.small_image.startsWith("mp:")
                              ? `https://media.discordapp.net/${activity.assets.small_image.replace("mp:", "")}`
                              : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.png`
                          }
                          alt={activity.assets?.small_text ?? ""}
                          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-[3px] border-[#111214] object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      )}
                    </div>

                    {/* Activity text */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="font-semibold text-[13px] text-white truncate">
                        {activity.name}
                      </p>
                      {activity.details && (
                        <p className="text-[12px] text-[#b5bac1] truncate">{activity.details}</p>
                      )}
                      {activity.state && (
                        <p className="text-[12px] text-[#b5bac1] truncate">{activity.state}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

          </div>
        </div>
      </div>
    </div>
  );
}

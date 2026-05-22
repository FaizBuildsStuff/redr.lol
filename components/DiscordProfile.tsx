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
    
    if (discordId) {
      fetchDiscordProfile();
    }
  }, [discordId]);

  if (!discordId) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-[#8C8C8C] uppercase tracking-wider font-semibold p-6 text-center border-2 border-dashed border-white/5 rounded-3xl bg-black/20">
        No Discord Account Connected
      </div>
    );
  }

  const themeColors = profileData?.user_profile?.theme_colors?.length
    ? profileData.user_profile.theme_colors.map(
        (color: number) => "#" + color.toString(16).padStart(6, "0").toUpperCase()
      )
    : ["#5C5C5C", "#5C5C5C"];

  const accentColor = themeColors[0];
  const customStatus = lanyard?.activities?.find((a: any) => a.name === "Custom Status");
  const avatarUrl = lanyard?.discord_user?.avatar 
    ? `https://cdn.discordapp.com/avatars/${discordId}/${lanyard.discord_user.avatar}.png?size=256` 
    : null;
    
  const bannerUrl = lanyard?.discord_user?.banner 
    ? `https://cdn.discordapp.com/banners/${discordId}/${lanyard.discord_user.banner}.png?size=512`
    : null;

  const statusColorMap: Record<string, string> = {
    online: "#23a559",
    idle: "#f0b232",
    dnd: "#f23f43",
    offline: "#80848e"
  };

  const currentStatus = lanyard?.discord_status || "offline";
  const statusColor = statusColorMap[currentStatus];

  return (
    <div className="relative w-full max-w-[340px] mx-auto rounded-2xl overflow-hidden bg-[#111214] shadow-2xl border border-white/5 text-[#dbdee1] flex flex-col transform transition-all duration-300 hover:scale-[1.02]">
      {/* Banner */}
      <div 
        className="h-[120px] w-full bg-cover bg-center"
        style={{ 
          backgroundColor: accentColor,
          backgroundImage: bannerUrl ? `url(${bannerUrl})` : undefined
        }}
      />
      
      {/* Avatar Container */}
      <div className="relative px-4 pb-4 flex-1">
        <div className="absolute -top-12 left-4">
          <div className="relative">
            <div className="w-[92px] h-[92px] rounded-full bg-[#111214] p-1.5 flex items-center justify-center">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Avatar" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-neutral-800" />
              )}
            </div>
            {/* Status Indicator */}
            <div 
              className="absolute bottom-1 right-1 w-[22px] h-[22px] rounded-full bg-[#111214] flex items-center justify-center"
            >
              <div 
                className="w-3.5 h-3.5 rounded-full"
                style={{ backgroundColor: statusColor }}
              />
            </div>
          </div>
        </div>

        {/* Badges */}
        {profileData?.badges?.length > 0 && (
          <div className="absolute top-3 right-4 flex gap-1.5 bg-black/40 p-1.5 rounded-lg border border-white/5">
            {profileData.badges.map((badge: any, idx: number) => (
              <img 
                key={idx}
                src={`https://cdn.discordapp.com/badge-icons/${badge.icon}.png`}
                alt={badge.id}
                title={badge.description}
                className="w-5 h-5 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ))}
          </div>
        )}

        {/* Profile Info */}
        <div className="mt-14 space-y-3">
          <div className="leading-none">
            <h1 className="text-xl font-bold text-white tracking-tight">
              {lanyard?.discord_user?.global_name || lanyard?.discord_user?.username || "Loading..."}
            </h1>
            <p className="text-sm font-medium text-[#b5bac1] mt-1">
              {lanyard?.discord_user?.username}
            </p>
          </div>

          {/* Custom Status */}
          {customStatus && (
            <div className="text-sm pb-3 border-b border-white/5 flex items-center gap-2">
              {customStatus.emoji && (
                <img 
                  src={customStatus.emoji.id 
                    ? `https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${customStatus.emoji.animated ? 'gif' : 'png'}?size=24`
                    : ""
                  } 
                  alt="" 
                  className="w-5 h-5 object-contain"
                />
              )}
              <span>{customStatus.state}</span>
            </div>
          )}

          {/* Bio */}
          {(profileData?.user_profile?.bio || profileData?.user?.bio) && (
            <div className="text-sm">
              <h3 className="text-xs font-bold uppercase text-[#b5bac1] mb-2 tracking-wider">About Me</h3>
              <div className="text-[#dbdee1] whitespace-pre-wrap text-[13px] leading-relaxed opacity-90">
                {profileData.user_profile?.bio || profileData.user?.bio}
              </div>
            </div>
          )}
          
          {/* Active Status Display / Current Activity (Rich Presence) */}
          {lanyard?.activities?.filter((a: any) => a.type !== 4).map((activity: any, idx: number) => (
            <div key={idx} className="mt-4">
              <h3 className="text-xs font-bold uppercase text-[#b5bac1] mb-2 tracking-wider">
                {activity.type === 0 ? "Playing a game" : activity.type === 2 ? "Listening to Spotify" : activity.type === 3 ? "Watching" : "Activity"}
              </h3>
              <div className="flex gap-3 items-center">
                <div className="w-16 h-16 rounded-xl bg-neutral-800 flex-shrink-0 overflow-hidden relative">
                  {activity.assets?.large_image ? (
                    <img 
                      src={activity.assets.large_image.startsWith("spotify:") 
                        ? `https://i.scdn.co/image/${activity.assets.large_image.replace("spotify:", "")}`
                        : activity.assets.large_image.startsWith("mp:")
                        ? `https://media.discordapp.net/${activity.assets.large_image.replace("mp:", "")}`
                        : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`}
                      alt={activity.assets?.large_text || activity.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black/40">
                       <Tv className="w-6 h-6 text-white/20" />
                    </div>
                  )}
                  {activity.assets?.small_image && (
                    <img 
                      src={activity.assets.small_image.startsWith("mp:")
                        ? `https://media.discordapp.net/${activity.assets.small_image.replace("mp:", "")}`
                        : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.png`}
                      alt={activity.assets?.small_text}
                      className="absolute bottom-[-4px] right-[-4px] w-6 h-6 rounded-full border-[3px] border-[#111214] bg-[#111214]"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-white truncate">{activity.name}</div>
                  {activity.details && <div className="text-sm text-[#b5bac1] truncate">{activity.details}</div>}
                  {activity.state && <div className="text-sm text-[#b5bac1] truncate">{activity.state}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";

interface UserAvatarProps {
  discordId?: string | null;
  discordAvatar?: string | null;
  username: string;
  size?: number; // px
  className?: string;
  rounded?: string; // tailwind class e.g. "rounded-xl" "rounded-full"
}

/**
 * UserAvatar — shows Discord profile picture (animated if avatar hash starts with "a_"),
 * falling back to a styled initials tile if no Discord data is available.
 */
export default function UserAvatar({
  discordId,
  discordAvatar,
  username,
  size = 40,
  className = "",
  rounded = "rounded-xl",
}: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);

  const hasDiscord = discordId && discordAvatar && !imgError;
  const isAnimated = discordAvatar?.startsWith("a_");

  const avatarUrl = hasDiscord
    ? `https://cdn.discordapp.com/avatars/${discordId}/${discordAvatar}.${isAnimated ? "gif" : "png"}?size=256`
    : null;

  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div
      className={`relative overflow-hidden flex-shrink-0 ${rounded} ${className}`}
      style={{ width: size, height: size }}
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt={`${username}'s avatar`}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className={`h-full w-full flex items-center justify-center bg-gradient-to-br from-red-600 to-[#100303] border border-red-500/20`}
        >
          <span
            className="font-black text-white tracking-widest uppercase"
            style={{ fontSize: size * 0.33 }}
          >
            {initials}
          </span>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
        </div>
      )}
    </div>
  );
}

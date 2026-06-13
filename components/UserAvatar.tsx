"use client";

import React, { useEffect, useState } from "react";

interface UserAvatarProps {
  discordId?: string | null;
  discordAvatar?: string | null;
  googleAvatar?: string | null;
  username: string;
  size?: number; // px
  className?: string;
  rounded?: string; // tailwind class e.g. "rounded-xl" "rounded-full"
}

const isAbsoluteImageUrl = (value?: string | null) => {
  if (!value) return false;
  const trimmed = value.trim();
  return trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:");
};

const resolveAvatarUrl = ({
  discordId,
  discordAvatar,
  googleAvatar,
}: {
  discordId?: string | null;
  discordAvatar?: string | null;
  googleAvatar?: string | null;
}) => {
  if (googleAvatar && isAbsoluteImageUrl(googleAvatar)) return googleAvatar;

  if (discordAvatar && isAbsoluteImageUrl(discordAvatar)) return discordAvatar;

  if (discordId && discordAvatar) {
    const hash = discordAvatar.trim();
    const isAnimated = hash.startsWith("a_");
    return `https://cdn.discordapp.com/avatars/${discordId}/${hash}.${isAnimated ? "gif" : "png"}?size=256`;
  }

  if (discordId) {
    const fallbackIndex = Number.parseInt(discordId, 10) % 5;
    return `https://cdn.discordapp.com/embed/avatars/${fallbackIndex}.png`;
  }

  return null;
};

/**
 * UserAvatar — shows Discord or Google profile pictures when available,
 * falling back to a styled initials tile if no usable avatar data is available.
 */
export default function UserAvatar({
  discordId,
  discordAvatar,
  googleAvatar,
  username,
  size = 40,
  className = "",
  rounded = "rounded-xl",
}: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [discordId, discordAvatar, googleAvatar]);

  const avatarUrl = !imgError
    ? resolveAvatarUrl({ discordId, discordAvatar, googleAvatar })
    : null;

  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div
      className={`relative shrink-0 overflow-hidden ${rounded} ${className}`}
      style={{ width: size, height: size }}
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt={`${username}'s avatar`}
          width={size}
          height={size}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center border border-red-500/20 bg-linear-to-br from-red-600 to-[#100303]`}
        >
          <span
            className="font-black text-white tracking-widest uppercase"
            style={{ fontSize: size * 0.33 }}
          >
            {initials}
          </span>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--tw-gradient-stops))] from-white/10 to-transparent" />
        </div>
      )}
    </div>
  );
}

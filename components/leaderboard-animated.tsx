'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';

export function LeaderboardAnimated({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroItems = containerRef.current?.querySelectorAll('[data-animate="hero"]');
      const cardItems = containerRef.current?.querySelectorAll('[data-animate="card"]');

      gsap.fromTo(
        heroItems || [],
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
        }
      );

      gsap.fromTo(
        cardItems || [],
        { opacity: 0, y: 40, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.08,
          delay: 0.15,
          ease: 'power3.out',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

import { useEffect, useState, useRef } from "react";

export interface LanyardData {
  spotify: any;
  discord_user: {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    bot: boolean;
    global_name: string;
    avatar_decoration_data?: {
      asset: string;
      sku_id: number;
    };
    display_name: string;
    public_flags: number;
  };
  activities: any[];
  discord_status: string;
  active_on_discord_web: boolean;
  active_on_discord_desktop: boolean;
  active_on_discord_mobile: boolean;
  listening_to_spotify: boolean;
}

export function useLanyard(discordId: string | null | undefined) {
  const [data, setData] = useState<LanyardData | null>(null);

  useEffect(() => {
    if (!discordId) {
      setData(null);
      return;
    }

    let ws: WebSocket | null = null;
    let heartbeat: ReturnType<typeof setInterval> | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let connectTimer: ReturnType<typeof setTimeout> | null = null;
    let attempts = 0;
    const MAX_ATTEMPTS = 5;
    const BASE_DELAY = 3000;
    // This flag is set to true the moment cleanup runs so that no
    // callback scheduled in the future can open a new socket.
    let dead = false;

    function destroySocket() {
      if (heartbeat) { clearInterval(heartbeat); heartbeat = null; }
      if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
      if (ws) {
        const s = ws;
        ws = null;
        // Null out all handlers BEFORE closing so the onclose handler
        // never fires and never tries to schedule a reconnect.
        s.onopen = null;
        s.onmessage = null;
        s.onerror = null;
        s.onclose = null;
        // Only call close() when the socket is fully OPEN to avoid the
        // "WebSocket closed before connection established" browser warning.
        if (s.readyState === WebSocket.OPEN) {
          s.close(1000, "cleanup");
        }
        // If it's still CONNECTING we just dropped the handlers — the
        // browser will complete the handshake and then idle; no warning.
      }
    }

    function scheduleConnect(delay = 0) {
      if (dead) return;
      connectTimer = setTimeout(() => {
        if (dead) return;
        openSocket();
      }, delay);
    }

    function openSocket() {
      if (dead) return;
      destroySocket();

      try {
        ws = new WebSocket("wss://api.lanyard.rest/socket");
      } catch {
        return; // WebSocket not available (SSR safety)
      }

      ws.onopen = () => {
        if (dead || !ws) return;
        attempts = 0;
        ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: discordId } }));
      };

      ws.onmessage = (event) => {
        if (dead) return;
        try {
          const msg = JSON.parse(event.data as string);
          if (msg.d?.heartbeat_interval) {
            if (heartbeat) clearInterval(heartbeat);
            heartbeat = setInterval(() => {
              if (ws?.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ op: 3 }));
              }
            }, msg.d.heartbeat_interval);
          }
          if (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE") {
            setData(msg.d);
          }
        } catch {
          // ignore malformed frames
        }
      };

      ws.onerror = () => {
        // onclose fires right after; let it handle retry
      };

      ws.onclose = () => {
        if (dead) return;
        if (heartbeat) { clearInterval(heartbeat); heartbeat = null; }
        ws = null;
        if (attempts < MAX_ATTEMPTS) {
          const delay = BASE_DELAY * Math.pow(2, attempts);
          attempts++;
          reconnectTimer = setTimeout(() => scheduleConnect(), delay);
        }
      };
    }

    // ⬇ Delay the initial connect by 150 ms.
    // React 18 Strict Mode intentionally mounts → unmounts → remounts
    // every component in development. If cleanup fires within 150 ms
    // (it always does for the Strict-Mode ghost mount) the timer is
    // cancelled and the socket is never created — eliminating the
    // "WebSocket closed before connection established" warning entirely.
    scheduleConnect(150);

    return () => {
      dead = true;
      if (connectTimer) { clearTimeout(connectTimer); connectTimer = null; }
      destroySocket();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discordId]);

  return { data };
}

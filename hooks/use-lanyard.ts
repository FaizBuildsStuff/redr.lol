import { useEffect, useState, useRef, useCallback } from "react";

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
  const socketRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const baseReconnectDelay = 1000;

  const cleanup = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (!discordId) return;

    cleanup();

    const ws = new WebSocket("wss://api.lanyard.rest/socket");
    socketRef.current = ws;

    ws.onopen = () => {
      reconnectAttempts.current = 0;
      ws.send(
        JSON.stringify({
          op: 2,
          d: {
            subscribe_to_id: discordId,
          },
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.d?.heartbeat_interval) {
          heartbeatRef.current = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ op: 3 }));
            }
          }, message.d.heartbeat_interval);
        }

        if (message.t === "INIT_STATE" || message.t === "PRESENCE_UPDATE") {
          setData(message.d);
        }
      } catch (error) {
        console.error("Error parsing Lanyard WebSocket message:", error);
      }
    };

    ws.onclose = (event) => {
      cleanup();
      if (!event.wasClean && reconnectAttempts.current < maxReconnectAttempts) {
        const delay = baseReconnectDelay * Math.pow(2, reconnectAttempts.current);
        reconnectAttempts.current++;
        setTimeout(connect, delay);
      }
    };
  }, [discordId, cleanup]);

  useEffect(() => {
    if (discordId) {
      connect();
    } else {
      setData(null);
    }
    return () => cleanup();
  }, [discordId, connect, cleanup]);

  return { data };
}

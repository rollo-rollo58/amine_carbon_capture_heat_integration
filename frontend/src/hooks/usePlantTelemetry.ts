'use client';

import { useEffect, useState } from 'react';
import type { Telemetry } from '@/types/domain';
import { getTelemetry, websocketAddress } from '@/lib/api-client';

export function usePlantTelemetry() {
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);
  const [state, setState] = useState<'connecting' | 'live' | 'offline'>('connecting');
  const [samples, setSamples] = useState<Telemetry[]>([]);

  useEffect(() => {
    let mounted = true;
    const socket = new WebSocket(websocketAddress());
    const insert = (sample: Telemetry) => {
      if (!mounted) return;
      setTelemetry(sample);
      setSamples((list) => [...list.slice(-39), sample]);
      setState('live');
    };
    socket.onmessage = (event: MessageEvent<string>) => {
      try {
        insert(JSON.parse(event.data) as Telemetry);
      } catch {
        setState('offline');
      }
    };
    socket.onerror = () => setState('offline');
    socket.onclose = () => setState('offline');
    void getTelemetry().then(insert).catch(() => setState('offline'));
    return () => {
      mounted = false;
      socket.close();
    };
  }, []);

  return { telemetry, state, samples };
}

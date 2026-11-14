import type {
  Plant,
  ScenarioInput,
  ScenarioResponse,
  Telemetry,
} from '@/types/domain';

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

async function readJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`The research API returned ${response.status} for ${path}`);
  }
  return (await response.json()) as T;
}

export function getPlant(): Promise<Plant> {
  return readJson('/api/v1/plant');
}

export function getTelemetry(): Promise<Telemetry> {
  return readJson('/api/v1/telemetry');
}

export function runScenario(input: ScenarioInput): Promise<ScenarioResponse> {
  return readJson('/api/v1/scenarios', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function getAlarms(): Promise<Array<{ code: string; severity: string }>> {
  return readJson('/api/v1/alarms');
}

export function websocketAddress(): string {
  return `${BASE.replace(/^http/, 'ws')}/ws/telemetry`;
}

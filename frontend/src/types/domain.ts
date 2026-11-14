export interface ScenarioInput {
  flue_gas_kmol_h: number;
  co2_mole_fraction: number;
  lean_solvent_m3_h: number;
  lean_loading: number;
  rich_loading: number;
  stripper_temperature_c: number;
  inlet_pressure_bar: number;
  storage_pressure_bar: number;
  solvent_age_days: number;
  ambient_temperature_c: number;
  heat_recovery_fraction: number;
}

export interface ScenarioOutput {
  feed_co2_t_h: number;
  captured_co2_t_h: number;
  emitted_co2_t_h: number;
  capture_percent: number;
  solvent_circulation_m3_h: number;
  reboiler_mw: number;
  heat_recovered_mw: number;
  compressor_mw: number;
  pump_mw: number;
  net_energy_mw: number;
  solvent_degradation_index: number;
  specific_energy_gj_t: number;
  alerts: string[];
}

export interface Equipment {
  tag: string;
  name: string;
  type: string;
  train: string;
  design_pressure_bar: number;
  design_temperature_c: number;
}

export interface Plant {
  id: string;
  name: string;
  mode: string;
  equipment: Equipment[];
}

export interface ScenarioResponse {
  id: string;
  outputs: ScenarioOutput;
  intensity: Record<string, number>;
}

export interface Telemetry {
  timestamp: string;
  simulated: boolean;
  feed_co2_t_h: number;
  captured_co2_t_h: number;
  capture_percent: number;
  energy_mw: number;
  stripper_temperature_c: number;
  solvent_flow_m3_h: number;
}

export const DEFAULT_INPUTS: ScenarioInput = {
  flue_gas_kmol_h: 24000,
  co2_mole_fraction: 0.13,
  lean_solvent_m3_h: 650,
  lean_loading: 0.18,
  rich_loading: 0.43,
  stripper_temperature_c: 118,
  inlet_pressure_bar: 1.04,
  storage_pressure_bar: 110,
  solvent_age_days: 40,
  ambient_temperature_c: 24,
  heat_recovery_fraction: 0.25,
};

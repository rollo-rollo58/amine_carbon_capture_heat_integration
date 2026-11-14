"""Compact calculations with explicit physical units and research bounds."""
from math import exp, isfinite, log

CO2_MOLAR_MASS_KG_KMOL = 44.0095
GAS_R = 8.314462618


def bounded(value: float, low: float, high: float) -> float:
    if not isfinite(value):
        raise ValueError("non-finite process value")
    return min(high, max(low, value))


def inlet_co2_t_h(flue_kmol_h: float, mole_fraction: float) -> float:
    return flue_kmol_h * mole_fraction * CO2_MOLAR_MASS_KG_KMOL / 1000.0


def capture_efficiency(
    solvent_m3_h: float,
    flue_kmol_h: float,
    loading_span: float,
    stripper_c: float,
) -> float:
    liquid_ratio = solvent_m3_h / max(flue_kmol_h, 1.0)
    effective_ratio = liquid_ratio * loading_span * 85.0
    approach = 1.0 - exp(-max(0.0, effective_ratio) * 1.6)
    temperature_penalty = max(0.0, abs(stripper_c - 119.0) - 12.0) * 0.002
    return bounded(approach - temperature_penalty, 0.02, 0.985)


def reboiler_duty_mw(captured_t_h: float, stripper_c: float) -> float:
    specific_gj_t = 2.7 + 0.0009 * (stripper_c - 119.0) ** 2
    return captured_t_h * specific_gj_t / 3.6


def multistage_compression_mw(
    t_h: float,
    suction_bar: float,
    discharge_bar: float,
    inlet_c: float,
    stages: int = 4,
    efficiency: float = 0.78,
) -> float:
    if t_h <= 0:
        return 0.0
    if stages < 1 or not 0 < efficiency <= 1:
        raise ValueError("invalid compressor configuration")
    mass_kg_s = t_h * 1000.0 / 3600.0
    mol_s = mass_kg_s * 1000.0 / CO2_MOLAR_MASS_KG_KMOL
    temperature_k = inlet_c + 273.15
    heat_ratio = 1.30
    stage_ratio = (discharge_bar / suction_bar) ** (1.0 / stages)
    exponent = (heat_ratio - 1.0) / heat_ratio
    work_j_mol = (
        GAS_R * temperature_k * heat_ratio / (heat_ratio - 1.0)
        * (stage_ratio ** exponent - 1.0)
    )
    return work_j_mol * mol_s * stages / (efficiency * 1_000_000.0)


def pump_power_mw(flow_m3_h: float, delta_pressure_bar: float = 5.0) -> float:
    return flow_m3_h / 3600.0 * delta_pressure_bar * 100000.0 / 0.79 / 1_000_000.0


def degradation_exposure(age_days: float, stripper_c: float) -> float:
    heat_factor = exp(bounded((stripper_c - 110.0) / 40.0, -2.0, 2.0))
    return bounded(age_days / 720.0 * heat_factor, 0.0, 1.0)


def material_balance_error(input_t_h: float, captured_t_h: float, emitted_t_h: float) -> float:
    return abs(input_t_h - captured_t_h - emitted_t_h)


def compressor_ratio(suction_bar: float, discharge_bar: float) -> float:
    if suction_bar <= 0 or discharge_bar <= 0:
        raise ValueError("pressures must be positive")
    return exp(log(discharge_bar) - log(suction_bar))

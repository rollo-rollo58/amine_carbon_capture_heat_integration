"""An explainable, deterministic research simulation."""
from .domain import (
    capture_efficiency,
    degradation_exposure,
    inlet_co2_t_h,
    multistage_compression_mw,
    pump_power_mw,
    reboiler_duty_mw,
)
from .models import ScenarioInput, ScenarioOutput


def evaluate(inputs: ScenarioInput) -> ScenarioOutput:
    incoming = inlet_co2_t_h(inputs.flue_gas_kmol_h, inputs.co2_mole_fraction)
    span = inputs.rich_loading - inputs.lean_loading
    fraction = capture_efficiency(
        inputs.lean_solvent_m3_h,
        inputs.flue_gas_kmol_h,
        span,
        inputs.stripper_temperature_c,
    )
    captured = incoming * fraction
    emitted = incoming - captured
    reboiler = reboiler_duty_mw(captured, inputs.stripper_temperature_c)
    recovery = reboiler * inputs.heat_recovery_fraction
    compressor = multistage_compression_mw(
        captured,
        inputs.inlet_pressure_bar,
        inputs.storage_pressure_bar,
        inputs.ambient_temperature_c,
    )
    pump = pump_power_mw(inputs.lean_solvent_m3_h)
    net = max(0.0, reboiler - recovery + compressor + pump)
    degradation = degradation_exposure(
        inputs.solvent_age_days,
        inputs.stripper_temperature_c,
    )
    alarms: list[str] = []
    if fraction < 0.75:
        alarms.append("LOW_CAPTURE_EFFICIENCY")
    if degradation >= 0.55:
        alarms.append("HIGH_SOLVENT_EXPOSURE")
    if compressor > 20:
        alarms.append("COMPRESSOR_POWER_REVIEW")
    if inputs.stripper_temperature_c >= 140:
        alarms.append("HIGH_REGENERATION_TEMPERATURE")
    return ScenarioOutput(
        feed_co2_t_h=round(incoming, 4),
        captured_co2_t_h=round(captured, 4),
        emitted_co2_t_h=round(emitted, 4),
        capture_percent=round(fraction * 100, 3),
        solvent_circulation_m3_h=inputs.lean_solvent_m3_h,
        reboiler_mw=round(reboiler, 4),
        heat_recovered_mw=round(recovery, 4),
        compressor_mw=round(compressor, 4),
        pump_mw=round(pump, 4),
        net_energy_mw=round(net, 4),
        solvent_degradation_index=round(degradation, 5),
        specific_energy_gj_t=round(3.6 * net / max(captured, 0.0001), 4),
        alerts=alarms,
    )

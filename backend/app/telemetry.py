"""Synthetic streaming telemetry; not actual industrial sensor measurements."""
from datetime import datetime, timezone
from math import sin
from time import monotonic

from .models import ScenarioInput
from .simulation import evaluate

STARTED = monotonic()


def sample() -> dict:
    elapsed = monotonic() - STARTED
    baseline = ScenarioInput(
        flue_gas_kmol_h=24000 + 240 * sin(elapsed / 15),
        lean_solvent_m3_h=650 + 16 * sin(elapsed / 20),
        stripper_temperature_c=118 + 2 * sin(elapsed / 40),
    )
    output = evaluate(baseline)
    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "simulated": True,
        "feed_co2_t_h": output.feed_co2_t_h,
        "captured_co2_t_h": output.captured_co2_t_h,
        "capture_percent": output.capture_percent,
        "energy_mw": output.net_energy_mw,
        "stripper_temperature_c": baseline.stripper_temperature_c,
        "solvent_flow_m3_h": baseline.lean_solvent_m3_h,
    }

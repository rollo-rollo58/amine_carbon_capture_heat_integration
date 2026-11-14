"""Summary and comparison helpers for simulation runs."""
from .models import ComparisonOutput, ScenarioInput, ScenarioOutput
from .simulation import evaluate


def compare(baseline: ScenarioInput, candidate: ScenarioInput) -> ComparisonOutput:
    a = evaluate(baseline)
    b = evaluate(candidate)
    gain = (b.captured_co2_t_h - a.captured_co2_t_h) / max(a.captured_co2_t_h, 0.01)
    return ComparisonOutput(
        baseline=a,
        candidate=b,
        captured_delta_t_h=round(b.captured_co2_t_h - a.captured_co2_t_h, 5),
        energy_delta_mw=round(b.net_energy_mw - a.net_energy_mw, 5),
        relative_capture_gain_percent=round(gain * 100, 4),
    )


def intensity(output: ScenarioOutput) -> dict[str, float]:
    return {
        "net_mw_per_t_h": round(output.net_energy_mw / max(output.captured_co2_t_h, 0.01), 4),
        "co2_avoided_t_h": round(output.captured_co2_t_h, 4),
        "uncaptured_share": round(output.emitted_co2_t_h / output.feed_co2_t_h, 6),
    }

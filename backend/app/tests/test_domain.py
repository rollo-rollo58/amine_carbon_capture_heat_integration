"""Domain calculation invariants and boundary tests."""
from math import isfinite

import pytest

from app.domain import (
    capture_efficiency,
    compressor_ratio,
    degradation_exposure,
    inlet_co2_t_h,
    material_balance_error,
    multistage_compression_mw,
    pump_power_mw,
)
from app.models import ScenarioInput
from app.simulation import evaluate


def test_inlet_mass():
    assert inlet_co2_t_h(1000, 0.1) == pytest.approx(4.40095)


def test_mass_balance():
    result = evaluate(ScenarioInput())
    assert material_balance_error(
        result.feed_co2_t_h,
        result.captured_co2_t_h,
        result.emitted_co2_t_h,
    ) < 0.0002


def test_capture_bounds():
    for liquid in [20, 100, 650, 2000]:
        fraction = capture_efficiency(liquid, 24000, 0.25, 118)
        assert 0.02 <= fraction <= 0.985


def test_energy_is_nonnegative():
    result = evaluate(ScenarioInput())
    assert all(isfinite(value) and value >= 0 for value in [
        result.net_energy_mw, result.reboiler_mw, result.compressor_mw,
    ])


def test_more_recovery_reduces_net_energy():
    low = evaluate(ScenarioInput(heat_recovery_fraction=0.1))
    high = evaluate(ScenarioInput(heat_recovery_fraction=0.6))
    assert high.net_energy_mw < low.net_energy_mw


def test_compressor_work_increases_with_pressure():
    low = multistage_compression_mw(100, 1.0, 50, 20)
    high = multistage_compression_mw(100, 1.0, 120, 20)
    assert 0 < low < high


def test_zero_compressor_flow():
    assert multistage_compression_mw(0, 1.0, 100.0, 20) == 0


def test_compressor_parameter_validation():
    with pytest.raises(ValueError):
        multistage_compression_mw(20, 1.0, 100.0, 20, efficiency=0)


def test_loading_rejected():
    with pytest.raises(ValueError):
        ScenarioInput(lean_loading=0.5, rich_loading=0.3)


def test_invalid_pressure_rejected():
    with pytest.raises(ValueError):
        ScenarioInput(inlet_pressure_bar=2, storage_pressure_bar=1)


def test_exposure_and_pump():
    assert degradation_exposure(0, 118) == 0
    assert degradation_exposure(1000, 140) <= 1
    assert pump_power_mw(600) > 0
    assert compressor_ratio(1, 100) == pytest.approx(100)

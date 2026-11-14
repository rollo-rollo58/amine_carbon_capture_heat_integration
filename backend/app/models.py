"""Validated API contracts for the capture train."""
from pydantic import BaseModel, Field, model_validator


class ScenarioInput(BaseModel):
    flue_gas_kmol_h: float = Field(default=24000, gt=100, le=200000)
    co2_mole_fraction: float = Field(default=0.13, ge=0.01, le=0.35)
    lean_solvent_m3_h: float = Field(default=650, gt=10, le=5000)
    lean_loading: float = Field(default=0.18, ge=0.05, le=0.40)
    rich_loading: float = Field(default=0.43, ge=0.20, le=0.65)
    stripper_temperature_c: float = Field(default=118, ge=85, le=155)
    inlet_pressure_bar: float = Field(default=1.04, ge=0.80, le=3.50)
    storage_pressure_bar: float = Field(default=110, ge=30, le=200)
    solvent_age_days: float = Field(default=40, ge=0, le=2000)
    ambient_temperature_c: float = Field(default=24, ge=-10, le=55)
    heat_recovery_fraction: float = Field(default=0.25, ge=0, le=0.80)

    @model_validator(mode="after")
    def validate_loading(self) -> "ScenarioInput":
        if self.rich_loading <= self.lean_loading:
            raise ValueError("rich solvent loading must exceed lean loading")
        if self.storage_pressure_bar <= self.inlet_pressure_bar:
            raise ValueError("storage pressure must exceed inlet pressure")
        return self


class ScenarioOutput(BaseModel):
    feed_co2_t_h: float
    captured_co2_t_h: float
    emitted_co2_t_h: float
    capture_percent: float
    solvent_circulation_m3_h: float
    reboiler_mw: float
    heat_recovered_mw: float
    compressor_mw: float
    pump_mw: float
    net_energy_mw: float
    solvent_degradation_index: float
    specific_energy_gj_t: float
    alerts: list[str]


class ComparisonInput(BaseModel):
    baseline: ScenarioInput
    candidate: ScenarioInput


class ComparisonOutput(BaseModel):
    baseline: ScenarioOutput
    candidate: ScenarioOutput
    captured_delta_t_h: float
    energy_delta_mw: float
    relative_capture_gain_percent: float

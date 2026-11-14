"""All research REST endpoints are read-only or simulated calculations."""
from importlib import import_module

from fastapi import APIRouter, HTTPException

from .analytics import compare, intensity
from .equipment import inventory
from .models import ComparisonInput, ScenarioInput
from .repository import meter, store, recent, record
from .simulation import evaluate
from .telemetry import sample

router = APIRouter(prefix="/api/v1")
FAMILIES = frozenset({"solvent", "compression", "emissions", "heat_integration"})


@router.get("/plant")
def plant() -> dict:
    meter.increment("plant_reads")
    return {
        "id": "CL-01",
        "name": "CarbonLoop Demonstration Facility",
        "mode": "research-simulation",
        "equipment": inventory(),
    }


@router.get("/telemetry")
def telemetry() -> dict:
    meter.increment("telemetry_reads")
    return sample()


@router.post("/scenarios")
def scenarios(inputs: ScenarioInput) -> dict:
    result = evaluate(inputs)
    item = store.append(inputs, result)
    record("scenario_evaluated", "simulation")
    meter.increment("scenario_runs")
    return {"id": item.id, "outputs": result, "intensity": intensity(result)}


@router.post("/scenarios/compare")
def compare_scenarios(inputs: ComparisonInput) -> dict:
    meter.increment("comparisons")
    result = compare(inputs.baseline, inputs.candidate)
    return result.model_dump()


@router.get("/alarms")
def alarms() -> list[dict]:
    return [
        {"code": item, "severity": "warning", "source": "research-envelope"}
        for item in evaluate(ScenarioInput()).alerts
    ]


@router.get("/history")
def history(limit: int = 30) -> list[dict]:
    return [record.__dict__ for record in store.latest(limit)]


@router.get("/audit")
def audit() -> list[dict]:
    return recent()


@router.get("/policies/{family}/{index}")
def policy(family: str, index: int, signal: float = 0.5) -> dict:
    if family not in FAMILIES or not 0 <= index < 1550:
        raise HTTPException(status_code=404, detail="unknown research policy")
    if not -5 <= signal <= 5:
        raise HTTPException(status_code=422, detail="signal out of range")
    module = import_module("app.policies.generated_catalogue")
    rule = getattr(module, f"{family}_rule_{index:04d}")
    return {"family": family, "index": index, "score": rule(signal)}

"""Research equipment inventory and read-only process path."""
from dataclasses import asdict, dataclass


@dataclass(frozen=True)
class Equipment:
    tag: str
    name: str
    type: str
    train: str
    design_pressure_bar: float
    design_temperature_c: float


EQUIPMENT = (
    Equipment("ABS-101", "Amine absorber", "column", "capture", 3.2, 75.0),
    Equipment("STR-201", "Solvent stripper", "column", "regeneration", 4.0, 140.0),
    Equipment("HXR-301", "Lean/rich exchanger", "exchanger", "thermal", 16.0, 155.0),
    Equipment("PMP-401", "Circulation pump", "pump", "capture", 18.0, 95.0),
    Equipment("CMP-501", "CO2 compression", "compressor", "storage", 160.0, 175.0),
    Equipment("DRY-601", "CO2 dehydrator", "dryer", "storage", 150.0, 65.0),
)


def inventory() -> list[dict]:
    return [asdict(device) for device in EQUIPMENT]


def equipment_by_tag(tag: str) -> Equipment | None:
    return next((item for item in EQUIPMENT if item.tag == tag), None)

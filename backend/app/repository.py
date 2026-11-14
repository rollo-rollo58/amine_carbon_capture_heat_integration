"""A bounded in-memory demo store; no claim of durable persistence."""
from collections import deque
from dataclasses import dataclass
from datetime import datetime, timezone
from threading import Lock
from uuid import uuid4

from .models import ScenarioInput, ScenarioOutput


@dataclass(frozen=True)
class EvaluationRecord:
    id: str
    created_at: str
    inputs: dict
    outputs: dict


class ScenarioStore:
    def __init__(self, max_items: int = 200) -> None:
        self._records: deque[EvaluationRecord] = deque(maxlen=max_items)
        self._lock = Lock()

    def append(self, inputs: ScenarioInput, outputs: ScenarioOutput) -> EvaluationRecord:
        record = EvaluationRecord(
            id=str(uuid4()),
            created_at=datetime.now(timezone.utc).isoformat(),
            inputs=inputs.model_dump(),
            outputs=outputs.model_dump(),
        )
        with self._lock:
            self._records.appendleft(record)
        return record

    def latest(self, limit: int = 30) -> list[EvaluationRecord]:
        with self._lock:
            return list(self._records)[:max(1, min(limit, 100))]


store = ScenarioStore()


class Meter:
    def __init__(self) -> None:
        self._counts: dict[str, int] = {}
        self._lock = Lock()

    def increment(self, name: str) -> None:
        with self._lock:
            self._counts[name] = self._counts.get(name, 0) + 1

    def snapshot(self) -> dict[str, int]:
        with self._lock:
            return dict(self._counts)


meter = Meter()

"""Append-only bounded audit envelope for demonstration usage."""

_lock = Lock()
_events: deque[dict] = deque(maxlen=300)


def record(action: str, category: str) -> None:
    entry = {
        "action": action,
        "category": category,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    with _lock:
        _events.appendleft(entry)


def recent(limit: int = 50) -> list[dict]:
    with _lock:
        return list(_events)[:max(1, min(limit, 50))]

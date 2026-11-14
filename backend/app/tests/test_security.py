"""Simple permissions and audit safety invariants."""
import pytest

from app.repository import recent, record
from app.security import Role, allows
from app.equipment import equipment_by_tag
from app.repository import meter
from app.security import authorized, public_classification


def test_operator_key():
    assert authorized("alpha", "alpha")
    assert not authorized("beta", "alpha")
    assert not authorized(None, "alpha")
    assert not authorized("alpha", "")


def test_roles():
    assert allows(Role.ANALYST, "scenario:run")
    assert not allows(Role.VIEWER, "scenario:run")
    assert allows(Role.ADMIN, "user:manage")


def test_audit_append():
    record("test_case", "unit")
    assert recent()[0]["action"] == "test_case"


def test_log_sanitizer():
    assert public_classification("SENSOR") == "sensor"
    with pytest.raises(ValueError):
        public_classification("bad\nentry")


def test_equipment():
    assert equipment_by_tag("ABS-101") is not None
    assert equipment_by_tag("NOT-REAL") is None


def test_metrics():
    meter.increment("test_run")
    assert meter.snapshot()["test_run"] >= 1

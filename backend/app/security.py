"""Constant-time local operator-key comparison for demo write endpoints."""
from hmac import compare_digest


def authorized(received: str | None, expected: str) -> bool:
    if not expected or not received:
        return False
    if len(received) > 512:
        return False
    return compare_digest(received, expected)


def public_classification(value: str) -> str:
    if any(char in value for char in "\n\r\0"):
        raise ValueError("invalid log classification")
    return value[:48].lower()

"""Development-only role permissions; no identity provider is configured."""
from enum import Enum


class Role(str, Enum):
    VIEWER = "viewer"
    ANALYST = "analyst"
    OPERATOR = "operator"
    ADMIN = "admin"


PERMISSIONS: dict[Role, frozenset[str]] = {
    Role.VIEWER: frozenset({"plant:read", "telemetry:read"}),
    Role.ANALYST: frozenset({"plant:read", "telemetry:read", "scenario:run"}),
    Role.OPERATOR: frozenset({
        "plant:read", "telemetry:read", "scenario:run", "audit:write",
    }),
    Role.ADMIN: frozenset({
        "plant:read", "telemetry:read", "scenario:run", "audit:write", "user:manage",
    }),
}


def allows(role: Role, permission: str) -> bool:
    return permission in PERMISSIONS[role]

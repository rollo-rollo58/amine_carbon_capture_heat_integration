CREATE TABLE IF NOT EXISTS plant_roles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    plant_id UUID NOT NULL REFERENCES capture_plants(id),
    principal_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('viewer', 'analyst', 'operator', 'admin')),
    UNIQUE (plant_id, principal_name)
);
CREATE TABLE IF NOT EXISTS operator_audit (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    plant_id UUID REFERENCES capture_plants(id),
    principal_name TEXT NOT NULL,
    operation TEXT NOT NULL,
    payload JSONB NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_recorded
    ON operator_audit(recorded_at DESC);
CREATE OR REPLACE FUNCTION block_audit_edits()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    RAISE EXCEPTION 'audit events are append only';
END;
$$;
DROP TRIGGER IF EXISTS block_operator_audit_updates ON operator_audit;
CREATE TRIGGER block_operator_audit_updates
BEFORE UPDATE OR DELETE ON operator_audit
FOR EACH ROW EXECUTE FUNCTION block_audit_edits();

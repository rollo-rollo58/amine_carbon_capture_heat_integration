CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS capture_plants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    design_flow_kmol_h NUMERIC(16, 4) NOT NULL CHECK (design_flow_kmol_h > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plant_id UUID NOT NULL REFERENCES capture_plants(id) ON DELETE CASCADE,
    equipment_tag TEXT NOT NULL,
    equipment_kind TEXT NOT NULL,
    design_pressure_bar NUMERIC(10, 3) NOT NULL CHECK (design_pressure_bar > 0),
    design_temperature_c NUMERIC(10, 3) NOT NULL,
    UNIQUE (plant_id, equipment_tag)
);
CREATE TABLE IF NOT EXISTS process_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plant_id UUID NOT NULL REFERENCES capture_plants(id),
    name TEXT NOT NULL,
    inputs JSONB NOT NULL,
    outputs JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS measurement_samples (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    equipment_id UUID NOT NULL REFERENCES equipment(id),
    measured_at TIMESTAMPTZ NOT NULL,
    signal TEXT NOT NULL,
    value NUMERIC(16, 5) NOT NULL,
    units TEXT NOT NULL,
    quality TEXT NOT NULL DEFAULT 'SIMULATED'
);
CREATE INDEX IF NOT EXISTS idx_sample_lookup
    ON measurement_samples(equipment_id, signal, measured_at DESC);

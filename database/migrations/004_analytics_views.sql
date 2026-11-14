CREATE OR REPLACE VIEW latest_equipment_signals AS
SELECT DISTINCT ON (e.id, s.signal)
    e.equipment_tag, e.equipment_kind, s.signal,
    s.value, s.units, s.measured_at, s.quality
FROM equipment e
JOIN measurement_samples s ON s.equipment_id = e.id
ORDER BY e.id, s.signal, s.measured_at DESC;
CREATE OR REPLACE VIEW daily_sample_statistics AS
SELECT e.equipment_tag, s.signal, DATE_TRUNC('day', s.measured_at) AS day,
       COUNT(*) AS n, AVG(s.value) AS mean_value,
       MIN(s.value) AS min_value, MAX(s.value) AS max_value
FROM measurement_samples s
JOIN equipment e ON e.id = s.equipment_id
GROUP BY e.equipment_tag, s.signal, DATE_TRUNC('day', s.measured_at);
CREATE INDEX IF NOT EXISTS idx_scenario_created
    ON process_scenarios(plant_id, created_at DESC);

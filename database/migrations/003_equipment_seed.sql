INSERT INTO capture_plants (code, name, design_flow_kmol_h)
VALUES ('CL-01', 'CarbonLoop Research Capture Train', 24000.0)
ON CONFLICT (code) DO NOTHING;
INSERT INTO equipment (
    plant_id, equipment_tag, equipment_kind, design_pressure_bar,
    design_temperature_c
)
SELECT p.id, d.tag, d.kind, d.pressure, d.temperature
FROM capture_plants p
CROSS JOIN (
    VALUES
      ('ABS-101', 'absorber', 3.2, 75.0),
      ('STR-201', 'stripper', 4.0, 140.0),
      ('HXR-301', 'lean-rich-exchanger', 16.0, 155.0),
      ('PMP-401', 'solvent-pump', 18.0, 95.0),
      ('CMP-501', 'co2-compressor', 160.0, 175.0),
      ('DRY-601', 'dehydrator', 150.0, 65.0)
) AS d(tag, kind, pressure, temperature)
WHERE p.code = 'CL-01'
ON CONFLICT (plant_id, equipment_tag) DO NOTHING;

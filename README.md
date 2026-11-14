# CarbonLoop — Industrial Carbon Capture & Solvent Regeneration Workbench

A full-stack **research demonstration** of an aqueous-amine post-combustion carbon
capture facility. Operators can explore capture fraction, stripper heat demand,
solvent degradation indicators, compressor power, and heat-integration options.

## What is real and what is synthetic?

The backend implements explicit mass/energy balances, a bounded turbine-equivalent
compressor model, scenario validation, audit records, role policy helpers, and a streaming
telemetry demonstration. The process models deliberately use simplified assumptions.
They have not been validated against industrial plant instrumentation or rigorous
thermodynamic property packages. The UI is a bespoke flow-oriented control room.

Four files in `backend/app/policies/` are machine-generated **synthetic rule
catalogues**, not separately engineered algorithms. They account for most of the
source lines and exist for large-repository IDE and indexing workloads. A large
line count is not equivalent to production readiness. This system must not be
connected to physical control actuators or used for safety-critical decisions.

## Engineering assumptions and units

- Flue gas flow, dry basis: kmol/hour.
- CO2 mole fraction: unitless, from 0 through 1.
- Absorber capture: simplified equilibrium approach and flow-ratio proxy.
- Specific reboiler duty: GJ/tCO2, bounded over an illustrative range.
- CO2 compressor work: isentropic multistage ideal-gas estimate, kW.
- Lean solvent flow: m3/hour; pump loads use differential pressure and efficiency.
- Solvent degradation: experimental exposure index, not an empirical guarantee.
- Heat recovery: capped by hot- and cold-side temperature approach.

## API contract

| Method | Route | Function |
| --- | --- | --- |
| GET | `/health` | Service readiness |
| GET | `/api/v1/plant` | Plant metadata and equipment |
| GET | `/api/v1/telemetry` | Latest synthetic process telemetry |
| POST | `/api/v1/scenarios` | Evaluate validated scenario |
| POST | `/api/v1/scenarios/compare` | Compare baseline and candidate |
| GET | `/api/v1/alarms` | Research operating-envelope alerts |
| GET | `/api/v1/history` | Recent synthetic evaluations |
| GET | `/api/v1/policies/{family}/{index}` | Synthetic generated score function |
| WS | `/ws/telemetry` | 1 Hz research-only telemetry |

## Quick start (Python 3.11+, Node 20+)

```sh
cd backend
python -m pip install -e '.[dev]'
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

In another terminal:

```sh
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`; copy `.env.example` values to local environment
variables. The frontend defaults to localhost:8000, and the API demo uses a
bounded in-memory history: the supplied PostgreSQL migrations describe a future
persistence backend but are **not automatically wired into the demo API**.

To run backend tests:

```sh
cd backend
python -m pytest -q
```

## Repository layout

- `backend/app/`: Pydantic domain contracts, simulation, routes, audit, auth,
  statistics, telemetry, equipment and worker orchestration.
- `frontend/src/components/`: domain-specific plant schematics and panels.
- `database/migrations/`: DDL, constraints, indexes, triggers, seeded equipment,
  and analytics views.
- `infra/`: deployment examples, scrape configuration, and CI.

## Production hardening gaps

Introduce authenticated identity federation, durable transaction-backed state,
secret injection, network policy, TLS termination, load testing, formal threat
modeling, validated property tables, independent mass-balance reconciliation,
HA/DR, process hazard review, and in-plant commissioning prior to deployment.

# RockfallAI — Localhost Stability & Regression Protection Guide

This document establishes the mandatory localhost stability and regression-protection verification procedure for the RockfallAI project.

---

## 1. Development URLs & Ports

| Subsystem | Localhost URL | Purpose |
| :--- | :--- | :--- |
| **Frontend Dashboard** | `http://localhost:5173` | React 19 + Vite Early Warning Dashboard |
| **Backend API** | `http://localhost:8000` | FastAPI Multi-Modal Telemetry & ML Service |
| **Backend Health** | `http://localhost:8000/health` | Automated uptime & readiness check |
| **Interactive API Docs** | `http://localhost:8000/docs` | Swagger OpenAPI specification |

---

## 2. Server Startup Commands

### Start Backend Service
Run from project root or `backend/`:
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

### Start Frontend Dev Server
Run from `frontend/`:
```bash
cd frontend
npm run dev
```

---

## 3. Mandatory Pre-Completion Verification Procedure

Before marking any modification complete, run this verification pipeline in sequence:

### Step 1: Frontend Build Verification
Ensures all JSX, assets, and module imports compile cleanly into production bundles without syntax or bundler errors:
```bash
cd frontend
npm run build
```

### Step 2: Undefined Variable & Linter Audit
Scans all frontend files (`src/**`) with the project's configured `.oxlintrc.json` to guarantee **0 undeclared variables** (`no-undef`):
```bash
cd frontend
npm run lint
```

### Step 3: Automated Localhost Smoke Test
Executes `frontend/smoke_test.js` to verify end-to-end localhost availability:
```bash
cd frontend
npm run test:smoke
```
This automated test checks:
1. `GET http://localhost:8000/health` (HTTP 200, `"status": "healthy"`)
2. Primary telemetry APIs (`/api/dashboard/summary`, `/api/zones`, `/api/sensors`, `/api/predictions`, `/api/alerts`)
3. Frontend root mount (`http://localhost:5173/`, container `#root`)
4. Vite module transformation across all pages and core components
5. Static AST audit (zero undefined variables)

### Step 4: Backend Pipeline, Acceptance & Simulation Tests
Executes unit, acceptance, and virtual hardware simulation test suites:
```bash
python backend/tests/test_phase5_simulation.py
python backend/tests/test_phase3_genai_alerts.py
python backend/tests/test_acceptance.py
python backend/tests/verify_flow.py
```

---

## 4. Error Boundaries & Degraded Mode Architecture

### Global & Sectional Error Boundaries
* **Root Boundary (`frontend/src/main.jsx`)**: Catches fatal mounting crashes and displays a readable technical diagnostic screen with an application reload action instead of a blank black screen.
* **Page Boundary (`frontend/src/App.jsx` wrapping `<main className="content-body">`)**: If a specific page or chart encounters an unexpected error, the **Sidebar** and **Header** remain 100% interactive. The user can switch sectors or retry the section without reloading the entire application.
* **Component Boundary (`frontend/src/components/ErrorBoundary.jsx`)**: Available in `compact` mode for individual charts or cards.

### Backend Offline / Degraded Mode Protection
All frontend components safely handle offline or empty backend states:
* Arrays are defaulted via `(data || [])` before iterating or filtering.
* Object lookups use optional chaining (`?.`) and nullish coalescing (`??`).
* If the FastAPI backend is offline, the dashboard displays a non-blocking diagnostic notification while keeping the UI accessible.

---

## 5. Checklist Before Committing Changes

- [x] Code changes completed without deleting working Phase 1–3 functionality.
- [x] All imports and variable references verified across the entire frontend.
- [x] `npm run build` exits with code 0.
- [x] `npm run lint` exits with 0 errors.
- [x] `npm run test:smoke` passes all 5 stages.
- [x] Backend acceptance and integration tests pass.
- [x] Localhost browser verified at `http://localhost:5173` without fatal console exceptions.

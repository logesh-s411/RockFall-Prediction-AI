# System Requirements Specification (SRS)

## 1. Introduction

This document specifies the software requirements for the **AI-Based Multi-Modal Rockfall Risk Prediction and Early Warning System** (RockfallAI).

---

## 2. Functional Requirements (FR)

| ID | Requirement Name | Description | Verification Method |
|---|---|---|---|
| **FR-01** | Multi-Modal Data Ingestion | The system shall ingest spatial terrain data (DEM elevation, slope angle, roughness, curvature, crack density) and temporal sensor telemetry (vibration PPV, tilt, displacement, rainfall, temperature). | Unit Test / API Test |
| **FR-02** | Geotechnical Preprocessing | The system shall normalize multi-modal feature vectors using a pre-fitted `StandardScaler` (`scaler.joblib`) and structure temporal sequences into 12-step hourly sliding windows. | Acceptance Test |
| **FR-03** | Continuous Risk Scoring | The deep learning model shall compute a continuous risk score between `0.0` and `100.0` for any valid input vector. | Model Inference Test |
| **FR-04** | 4-Tier Risk Categorization | The system shall categorize risk scores into 4 distinct hazard tiers: `LOW` (0–24), `MODERATE` (25–49), `HIGH` (50–74), and `CRITICAL` (75–100). | Threshold Unit Test |
| **FR-05** | Explainable AI Synthesis | The system shall provide an LLM integration layer (Anthropic Claude API) to explain the physical rationale behind risk predictions in natural language. | GenAI Service Test |
| **FR-06** | Zero-Key Offline Fallback | The system shall provide a deterministic rule-based fallback generator that functions without internet or API keys with 100% availability. | Fallback Unit Test |
| **FR-07** | Automated Alert Generation | The system shall automatically dispatch early warning alerts when predicted risk scores meet or exceed `50.0`. | Alert Service Test |
| **FR-08** | Alert Deduplication | The alert engine shall prevent repeated duplicate alerts for the same zone within the same operational risk tier. | Deduplication Test |
| **FR-09** | Operator Acknowledgment | The system shall allow authorized personnel to acknowledge active alerts via REST API endpoints (`PATCH` and `POST`). | Acknowledgment Test |
| **FR-10** | Enterprise Site Briefing | The system shall generate a synthesized cross-sector situation summary highlighting the highest-risk pit highwalls and aggregated triggers. | Site Summary Test |

---

## 3. Non-Functional Requirements (NFR)

| ID | Category | Requirement Description | Verification Method |
|---|---|---|---|
| **NFR-01** | Latency | Single-sample model inference latency shall not exceed 100 milliseconds on CPU. | Benchmark Test |
| **NFR-02** | Availability | The backend service and deterministic fallback engine shall operate with zero downtime during external network disruptions. | Offline Simulation |
| **NFR-03** | Security | Secret API keys (`ANTHROPIC_API_KEY`, `OPENWEATHER_API_KEY`) shall never be embedded in frontend client builds or committed to version control. | Security Audit |
| **NFR-04** | Usability & Contrast | The dashboard user interface shall maintain accessible color contrast compliant with WCAG AA standards for dark engineering consoles. | UI Inspection |
| **NFR-05** | Data Integrity | All historical predictions, sensor readings, alerts, and AI explanations shall be persisted in SQLite with relational integrity. | DB Test |
| **NFR-06** | Portability | The system shall run across Windows, macOS, and Linux without requiring proprietary drivers or GPU hardware. | Cross-Platform Audit |

---

## 4. Hardware & Software Prerequisites

### Hardware (Minimum)
- **CPU:** Dual-core 2.0 GHz or higher (x86_64 or ARM64)
- **RAM:** 4 GB RAM (8 GB recommended)
- **Storage:** 500 MB free disk space

### Software Environment
- **Operating System:** Windows 10/11, macOS 12+, or Ubuntu 20.04+ LTS
- **Python Runtime:** Python 3.10, 3.11, or 3.14
- **Node.js Runtime:** Node.js 18.x or 20.x with npm 9.x+
- **Database Engine:** SQLite 3.30+ (bundled with Python)

---

## 5. Software Dependency Matrix

### Backend Dependencies (`backend/requirements.txt`)
- `fastapi>=0.110.0` — Asynchronous REST API framework
- `uvicorn>=0.28.0` — Production ASGI web server
- `pydantic>=2.6.0` — Strict schema validation
- `pydantic-settings>=2.2.0` — Environment variable parsing
- `sqlalchemy>=2.0.28` — Relational database ORM
- `scikit-learn>=1.4.0` — Feature normalization (`StandardScaler`)
- `joblib>=1.3.0` — Serialized model and scaler persistence
- `pandas>=2.2.0` — Tabular data manipulation
- `numpy>=1.26.0` — Matrix arithmetic and tensor shaping
- `httpx>=0.27.0` — Asynchronous HTTP client for Claude API
- `python-dotenv>=1.0.1` — Environment file loader
- `torch` — PyTorch deep learning framework (optional on non-supported platforms, uses fallback predictor)

### Frontend Dependencies (`frontend/package.json`)
- `react>=19.2.0` — UI component framework
- `react-dom>=19.2.0` — DOM rendering engine
- `recharts>=3.10.0` — Composable charting library for telemetry
- `lucide-react>=1.48.0` — Industrial instrumentation iconography
- `vite>=8.3.0` — Development server and production bundler

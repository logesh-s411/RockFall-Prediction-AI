# RockfallAI REST API Reference

The **RockfallAI Backend** is built using FastAPI and exposes interactive OpenAPI documentation at `http://localhost:8000/docs` (Swagger UI) and `http://localhost:8000/redoc` (ReDoc).

- **Base URL:** `http://localhost:8000`
- **Default Content-Type:** `application/json`
- **CORS Allowed Origins:** `http://localhost:5173`, `http://127.0.0.1:5173`, `http://localhost:3000`

---

## 1. System & Health Endpoints

### 1.1 Health Check
- **Endpoint:** `GET /health`
- **Description:** Verifies service uptime, environment mode, and returns prototype disclosure.
- **Response `200 OK`:**
```json
{
  "status": "healthy",
  "service": "AI-Based Multi-Modal Rockfall Risk Prediction and Early Warning System",
  "environment": "development",
  "timestamp": "2026-09-30T00:00:00Z",
  "demo_mode": true,
  "disclaimer": "PROTOTYPE SYSTEM: Uses synthetic/simulated multi-modal sensor streams for software evaluation."
}
```

### 1.2 Subsystem Status
- **Endpoint:** `GET /api/system/status`
- **Description:** Returns live operational status of backend, SQLite, model, GenAI, and weather providers.
- **Response `200 OK`:**
```json
{
  "backend": true,
  "database": true,
  "model": true,
  "genai": false,
  "weather": false,
  "demo_mode": true,
  "details": {
    "genai_provider": "fallback (deterministic)",
    "weather_provider": "synthetic demo",
    "model_architecture": "CNN-LSTM Hybrid"
  }
}
```

---

## 2. Monitored Zones & Sectors

### 2.1 List All Monitored Zones
- **Endpoint:** `GET /api/zones`
- **Description:** Returns array of all 4 monitored mine pit sectors with geotechnical profiles.
- **Response `200 OK`:**
```json
[
  {
    "id": "ZONE-A",
    "name": "South Highwall",
    "slope_angle": 64.5,
    "elevation": 920.0,
    "geological_type": "Heavily Fractured Sandstone",
    "last_risk_score": 68.4,
    "last_risk_level": "HIGH",
    "status": "MONITORED",
    "description": "Steep bench highwall subject to continuous haulage vibration.",
    "updated_at": "2026-09-30T00:00:00Z"
  }
]
```

### 2.2 Get Specific Zone
- **Endpoint:** `GET /api/zones/{zone_id}`
- **Parameters:** `zone_id` (Path, string, e.g., `ZONE-A`)
- **Response `200 OK`:** Single `ZoneResponse` object.

---

## 3. Geotechnical Telemetry & Simulation

### 3.1 Get Latest Sensor Readings
- **Endpoints:** `GET /api/sensors` or `GET /api/sensors/current`
- **Query Parameters:** `zone_id` (Optional, string)
- **Response `200 OK`:**
```json
[
  {
    "zone_id": "ZONE-A",
    "vibration": 14.5,
    "tilt": 7.2,
    "displacement": 8.6,
    "rainfall": 24.0,
    "temperature": 16.5,
    "battery_level": 94.0,
    "signal_quality": 98.0,
    "timestamp": "2026-09-30T00:00:00Z",
    "status": "ACTIVE"
  }
]
```

### 3.2 Sensor History Stream
- **Endpoint:** `GET /api/sensors/history`
- **Query Parameters:**
  - `zone_id` (Required, string, e.g., `ZONE-A`)
  - `limit` (Optional, integer, default: 24, max: 100)
- **Response `200 OK`:** Chronological array of historical sensor telemetry for trend charts.

### 3.3 Simulate Telemetry Tick
- **Endpoint:** `POST /api/sensors/tick`
- **Query Parameters:**
  - `zone_id` (Optional, string)
  - `scenario` (Optional, string: `NORMAL`, `MODERATE`, `HIGH`, `CRITICAL`)
- **Description:** Injects synthetic variation into sensor readings, updates SQLite, recalculates CNN-LSTM risk score, and triggers alerts if thresholds are exceeded.

### 3.4 Set Operational Demo Scenario
- **Endpoint:** `POST /api/sensors/scenario`
- **Request Body:**
```json
{
  "scenario": "CRITICAL",
  "zone_id": "ZONE-C"
}
```
- **Response `200 OK`:**
```json
{
  "status": "success",
  "scenario": "CRITICAL",
  "message": "Applied CRITICAL operational scenario to 1 zone(s).",
  "updates": [...]
}
```

---

## 4. Machine Learning & Predictions

### 4.1 Prediction History Log
- **Endpoint:** `GET /api/predictions`
- **Query Parameters:**
  - `zone_id` (Optional, string)
  - `limit` (Optional, integer, default: 25, max: 100)
- **Response `200 OK`:** Chronological array of past inference runs stored in SQLite.

### 4.2 Execute Model Inference
- **Endpoint:** `POST /api/predictions/predict`
- **Request Body:**
```json
{
  "zone_id": "ZONE-A",
  "elevation": 920.0,
  "slope_angle": 64.5,
  "terrain_roughness": 0.72,
  "curvature": 0.45,
  "drainage_index": 0.68,
  "crack_density": 0.75,
  "vibration": 14.5,
  "tilt": 7.2,
  "displacement": 8.6,
  "rainfall": 24.0,
  "temperature": 16.5,
  "humidity": 78.0,
  "pore_pressure": 0.70,
  "rainfall_intensity": 0.60,
  "historical_risk": 0.74,
  "model_type": "cnn_lstm"
}
```
- **Response `200 OK`:**
```json
{
  "zone_id": "ZONE-A",
  "risk_score": 68.4,
  "risk_level": "HIGH",
  "confidence": 0.94,
  "contributing_factors": [
    { "factor": "Accelerating crack displacement rate (> 5 mm)", "impact": "HIGH" },
    { "factor": "Elevated dynamic blasting vibration (> 10 mm/s PPV)", "impact": "HIGH" }
  ],
  "factors": [
    "Accelerating crack displacement rate (> 5 mm)",
    "Elevated dynamic blasting vibration (> 10 mm/s PPV)"
  ],
  "recommended_action": "Safety inspection recommended. Restrict heavy equipment within 100m of slope face. (Prototype Recommended Action)",
  "timestamp": "2026-09-30T00:00:00Z",
  "model_used": "PyTorch CNN-LSTM Hybrid"
}
```

### 4.3 Model Status & Training Loss
- **Endpoint:** `GET /api/predictions/model-status`
- **Response `200 OK`:**
```json
{
  "model": "CNN-LSTM Hybrid (Spatial 1D-CNN + Temporal 2-layer LSTM + Dense Fusion)",
  "status": "Trained",
  "input": "Multi-modal terrain + sensor data (15 channels)",
  "output": "0–100 risk score",
  "data": "Synthetic Demo Dataset (2,000 samples, 12-step sequence)",
  "metrics": {
    "MAE": 1.14,
    "RMSE": 1.41,
    "Accuracy": 97.67,
    "Precision": 97.85,
    "Recall": 97.67,
    "F1": 97.68
  },
  "training_samples": 1400,
  "validation_samples": 300,
  "test_samples": 300,
  "final_validation_loss": 1.0272,
  "final_test_loss": 0.8681
}
```

### 4.4 Model Comparison Benchmarks
- **Endpoint:** `GET /api/predictions/model-comparison`
- **Response `200 OK`:**
```json
{
  "CNN-LSTM": {
    "MAE": 1.14,
    "RMSE": 1.41,
    "Accuracy": 97.67,
    "Precision": 97.85,
    "Recall": 97.67,
    "F1": 97.68,
    "status": "Trained (PyTorch CNN-LSTM)"
  },
  "Random Forest": {
    "MAE": 1.11,
    "RMSE": 1.37,
    "Accuracy": 97.33,
    "Precision": 97.49,
    "Recall": 97.33,
    "F1": 97.33,
    "status": "Trained & Evaluated"
  },
  "XGBoost": {
    "MAE": 1.13,
    "RMSE": 1.45,
    "Accuracy": 96.67,
    "Precision": 96.82,
    "Recall": 96.67,
    "F1": 96.67,
    "status": "Trained & Evaluated"
  }
}
```

---

## 5. GenAI & Early Warning Intelligence

### 5.1 Explain Zone Risk
- **Endpoint:** `POST /api/ai/explain`
- **Request Body:**
```json
{
  "zone_id": "ZONE-C"
}
```
- **Response `200 OK`:**
```json
{
  "zone_id": "ZONE-C",
  "risk_score": 88.0,
  "risk_level": "CRITICAL",
  "summary": "ZONE-C is currently classified as CRITICAL (88.0/100) in the prototype assessment. The strongest contributing signals are crack displacement (> 10 mm), rainfall & torrential saturation, combined with steep terrain (72.0 deg).",
  "why_flagged": [
    "High rainfall is contributing to the current risk assessment.",
    "Increased displacement is contributing to the current risk assessment.",
    "Elevated vibration is contributing to the current risk assessment.",
    "Steep terrain contributes to the current risk assessment."
  ],
  "risk_explanation": "Severe joint dilation combined with elevated cleft water pressure reduces effective normal stress across geological discontinuities, promoting planar or wedge sliding.",
  "recommended_action": "Immediate safety assessment and access restriction should be considered according to the responsible site's established safety procedures. (Prototype Guidance)",
  "alert_message": "CRITICAL EARLY WARNING: Zone ZONE-C shows severe instability indicators.",
  "confidence_note": "Prototype risk assessment based on synthetic telemetry. Not a certified geological prediction.",
  "provider": "anthropic",
  "fallback": false,
  "generated_at": "2026-09-30T00:00:00Z"
}
```

### 5.2 Enterprise Site-Wide Summary
- **Endpoint:** `POST /api/ai/site-summary`
- **Request Body:** `{}` (Empty JSON object)
- **Response `200 OK`:**
```json
{
  "overall_risk_score": 58.2,
  "overall_risk_level": "HIGH",
  "highest_risk_zone": "ZONE-C",
  "summary": "Overall mine site risk is classified as HIGH (58.2/100). ZONE-C currently exhibits the highest estimated instability risk due to accelerating crack displacement and high precipitation.",
  "key_factors": [
    "Rainfall saturation along slope face",
    "Dynamic blasting vibrations",
    "Joint dilation in highwall sector"
  ],
  "recommended_actions": [
    "Dispatch geotechnical radar sweep to ZONE-C perimeter",
    "Restrict heavy equipment haulage within 100m zone",
    "Monitor real-time displacement rates at 5-minute intervals"
  ],
  "provider": "anthropic",
  "fallback": false,
  "generated_at": "2026-09-30T00:00:00Z"
}
```

### 5.3 Atmospheric Weather
- **Endpoint:** `GET /api/weather/current`
- **Query Parameters:** `zone_id` (Optional, string)
- **Response `200 OK`:**
```json
{
  "zone_id": "ZONE-A",
  "temperature": 18.5,
  "rainfall": 14.2,
  "humidity": 76.0,
  "rainfall_intensity": 0.65,
  "weather_condition": "Moderate Rain",
  "source": "SYNTHETIC DEMO"
}
```

---

## 6. Safety Alerts & Incident Management

### 6.1 List Alerts
- **Endpoint:** `GET /api/alerts`
- **Query Parameters:**
  - `zone_id` (Optional, string)
  - `unread_only` (Optional, boolean, default: `false`)
  - `limit` (Optional, integer, default: 50)
- **Response `200 OK`:** Array of `AlertResponse` objects.

### 6.2 Manual Demo Alert Generation
- **Endpoint:** `POST /api/alerts/generate`
- **Request Body:**
```json
{
  "zone_id": "ZONE-A",
  "force_level": "HIGH"
}
```
- **Response `200 OK`:** Returns newly created `AlertResponse` object.

### 6.3 Acknowledge Alert (PATCH)
- **Endpoint:** `PATCH /api/alerts/{alert_id}/acknowledge`
- **Response `200 OK`:** Returns updated `AlertResponse` with `acknowledged: true`.

### 6.4 Acknowledge Alert (POST Path Param)
- **Endpoint:** `POST /api/alerts/{alert_id}/acknowledge`
- **Response `200 OK`:** Returns updated `AlertResponse` with `acknowledged: true`.

### 6.5 Acknowledge Alert (POST JSON Body)
- **Endpoint:** `POST /api/alerts/acknowledge`
- **Request Body:**
```json
{
  "alert_id": 42
}
```
- **Response `200 OK`:** Returns updated `AlertResponse` with `acknowledged: true`.

# Faculty & Academic Reviewer Notes

## 1. Project Identity & Academic Context

- **Project Title:** AI-Based Multi-Modal Rockfall Risk Prediction and Early Warning System Prototype
- **Course / Scope:** Final Year Project / Software Engineering Capstone
- **Primary Objective:** To evaluate multi-modal deep learning architectures (spatial 1D-CNN fused with temporal LSTM) coupled with explainable generative AI for open-pit mine slope hazard assessment.
- **Prototype Clarification:** This software is an **academic prototype**. All telemetry data streams are synthetically simulated based on geotechnical physics formulas. It is not currently deployed to active mine operations or connected to government emergency broadcast systems.

---

## 2. Geotechnical & Physical Foundations

Rockfall and bench detachments in open-pit mines are multi-physics phenomena governed by structural geology, kinematic mechanics, and hydrogeological saturation:

1. **Mohr-Coulomb & Hoek-Brown Shear Strength:**
   \[
   \tau = c + (\sigma_n - u) \tan(\phi)
   \]
   Where \(u\) is cleft pore-water pressure from sustained rainfall. As rainfall intensifies and saturates rock fractures, pore pressure increases, drastically reducing the effective normal stress \(\sigma_n' = \sigma_n - u\) and precipitating shear sliding along joint planes.

2. **Kinematic Creep Stages:**
   - **Primary Creep (Transient):** Decreasing strain rate following excavation or blast impulse.
   - **Secondary Creep (Steady-state):** Constant, slow displacement velocity (millimeter-scale creep).
   - **Tertiary Creep (Accelerating):** Exponentially increasing displacement rate culminating in catastrophic slope detachment. The LSTM temporal branch captures this sequential acceleration.

3. **Dynamic Vibration & Blasting:**
   Heavy machinery haulage and explosive bench blasting generate high-frequency micro-seismic vibrations measured in **Peak Particle Velocity (PPV mm/s)**, which induce cyclic shear fatigue on rock bridges.

---

## 3. Machine Learning Architectural Justification

### Why CNN-LSTM Hybrid Architecture?
| Approach | Spatial Features (Terrain/DEM) | Temporal Sequences (Sensors) | Limitation in Mine Setting |
|---|---|---|---|
| **Standard Tabular (Random Forest/XGBoost)** | Flattened vector | Aggregated / flattened | Ignores sequential kinematic creep acceleration; cannot model sliding time-windows effectively. |
| **Pure 2D/1D CNN** | Excellent spatial capture | Weak long-term temporal dependencies | Insufficient memory retention for prolonged rain infiltration lags (hours to days). |
| **Pure LSTM** | Poor structural spatial modeling | Excellent temporal tracking | Disregards slope morphology, curvature, and lithological properties. |
| **RockfallAI Hybrid (CNN-LSTM)** | **1D-CNN branch captures morphology** | **2-layer LSTM captures sequential creep** | **Combines static geotechnical vulnerability with dynamic environmental triggers.** |

---

## 4. Safety Ethics & Separation of Concerns

A key evaluation criterion for AI in industrial safety is **predictable determinism**:

```
+------------------------------------------------------------------+
|                     SAFETY-CRITICAL BOUNDARY                     |
|                                                                  |
|   [Sensor & Terrain Streams]                                     |
|              |                                                   |
|              v                                                   |
|   [PyTorch CNN-LSTM Hybrid Model] ===> Deterministic Risk Score  |
|                                         (0.0 to 100.0)           |
|                                         LOW / MOD / HIGH / CRIT  |
|                                                   |              |
|              +------------------------------------+              |
|              | (Immutable numerical payload)                     |
|              v                                                   |
|   [Explainable GenAI Service]                                    |
|   - Explains WHY the score was reached                           |
|   - Recommends tactical procedures based on site rules           |
|   * ZERO authority to change risk score or level                 |
+------------------------------------------------------------------+
```

- **LLMs are non-deterministic** and must never be the primary arbiter of life-safety risk scores.
- In this architecture, the **PyTorch model deterministically establishes the risk score**.
- The LLM layer acts exclusively as an **Explainable AI (XAI)** tool, translating complex multi-sensor tensor states into human-readable engineering briefings.
- If external LLM access fails, the **deterministic zero-key fallback engine** takes over instantaneously, ensuring zero downtime.

---

## 5. Empirical Validation Metrics

The models were evaluated on a held-out 20% test split from 2,000 synthetic observations:

| Metric | CNN-LSTM Hybrid | Random Forest Baseline | XGBoost Baseline |
|---|---|---|---|
| **Mean Absolute Error (MAE)** | **1.14** | 1.11 | 1.13 |
| **Root Mean Squared Error (RMSE)** | **1.41** | 1.37 | 1.45 |
| **Classification Accuracy** | **97.67%** | 97.33% | 96.67% |
| **Precision** | **97.85%** | 97.49% | 96.82% |
| **Recall** | **97.67%** | 97.33% | 96.67% |
| **F1-Score** | **97.68%** | 97.33% | 96.67% |

*Note: All metrics reflect actual validation outputs recorded in `backend/models/training_metadata.json` and `backend/data/processed/model_comparison.json`.*

---

## 6. Implementation Scope & Real-World Pathway

For deployment in real-world mining concessions, the modular architecture accommodates:
1. **IoT Sensor Ingestion:** Replacing synthetic streams with real LoRaWAN/MQTT gateways connected to extensometers, biaxial tiltmeters, and geophones.
2. **InSAR Remote Sensing:** Ingesting Copernicus Sentinel-1 radar rasters for millimeter-scale line-of-sight displacement tracking.
3. **Edge Deployment:** Running the PyTorch model using ONNX Runtime or TensorRT on solar-powered NVIDIA Jetson nodes positioned on the mine pit perimeter.

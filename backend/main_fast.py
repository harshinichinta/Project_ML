from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.bias_scoring import get_bias_analysis
from routes.placement_predict import predict_placement
from routes.risk_scoring import get_risk_prediction
from routes.skill_gap import predict_skill_gap

app = FastAPI(title="Placement Prediction API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Placement Prediction API is running"}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/predict_placement")
def predict_endpoint(payload: dict[str, Any]) -> dict[str, Any]:
    return predict_placement(payload)


@app.post("/risk-score")
def risk_endpoint(payload: dict[str, Any]) -> dict[str, Any]:
    return get_risk_prediction(payload)


@app.post("/skill-gap")
def skill_gap_endpoint(payload: dict[str, Any]) -> dict[str, Any]:
    return predict_skill_gap(payload)


@app.get("/bias-analysis")
def bias_analysis() -> dict[str, Any]:
    return get_bias_analysis()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main_fast:app", host="0.0.0.0", port=8000, reload=True)

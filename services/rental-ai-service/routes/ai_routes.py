from fastapi import APIRouter, HTTPException
from typing import List
from services.ai_service import AIService
from models.request_models import RouteOptimizationRequest, ForecastRequest

router = APIRouter(prefix="/api/ai", tags=["AI"])
ai_service = AIService()

@router.get("/predictive-maintenance/{product_id}")
async def predictive_maintenance(product_id: str, rental_frequency: int, product_age: int):
    try:
        result = ai_service.predict_maintenance(rental_frequency, product_age)
        return {"product_id": product_id, **result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/optimize-route")
async def optimize_route(request: RouteOptimizationRequest):
    try:
        result = ai_service.optimize_route(request.addresses)
        return {"optimized_route": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/forecast/{product_id}")
async def forecast_demand(product_id: str, request: ForecastRequest):
    try:
        result = ai_service.forecast_demand(request.historical_rentals)
        return {"product_id": product_id, **result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/smart-reminder")
async def smart_reminder(rental_end_date: str):
    try:
        result = ai_service.get_optimal_reminder_time(rental_end_date)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
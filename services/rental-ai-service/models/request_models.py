from pydantic import BaseModel
from typing import List, Optional

class RentalData(BaseModel):
    rental_id: str
    product_id: str
    product_name: str
    rental_days: int
    daily_rate: float
    total_amount: float
    start_date: str
    end_date: str

class RouteOptimizationRequest(BaseModel):
    addresses: List[str]

class ForecastRequest(BaseModel):
    product_id: str
    historical_rentals: List[int]  
import random
import math
from typing import List
from datetime import datetime, timedelta

class AIService:
    
  
    def predict_maintenance(self, rental_frequency: int, product_age: int) -> dict:
        """Predicts when maintenance is needed based on usage."""
        risk_score = min(100, (rental_frequency * 2) + (product_age * 1.5))
        
        if risk_score > 80:
            recommendation = "Immediate maintenance required"
        elif risk_score > 50:
            recommendation = "Schedule maintenance within 7 days"
        elif risk_score > 30:
            recommendation = "Monitor weekly"
        else:
            recommendation = "No maintenance needed"
        
        return {
            "risk_score": round(risk_score, 2),
            "recommendation": recommendation,
            "estimated_next_maintenance_days": max(0, int(100 - risk_score))
        }
    

    def _haversine_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate distance between two coordinates in km."""
        R = 6371  # Earth's radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        return R * c

    def optimize_route(self, addresses: List[str]) -> List[str]:
        """Optimizes delivery route using Nearest Neighbor algorithm."""
        if len(addresses) <= 1:
            return addresses

 
        coords = [
            (random.uniform(28.0, 29.0), random.uniform(77.0, 78.0))  # Delhi region
            for _ in addresses
        ]

        # Nearest Neighbor Algorithm
        unvisited = list(range(len(coords)))
        route = [unvisited.pop(0)] 
        current = route[-1]

        while unvisited:
            nearest_idx = min(
                unvisited,
                key=lambda i: self._haversine_distance(
                    coords[current][0], coords[current][1],
                    coords[i][0], coords[i][1]
                )
            )
            route.append(nearest_idx)
            current = nearest_idx
            unvisited.remove(nearest_idx)

        # Return original addresses in optimized order
        return [addresses[i] for i in route]
    
  
    def forecast_demand(self, historical_data: List[int]) -> dict:
        """Forecasts future demand using Weighted Moving Average."""
        if not historical_data:
            return {"forecast": 0, "trend": "insufficient_data"}
        
        if len(historical_data) == 1:
            return {"forecast": historical_data[0], "trend": "stable", "confidence": 30}
        
    
        weights = [i+1 for i in range(len(historical_data))]
        weighted_avg = sum(h * w for h, w in zip(historical_data, weights)) / sum(weights)
        
      
        if len(historical_data) >= 3:
            recent_avg = sum(historical_data[-3:]) / 3
            if recent_avg > weighted_avg * 1.1:
                trend = "increasing"
            elif recent_avg < weighted_avg * 0.9:
                trend = "decreasing"
            else:
                trend = "stable"
        else:
            trend = "stable"
        
        next_forecast = int(weighted_avg * (1.1 if trend == "increasing" else 0.9 if trend == "decreasing" else 1))
        
        return {
            "forecast": next_forecast,
            "trend": trend,
            "confidence": min(100, len(historical_data) * 15)
        }

    def get_optimal_reminder_time(self, rental_end_date: str) -> dict:
        """Calculates the best time to send a return reminder."""
        end_date = datetime.fromisoformat(rental_end_date)
        now = datetime.now()
        
        days_until_return = (end_date - now).days
        
        if days_until_return > 3:
            recommended_time = (end_date - timedelta(days=3)).isoformat()
            message = "Send reminder 3 days before return"
        elif days_until_return > 1:
            recommended_time = (end_date - timedelta(days=1)).isoformat()
            message = "Send reminder 1 day before return"
        else:
            recommended_time = now.isoformat()
            message = "Send reminder immediately (return is due soon)"
        
        return {
            "recommended_time": recommended_time,
            "days_until_return": days_until_return,
            "message": message
        }
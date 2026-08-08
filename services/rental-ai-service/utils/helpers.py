import math
import random
from datetime import datetime, timedelta
from typing import List, Tuple, Optional, Dict, Any
import re


class GeoHelper:
    """Helper class for geographical calculations."""
    
    @staticmethod
    def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Calculate the great-circle distance between two points on Earth.
        Returns distance in kilometers.
        """
        R = 6371  # Earth's radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (
            math.sin(dlat / 2) ** 2
            + math.cos(math.radians(lat1))
            * math.cos(math.radians(lat2))
            * math.sin(dlon / 2) ** 2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    @staticmethod
    def generate_random_coordinates(
        center_lat: float = 28.6139,  # Default: Delhi, India
        center_lon: float = 77.2090,
        radius_km: float = 10.0
    ) -> Tuple[float, float]:
        """
        Generate random coordinates within a radius of a center point.
        Useful for demo data generation.
        """
        # Convert radius from km to degrees (rough approximation)
        radius_deg = radius_km / 111.0
        
        # Generate random angle and distance
        angle = random.uniform(0, 2 * math.pi)
        distance = random.uniform(0, radius_deg)
        
        lat = center_lat + distance * math.cos(angle)
        lon = center_lon + distance * math.sin(angle)
        
        return lat, lon


class DateHelper:
    """Helper class for date and time operations."""
    
    @staticmethod
    def parse_date(date_str: str) -> datetime:
        """Parse ISO format date string to datetime."""
        return datetime.fromisoformat(date_str)

    @staticmethod
    def format_date(date_obj: datetime) -> str:
        """Format datetime to ISO string."""
        return date_obj.isoformat()

    @staticmethod
    def days_between(date1: str, date2: str) -> int:
        """Calculate days between two date strings."""
        d1 = datetime.fromisoformat(date1)
        d2 = datetime.fromisoformat(date2)
        return abs((d2 - d1).days)

    @staticmethod
    def add_days(date_str: str, days: int) -> str:
        """Add days to a date string."""
        date_obj = datetime.fromisoformat(date_str)
        new_date = date_obj + timedelta(days=days)
        return new_date.isoformat()

    @staticmethod
    def get_today_iso() -> str:
        """Return today's date in ISO format."""
        return datetime.now().isoformat()


class DataHelper:
    """Helper class for data processing and validation."""
    
    @staticmethod
    def clean_string(text: str) -> str:
        """Clean and normalize a string."""
        if not text:
            return ""
        return text.strip().lower()

    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format."""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))

    @staticmethod
    def validate_phone(phone: str) -> bool:
        """Validate phone number format."""
        pattern = r'^\+?[1-9]\d{1,14}$'
        return bool(re.match(pattern, phone))

    @staticmethod
    def calculate_moving_average(data: List[float], window: int = 3) -> List[float]:
        """Calculate moving average of a list of numbers."""
        if len(data) < window:
            return data
        
        result = []
        for i in range(len(data) - window + 1):
            avg = sum(data[i:i+window]) / window
            result.append(avg)
        return result

    @staticmethod
    def calculate_weighted_average(data: List[float], weights: List[float]) -> float:
        """Calculate weighted average of data."""
        if len(data) != len(weights):
            raise ValueError("Data and weights must have the same length")
        total_weight = sum(weights)
        if total_weight == 0:
            return 0
        return sum(d * w for d, w in zip(data, weights)) / total_weight


class StatsHelper:
    """Helper class for statistical calculations."""
    
    @staticmethod
    def mean(data: List[float]) -> float:
        """Calculate mean of a list."""
        if not data:
            return 0
        return sum(data) / len(data)

    @staticmethod
    def median(data: List[float]) -> float:
        """Calculate median of a list."""
        if not data:
            return 0
        sorted_data = sorted(data)
        n = len(sorted_data)
        if n % 2 == 0:
            return (sorted_data[n//2 - 1] + sorted_data[n//2]) / 2
        return sorted_data[n//2]

    @staticmethod
    def standard_deviation(data: List[float]) -> float:
        """Calculate standard deviation of a list."""
        if len(data) < 2:
            return 0
        m = StatsHelper.mean(data)
        variance = sum((x - m) ** 2 for x in data) / len(data)
        return math.sqrt(variance)

    @staticmethod
    def normalize(data: List[float]) -> List[float]:
        """Normalize data to 0-1 range."""
        if not data:
            return []
        min_val = min(data)
        max_val = max(data)
        if min_val == max_val:
            return [0.5] * len(data)
        return [(x - min_val) / (max_val - min_val) for x in data]


class AIHelper:
    """Helper class for AI-related utilities."""
    
    @staticmethod
    def calculate_confidence_score(
        data_points: int,
        max_data_points: int = 100,
        base_confidence: float = 50.0
    ) -> float:
        """
        Calculate confidence score based on amount of data available.
        """
        if data_points >= max_data_points:
            return 100.0
        confidence = base_confidence + (data_points / max_data_points) * 50.0
        return min(100.0, confidence)

    @staticmethod
    def classify_risk(score: float) -> str:
        """Classify risk score into categories."""
        if score >= 80:
            return "high"
        elif score >= 50:
            return "medium"
        elif score >= 30:
            return "low"
        return "minimal"

    @staticmethod
    def get_trend_label(data: List[float]) -> str:
        """Determine trend label from data."""
        if len(data) < 3:
            return "insufficient_data"
        recent = sum(data[-3:]) / 3
        older = sum(data[:-3]) / max(1, len(data) - 3)
        if recent > older * 1.1:
            return "increasing"
        elif recent < older * 0.9:
            return "decreasing"
        return "stable"


# Singleton instances
geo_helper = GeoHelper()
date_helper = DateHelper()
data_helper = DataHelper()
stats_helper = StatsHelper()
ai_helper = AIHelper()
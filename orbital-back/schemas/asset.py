from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AssetCreate(BaseModel):
    asset_id: str
    asset_type: str  # SATELLITE, POWER GRID, AIRCRAFT, DATA CENTER
    status: str  # ACTIVE, WARNING, MAINTENANCE
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    altitude_km: Optional[float] = None
    velocity_x: Optional[float] = None
    velocity_y: Optional[float] = None
    velocity_z: Optional[float] = None
    battery_voltage: Optional[float] = None
    coordinate_array: Optional[str] = None


class AssetOut(BaseModel):
    id: int
    asset_id: str
    asset_type: str
    status: str
    registration_timestamp: datetime
    latitude: Optional[float]
    longitude: Optional[float]
    altitude_km: Optional[float]
    velocity_x: Optional[float]
    velocity_y: Optional[float]
    velocity_z: Optional[float]
    battery_voltage: Optional[float]
    coordinate_array: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class AssetStats(BaseModel):
    total_assets: int
    nominal_assets: int
    at_risk_assets: int

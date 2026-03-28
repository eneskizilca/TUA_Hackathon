from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


# --- Auth ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None


# --- Satellite ---
class SatelliteCreate(BaseModel):
    name: str
    norad_id: str


class SatelliteOut(BaseModel):
    id: int
    name: str
    norad_id: str
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- Telemetry ---
class TelemetryCreate(BaseModel):
    satellite_id: int
    latitude: float
    longitude: float
    altitude_km: float
    velocity_kmps: Optional[float] = None


class TelemetryOut(BaseModel):
    id: int
    satellite_id: int
    latitude: float
    longitude: float
    altitude_km: float
    velocity_kmps: Optional[float]
    timestamp: datetime

    class Config:
        from_attributes = True

from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from enum import Enum


class UserRole(str, Enum):
    OBSERVER = "OBSERVER"
    OPERATOR = "OPERATOR"


# --- Auth ---
class UserCreate(BaseModel):
    full_name: Optional[str] = None
    email: EmailStr
    password: str
    role: UserRole = UserRole.OBSERVER


class UserOut(BaseModel):
    id: int
    full_name: Optional[str]
    email: EmailStr
    role: UserRole
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None


class RecoverRequest(BaseModel):
    email: EmailStr


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

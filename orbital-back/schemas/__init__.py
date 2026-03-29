# Space weather schemas package
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from enum import Enum


class UserRole(str, Enum):
    OBSERVER = "OBSERVER"
    OPERATOR = "OPERATOR"
    ADMIN = "ADMIN"


class AlertSeverity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


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


class UserUpdate(BaseModel):
    is_active: Optional[bool] = None
    role: Optional[UserRole] = None


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


# --- Alert ---
class AlertCreate(BaseModel):
    title: str
    message: str
    severity: AlertSeverity
    threat_type: Optional[str] = None
    affected_users: int = 0
    is_global: bool = False


class AlertOut(BaseModel):
    id: int
    title: str
    message: str
    severity: AlertSeverity
    threat_type: Optional[str]
    affected_users: int
    is_global: bool
    created_at: datetime

    class Config:
        from_attributes = True


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


# --- Asset ---
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

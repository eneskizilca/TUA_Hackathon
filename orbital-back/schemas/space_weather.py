from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional, Dict
from enum import Enum


# SWPC Data Models
class SolarWindData(BaseModel):
    speed_kmps: float = Field(..., description="Solar wind speed in km/s")
    density_ppcm: float = Field(..., description="Particle density in particles/cm³")
    timestamp: datetime = Field(..., description="Measurement timestamp in UTC")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class MagneticFieldData(BaseModel):
    bz_nt: float = Field(..., description="IMF Bz component in nanoTesla")
    bt_nt: float = Field(..., description="IMF Bt total field in nanoTesla")
    timestamp: datetime = Field(..., description="Measurement timestamp in UTC")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class KpIndexData(BaseModel):
    kp_value: float = Field(..., ge=0.0, le=9.0, description="Kp index value (0-9)")
    status: str = Field(..., description="Classification: QUIET, ACTIVE, or STORM")
    observed_time: datetime = Field(..., description="Observation timestamp in UTC")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class SpaceWeatherSnapshot(BaseModel):
    solar_wind: SolarWindData
    magnetic_field: MagneticFieldData
    kp_index: KpIndexData
    fetched_at: datetime

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


# DONKI Data Models
class CMEForecast(BaseModel):
    activity_id: str = Field(..., description="Unique CME activity identifier")
    speed_kmps: float = Field(..., description="CME speed in km/s")
    is_earth_directed: bool = Field(..., description="Whether CME is directed at Earth")
    start_time: datetime = Field(..., description="CME start time in UTC")
    high_priority: bool = Field(default=False, description="High priority flag")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class SolarFlare(BaseModel):
    class_type: str = Field(..., description="Flare class: B, C, M, or X")
    peak_time: datetime = Field(..., description="Peak time in UTC")
    source_location: str = Field(..., description="Source location coordinates")
    priority: str = Field(..., description="Priority: NORMAL, HIGH, or EXTREME")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class ForecastSnapshot(BaseModel):
    cme_forecasts: List[CMEForecast]
    solar_flares: List[SolarFlare]
    fetched_at: datetime

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


# Threat Models
class ThreatClassification(str, Enum):
    SHIELD_BREACH = "SHIELD_BREACH"
    GEOMAGNETIC_STORM = "GEOMAGNETIC_STORM"
    INCOMING_CME = "INCOMING_CME"
    RADIATION_STORM = "RADIATION_STORM"


class ThreatAssessment(BaseModel):
    active_threats: List[ThreatClassification]
    composite_score: float = Field(..., ge=0.0, le=100.0, description="Composite threat score (0-100)")
    timestamp: datetime

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


# Asset Models
class AssetStatus(str, Enum):
    SAFE = "SAFE"
    CAUTION = "CAUTION"
    CRITICAL = "CRITICAL"
    OFFLINE = "OFFLINE"


class AssetStatusSummary(BaseModel):
    safe_count: int
    caution_count: int
    critical_count: int
    offline_count: int
    by_type: Dict[str, Dict[str, int]]


# Dashboard Models
class DashboardData(BaseModel):
    current_conditions: SpaceWeatherSnapshot
    threats: ThreatAssessment
    assets: AssetStatusSummary
    forecasts: ForecastSnapshot
    cache_age_seconds: Optional[int] = None

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

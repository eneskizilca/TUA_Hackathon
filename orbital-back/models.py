from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from database import Base


class UserRole(str, enum.Enum):
    OBSERVER = "OBSERVER"
    OPERATOR = "OPERATOR"
    ADMIN = "ADMIN"


class AlertSeverity(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class AssetType(str, enum.Enum):
    SATELLITE = "SATELLITE"
    POWER_GRID = "POWER GRID"
    AIRCRAFT = "AIRCRAFT"
    DATA_CENTER = "DATA CENTER"


class AssetStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    WARNING = "WARNING"
    MAINTENANCE = "MAINTENANCE"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.OBSERVER, nullable=False)
    is_active = Column(Boolean, default=False)  # Changed to False by default
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    satellites = relationship("Satellite", back_populates="owner")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(Enum(AlertSeverity), nullable=False)
    threat_type = Column(String, nullable=True)  # SHIELD_BREACH, CME, etc.
    affected_users = Column(Integer, default=0)
    is_global = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Satellite(Base):
    __tablename__ = "satellites"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    norad_id = Column(String, unique=True, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="satellites")
    telemetry = relationship("Telemetry", back_populates="satellite")


class Telemetry(Base):
    __tablename__ = "telemetry"

    id = Column(Integer, primary_key=True, index=True)
    satellite_id = Column(Integer, ForeignKey("satellites.id"))
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    altitude_km = Column(Float, nullable=False)
    velocity_kmps = Column(Float, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    satellite = relationship("Satellite", back_populates="telemetry")


class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(String, unique=True, nullable=False, index=True)
    asset_type = Column(Enum(AssetType), nullable=False)
    status = Column(Enum(AssetStatus), default=AssetStatus.ACTIVE, nullable=False)
    
    # Telemetry & Position
    registration_timestamp = Column(DateTime(timezone=True), server_default=func.now())
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    altitude_km = Column(Float, nullable=True)
    
    # Orbital Dynamics
    velocity_x = Column(Float, nullable=True)
    velocity_y = Column(Float, nullable=True)
    velocity_z = Column(Float, nullable=True)
    battery_voltage = Column(Float, nullable=True)
    
    # Projected Route
    coordinate_array = Column(Text, nullable=True)  # JSON string
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class PushToken(Base):
    __tablename__ = "push_tokens"

    id = Column(Integer, primary_key=True, index=True)
    expo_token = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="push_tokens")

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from database import Base


class UserRole(str, enum.Enum):
    OBSERVER = "OBSERVER"
    OPERATOR = "OPERATOR"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.OBSERVER, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    satellites = relationship("Satellite", back_populates="owner")


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

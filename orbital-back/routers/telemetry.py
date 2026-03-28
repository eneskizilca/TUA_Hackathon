from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from schemas import TelemetryCreate, TelemetryOut
from models import Telemetry

router = APIRouter()


@router.post("/", response_model=TelemetryOut, status_code=201)
def ingest_telemetry(payload: TelemetryCreate, db: Session = Depends(get_db)):
    record = Telemetry(**payload.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/{satellite_id}", response_model=List[TelemetryOut])
def get_telemetry(satellite_id: int, limit: int = 50, db: Session = Depends(get_db)):
    records = (
        db.query(Telemetry)
        .filter(Telemetry.satellite_id == satellite_id)
        .order_by(Telemetry.timestamp.desc())
        .limit(limit)
        .all()
    )
    if not records:
        raise HTTPException(status_code=404, detail="No telemetry found for this satellite")
    return records

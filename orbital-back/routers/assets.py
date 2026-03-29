from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Asset, AssetStatus
from schemas import AssetCreate, AssetOut, AssetStats

router = APIRouter(prefix="/api/v1/assets", tags=["assets"])


@router.get("/stats", response_model=AssetStats)
def get_asset_stats(db: Session = Depends(get_db)):
    """Get asset statistics"""
    total = db.query(Asset).count()
    nominal = db.query(Asset).filter(Asset.status == AssetStatus.ACTIVE).count()
    at_risk = db.query(Asset).filter(
        (Asset.status == AssetStatus.WARNING) | (Asset.status == AssetStatus.MAINTENANCE)
    ).count()
    
    return AssetStats(
        total_assets=total,
        nominal_assets=nominal,
        at_risk_assets=at_risk
    )


@router.get("/", response_model=List[AssetOut])
def list_assets(db: Session = Depends(get_db)):
    """List all assets"""
    assets = db.query(Asset).order_by(Asset.created_at.desc()).all()
    return assets


@router.get("/{asset_id}", response_model=AssetOut)
def get_asset(asset_id: str, db: Session = Depends(get_db)):
    """Get a specific asset by asset_id"""
    asset = db.query(Asset).filter(Asset.asset_id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset


@router.post("/", response_model=AssetOut)
def create_asset(asset_data: AssetCreate, db: Session = Depends(get_db)):
    """Create a new asset"""
    # Check if asset_id already exists
    existing = db.query(Asset).filter(Asset.asset_id == asset_data.asset_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Asset ID already exists")
    
    # Create new asset
    new_asset = Asset(
        asset_id=asset_data.asset_id,
        asset_type=asset_data.asset_type,
        status=asset_data.status,
        latitude=asset_data.latitude,
        longitude=asset_data.longitude,
        altitude_km=asset_data.altitude_km,
        velocity_x=asset_data.velocity_x,
        velocity_y=asset_data.velocity_y,
        velocity_z=asset_data.velocity_z,
        battery_voltage=asset_data.battery_voltage,
        coordinate_array=asset_data.coordinate_array
    )
    
    db.add(new_asset)
    db.commit()
    db.refresh(new_asset)
    
    return new_asset


@router.delete("/{asset_id}")
def delete_asset(asset_id: str, db: Session = Depends(get_db)):
    """Delete an asset"""
    asset = db.query(Asset).filter(Asset.asset_id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    db.delete(asset)
    db.commit()
    
    return {"message": "Asset deleted successfully"}

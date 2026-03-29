from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User, Alert, UserRole, AlertSeverity
from schemas import UserOut, UserUpdate, AlertOut, AlertCreate
from clients.swpc_client import SWPCClient
from clients.donki_client import DONKIClient
from config import settings
import httpx

router = APIRouter()

# Initialize clients for health check
swpc_client = SWPCClient()
donki_client = DONKIClient(api_key=settings.NASA_API_KEY)


@router.get("/users", response_model=List[UserOut])
def get_all_users(db: Session = Depends(get_db)):
    """Get all users for admin management"""
    users = db.query(User).order_by(User.created_at.desc()).all()
    return users


@router.get("/users/pending", response_model=List[UserOut])
def get_pending_users(db: Session = Depends(get_db)):
    """Get users pending approval (is_active=False and role=OPERATOR)"""
    pending_users = db.query(User).filter(
        User.is_active == False,
        User.role == UserRole.OPERATOR
    ).order_by(User.created_at.desc()).all()
    return pending_users


@router.patch("/users/{user_id}", response_model=UserOut)
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    """Update user (approve/reject, change role)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_update.is_active is not None:
        user.is_active = user_update.is_active
    if user_update.role is not None:
        user.role = user_update.role
    
    db.commit()
    db.refresh(user)
    return user


@router.get("/api-health")
async def check_api_health():
    """Check health of external APIs (NOAA SWPC and NASA DONKI)"""
    health_status = {
        "noaa_swpc": {
            "status": "unknown",
            "latency_ms": 0,
            "endpoints": {
                "plasma": False,
                "mag": False,
                "kp_index": False
            }
        },
        "nasa_donki": {
            "status": "unknown",
            "latency_ms": 0,
            "endpoints": {
                "cme": False,
                "flare": False
            }
        }
    }
    
    # Check NOAA SWPC
    try:
        import time
        start = time.time()
        
        async with httpx.AsyncClient(timeout=10) as client:
            # Test plasma endpoint
            try:
                response = await client.get(swpc_client.PLASMA_ENDPOINT)
                health_status["noaa_swpc"]["endpoints"]["plasma"] = response.status_code == 200
            except:
                pass
            
            # Test mag endpoint
            try:
                response = await client.get(swpc_client.MAG_ENDPOINT)
                health_status["noaa_swpc"]["endpoints"]["mag"] = response.status_code == 200
            except:
                pass
            
            # Test kp endpoint
            try:
                response = await client.get(swpc_client.KP_ENDPOINT)
                health_status["noaa_swpc"]["endpoints"]["kp_index"] = response.status_code == 200
            except:
                pass
        
        latency = int((time.time() - start) * 1000)
        health_status["noaa_swpc"]["latency_ms"] = latency
        
        # Determine overall status
        all_ok = all(health_status["noaa_swpc"]["endpoints"].values())
        health_status["noaa_swpc"]["status"] = "healthy" if all_ok else "degraded"
    except Exception as e:
        health_status["noaa_swpc"]["status"] = "down"
    
    # Check NASA DONKI
    try:
        import time
        from datetime import datetime, timedelta
        start = time.time()
        
        end_date = datetime.now()
        start_date = end_date - timedelta(days=1)
        
        async with httpx.AsyncClient(timeout=10) as client:
            # Test CME endpoint
            try:
                url = f"{donki_client.BASE_URL}/CME?api_key={settings.NASA_API_KEY}&startDate={start_date.strftime('%Y-%m-%d')}&endDate={end_date.strftime('%Y-%m-%d')}"
                response = await client.get(url)
                health_status["nasa_donki"]["endpoints"]["cme"] = response.status_code == 200
            except:
                pass
            
            # Test FLR endpoint
            try:
                url = f"{donki_client.BASE_URL}/FLR?api_key={settings.NASA_API_KEY}&startDate={start_date.strftime('%Y-%m-%d')}&endDate={end_date.strftime('%Y-%m-%d')}"
                response = await client.get(url)
                health_status["nasa_donki"]["endpoints"]["flare"] = response.status_code == 200
            except:
                pass
        
        latency = int((time.time() - start) * 1000)
        health_status["nasa_donki"]["latency_ms"] = latency
        
        # Determine overall status
        all_ok = all(health_status["nasa_donki"]["endpoints"].values())
        health_status["nasa_donki"]["status"] = "healthy" if all_ok else "degraded"
    except Exception as e:
        health_status["nasa_donki"]["status"] = "down"
    
    return health_status


@router.get("/alerts", response_model=List[AlertOut])
def get_alerts(limit: int = 50, db: Session = Depends(get_db)):
    """Get recent alerts ordered by severity and time"""
    alerts = db.query(Alert).order_by(
        Alert.created_at.desc()
    ).limit(limit).all()
    return alerts


@router.post("/alerts", response_model=AlertOut)
def create_alert(alert: AlertCreate, db: Session = Depends(get_db)):
    """Create a new alert"""
    db_alert = Alert(**alert.dict())
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert

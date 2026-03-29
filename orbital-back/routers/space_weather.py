from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas.space_weather import DashboardData
from clients.swpc_client import SWPCClient
from clients.donki_client import DONKIClient
from services.threat_analyzer import ThreatAnalyzer
from services.dashboard_service import DashboardService
from config import settings

router = APIRouter()

# Initialize clients and services
swpc_client = SWPCClient()
donki_client = DONKIClient(api_key=settings.NASA_API_KEY)
threat_analyzer = ThreatAnalyzer()
dashboard_service = DashboardService(swpc_client, donki_client, threat_analyzer)


@router.get("/dashboard", response_model=DashboardData)
async def get_dashboard_data(db: Session = Depends(get_db)):
    """Get unified dashboard data including current conditions, threats, assets, and forecasts"""
    data = await dashboard_service.get_dashboard_data(db)
    if not data:
        raise HTTPException(status_code=503, detail="Unable to fetch space weather data")
    return data


@router.get("/current")
async def get_current_conditions():
    """Get current space weather conditions from SWPC"""
    snapshot = await swpc_client.fetch_all()
    if not snapshot:
        raise HTTPException(status_code=503, detail="Unable to fetch current conditions")
    return snapshot


@router.get("/forecasts")
async def get_forecasts():
    """Get CME and solar flare forecasts from DONKI"""
    forecasts = await donki_client.fetch_all_forecasts()
    if not forecasts:
        raise HTTPException(status_code=503, detail="Unable to fetch forecasts")
    return forecasts


@router.get("/threats")
async def get_threats():
    """Get current threat assessment"""
    snapshot = await swpc_client.fetch_all()
    forecasts = await donki_client.fetch_all_forecasts()
    
    if not snapshot or not forecasts:
        raise HTTPException(status_code=503, detail="Unable to fetch threat data")
    
    threats = threat_analyzer.analyze(snapshot, forecasts)
    return threats

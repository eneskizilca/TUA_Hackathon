from typing import Optional
from sqlalchemy.orm import Session
from schemas.space_weather import (
    DashboardData,
    SpaceWeatherSnapshot,
    ForecastSnapshot,
    ThreatAssessment,
    AssetStatusSummary
)
from clients.swpc_client import SWPCClient
from clients.donki_client import DONKIClient
from services.threat_analyzer import ThreatAnalyzer


class DashboardService:
    """Provides unified data aggregation for frontend dashboard"""
    
    def __init__(self, swpc_client: SWPCClient, donki_client: DONKIClient, threat_analyzer: ThreatAnalyzer):
        self.swpc_client = swpc_client
        self.donki_client = donki_client
        self.threat_analyzer = threat_analyzer
    
    async def get_dashboard_data(self, db: Session) -> Optional[DashboardData]:
        """Get all dashboard data in one call"""
        try:
            # Fetch current conditions
            current_conditions = await self.swpc_client.fetch_all()
            if not current_conditions:
                return None
            
            # Fetch forecasts
            forecasts = await self.donki_client.fetch_all_forecasts()
            if not forecasts:
                # Create empty forecast if API fails
                from schemas.space_weather import ForecastSnapshot
                from datetime import datetime, timezone
                forecasts = ForecastSnapshot(
                    cme_forecasts=[],
                    solar_flares=[],
                    fetched_at=datetime.now(timezone.utc)
                )
            
            # Analyze threats
            threats = self.threat_analyzer.analyze(current_conditions, forecasts)
            
            # Get asset summary (mock for now)
            assets = AssetStatusSummary(
                safe_count=12,
                caution_count=2,
                critical_count=1,
                offline_count=0,
                by_type={
                    "SATELLITE": {"SAFE": 8, "CAUTION": 1, "CRITICAL": 1, "OFFLINE": 0},
                    "TRANSFORMER": {"SAFE": 3, "CAUTION": 1, "CRITICAL": 0, "OFFLINE": 0},
                    "AIRCRAFT": {"SAFE": 1, "CAUTION": 0, "CRITICAL": 0, "OFFLINE": 0}
                }
            )
            
            # Calculate cache age
            cache_age = self.swpc_client.get_cache_age("plasma")
            
            return DashboardData(
                current_conditions=current_conditions,
                threats=threats,
                assets=assets,
                forecasts=forecasts,
                cache_age_seconds=cache_age
            )
        except Exception as e:
            import logging
            logging.error(f"Error getting dashboard data: {e}")
            return None

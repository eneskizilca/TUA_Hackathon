from typing import List
from schemas.space_weather import (
    SpaceWeatherSnapshot,
    ForecastSnapshot,
    ThreatClassification,
    ThreatAssessment
)
from datetime import datetime, timezone


class ThreatAnalyzer:
    """Analyzes space weather conditions and determines threat levels"""
    
    def detect_shield_breach(self, snapshot: SpaceWeatherSnapshot) -> bool:
        """Detect shield breach: speed > 600 km/s AND Bz < -10 nT"""
        return (snapshot.solar_wind.speed_kmps > 600 and 
                snapshot.magnetic_field.bz_nt < -10)
    
    def detect_geomagnetic_storm(self, snapshot: SpaceWeatherSnapshot) -> bool:
        """Detect geomagnetic storm: Kp > 7.0"""
        return snapshot.kp_index.kp_value > 7.0
    
    def detect_incoming_cme(self, forecasts: ForecastSnapshot) -> bool:
        """Detect incoming CME: Earth-directed AND speed > 1000 km/s"""
        for cme in forecasts.cme_forecasts:
            if cme.is_earth_directed and cme.speed_kmps > 1000:
                return True
        return False
    
    def detect_radiation_storm(self, forecasts: ForecastSnapshot) -> bool:
        """Detect radiation storm: X-class flare detected"""
        for flare in forecasts.solar_flares:
            if flare.class_type.startswith('X'):
                return True
        return False
    
    def calculate_composite_score(self, threats: List[ThreatClassification]) -> float:
        """Calculate composite threat score (0-100)"""
        score = 0.0
        
        if ThreatClassification.SHIELD_BREACH in threats:
            score += 40
        if ThreatClassification.GEOMAGNETIC_STORM in threats:
            score += 30
        if ThreatClassification.INCOMING_CME in threats:
            score += 20
        if ThreatClassification.RADIATION_STORM in threats:
            score += 10
        
        return min(score, 100.0)
    
    def analyze(self, snapshot: SpaceWeatherSnapshot, forecasts: ForecastSnapshot) -> ThreatAssessment:
        """Analyze all conditions and return threat assessment"""
        active_threats = []
        
        if self.detect_shield_breach(snapshot):
            active_threats.append(ThreatClassification.SHIELD_BREACH)
        
        if self.detect_geomagnetic_storm(snapshot):
            active_threats.append(ThreatClassification.GEOMAGNETIC_STORM)
        
        if self.detect_incoming_cme(forecasts):
            active_threats.append(ThreatClassification.INCOMING_CME)
        
        if self.detect_radiation_storm(forecasts):
            active_threats.append(ThreatClassification.RADIATION_STORM)
        
        composite_score = self.calculate_composite_score(active_threats)
        
        return ThreatAssessment(
            active_threats=active_threats,
            composite_score=composite_score,
            timestamp=datetime.now(timezone.utc)
        )

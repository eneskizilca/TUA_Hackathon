import httpx
import logging
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from schemas.space_weather import (
    SolarWindData,
    MagneticFieldData,
    KpIndexData,
    SpaceWeatherSnapshot
)

logger = logging.getLogger(__name__)


class SWPCClient:
    """Client for fetching real-time data from NOAA Space Weather Prediction Center"""
    
    BASE_URL = "https://services.swpc.noaa.gov/products"
    PLASMA_ENDPOINT = f"{BASE_URL}/solar-wind/plasma-1-day.json"
    MAG_ENDPOINT = f"{BASE_URL}/solar-wind/mag-1-day.json"
    KP_ENDPOINT = f"{BASE_URL}/noaa-planetary-k-index.json"
    
    def __init__(self, timeout: int = 30):
        self.timeout = timeout
        self.cache: Dict[str, Any] = {}
        
    def _classify_kp_status(self, kp_value: float) -> str:
        """Classify Kp index into QUIET, ACTIVE, or STORM"""
        if 0 <= kp_value <= 4:
            return "QUIET"
        elif 5 <= kp_value <= 6:
            return "ACTIVE"
        elif 7 <= kp_value <= 9:
            return "STORM"
        else:
            return "UNKNOWN"
    
    async def _fetch_with_retry(self, url: str, cache_key: str, max_retries: int = 3) -> Optional[list]:
        """Fetch data with retry logic and caching"""
        retry_delays = [1, 2, 4]  # Exponential backoff
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            for attempt in range(max_retries):
                try:
                    response = await client.get(url)
                    
                    if response.status_code == 429:
                        # Rate limit - wait 60 seconds
                        logger.warning(f"Rate limit hit for {url}, waiting 60 seconds")
                        await httpx.AsyncClient().aclose()
                        import asyncio
                        await asyncio.sleep(60)
                        continue
                    
                    if response.status_code >= 500:
                        # Server error - exponential backoff
                        if attempt < max_retries - 1:
                            delay = retry_delays[attempt]
                            logger.warning(f"Server error {response.status_code} for {url}, retrying in {delay}s")
                            import asyncio
                            await asyncio.sleep(delay)
                            continue
                        else:
                            logger.error(f"Max retries exhausted for {url}")
                            return self.cache.get(cache_key)
                    
                    if response.status_code == 200:
                        data = response.json()
                        # Cache successful response
                        self.cache[cache_key] = {
                            "data": data,
                            "fetched_at": datetime.now(timezone.utc)
                        }
                        return data
                    
                    logger.error(f"Unexpected status code {response.status_code} for {url}")
                    return self.cache.get(cache_key, {}).get("data")
                    
                except httpx.RequestError as e:
                    logger.error(f"Network error fetching {url}: {e}")
                    if attempt == max_retries - 1:
                        # Return cached data on final failure
                        cached = self.cache.get(cache_key)
                        if cached:
                            logger.info(f"Returning cached data for {cache_key}")
                            return cached.get("data")
                        return None
                    
        return None
    
    async def fetch_solar_wind(self) -> Optional[SolarWindData]:
        """Fetch solar wind speed and density from plasma-1-day.json"""
        try:
            data = await self._fetch_with_retry(self.PLASMA_ENDPOINT, "plasma")
            if not data or len(data) < 2:
                logger.error("Invalid plasma data format")
                return None
            
            # Get the most recent measurement (last row, skip header)
            latest = data[-1]
            
            return SolarWindData(
                speed_kmps=float(latest[1]) if latest[1] else 0.0,
                density_ppcm=float(latest[2]) if latest[2] else 0.0,
                timestamp=datetime.fromisoformat(latest[0].replace('Z', '+00:00'))
            )
        except Exception as e:
            logger.error(f"Error parsing solar wind data: {e}")
            return None
    
    async def fetch_magnetic_field(self) -> Optional[MagneticFieldData]:
        """Fetch IMF Bz and Bt from mag-1-day.json"""
        try:
            data = await self._fetch_with_retry(self.MAG_ENDPOINT, "mag")
            if not data or len(data) < 2:
                logger.error("Invalid magnetic field data format")
                return None
            
            # Get the most recent measurement (last row, skip header)
            latest = data[-1]
            
            return MagneticFieldData(
                bz_nt=float(latest[3]) if latest[3] else 0.0,
                bt_nt=float(latest[6]) if latest[6] else 0.0,
                timestamp=datetime.fromisoformat(latest[0].replace('Z', '+00:00'))
            )
        except Exception as e:
            logger.error(f"Error parsing magnetic field data: {e}")
            return None
    
    async def fetch_kp_index(self) -> Optional[KpIndexData]:
        """Fetch current Kp index from noaa-planetary-k-index.json"""
        try:
            data = await self._fetch_with_retry(self.KP_ENDPOINT, "kp")
            if not data or len(data) < 2:
                logger.error("Invalid Kp index data format")
                return None
            
            # Get the most recent measurement (last row, skip header)
            latest = data[-1]
            kp_value = float(latest[1]) if latest[1] else 0.0
            
            return KpIndexData(
                kp_value=kp_value,
                status=self._classify_kp_status(kp_value),
                observed_time=datetime.fromisoformat(latest[0].replace('Z', '+00:00'))
            )
        except Exception as e:
            logger.error(f"Error parsing Kp index data: {e}")
            return None
    
    async def fetch_all(self) -> Optional[SpaceWeatherSnapshot]:
        """Fetch all SWPC data and return as a snapshot"""
        try:
            solar_wind = await self.fetch_solar_wind()
            magnetic_field = await self.fetch_magnetic_field()
            kp_index = await self.fetch_kp_index()
            
            if not all([solar_wind, magnetic_field, kp_index]):
                logger.error("Failed to fetch complete space weather data")
                return None
            
            return SpaceWeatherSnapshot(
                solar_wind=solar_wind,
                magnetic_field=magnetic_field,
                kp_index=kp_index,
                fetched_at=datetime.now(timezone.utc)
            )
        except Exception as e:
            logger.error(f"Error creating space weather snapshot: {e}")
            return None
    
    def get_cache_age(self, cache_key: str) -> Optional[int]:
        """Get age of cached data in seconds"""
        cached = self.cache.get(cache_key)
        if not cached:
            return None
        
        age = (datetime.now(timezone.utc) - cached["fetched_at"]).total_seconds()
        return int(age)

import httpx
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Dict, Any
from schemas.space_weather import CMEForecast, SolarFlare, ForecastSnapshot

logger = logging.getLogger(__name__)


class DONKIClient:
    """Client for fetching forecast data from NASA DONKI API"""
    
    BASE_URL = "https://api.nasa.gov/DONKI"
    
    def __init__(self, api_key: str, timeout: int = 30):
        self.api_key = api_key
        self.timeout = timeout
        self.cache: Dict[str, Any] = {}
    
    def _classify_flare_priority(self, class_type: str) -> str:
        """Classify solar flare priority based on class type"""
        if class_type.startswith('X'):
            return "EXTREME"
        elif class_type.startswith('M'):
            return "HIGH"
        else:
            return "NORMAL"
    
    def _check_cme_priority(self, speed: float, is_earth_directed: bool) -> bool:
        """Check if CME is high priority"""
        return is_earth_directed and speed > 500
    
    async def _fetch_with_retry(self, url: str, cache_key: str, max_retries: int = 3) -> Optional[Any]:
        """Fetch data with retry logic and caching"""
        retry_delays = [1, 2, 4]  # Exponential backoff
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            for attempt in range(max_retries):
                try:
                    response = await client.get(url)
                    
                    if response.status_code in [401, 403]:
                        # Authentication error
                        logger.error(f"Authentication failed for NASA DONKI API: {response.status_code}")
                        return None
                    
                    if response.status_code == 429:
                        # Rate limit - wait 300 seconds
                        logger.warning(f"Rate limit hit for {url}, waiting 300 seconds")
                        import asyncio
                        await asyncio.sleep(300)
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
                            return self.cache.get(cache_key, {}).get("data")
                    
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
    
    async def fetch_cme_forecasts(self, start_date: str, end_date: str) -> List[CMEForecast]:
        """Fetch CME forecasts from DONKI API"""
        try:
            url = f"{self.BASE_URL}/CME?api_key={self.api_key}&startDate={start_date}&endDate={end_date}"
            data = await self._fetch_with_retry(url, "cme")
            
            if not data:
                logger.warning("No CME data received")
                return []
            
            forecasts = []
            for cme in data:
                try:
                    # Extract CME analysis data
                    analyses = cme.get('cmeAnalyses', [])
                    if not analyses:
                        continue
                    
                    analysis = analyses[0]  # Use first analysis
                    speed = float(analysis.get('speed', 0))
                    is_earth_directed = analysis.get('isEarthDirected', False) or analysis.get('isMostAccurate', False)
                    
                    forecast = CMEForecast(
                        activity_id=cme.get('activityID', ''),
                        speed_kmps=speed,
                        is_earth_directed=is_earth_directed,
                        start_time=datetime.fromisoformat(cme.get('startTime', '').replace('Z', '+00:00')),
                        high_priority=self._check_cme_priority(speed, is_earth_directed)
                    )
                    forecasts.append(forecast)
                except Exception as e:
                    logger.error(f"Error parsing CME event: {e}")
                    continue
            
            return forecasts
        except Exception as e:
            logger.error(f"Error fetching CME forecasts: {e}")
            return []
    
    async def fetch_solar_flares(self, start_date: str, end_date: str) -> List[SolarFlare]:
        """Fetch solar flare forecasts from DONKI API"""
        try:
            url = f"{self.BASE_URL}/FLR?api_key={self.api_key}&startDate={start_date}&endDate={end_date}"
            data = await self._fetch_with_retry(url, "flr")
            
            if not data:
                logger.warning("No solar flare data received")
                return []
            
            flares = []
            for flare in data:
                try:
                    class_type = flare.get('classType', 'C1.0')
                    
                    solar_flare = SolarFlare(
                        class_type=class_type,
                        peak_time=datetime.fromisoformat(flare.get('peakTime', '').replace('Z', '+00:00')),
                        source_location=flare.get('sourceLocation', 'Unknown'),
                        priority=self._classify_flare_priority(class_type)
                    )
                    flares.append(solar_flare)
                except Exception as e:
                    logger.error(f"Error parsing solar flare event: {e}")
                    continue
            
            return flares
        except Exception as e:
            logger.error(f"Error fetching solar flares: {e}")
            return []
    
    async def fetch_all_forecasts(self, days_back: int = 7) -> Optional[ForecastSnapshot]:
        """Fetch all DONKI forecast data"""
        try:
            end_date = datetime.now(timezone.utc)
            start_date = end_date - timedelta(days=days_back)
            
            start_str = start_date.strftime('%Y-%m-%d')
            end_str = end_date.strftime('%Y-%m-%d')
            
            cme_forecasts = await self.fetch_cme_forecasts(start_str, end_str)
            solar_flares = await self.fetch_solar_flares(start_str, end_str)
            
            return ForecastSnapshot(
                cme_forecasts=cme_forecasts,
                solar_flares=solar_flares,
                fetched_at=datetime.now(timezone.utc)
            )
        except Exception as e:
            logger.error(f"Error creating forecast snapshot: {e}")
            return None
    
    def get_cache_age(self, cache_key: str) -> Optional[int]:
        """Get age of cached data in seconds"""
        cached = self.cache.get(cache_key)
        if not cached:
            return None
        
        age = (datetime.now(timezone.utc) - cached["fetched_at"]).total_seconds()
        return int(age)

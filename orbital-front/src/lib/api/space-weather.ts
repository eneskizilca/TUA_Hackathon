import { DashboardData, SpaceWeatherSnapshot, ThreatAssessment, ForecastSnapshot } from '@/types/space-weather';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchDashboardData(): Promise<DashboardData> {
  const response = await fetch(`${API_BASE_URL}/api/v1/space-weather/dashboard`);
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }
  return response.json();
}

export async function fetchCurrentConditions(): Promise<SpaceWeatherSnapshot> {
  const response = await fetch(`${API_BASE_URL}/api/v1/space-weather/current`);
  if (!response.ok) {
    throw new Error('Failed to fetch current conditions');
  }
  return response.json();
}

export async function fetchThreatStatus(): Promise<ThreatAssessment> {
  const response = await fetch(`${API_BASE_URL}/api/v1/space-weather/threats`);
  if (!response.ok) {
    throw new Error('Failed to fetch threat status');
  }
  return response.json();
}

export async function fetchForecastData(): Promise<ForecastSnapshot> {
  const response = await fetch(`${API_BASE_URL}/api/v1/space-weather/forecasts`);
  if (!response.ok) {
    throw new Error('Failed to fetch forecast data');
  }
  return response.json();
}

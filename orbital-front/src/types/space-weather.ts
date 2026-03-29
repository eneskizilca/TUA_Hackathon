export interface SolarWindData {
  speed_kmps: number;
  density_ppcm: number;
  timestamp: string;
}

export interface MagneticFieldData {
  bz_nt: number;
  bt_nt: number;
  timestamp: string;
}

export interface KpIndexData {
  kp_value: number;
  status: "QUIET" | "ACTIVE" | "STORM";
  observed_time: string;
}

export interface CMEForecast {
  activity_id: string;
  speed_kmps: number;
  is_earth_directed: boolean;
  start_time: string;
  high_priority: boolean;
}

export interface SolarFlare {
  class_type: string;
  peak_time: string;
  source_location: string;
  priority: string;
}

export interface SpaceWeatherSnapshot {
  solar_wind: SolarWindData;
  magnetic_field: MagneticFieldData;
  kp_index: KpIndexData;
  fetched_at: string;
}

export interface ForecastSnapshot {
  cme_forecasts: CMEForecast[];
  solar_flares: SolarFlare[];
  fetched_at: string;
}

export interface ThreatAssessment {
  active_threats: string[];
  composite_score: number;
  timestamp: string;
}

export interface AssetStatusSummary {
  safe_count: number;
  caution_count: number;
  critical_count: number;
  offline_count: number;
  by_type: Record<string, Record<string, number>>;
}

export interface DashboardData {
  current_conditions: SpaceWeatherSnapshot;
  threats: ThreatAssessment;
  assets: AssetStatusSummary;
  forecasts: ForecastSnapshot;
  cache_age_seconds?: number;
}

const API_BASE = "http://localhost:8000/api/v1";

export interface Asset {
  id: number;
  asset_id: string;
  asset_type: string;
  status: string;
  registration_timestamp: string;
  latitude: number | null;
  longitude: number | null;
  altitude_km: number | null;
  velocity_x: number | null;
  velocity_y: number | null;
  velocity_z: number | null;
  battery_voltage: number | null;
  coordinate_array: string | null;
  created_at: string;
}

export interface AssetStats {
  total_assets: number;
  nominal_assets: number;
  at_risk_assets: number;
}

export interface AssetCreate {
  asset_id: string;
  asset_type: string;
  status: string;
  latitude?: number;
  longitude?: number;
  altitude_km?: number;
  velocity_x?: number;
  velocity_y?: number;
  velocity_z?: number;
  battery_voltage?: number;
  coordinate_array?: string;
}

export async function getAssetStats(): Promise<AssetStats> {
  const response = await fetch(`${API_BASE}/assets/stats`);
  if (!response.ok) throw new Error("Failed to fetch asset stats");
  return response.json();
}

export async function listAssets(): Promise<Asset[]> {
  const response = await fetch(`${API_BASE}/assets/`);
  if (!response.ok) throw new Error("Failed to fetch assets");
  return response.json();
}

export async function getAsset(assetId: string): Promise<Asset> {
  const response = await fetch(`${API_BASE}/assets/${assetId}`);
  if (!response.ok) throw new Error("Failed to fetch asset");
  return response.json();
}

export async function createAsset(data: AssetCreate): Promise<Asset> {
  const response = await fetch(`${API_BASE}/assets/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to create asset");
  }
  return response.json();
}

export async function deleteAsset(assetId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/assets/${assetId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete asset");
}

const DEFAULT_REMOTE_API_BASE_URL = "https://car-recommendation-database.co.uk/api";

const rawApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
const trimmedApiBaseUrl = String(rawApiBaseUrl || "").trim();
const resolvedApiBaseUrl = trimmedApiBaseUrl || DEFAULT_REMOTE_API_BASE_URL;

export const API_BASE_URL = resolvedApiBaseUrl.endsWith("/api")
  ? resolvedApiBaseUrl
  : `${resolvedApiBaseUrl.replace(/\/+$/, "")}/api`;

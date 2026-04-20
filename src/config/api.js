import { Platform } from "react-native";

const DEFAULT_REMOTE_API_BASE_URL = "https://car-recommendation-database.co.uk/api";
const DEFAULT_LOCAL_API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8080/api"
    : "http://localhost:8080/api";

const rawApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
const trimmedApiBaseUrl = String(rawApiBaseUrl || "").trim();
const fallbackApiBaseUrl =
  typeof __DEV__ !== "undefined" && __DEV__
    ? DEFAULT_LOCAL_API_BASE_URL
    : DEFAULT_REMOTE_API_BASE_URL;

const resolvedApiBaseUrl = trimmedApiBaseUrl || fallbackApiBaseUrl;

export const API_BASE_URL = resolvedApiBaseUrl.endsWith("/api")
  ? resolvedApiBaseUrl
  : `${resolvedApiBaseUrl.replace(/\/+$/, "")}/api`;

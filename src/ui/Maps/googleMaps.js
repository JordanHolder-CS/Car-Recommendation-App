import { Linking } from "react-native";

export const buildGoogleMapsUrl = ({ markerCoordinate } = {}) =>
  `https://www.google.com/maps/search/?api=1&query=${markerCoordinate.latitude},${markerCoordinate.longitude}`;

export const openInGoogleMaps = (options = {}) =>
  Linking.openURL(buildGoogleMapsUrl(options));

export default openInGoogleMaps;

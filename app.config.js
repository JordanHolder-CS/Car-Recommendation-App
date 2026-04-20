require("dotenv").config();

const { expo } = require("./app.json");

const googleMapsApiKey = String(process.env.GOOGLE_API_KEY || "").trim();

module.exports = {
  expo: {
    ...expo,
    ios: {
      ...expo.ios,
      config: {
        ...(expo.ios?.config || {}),
        ...(googleMapsApiKey ? { googleMapsApiKey } : {}),
      },
    },
    android: {
      ...expo.android,
      config: {
        ...(expo.android?.config || {}),
        googleMaps: {
          ...(expo.android?.config?.googleMaps || {}),
          ...(googleMapsApiKey ? { apiKey: googleMapsApiKey } : {}),
        },
      },
    },
  },
};

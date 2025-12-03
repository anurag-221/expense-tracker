export default {
  name: "Sapphire Ledger",
  slug: "sapphire-ledger",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme: "sapphireledger",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#EFE9FF"
  },
  android: {
    package: "com.sapphire.ledger",
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#EFE9FF"
    },
    permissions: [
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE",
      "NOTIFICATIONS"
    ]
  },
  extra: {
    eas: {
      projectId: "54864cb5-947d-4dbf-9c6f-f3c16812d85e"
    }
  }
};

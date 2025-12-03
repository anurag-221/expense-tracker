export default {
  expo: {
    name: "Sapphire Ledger",
    slug: "sapphire-ledger",
    owner: "anurags221s-organization",

    version: "1.0.0",
    orientation: "portrait",

    icon: "./assets/icon.png",
    scheme: "sapphireledger",
    userInterfaceStyle: "automatic",

    cli: {
      appVersionSource: "remote"
    },

    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#1A1132"
    },

    android: {
      package: "com.anurag.sapphireledger",
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#000000"
      },
      permissions: [
        "INTERNET",
        "USE_BIOMETRIC",
        "USE_FINGERPRINT",
        "CAMERA"
      ]
    },

    ios: {
      bundleIdentifier: "com.anurag.sapphireledger",
      buildNumber: "1",
      supportsTablet: false,
      deploymentTarget: "15.1",
      infoPlist: {
        NSFaceIDUsageDescription:
          "This app uses Face ID for secure access to your financial data.",
        NSCameraUsageDescription: "Camera is used for scanning receipts.",
        NSPhotoLibraryUsageDescription: "Photos are used to select receipts."
      }
    },

    plugins: [
      [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 34,
            targetSdkVersion: 34,
            minSdkVersion: 23
          },
          ios: {
            deploymentTarget: "15.1"
          }
        }
      ],
      "expo-local-authentication",
      "expo-notifications"
    ],

    extra: {
      eas: {
        projectId: "54864cb5-947d-4dbf-9c6f-f3c16812d85e"
      }
    }
  }
};

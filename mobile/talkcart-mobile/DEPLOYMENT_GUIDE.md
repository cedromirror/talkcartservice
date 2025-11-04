# TalkCart Mobile Application - Deployment Guide

## Overview
This guide provides step-by-step instructions for building and distributing the TalkCart mobile application for both Android and iOS platforms.

## Prerequisites
Before building the application, ensure you have:
1. Node.js (version 18 or higher)
2. npm or yarn package manager
3. Expo CLI installed globally (`npm install -g expo-cli`)
4. Android Studio (for Android builds)
5. Xcode (for iOS builds - macOS only)

## Development Server
To start the development server:

```bash
npx expo start --offline
```

This will start the Expo development server and provide options to:
- Open the app in an emulator/simulator
- Generate a QR code for testing on physical devices
- Run on web browser

## Building for Android

### 1. Prebuild the project (if not already done)
```bash
npx expo prebuild --platform android
```

### 2. Generate a keystore for signing (first time only)
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore talkcart.keystore -alias talkcart -keyalg RSA -keysize 2048 -validity 10000
```

### 3. Build the APK
```bash
npx expo build:android
```

### 4. Follow the prompts to:
- Choose build type (APK or AAB)
- Upload your keystore (if you have one)
- Configure build settings

### 5. Download the build
Once the build is complete, download the APK/AAB file from the Expo build dashboard.

## Building for iOS (macOS only)

### 1. Prebuild the project (if not already done)
```bash
npx expo prebuild --platform ios
```

### 2. Build the IPA
```bash
npx expo build:ios
```

### 3. Follow the prompts to:
- Choose build type
- Configure Apple Developer account
- Set up provisioning profiles
- Configure build settings

### 4. Download the build
Once the build is complete, download the IPA file from the Expo build dashboard.

## Environment Configuration
The application uses environment variables defined in the `.env` file:

```
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_SOCKET_URL=http://localhost:8000

# Cloudinary Configuration
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=dgi1c5jia

# Authentication
EXPO_PUBLIC_JWT_SECRET=your-jwt-secret
```

Make sure to update these values for production environments.

## Testing on Physical Devices

### Android
1. Install the Expo Go app from Google Play Store
2. Scan the QR code from the development server
3. Or download the APK and install it directly (enable "Install from unknown sources")

### iOS
1. Install the Expo Go app from App Store
2. Scan the QR code from the development server
3. For production builds, use TestFlight or Ad Hoc distribution

## App Store Submission

### Google Play Store
1. Create a Google Play Developer account
2. Prepare store listing assets (screenshots, descriptions, etc.)
3. Upload the AAB file to Google Play Console
4. Complete the store listing information
5. Submit for review

### Apple App Store
1. Enroll in the Apple Developer Program
2. Create an app record in App Store Connect
3. Prepare store listing assets
4. Upload the IPA file using Transporter
5. Complete the app store listing
6. Submit for review

## Troubleshooting

### Common Issues
1. **Build fails due to missing dependencies**: Run `npm install` to ensure all dependencies are installed
2. **Environment variables not loading**: Ensure variables are prefixed with `EXPO_PUBLIC_`
3. **iOS build fails on Windows**: iOS builds require macOS; use Expo's cloud build service

### Useful Commands
```bash
# Check project setup
npm run verify-setup

# Test functionality
npm run test-functionality

# Clear cache
npx expo start -c

# Update dependencies
npm update
```

## Support
For issues with building or deploying the application, refer to:
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- Project-specific documentation in the repository
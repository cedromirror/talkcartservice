# TalkCart Mobile App Installation Verification

## Overview
This document provides instructions to verify that the TalkCart mobile application has been properly installed and configured.

## Prerequisites
1. Node.js (version 18 or higher)
2. npm or yarn package manager
3. Expo CLI installed globally (optional but recommended)
4. Android Studio or Xcode for emulator/simulator (optional)
5. Physical mobile device with Expo Go app installed (optional)

## Installation Verification Steps

### 1. Directory Structure Verification
Verify that the following directory structure exists:
```
mobile/
└── talkcart-mobile/
    ├── app/
    │   ├── (tabs)/
    │   │   ├── index.tsx (Marketplace screen)
    │   │   ├── explore.tsx (Explore screen)
    │   │   ├── create.tsx (Create screen)
    │   │   ├── messages.tsx (Messages screen)
    │   │   ├── profile.tsx (Profile screen)
    │   │   └── _layout.tsx (Tab navigation)
    │   ├── auth/
    │   │   └── login.tsx (Login screen)
    │   ├── _layout.tsx (Root layout)
    │   └── modal.tsx
    ├── src/
    │   ├── contexts/
    │   │   └── AuthContext.tsx
    │   └── lib/
    │       └── api.ts
    ├── assets/
    ├── components/
    ├── constants/
    ├── hooks/
    ├── node_modules/
    ├── .env
    ├── app.json
    ├── package.json
    └── tsconfig.json
```

### 2. Dependency Verification
Check that all required dependencies are installed by running:
```bash
cd mobile/talkcart-mobile
npm list socket.io-client @react-native-async-storage/async-storage @tanstack/react-query react-native-paper react-native-vector-icons
```

Expected output should show all packages are installed without errors.

### 3. Environment Configuration Verification
Verify that the `.env` file contains the correct configuration:
```
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_SOCKET_URL=http://localhost:8000

# Cloudinary Configuration
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=dgi1c5jia

# Authentication
EXPO_PUBLIC_JWT_SECRET=your-jwt-secret
```

### 4. Application Start Verification
Test that the application starts correctly:
```bash
cd mobile/talkcart-mobile
npx expo start --offline
```

Note: The `--offline` flag is used to bypass network-dependent initialization as per the project requirements.

### 5. Platform-Specific Testing
Test the application on different platforms:

#### Android
```bash
cd mobile/talkcart-mobile
npx expo run:android
```

#### iOS (macOS only)
```bash
cd mobile/talkcart-mobile
npx expo run:ios
```

#### Web
```bash
cd mobile/talkcart-mobile
npx expo start --web
```

### 6. Feature Verification
Verify that all core features work correctly:

1. **Tab Navigation**: All five tabs (Marketplace, Explore, Create, Messages, Profile) should be visible and functional
2. **Authentication**: Login screen should be accessible and functional
3. **API Integration**: The app should be able to communicate with the backend API
4. **WebSocket Connection**: Real-time features should work
5. **Responsive Design**: UI should adapt to different screen sizes

### 7. Build Verification
Test that the application can be built for production:

#### Development Build
```bash
cd mobile/talkcart-mobile
npx expo build:android -t apk
# or
npx expo build:ios -t simulator
```

#### Production Build with EAS (if configured)
```bash
cd mobile/talkcart-mobile
eas build -p android
# or
eas build -p ios
```

## Troubleshooting

### Common Issues and Solutions

1. **Metro Bundler Issues**
   ```bash
   # Clear cache and restart
   npx expo start -c --offline
   ```

2. **Dependency Installation Issues**
   ```bash
   # Remove node_modules and reinstall
   rm -rf node_modules && npm install
   ```

3. **TypeScript Errors**
   ```bash
   # Check TypeScript compilation
   npx tsc --noEmit
   ```

4. **Port Conflicts**
   ```bash
   # Start on a different port
   npx expo start --offline --port 19001
   ```

## Conclusion
If all verification steps pass successfully, the TalkCart mobile application is properly installed and configured. The application should be fully functional across different platforms and screen sizes, providing a responsive user experience that maintains feature parity with the web application.
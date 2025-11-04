# TalkCart Mobile App

This is the mobile application for TalkCart, built with React Native and Expo.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

## Cloudinary Configuration

The mobile app is configured to work with Cloudinary using the cloud name `dftpdqd4k`. This matches the backend configuration.

For detailed information about the Cloudinary setup, see [CLOUDINARY_CONFIG.md](CLOUDINARY_CONFIG.md).

## Marketplace Integration

The mobile app now fetches products directly from the backend API. The marketplace screen displays real products from vendors instead of sample data.

For detailed information about the marketplace integration, see [MARKETPLACE_INTEGRATION.md](MARKETPLACE_INTEGRATION.md).

## Currency Conversion

The mobile app includes currency conversion functionality that allows users to view product prices in their preferred currency.

For detailed information about currency conversion, see [CURRENCY_CONVERSION.md](CURRENCY_CONVERSION.md).

## Geographically-Based Currency Detection

The mobile app includes geographically-based currency detection similar to the website, automatically detecting users' preferred currency based on their location.

For detailed information about geographic currency detection, see [GEOGRAPHIC_CURRENCY.md](GEOGRAPHIC_CURRENCY.md).

## Backend Integration

The mobile app properly integrates with the existing backend API and contains no redundant files. All data operations use the backend API.

For detailed information about backend integration, see [BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md).

## Fixing Common Issues

### Deprecation Warnings

You may encounter these warnings:
- `"shadow*" style props are deprecated. Use "boxShadow"`
- `props.pointerEvents is deprecated. Use style.pointerEvents`

These warnings are typically caused by third-party libraries and should not affect functionality. See [DEPRECATION_WARNINGS_FIX.md](DEPRECATION_WARNINGS_FIX.md) for more details.

### Network Connectivity Issues

If you see `ERR_NAME_NOT_RESOLVED` or Metro disconnection errors:

1. Run the diagnostics script:
   ```bash
   npm run diagnose-connection
   ```

2. Update your [.env](.env) file with the correct IP address for your development machine.

3. For Android emulator, use `10.0.2.2` instead of `localhost`.

4. For iOS simulator, `localhost` should work.

5. For physical devices, use your computer's IP address on the local network.

## Running on Different Platforms

- Android: `npm run android`
- iOS: `npm run ios`
- Web: `npm run web`

## Testing Cloudinary Configuration

To verify that the Cloudinary configuration is correct:

```bash
node scripts/test-cloudinary-config.js
```

## Testing Marketplace API

To verify that the marketplace is properly fetching products:

```bash
npm run test-marketplace
```

## Testing Currency Conversion

To verify that currency conversion is working correctly:

```bash
npm run test-currency
```

## Testing Geographic Currency Detection

To verify that geographically-based currency detection is working correctly:

```bash
npm run test-geographic-currency
```

## Testing Backend Integration

To verify that the mobile app properly uses the backend and has no redundant files:

```bash
npm run cleanup-redundant
```

## Troubleshooting

If you encounter persistent issues:

1. Clear the cache:
   ```bash
   npx react-native start --reset-cache
   ```

2. Delete node_modules and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

3. Check the [COMPREHENSIVE_VERIFICATION_REPORT.md](COMPREHENSIVE_VERIFICATION_REPORT.md) for detailed verification steps.

## Overview
This is the mobile application for TalkCart, a Web3 social commerce platform. The app is built with React Native using Expo and provides a responsive, cross-platform experience for iOS and Android devices.

## Features
- **Marketplace**: Buy and sell digital assets and products
- **Social Feed**: Share posts, follow users, and engage with content
- **Messaging**: Real-time chat with other users
- **Content Creation**: Create and share posts, products, and media
- **User Profiles**: Personal and vendor profiles with customization
- **Real-time Updates**: WebSocket-based live updates
- **Responsive Design**: Optimized for all screen sizes and orientations

## Technology Stack
- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context API + React Query
- **Real-time Communication**: Socket.IO Client
- **UI Components**: React Native Paper
- **Storage**: AsyncStorage for local data
- **Build Tools**: Expo Application Services (EAS)

## Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager
- Expo CLI (optional but recommended)
- Android Studio or Xcode for development (optional)
- Physical mobile device with Expo Go app (optional)

## Installation

### 1. Clone the Repository
```
git clone <repository-url>
cd talkcart/mobile/talkcart-mobile
```

### 2. Install Dependencies
```
npm install
```

### 3. Environment Configuration
Create a `.env` file in the project root with the following configuration:
```
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_SOCKET_URL=http://localhost:8000

# Cloudinary Configuration
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=dgi1c5jia

# Authentication
EXPO_PUBLIC_JWT_SECRET=your-jwt-secret
```

### 4. Start the Development Server
```
npx expo start --offline
```

Note: The `--offline` flag is used to bypass network-dependent initialization.

## Development Workflow

### Running on Devices
- **Android**: `npx expo run:android`
- **iOS**: `npx expo run:ios` (macOS only)
- **Web**: `npx expo start --web`

### Development Best Practices
1. Use functional components with hooks
2. Implement proper TypeScript typing
3. Follow consistent naming conventions
4. Use React Context for global state
5. Implement React Query for server state
6. Keep component state localized when possible

## Project Structure
```
app/                          # Expo Router pages
├── (tabs)/                  # Tab navigation
│   ├── index.tsx            # Marketplace screen
│   ├── explore.tsx          # Explore screen
│   ├── create.tsx           # Create screen
│   ├── messages.tsx         # Messages screen
│   ├── profile.tsx          # Profile screen
│   └── _layout.tsx          # Tab layout
├── auth/                    # Authentication screens
│   └── login.tsx            # Login screen
├── _layout.tsx              # Root layout
└── modal.tsx                # Modal screen
src/
├── components/              # Shared UI components
├── contexts/                # React contexts
│   └── AuthContext.tsx      # Authentication context
├── hooks/                   # Custom hooks
├── lib/                     # Utility functions
│   └── api.ts               # API client
└── types/                   # TypeScript types
assets/                      # Static assets
constants/                   # App constants
hooks/                       # Custom hooks
```

## Building and Deployment

### Development Builds
```bash
# Android
npx expo build:android -t apk

# iOS (macOS only)
npx expo build:ios -t simulator
```

### Production Builds with EAS
```bash
# Build for Android
eas build -p android

# Build for iOS
eas build -p ios

# Build for both platforms
eas build
```

## Testing

### Unit Testing
```bash
npm test
```

### Device Testing
Test on various screen sizes and devices to ensure responsive design works correctly.

## Troubleshooting

### Common Issues
1. **Metro Bundler Issues**: Clear cache with `npx expo start -c --offline`
2. **Dependency Issues**: Remove node_modules and reinstall
3. **TypeScript Errors**: Run `npx tsc --noEmit` to check for errors
4. **Port Conflicts**: Use `--port` flag to specify a different port

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License
This project is proprietary and confidential. All rights reserved.

## Support
For support, contact the development team or check the project documentation.
# Mobile App Setup Guide

## Overview
This guide provides step-by-step instructions for setting up, developing, and building the TalkCart mobile application.

## Prerequisites

### System Requirements
1. **Node.js** (version 18 or higher)
2. **npm** or **yarn** package manager
3. **Git** for version control
4. **Expo CLI** (installed globally)
5. **Android Studio** (for Android development)
6. **Xcode** (for iOS development on macOS)

### Recommended Development Environment
- **IDE**: VS Code with React Native and TypeScript extensions
- **Emulators**: Android Emulator and iOS Simulator
- **Physical Devices**: For testing on real devices

## Initial Setup

### 1. Create Mobile Project Directory
```bash
# Create mobile directory in the project root
mkdir mobile
cd mobile
```

### 2. Initialize Expo Project
```bash
# Initialize a new Expo project with TypeScript template
npx create-expo-app --template tabs@51.0.0-preview.9

# Navigate to project directory
cd talkcart-mobile
```

### 3. Install Required Dependencies
```bash
# Install core dependencies
npm install @react-native-async-storage/async-storage
npm install socket.io-client
npm install @tanstack/react-query
npm install react-native-paper
npm install react-native-safe-area-context
npm install react-native-vector-icons

# Install development dependencies
npm install -D @types/react-native
```

### 4. Configure TypeScript
Update `tsconfig.json`:
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "jsx": "react-native"
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
```

## Project Configuration

### 1. Environment Variables
Create `.env` file in the project root:
```bash
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_SOCKET_URL=http://localhost:8000

# Cloudinary Configuration
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=dgi1c5jia

# Authentication
EXPO_PUBLIC_JWT_SECRET=your-jwt-secret
```

### 2. Expo Configuration
Update `app.json`:
```json
{
  "expo": {
    "name": "TalkCart",
    "slug": "talkcart",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.talkcart.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.talkcart.app"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router"
    ]
  }
}
```

### 3. Navigation Setup
Create the basic navigation structure:
```
app/
├── (tabs)/
│   ├── marketplace/
│   │   └── index.tsx
│   ├── explore/
│   │   └── index.tsx
│   ├── create/
│   │   └── index.tsx
│   ├── messages/
│   │   └── index.tsx
│   ├── profile/
│   │   └── index.tsx
│   └── _layout.tsx
├── _layout.tsx
└── +not-found.tsx
```

## Development Workflow

### 1. Start Development Server
```bash
# Start Expo development server
npx expo start

# Start with reset cache (if needed)
npx expo start -c
```

### 2. Running on Devices
```bash
# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android

# Run on physical device
npx expo start
# Then scan QR code with Expo Go app
```

### 3. Development Best Practices
1. **Component Structure**
   - Use functional components with hooks
   - Implement proper TypeScript typing
   - Follow consistent naming conventions

2. **State Management**
   - Use React Context for global state
   - Implement React Query for server state
   - Keep component state localized when possible

3. **Styling**
   - Use StyleSheet.create for styles
   - Implement responsive design with Dimensions API
   - Follow platform-specific design guidelines

## API Integration

### 1. API Client Setup
Create `src/lib/api.ts`:
```typescript
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:8000';

// API Client
export const api = {
  get: async (endpoint: string) => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },
  
  post: async (endpoint: string, data: any) => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

// WebSocket Connection
export const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
```

### 2. Authentication Context
Create `src/contexts/AuthContext.tsx`:
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../lib/api';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session on app start
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // Validate token and fetch user data
        const userData = await api.get('/api/auth/me');
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // Token invalid, clear storage
      await AsyncStorage.removeItem('token');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      if (response.success) {
        await AsyncStorage.setItem('token', response.token);
        setUser(response.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (userData: any) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      if (response.success) {
        await AsyncStorage.setItem('token', response.token);
        setUser(response.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## Responsive Design Implementation

### 1. Screen Size Detection
Create `src/hooks/useScreenSize.ts`:
```typescript
import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<ScaledSize>(Dimensions.get('window'));

  useEffect(() => {
    const onChange = ({ window }: { window: ScaledSize }) => {
      setScreenSize(window);
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  const isSmallScreen = screenSize.width < 375;
  const isMediumScreen = screenSize.width >= 375 && screenSize.width < 768;
  const isLargeScreen = screenSize.width >= 768;

  return {
    ...screenSize,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
  };
};
```

### 2. Responsive Components
Create `src/components/common/ResponsiveView.tsx`:
```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useScreenSize } from '../../hooks/useScreenSize';

interface ResponsiveViewProps {
  children: React.ReactNode;
  style?: any;
}

export const ResponsiveView: React.FC<ResponsiveViewProps> = ({ children, style }) => {
  const { isSmallScreen, isMediumScreen, isLargeScreen } = useScreenSize();

  const responsiveStyle = StyleSheet.create({
    container: {
      padding: isSmallScreen ? 12 : isMediumScreen ? 16 : 20,
      margin: isSmallScreen ? 8 : isMediumScreen ? 12 : 16,
      ...style,
    },
  });

  return (
    <View style={responsiveStyle.container}>
      {children}
    </View>
  );
};
```

## Testing

### 1. Unit Testing Setup
Install testing dependencies:
```bash
npm install -D jest @testing-library/react-native @testing-library/jest-native
```

Create `jest.config.js`:
```javascript
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg))',
  ],
};
```

### 2. Sample Test
Create `src/components/__tests__/ResponsiveView.test.tsx`:
```typescript
import React from 'react';
import { render } from '@testing-library/react-native';
import { ResponsiveView } from '../common/ResponsiveView';

describe('ResponsiveView', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <ResponsiveView>
        <Text>Test Content</Text>
      </ResponsiveView>
    );
    
    expect(getByText('Test Content')).toBeTruthy();
  });
});
```

## Building and Deployment

### 1. Development Builds
```bash
# Start development server
npx expo start

# Build development APK (Android)
npx expo build:android -t apk

# Build development IPA (iOS)
npx expo build:ios -t simulator
```

### 2. Production Builds with EAS
Install EAS CLI:
```bash
npm install -g eas-cli
```

Configure EAS:
```bash
# Initialize EAS configuration
eas build:configure
```

Build for production:
```bash
# Build for Android
eas build -p android

# Build for iOS
eas build -p ios

# Build for both platforms
eas build
```

### 3. App Store Submission
1. **Google Play Store**
   - Create Google Play Developer account
   - Prepare app listing (screenshots, descriptions, etc.)
   - Upload APK/IPA file
   - Submit for review

2. **Apple App Store**
   - Enroll in Apple Developer Program
   - Create app record in App Store Connect
   - Prepare app metadata
   - Submit app for review

## Troubleshooting

### Common Issues and Solutions

1. **Metro Bundler Issues**
   ```bash
   # Clear cache and restart
   npx expo start -c
   ```

2. **iOS Build Failures**
   ```bash
   # Clean iOS build folder
   cd ios && xcodebuild clean && cd ..
   ```

3. **Android Build Failures**
   ```bash
   # Clean Android build folder
   cd android && ./gradlew clean && cd ..
   ```

4. **Dependency Conflicts**
   ```bash
   # Remove node_modules and reinstall
   rm -rf node_modules && npm install
   ```

5. **TypeScript Errors**
   ```bash
   # Check TypeScript compilation
   npx tsc --noEmit
   ```

## Performance Optimization

### 1. Bundle Size Optimization
```bash
# Analyze bundle size
npx expo-optimize
```

### 2. Image Optimization
- Use appropriate image formats (WebP for Android, HEIC for iOS)
- Implement proper image sizing
- Use caching for frequently accessed images

### 3. Network Optimization
- Implement request batching
- Use compression for API responses
- Cache frequently accessed data

## Conclusion

This setup guide provides a comprehensive approach to creating, developing, and deploying the TalkCart mobile application. By following these steps, you can establish a robust development environment that supports cross-platform mobile development with React Native and Expo.

The mobile application will maintain full feature parity with the web application while providing an optimized user experience for mobile devices across different screen sizes and operating systems.
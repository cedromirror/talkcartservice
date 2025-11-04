# Fixing Deprecation Warnings in TalkCart Mobile App

## Understanding the Warnings

### 1. "shadow*" style props are deprecated. Use "boxShadow"
This warning occurs in React Native Web when shadow properties are used incorrectly. In your code, you're correctly using shadow properties within StyleSheet styles, which is the right approach.

Possible causes:
- Third-party libraries using deprecated shadow props
- Older versions of React Native Paper components
- Expo or React Native version compatibility issues

### 2. props.pointerEvents is deprecated. Use style.pointerEvents
This warning indicates that somewhere in your app or dependencies, `pointerEvents` is being passed as a direct prop to a component instead of being included in the style prop.

### 3. Network Error (ERR_NAME_NOT_RESOLVED)
This error occurs because the mobile app cannot connect to your backend API running on localhost. When running on a device or simulator, `localhost` refers to the device itself, not your development machine.

### 4. Disconnected from Metro
This indicates that the React Native bundler connection was lost, which typically happens when there are network issues or when the Metro server stops running.

## Solutions

### Fixing Network Connectivity Issues

1. Updated the `.env` file to use `10.0.2.2` instead of `localhost` for Android emulators:
   ```
   EXPO_PUBLIC_API_URL=http://10.0.2.2:8000
   EXPO_PUBLIC_SOCKET_URL=http://10.0.2.2:8000
   ```

2. For physical devices, you'll need to:
   - Find your computer's IP address on the local network
   - Update the URLs to use that IP address instead
   - Ensure both devices are on the same network

### Addressing Deprecation Warnings

1. Check your dependencies for outdated packages:
   ```bash
   npm outdated
   ```

2. Update React Native Paper if it's installed:
   ```bash
   npm install react-native-paper@latest
   ```

3. Clear cache and rebuild:
   ```bash
   npx react-native start --reset-cache
   ```

### For iOS Simulator
If you're using iOS simulator, change the IP address in `.env` to:
```
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_SOCKET_URL=http://localhost:8000
```

### For Physical Devices
1. Find your computer's IP address:
   - Windows: Run `ipconfig` in Command Prompt
   - macOS/Linux: Run `ifconfig` in Terminal

2. Update the URLs in `.env` to use your computer's IP:
   ```
   EXPO_PUBLIC_API_URL=http://YOUR_IP_ADDRESS:8000
   EXPO_PUBLIC_SOCKET_URL=http://YOUR_IP_ADDRESS:8000
   ```

## Prevention

1. Regularly update dependencies to avoid using deprecated APIs
2. Test on both iOS and Android simulators/emulators
3. Monitor Expo and React Native release notes for breaking changes
4. Use consistent styling approaches (StyleSheet vs inline styles)

## Additional Debugging Steps

1. Check if Metro is running:
   ```bash
   npm start
   ```

2. Verify backend server is running on port 8000:
   ```bash
   # In your backend directory
   npm run dev
   ```

3. Test API connectivity:
   ```bash
   curl http://YOUR_IP_ADDRESS:8000/api/test
   ```
---
description: Repository Information Overview
alwaysApply: true
---

# Repository Information Overview

## Repository Summary
TalkCart is a comprehensive Web3 Super Application ecosystem built with a full-stack Node.js architecture. It comprises a backend API service, web frontend, mobile app, and admin dashboard. The platform includes marketplace, DeFi, DAO, social messaging, and streaming capabilities with cryptocurrency payments and Web3 authentication.

## Repository Structure
The repository is organized as a monorepo containing four main subprojects:
- **backend/**: Express.js REST API server with MongoDB
- **frontend/**: Next.js web application (port 4000)
- **mobile/talkcart-mobile/**: Expo React Native mobile application
- **super-admin/**: Next.js admin dashboard (port 4100)

### Main Repository Components
- **Backend API**: Provides REST endpoints for all platform services including users, marketplace, payments, messaging, and Web3 features
- **Frontend Web App**: Modern web interface built with Next.js and React
- **Mobile App**: Cross-platform mobile application using Expo and React Native
- **Admin Dashboard**: Management interface for super administrators

---

## Projects

### Backend API
**Configuration File**: backend/package.json | backend/server.js

#### Language & Runtime
**Language**: JavaScript (Node.js)
**Runtime Version**: >=18.0.0
**Package Manager**: npm
**Main Entry Point**: server.js
**Port**: 8000

#### Dependencies
**Main Dependencies**:
- express (4.18.2) - Web framework
- mongoose (8.0.3) - MongoDB ODM
- socket.io (4.8.1) - Real-time WebSocket communication
- jsonwebtoken (9.0.2) - JWT authentication
- bcryptjs (2.4.3) - Password hashing
- ethers (6.8.1) - Web3 integration
- cloudinary (1.41.3) - Media management
- stripe (19.0.0) - Payment processing
- redis (4.6.10) - Caching and sessions
- multer (2.0.2) - File uploads
- axios (1.12.2) - HTTP client
- joi (17.11.0) - Data validation
- helmet (7.1.0) - Security headers
- cors (2.8.5) - CORS middleware
- compression (1.7.4) - Response compression
- express-rate-limit (7.5.1) - Rate limiting
- morgan (1.10.0) - Request logging
- node-cron (3.0.3) - Task scheduling

**Development Dependencies**:
- nodemon (3.0.2) - Auto-restart on file changes

#### Build & Installation
```bash
npm install
npm start          # Production: node server.js
npm run dev        # Development: nodemon server.js
npm run init-db    # Seed database
npm run reset-db   # Reset database
```

#### Docker
**Dockerfile**: backend/Dockerfile
**Base Image**: node:18-alpine
**Image Port**: 8000
**Configuration**: Non-root user (nodejs), health checks enabled, production-only npm installation

#### Key Services
- **Authentication**: JWT + Web3 (SIWE) via @simplewebauthn
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io for WebSocket communication
- **Media Storage**: Cloudinary integration
- **Payments**: Stripe and Flutterwave support
- **DeFi**: Ethers.js integration
- **Email**: Nodemailer configuration
- **Caching**: Redis support

---

### Frontend Web Application
**Configuration File**: frontend/package.json | frontend/next.config.js

#### Language & Runtime
**Language**: TypeScript/JavaScript (React)
**Framework**: Next.js 16.0.0
**React Version**: 18.3.1
**Package Manager**: npm
**Port**: 4000
**TypeScript**: Enabled (strict mode)

#### Dependencies
**Main Dependencies**:
- next (16.0.0) - React framework
- react (18.3.1) - UI library
- @mui/material (6.5.0) - Material Design UI
- wagmi (2.11.0) - Web3 hooks
- @rainbow-me/rainbowkit (2.1.7) - Web3 wallet UI
- ethers (6.13.4) - Web3 library
- flutterwave-react-v3 (1.3.2) - Payment processing
- @cloudinary/react (1.14.3) - Image component
- framer-motion (11.0.0) - Animations
- recharts (3.1.2) - Data visualization
- socket.io-client (4.8.1) - WebSocket client
- @tanstack/react-query (5.59.16) - Data fetching
- lucide-react (0.451.0) - Icon library

#### Build & Installation
```bash
npm install
npm run dev        # Development: next dev -p 4000
npm run build      # Build for production
npm start          # Production: next start -p 4000
npm run lint       # ESLint check
npm run type-check # TypeScript check
```

#### Key Features
- Material UI components with custom marketplace theme
- Web3 wallet integration (RainbowKit)
- Cryptocurrency payment support (Flutterwave)
- Real-time features via Socket.io
- Image optimization via Cloudinary
- Advanced animations with Framer Motion

---

### Mobile Application
**Configuration File**: mobile/talkcart-mobile/package.json | mobile/talkcart-mobile/app.json

#### Language & Runtime
**Language**: TypeScript/JavaScript (React Native)
**Framework**: Expo 54.0.19
**React Version**: 19.1.0
**React Native**: 0.81.5
**Package Manager**: npm
**Platform Targets**: iOS (com.talkcart.app) | Android (com.talkcart.app)

#### Dependencies
**Main Dependencies**:
- expo (~54.0.19) - Development platform
- react (19.1.0) - Core UI library
- react-native (0.81.5) - Native bridge
- react-native-paper (5.14.5) - Material Design
- expo-router (~6.0.13) - Navigation
- expo-image-picker (17.0.8) - Camera/gallery
- @tanstack/react-query (5.90.5) - Data fetching
- axios (1.12.2) - HTTP client
- react-native-reanimated (~4.1.1) - Animations
- expo-local-authentication (17.0.7) - Biometric auth

#### Build & Installation
```bash
npm install
npm start           # Start development
npm run android     # Build for Android
npm run ios        # Build for iOS
npm run web        # Run web version
npm run lint       # ESLint check
```

#### Configuration
**App Identifier**: talkcart (scheme)
**Bundle IDs**: com.talkcart.app
**New Architecture**: Enabled

---

### Super Admin Dashboard
**Configuration File**: super-admin/package.json | super-admin/next.config.js

#### Language & Runtime
**Language**: TypeScript/JavaScript (React)
**Framework**: Next.js 15.5.2
**React Version**: 18.3.1
**Package Manager**: npm
**Port**: 4100
**TypeScript**: Enabled

#### Dependencies
**Main Dependencies**:
- next (15.5.2) - React framework
- react (18.3.1) - UI library
- @mui/material (6.1.6) - Material Design UI

**Development Dependencies**:
- typescript (5.9.2) - Type checking
- @types/node (24.3.1) - Node types

#### Build & Installation
```bash
npm install
npm run dev   # Development: next dev -p 4100
npm run build # Build for production
npm start     # Production: next start -p 4100
```

#### Key Features
- Dashboard analytics
- User and vendor management
- Marketplace administration
- Payment and payout management
- Order and dispute management
- Flash sales, coupons, loyalty program
- Media and content management

---

## Technical Stack Summary

### Core Technologies
- **Backend**: Express.js, MongoDB, Socket.io, Node.js 18+
- **Frontend**: Next.js 16, React 18, TypeScript, Material-UI
- **Mobile**: Expo, React Native 0.81, React 19
- **Admin**: Next.js 15, React 18, TypeScript
- **Web3**: Ethers.js, Wagmi, RainbowKit, SIWE
- **Payments**: Stripe, Flutterwave
- **Media**: Cloudinary
- **State**: TanStack Query, Redis
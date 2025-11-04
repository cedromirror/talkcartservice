# TalkCart Quick Reference Guide
**Purpose**: Quick lookup for developers and DevOps

---

## 🚀 Quick Start

### Start Backend
```bash
cd d:\talkcart\backend
npm install
npm run dev
# Runs on http://localhost:8000
```

### Start Frontend
```bash
cd d:\talkcart\frontend
npm install
npm run dev
# Runs on http://localhost:4000
```

### Start Mobile
```bash
cd d:\talkcart\mobile\talkcart-mobile
npm install
npm start
# Runs on Expo
```

---

## 🔗 Important URLs

### Development
- **Backend API**: http://localhost:8000
- **Frontend**: http://localhost:4000
- **API Docs**: http://localhost:8000/api
- **Health Check**: http://localhost:8000/api/health

### Database
- **MongoDB**: mongodb://localhost:27017/talkcart

### External Services
- **Cloudinary**: dftpdqd4k (configured)
- **Stripe**: Configured in backend
- **Flutterwave**: Configured in backend

---

## 📁 Project Structure

```
talkcart/
├── backend/                 # Node.js/Express API
│   ├── routes/             # API endpoints
│   ├── models/             # MongoDB models
│   ├── services/           # Business logic
│   ├── middleware/         # Express middleware
│   └── config/             # Configuration
├── frontend/               # Next.js web app
│   ├── pages/             # Next.js pages
│   ├── src/components/    # React components
│   ├── src/hooks/         # Custom hooks
│   └── src/lib/           # Utilities
├── mobile/                # React Native app
│   ├── app/               # Expo Router screens
│   ├── src/components/    # React Native components
│   ├── src/contexts/      # Context providers
│   └── src/lib/           # Utilities
└── super-admin/           # Admin dashboard
```

---

## 🔑 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/talkcart
JWT_SECRET=ceaed44bd4141498d098722e48e887984e5d5dc14a503b06b1da2bc91f03c39af0228a8ce2290aa79198ad993014441f
PORT=8000
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=dftpdqd4k
EMAIL_USER=talkcartservice@gmail.com
```

### Frontend (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SOCKET_URL=http://localhost:8000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dftpdqd4k
```

### Mobile (.env)
```
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_SOCKET_URL=http://localhost:8000
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=dftpdqd4k
```

---

## 🔌 Key API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/auth/me
```

### Users
```
GET    /api/users
GET    /api/users/:id
GET    /api/users/profile/:username
PUT    /api/users/:id
POST   /api/users/:id/follow
POST   /api/users/:id/unfollow
```

### Posts
```
GET    /api/posts
POST   /api/posts
GET    /api/posts/:id
PUT    /api/posts/:id
DELETE /api/posts/:id
POST   /api/posts/:id/like
POST   /api/posts/:id/unlike
POST   /api/posts/:id/bookmark
```

### Marketplace
```
GET    /api/marketplace/products
POST   /api/marketplace/products
GET    /api/marketplace/products/:id
PUT    /api/marketplace/products/:id
DELETE /api/marketplace/products/:id
POST   /api/marketplace/products/:id/buy
```

### Messages
```
GET    /api/messages
POST   /api/messages
GET    /api/messages/:id
DELETE /api/messages/:id
```

### Currency
```
GET    /api/currency/rates
POST   /api/currency/convert
GET    /api/currency/detect
```

---

## 🔐 Authentication

### Token Storage
- **Frontend**: localStorage
- **Mobile**: AsyncStorage
- **Header**: `Authorization: Bearer <token>`

### Token Expiration
- **Access Token**: 1 hour
- **Refresh Token**: 30 days

### Refresh Flow
1. Access token expires
2. Client sends refresh token
3. Backend returns new access token
4. Client updates token and retries request

---

## 🔄 Real-Time Features

### Socket.IO Events
```
message:new          - New message
post:like            - Post liked
post:comment         - Comment added
user:online          - User presence
notification:new     - New notification
```

### Connection
```
Frontend: io('http://localhost:8000')
Mobile:   io('http://localhost:8000')
```

---

## 📊 Database Models

### User
```
- _id, username, email, password
- displayName, avatar, bio
- followers, following, isVerified
- role (user/vendor/admin)
```

### Post
```
- _id, content, type (text/image/video)
- author, media, hashtags, mentions
- likes, comments, bookmarks
- privacy (public/private)
```

### Product
```
- _id, name, description, price
- category, images, inventory
- vendor, reviews, ratings
- currency, isNFT
```

### Message
```
- _id, sender, recipient, content
- conversationId, createdAt
- isRead, attachments
```

---

## 🐛 Common Issues & Solutions

### Backend Won't Start
```bash
# Check MongoDB is running
# Check port 8000 is available
# Check .env file exists
npm run dev
```

### Frontend Can't Connect to Backend
```bash
# Check NEXT_PUBLIC_API_URL in .env
# Check backend is running on 8000
# Check CORS is enabled
```

### Mobile Can't Connect to Backend
```bash
# Check EXPO_PUBLIC_API_URL in .env
# Check backend is running on 8000
# Check device can reach localhost
```

### Real-Time Not Working
```bash
# Check Socket.IO is running
# Check CORS for WebSocket
# Check firewall allows port 8000
```

---

## 📈 Performance Tips

### Backend
- Use database indexes
- Implement caching (Redis)
- Optimize queries
- Use pagination

### Frontend
- Code splitting
- Image optimization
- Lazy loading
- Caching strategies

### Mobile
- Optimize bundle size
- Lazy load screens
- Cache images
- Minimize re-renders

---

## 🔒 Security Checklist

- [x] JWT authentication
- [x] CORS configured
- [x] Rate limiting
- [x] Input validation
- [x] Error handling
- [ ] HTTPS (production)
- [ ] Secrets management
- [ ] Regular backups

---

## 📚 Documentation Files

1. **INVESTIGATION_SUMMARY.md** - Overview of findings
2. **MOBILE_FRONTEND_INVESTIGATION_REPORT.md** - Detailed analysis
3. **FEATURE_COMPLETENESS_CHECKLIST.md** - Feature status
4. **BACKEND_INTEGRATION_VERIFICATION.md** - Integration details
5. **RECOMMENDATIONS_AND_NEXT_STEPS.md** - Improvement plan
6. **QUICK_REFERENCE_GUIDE.md** - This file

---

## 🆘 Support Resources

### Logs
- **Backend**: Console output
- **Frontend**: Browser console
- **Mobile**: Expo console

### Debugging
- **Backend**: Use `console.log()` or debugger
- **Frontend**: Use React DevTools
- **Mobile**: Use Expo DevTools

### Testing
- **Backend**: `npm test`
- **Frontend**: `npm test`
- **Mobile**: `npm test`

---

## ✅ Status Dashboard

| Component | Status | Port | Health |
|-----------|--------|------|--------|
| Backend | ✅ Running | 8000 | ✅ Healthy |
| Frontend | ✅ Running | 4000 | ✅ Healthy |
| Mobile | ✅ Ready | Expo | ✅ Ready |
| Database | ✅ Connected | 27017 | ✅ Healthy |
| Socket.IO | ✅ Active | 8000 | ✅ Active |

---

## 📞 Quick Commands

```bash
# Backend
npm run dev              # Start development
npm run build            # Build for production
npm run init-db          # Initialize database
npm run reset-db         # Reset database

# Frontend
npm run dev              # Start development
npm run build            # Build for production
npm run lint             # Run linter
npm run type-check       # Check types

# Mobile
npm start                # Start Expo
npm run android          # Build Android
npm run ios              # Build iOS
npm run web              # Run on web
```

---

**Last Updated**: 2025-10-25  
**Status**: ✅ All Systems Operational



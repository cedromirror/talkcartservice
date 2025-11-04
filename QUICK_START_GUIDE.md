# 🚀 QUICK START GUIDE - TalkCart Marketplace Features

**Get your new marketplace features up and running in minutes!**

---

## 📋 PREREQUISITES

- Node.js (v14+)
- MongoDB running
- Existing TalkCart backend and frontend

---

## ⚡ BACKEND SETUP (5 minutes)

### 1. Verify Files
All backend files should already be in place:
```bash
# Check models
ls backend/models/FlashSale.js
ls backend/models/Coupon.js
ls backend/models/SellerRating.js
ls backend/models/LoyaltyPoints.js
ls backend/models/GroupBuy.js
ls backend/models/ProductComparison.js
ls backend/models/PriceAlert.js
ls backend/models/BundleDeal.js
ls backend/models/SponsoredProduct.js
ls backend/models/Dispute.js

# Check schedulers
ls backend/jobs/flashSaleScheduler.js
ls backend/jobs/groupBuyScheduler.js
ls backend/jobs/bundleScheduler.js
ls backend/jobs/sponsoredScheduler.js
ls backend/jobs/disputeScheduler.js
```

### 2. Install Dependencies (if needed)
```bash
cd backend
npm install node-cron  # Should already be installed
```

### 3. Start Backend Server
```bash
cd backend
npm start
```

### 4. Verify Schedulers
You should see in console:
```
[Flash Sale Scheduler] Initialized - Running every minute
[Group Buy Scheduler] Initialized - Running every minute
[Bundle Scheduler] Initialized - Running every minute
[Sponsored Scheduler] Initialized - Running every minute
[Dispute Scheduler] Initialized - Running every hour
```

### 5. Test API Endpoints
```bash
# Test flash sales endpoint
curl http://localhost:5000/api/marketplace/flash-sales

# Test loyalty tiers endpoint
curl http://localhost:5000/api/marketplace/loyalty/tiers

# Test advanced search endpoint
curl http://localhost:5000/api/marketplace/search/advanced?q=laptop
```

---

## 🎨 FRONTEND SETUP (5 minutes)

### 1. Install Dependencies
```bash
cd frontend
npm install lucide-react
```

### 2. Set Environment Variable
Create or update `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Verify Files
```bash
# Check components
ls frontend/components/marketplace/FlashSaleCard.tsx
ls frontend/components/marketplace/CouponInput.tsx
ls frontend/components/marketplace/SellerRatingForm.tsx
ls frontend/components/marketplace/GroupBuyCard.tsx
ls frontend/components/marketplace/AdvancedSearchFilters.tsx
ls frontend/components/marketplace/PriceAlertButton.tsx
ls frontend/components/marketplace/DisputeForm.tsx

# Check pages
ls frontend/pages/marketplace/flash-sales.tsx
ls frontend/pages/marketplace/loyalty.tsx
ls frontend/pages/marketplace/compare.tsx

# Check service
ls frontend/services/marketplaceApi.ts
```

### 4. Start Frontend Server
```bash
cd frontend
npm run dev
```

### 5. Access Pages
Open in browser:
- Flash Sales: `http://localhost:3000/marketplace/flash-sales`
- Loyalty: `http://localhost:3000/marketplace/loyalty`
- Compare: `http://localhost:3000/marketplace/compare`

---

## 🧪 QUICK TESTING (10 minutes)

### Test 1: Create a Flash Sale (Vendor)
```bash
curl -X POST http://localhost:5000/api/marketplace/flash-sales \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_VENDOR_TOKEN" \
  -d '{
    "productId": "PRODUCT_ID",
    "salePrice": 49.99,
    "startTime": "2025-10-26T10:00:00Z",
    "endTime": "2025-10-27T10:00:00Z",
    "totalQuantity": 100,
    "maxPerUser": 2
  }'
```

### Test 2: Create a Coupon (Vendor)
```bash
curl -X POST http://localhost:5000/api/marketplace/coupons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_VENDOR_TOKEN" \
  -d '{
    "code": "SAVE20",
    "type": "percentage",
    "value": 20,
    "scope": "platform",
    "startDate": "2025-10-26T00:00:00Z",
    "endDate": "2025-12-31T23:59:59Z",
    "maxUses": 1000
  }'
```

### Test 3: Validate Coupon
```bash
curl -X POST http://localhost:5000/api/marketplace/coupons/validate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -d '{
    "code": "SAVE20",
    "cartTotal": 100,
    "cartItems": []
  }'
```

### Test 4: Get Loyalty Points
```bash
curl http://localhost:5000/api/marketplace/loyalty/my-points \
  -H "Authorization: Bearer YOUR_USER_TOKEN"
```

### Test 5: Advanced Search
```bash
curl "http://localhost:5000/api/marketplace/search/advanced?q=laptop&category=Electronics&minPrice=500&maxPrice=2000&sortBy=price_asc"
```

---

## 🎯 INTEGRATION EXAMPLES

### Example 1: Add Flash Sale Card to Product Page
```tsx
// In your product page component
import FlashSaleCard from '@/components/marketplace/FlashSaleCard';
import { useState, useEffect } from 'react';

export default function ProductPage() {
  const [flashSales, setFlashSales] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/marketplace/flash-sales`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFlashSales(data.data.flashSales);
        }
      });
  }, []);

  return (
    <div>
      <h2>Flash Sales</h2>
      <div className="grid grid-cols-4 gap-4">
        {flashSales.map(sale => (
          <FlashSaleCard
            key={sale._id}
            flashSale={sale}
            onPurchase={(id) => handlePurchase(id)}
          />
        ))}
      </div>
    </div>
  );
}
```

### Example 2: Add Coupon Input to Checkout
```tsx
// In your checkout page
import CouponInput from '@/components/marketplace/CouponInput';

export default function CheckoutPage() {
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState('');

  return (
    <div>
      <CouponInput
        cartTotal={cartTotal}
        cartItems={cartItems}
        onCouponApplied={(discount, code) => {
          setDiscount(discount);
          setCouponCode(code);
        }}
        onCouponRemoved={() => {
          setDiscount(0);
          setCouponCode('');
        }}
      />
      <div>Total: ${(cartTotal - discount).toFixed(2)}</div>
    </div>
  );
}
```

### Example 3: Add Price Alert to Product Details
```tsx
// In your product details page
import PriceAlertButton from '@/components/marketplace/PriceAlertButton';

export default function ProductDetails({ product }) {
  return (
    <div>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
      <PriceAlertButton
        productId={product._id}
        currentPrice={product.price}
        productName={product.name}
      />
    </div>
  );
}
```

### Example 4: Use API Service
```tsx
// In any component
import marketplaceApi from '@/services/marketplaceApi';

export default function MyComponent() {
  const handleSearch = async () => {
    const result = await marketplaceApi.search.advanced('laptop', {
      category: 'Electronics',
      minPrice: 500,
      maxPrice: 2000,
      sortBy: 'price_asc'
    });
    
    if (result.success) {
      console.log('Products:', result.data.products);
      console.log('Facets:', result.data.facets);
    }
  };

  const handleJoinGroupBuy = async (groupBuyId) => {
    const result = await marketplaceApi.groupBuy.join(groupBuyId);
    if (result.success) {
      alert('Successfully joined group buy!');
    }
  };

  return (
    <div>
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}
```

---

## 🔧 COMMON ISSUES & SOLUTIONS

### Issue 1: Schedulers Not Running
**Solution**: Check that server.js has the scheduler initialization code at the bottom:
```javascript
// Start schedulers
const { initFlashSaleScheduler } = require('./jobs/flashSaleScheduler');
initFlashSaleScheduler();
// ... other schedulers
```

### Issue 2: API Endpoints Return 404
**Solution**: Verify that marketplace.js routes are imported in server.js:
```javascript
const marketplaceRoutes = require('./routes/marketplace');
app.use('/api/marketplace', marketplaceRoutes);
```

### Issue 3: Frontend Components Not Found
**Solution**: Check import paths. Use `@/` alias or relative paths:
```tsx
import FlashSaleCard from '@/components/marketplace/FlashSaleCard';
// OR
import FlashSaleCard from '../../components/marketplace/FlashSaleCard';
```

### Issue 4: CORS Errors
**Solution**: Ensure CORS is configured in backend server.js:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Issue 5: Authentication Errors
**Solution**: Ensure token is stored in localStorage:
```javascript
localStorage.setItem('token', 'YOUR_JWT_TOKEN');
```

---

## 📊 MONITORING

### Check Scheduler Logs
```bash
# Backend console should show:
[Flash Sale Scheduler] Checked 5 flash sales, activated 2, ended 1
[Group Buy Scheduler] Checked 3 group buys, marked 1 as successful
[Bundle Scheduler] Checked 4 bundles, activated 1, expired 0
[Sponsored Scheduler] Checked 10 campaigns, reset 5 daily budgets
[Dispute Scheduler] Checked 2 disputes, escalated 0
```

### Check Database Collections
```bash
# Connect to MongoDB
mongo

# Use your database
use talkcart

# Check collections
db.flashsales.count()
db.coupons.count()
db.sellerratings.count()
db.loyaltypoints.count()
db.groupbuys.count()
db.productcomparisons.count()
db.pricealerts.count()
db.bundledeals.count()
db.sponsoredproducts.count()
db.disputes.count()
```

---

## 🎉 SUCCESS CHECKLIST

- [ ] Backend server running
- [ ] All 5 schedulers initialized
- [ ] Frontend server running
- [ ] Can access flash sales page
- [ ] Can access loyalty page
- [ ] Can access compare page
- [ ] API endpoints responding
- [ ] Components rendering correctly
- [ ] Can create flash sale (vendor)
- [ ] Can validate coupon
- [ ] Can view loyalty points
- [ ] Can search with filters
- [ ] Database collections created

---

## 📞 NEXT STEPS

1. **Create Test Data**: Use the API to create sample flash sales, coupons, etc.
2. **Test User Flows**: Go through complete user journeys
3. **Customize Styling**: Adjust colors and styles to match your brand
4. **Add to Navigation**: Add links to new pages in your navigation menu
5. **Deploy**: Deploy to production when ready

---

## 📚 DOCUMENTATION

For detailed information, see:
- `COMPLETE_IMPLEMENTATION_BACKEND_FRONTEND.md` - Complete overview
- `FRONTEND_IMPLEMENTATION_COMPLETE.md` - Frontend details
- `MARKETPLACE_COMPLETE_ALL_PHASES.md` - Backend details
- Individual phase documentation files

---

**You're all set! 🚀**

Your marketplace is now equipped with world-class features. Start testing and enjoy the new capabilities!


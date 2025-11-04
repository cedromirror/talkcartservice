# 🧪 MARKETPLACE TESTING GUIDE

**Date**: 2025-10-26  
**Status**: Ready for Testing  
**Estimated Time**: 4-6 hours

---

## 📋 PRE-TESTING CHECKLIST

- [ ] Backend server is running (`npm start` in backend directory)
- [ ] Frontend dev server is running (`npm run dev` in frontend directory)
- [ ] Database is connected and populated with test data
- [ ] Authentication tokens are working
- [ ] API endpoints are accessible

---

## 🧪 PHASE 1: API METHODS TESTING

### Test 1: getTrendingProducts()

**Endpoint**: `GET /api/marketplace/products/trending`

**Test Steps**:
1. Open browser console
2. Run:
```javascript
const api = require('@/lib/api').default;
const result = await api.marketplace.getTrendingProducts(10);
console.log(result);
```

**Expected Result**:
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "...",
        "name": "...",
        "price": 100,
        "rating": 4.5,
        "sales": 150,
        ...
      }
    ]
  }
}
```

**Pass Criteria**:
- ✅ Returns success: true
- ✅ Contains products array
- ✅ Each product has required fields
- ✅ Products sorted by trending metric

---

### Test 2: getRecommendations()

**Endpoint**: `GET /api/marketplace/recommendations/:userId`

**Test Steps**:
1. Get current user ID from localStorage
2. Run:
```javascript
const userId = localStorage.getItem('userId');
const result = await api.marketplace.getRecommendations(userId, 10);
console.log(result);
```

**Expected Result**:
- ✅ Returns personalized products
- ✅ Products match user preferences
- ✅ Different from trending products

---

### Test 3: getVendorAnalytics()

**Endpoint**: `GET /api/marketplace/vendor/analytics`

**Test Steps**:
1. Login as vendor
2. Run:
```javascript
const result = await api.marketplace.getVendorAnalytics();
console.log(result);
```

**Expected Result**:
```json
{
  "success": true,
  "data": {
    "totalSales": 150,
    "totalRevenue": 5000,
    "totalOrders": 25,
    "averageRating": 4.5,
    "totalReviews": 45,
    "totalProducts": 10,
    "topProducts": [...],
    "orderStatus": {
      "pending": 5,
      "completed": 18,
      "cancelled": 2
    }
  }
}
```

**Pass Criteria**:
- ✅ Returns success: true
- ✅ Contains all analytics fields
- ✅ Numbers are accurate
- ✅ Top products array populated

---

### Test 4: getVendor()

**Endpoint**: `GET /api/marketplace/vendors/:vendorId`

**Test Steps**:
1. Get a vendor ID from database
2. Run:
```javascript
const result = await api.marketplace.getVendor('vendorId123');
console.log(result);
```

**Expected Result**:
- ✅ Returns vendor information
- ✅ Includes avatar, name, bio
- ✅ Includes follower count
- ✅ Includes verification status

---

### Test 5: getVendorProducts()

**Endpoint**: `GET /api/marketplace/vendors/:vendorId/products`

**Test Steps**:
1. Run:
```javascript
const result = await api.marketplace.getVendorProducts('vendorId123', { limit: 10, page: 1 });
console.log(result);
```

**Expected Result**:
- ✅ Returns vendor's products
- ✅ Respects limit and page parameters
- ✅ Products have correct vendorId

---

### Test 6-12: Review Methods

**Test Steps for Each**:

#### createProductReview()
```javascript
const result = await api.marketplace.createProductReview('productId123', {
  rating: 5,
  title: 'Great product!',
  comment: 'This product exceeded my expectations...'
});
```
- ✅ Creates review successfully
- ✅ Returns review ID
- ✅ Review appears in product reviews

#### getProductReviews()
```javascript
const result = await api.marketplace.getProductReviews('productId123', 1);
```
- ✅ Returns reviews array
- ✅ Includes pagination info
- ✅ Reviews sorted by date

#### getProductReviewStats()
```javascript
const result = await api.marketplace.getProductReviewStats('productId123');
```
- ✅ Returns rating distribution
- ✅ Returns average rating
- ✅ Returns total review count

#### updateProductReview()
```javascript
const result = await api.marketplace.updateProductReview('reviewId123', {
  rating: 4,
  title: 'Updated title',
  comment: 'Updated comment...'
});
```
- ✅ Updates review successfully
- ✅ Changes reflected in product reviews
- ✅ Returns updated review

#### deleteProductReview()
```javascript
const result = await api.marketplace.deleteProductReview('reviewId123');
```
- ✅ Deletes review successfully
- ✅ Review no longer appears in list
- ✅ Stats updated

#### markReviewHelpful()
```javascript
const result = await api.marketplace.markReviewHelpful('reviewId123');
```
- ✅ Marks review as helpful
- ✅ Helpful count incremented
- ✅ User can only mark once

---

## 🎨 PHASE 2: COMPONENT TESTING

### Test 1: TrendingProducts Component

**Location**: Add to any page temporarily
```tsx
import TrendingProducts from '@/components/marketplace/TrendingProducts';

<TrendingProducts limit={10} />
```

**Test Checklist**:
- [ ] Component renders without errors
- [ ] Products load and display
- [ ] Grid layout is responsive
- [ ] Trending badges show
- [ ] Hover effects work
- [ ] Add to cart button visible
- [ ] Loading state displays
- [ ] Error state displays
- [ ] Empty state displays

---

### Test 2: VendorAnalyticsDashboard Component

**Location**: Add to vendor dashboard
```tsx
import VendorAnalyticsDashboard from '@/components/marketplace/VendorAnalyticsDashboard';

<VendorAnalyticsDashboard />
```

**Test Checklist**:
- [ ] Component renders without errors
- [ ] All 4 stat cards display
- [ ] Numbers are correct
- [ ] Order status distribution shows
- [ ] Top products table displays
- [ ] Colors are correct
- [ ] Responsive on mobile
- [ ] Loading state works
- [ ] Error state works

---

### Test 3: ReviewEditModal Component

**Location**: Add to product reviews section
```tsx
import ReviewEditModal from '@/components/marketplace/ReviewEditModal';

const [open, setOpen] = useState(false);
const [review, setReview] = useState(null);

<ReviewEditModal
  open={open}
  onClose={() => setOpen(false)}
  onSuccess={() => fetchReviews()}
  review={review}
/>
```

**Test Checklist**:
- [ ] Modal opens correctly
- [ ] Modal closes correctly
- [ ] Form fields populate with review data
- [ ] Rating selector works
- [ ] Character count displays
- [ ] Validation works (min 5 chars title, 10 chars comment)
- [ ] Submit button works
- [ ] Success message displays
- [ ] Error message displays
- [ ] Review updates in list

---

### Test 4: RecommendedProducts Component

**Location**: Product detail page
```tsx
import RecommendedProducts from '@/components/marketplace/RecommendedProducts';

<RecommendedProducts userId={user?.id} limit={10} />
```

**Test Checklist**:
- [ ] Component renders without errors
- [ ] Products load and display
- [ ] Uses new API method
- [ ] "For You" badge displays
- [ ] Grid layout is responsive
- [ ] Loading state works
- [ ] Error state works
- [ ] Empty state works

---

## 🪝 PHASE 3: HOOKS TESTING

### Test 1: useVendorAnalytics Hook

```tsx
import useVendorAnalytics from '@/hooks/useVendorAnalytics';

function TestComponent() {
  const { analytics, loading, refreshAnalytics, calculateMetrics } = useVendorAnalytics();

  return (
    <div>
      {loading && <p>Loading...</p>}
      {analytics && (
        <>
          <p>Revenue: ${analytics.totalRevenue}</p>
          <p>Orders: {analytics.totalOrders}</p>
          <button onClick={refreshAnalytics}>Refresh</button>
        </>
      )}
    </div>
  );
}
```

**Test Checklist**:
- [ ] Hook initializes correctly
- [ ] Auto-fetches on mount
- [ ] Loading state works
- [ ] Analytics data loads
- [ ] Refresh function works
- [ ] Metrics calculator works
- [ ] Error handling works

---

### Test 2: useTrendingProducts Hook

```tsx
import useTrendingProducts from '@/hooks/useTrendingProducts';

function TestComponent() {
  const { products, loading, getBestSellers, getDiscountedProducts } = useTrendingProducts(10);

  return (
    <div>
      <p>Total: {products.length}</p>
      <p>Best Sellers: {getBestSellers().length}</p>
      <p>Discounted: {getDiscountedProducts().length}</p>
    </div>
  );
}
```

**Test Checklist**:
- [ ] Hook initializes correctly
- [ ] Auto-fetches on mount
- [ ] Products load
- [ ] Filter methods work
- [ ] Search works
- [ ] Error handling works

---

### Test 3: useRecommendations Hook

```tsx
import useRecommendations from '@/hooks/useRecommendations';

function TestComponent() {
  const { products, loading, getTopRecommendations, getBestValue } = useRecommendations(userId, 10);

  return (
    <div>
      <p>Total: {products.length}</p>
      <p>Top 5: {getTopRecommendations(5).length}</p>
      <p>Best Value: {getBestValue().length}</p>
    </div>
  );
}
```

**Test Checklist**:
- [ ] Hook initializes correctly
- [ ] Auto-fetches when userId changes
- [ ] Products load
- [ ] Filter methods work
- [ ] Best value calculator works
- [ ] Error handling works

---

### Test 4: useProductReviews Hook (Updated)

```tsx
import useProductReviews from '@/hooks/useProductReviews';

function TestComponent() {
  const { reviews, submitReview, updateReview, deleteReview } = useProductReviews(productId);

  return (
    <div>
      <button onClick={() => submitReview(5, 'Great!', 'Amazing product')}>
        Submit Review
      </button>
      <button onClick={() => updateReview(reviewId, 4, 'Updated', 'Updated comment')}>
        Update Review
      </button>
      <button onClick={() => deleteReview(reviewId)}>
        Delete Review
      </button>
    </div>
  );
}
```

**Test Checklist**:
- [ ] Hook uses centralized API methods
- [ ] submitReview works
- [ ] updateReview works ✨ NEW
- [ ] deleteReview works
- [ ] markHelpful works
- [ ] Error handling works

---

## 🔗 PHASE 4: INTEGRATION TESTING

### Test 1: Homepage Integration

**Steps**:
1. Navigate to homepage
2. Scroll to trending section
3. Verify trending products display
4. Scroll to recommendations section
5. Verify recommendations display

**Checklist**:
- [ ] Both sections load
- [ ] Products display correctly
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Click product navigates to detail

---

### Test 2: Vendor Dashboard Integration

**Steps**:
1. Login as vendor
2. Navigate to vendor dashboard
3. Click "View Analytics"
4. Verify analytics page loads

**Checklist**:
- [ ] Analytics page loads
- [ ] All metrics display
- [ ] Top products show
- [ ] Tabs work
- [ ] Export button visible

---

### Test 3: Product Detail Integration

**Steps**:
1. Navigate to product detail page
2. Scroll to reviews section
3. Find your review
4. Click edit button
5. Update review
6. Verify update

**Checklist**:
- [ ] Edit button visible
- [ ] Modal opens
- [ ] Form populates
- [ ] Update works
- [ ] Review updates in list

---

### Test 4: Vendor Profile Integration

**Steps**:
1. Navigate to vendor profile page
2. Verify vendor info displays
3. Verify products display
4. Click product
5. Verify navigation works

**Checklist**:
- [ ] Vendor info loads
- [ ] Products load
- [ ] Navigation works
- [ ] No console errors

---

## 🐛 PHASE 5: ERROR HANDLING TESTING

### Test 1: Network Errors

**Steps**:
1. Disconnect internet
2. Try to load trending products
3. Verify error message displays

**Checklist**:
- [ ] Error message displays
- [ ] Retry button works
- [ ] No console errors

---

### Test 2: Invalid Data

**Steps**:
1. Manually call API with invalid ID
2. Verify error handling

**Checklist**:
- [ ] Error message displays
- [ ] Component doesn't crash
- [ ] User can retry

---

### Test 3: Authentication Errors

**Steps**:
1. Logout
2. Try to access vendor analytics
3. Verify redirect to login

**Checklist**:
- [ ] Redirects to login
- [ ] Error message displays
- [ ] No console errors

---

## ✅ FINAL VERIFICATION

### Checklist
- [ ] All API methods tested
- [ ] All components tested
- [ ] All hooks tested
- [ ] All integrations tested
- [ ] Error handling tested
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Responsive on all devices
- [ ] Performance acceptable
- [ ] All features working

---

## 📊 TEST RESULTS TEMPLATE

```
Date: 2025-10-26
Tester: [Name]
Environment: [Dev/Staging/Production]

API Methods: [Pass/Fail]
- getTrendingProducts: [Pass/Fail]
- getRecommendations: [Pass/Fail]
- getVendorAnalytics: [Pass/Fail]
- getVendor: [Pass/Fail]
- getVendorProducts: [Pass/Fail]
- Review methods: [Pass/Fail]

Components: [Pass/Fail]
- TrendingProducts: [Pass/Fail]
- VendorAnalyticsDashboard: [Pass/Fail]
- ReviewEditModal: [Pass/Fail]
- RecommendedProducts: [Pass/Fail]

Hooks: [Pass/Fail]
- useVendorAnalytics: [Pass/Fail]
- useTrendingProducts: [Pass/Fail]
- useRecommendations: [Pass/Fail]
- useProductReviews: [Pass/Fail]

Integration: [Pass/Fail]
- Homepage: [Pass/Fail]
- Vendor Dashboard: [Pass/Fail]
- Product Detail: [Pass/Fail]
- Vendor Profile: [Pass/Fail]

Issues Found:
1. [Issue description]
2. [Issue description]

Notes:
[Any additional notes]
```

---

**Status**: Ready for Testing  
**Next Step**: Execute tests and document results  
**Estimated Time**: 4-6 hours


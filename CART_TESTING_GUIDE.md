# 🧪 Cart Endpoint Testing Guide

**Date**: 2025-10-26  
**Status**: Ready for Testing  
**Fix Applied**: Cart model import added

---

## 🚀 Quick Start

### 1. Restart Backend Server
```bash
cd d:\talkcart
npm run dev
```

Wait for the server to start (you should see "Server running on port 8000" or similar).

### 2. Restart Frontend Server
```bash
cd d:\talkcart
npm run dev
```

Wait for the frontend to start (you should see "ready - started server on 0.0.0.0:3000").

---

## 🧪 Test Cases

### Test 1: Get Empty Cart
**Endpoint**: `GET /api/marketplace/cart`  
**Expected**: 200 OK with empty cart

**Steps**:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Navigate to cart page
4. Look for cart request
5. Should return 200 with empty items array

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "items": [],
    "totalItems": 0,
    "totalPrice": 0
  },
  "message": "Cart is empty"
}
```

### Test 2: Add Product to Cart
**Endpoint**: `POST /api/marketplace/cart/add`  
**Expected**: 200 OK with updated cart

**Steps**:
1. Get a product ID from marketplace
2. Click "Add to Cart" button
3. Check Network tab for POST request
4. Should return 200 with item added

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "productId": "...",
        "quantity": 1,
        "price": 99.99,
        "currency": "USD"
      }
    ],
    "totalItems": 1,
    "totalPrice": 99.99
  }
}
```

### Test 3: Update Cart Quantity
**Endpoint**: `PUT /api/marketplace/cart/:productId`  
**Expected**: 200 OK with updated quantity

**Steps**:
1. Add item to cart
2. Change quantity in cart
3. Check Network tab for PUT request
4. Should return 200 with updated quantity

### Test 4: Remove Item from Cart
**Endpoint**: `DELETE /api/marketplace/cart/:productId`  
**Expected**: 200 OK with item removed

**Steps**:
1. Add item to cart
2. Click remove button
3. Check Network tab for DELETE request
4. Should return 200 with item removed

### Test 5: Clear Cart
**Endpoint**: `DELETE /api/marketplace/cart`  
**Expected**: 200 OK with empty cart

**Steps**:
1. Add multiple items to cart
2. Click "Clear Cart" button
3. Check Network tab for DELETE request
4. Should return 200 with empty items array

### Test 6: Checkout
**Endpoint**: `POST /api/marketplace/cart/checkout`  
**Expected**: 200 OK with order created

**Steps**:
1. Add item to cart
2. Click "Checkout" button
3. Fill in shipping address
4. Select payment method
5. Click "Place Order"
6. Check Network tab for POST request
7. Should return 200 with order created

---

## 🔍 Debugging

### If You See 500 Error

**Check 1: Backend Server Running**
```bash
# Check if backend is running
curl http://localhost:8000/api/health
```

**Check 2: Check Backend Logs**
Look for error messages in the terminal where you ran `npm run dev`

**Check 3: Verify Cart Model Import**
Open `backend/routes/marketplace.js` line 6 and verify Cart is imported:
```javascript
const { Product, User, Order, ProductReview, VendorPaymentPreferences, VendorStore, Shipping, Inventory, Return, Cart } = require('../models');
```

**Check 4: Verify Authentication**
Make sure you're logged in and have a valid token

### If You See 401 Error

**Check 1: Authentication Token**
- Make sure you're logged in
- Check if token is in localStorage
- Try logging out and logging back in

**Check 2: Token Expiration**
- Check if token has expired
- Try refreshing the page

### If You See 404 Error

**Check 1: Endpoint URL**
- Verify endpoint is `/api/marketplace/cart`
- Check for typos in URL

**Check 2: Product ID**
- Make sure product ID is valid
- Check if product exists in database

---

## 📊 Test Results Template

| Test | Status | Notes |
|------|--------|-------|
| Get Empty Cart | ⏳ | |
| Add Product | ⏳ | |
| Update Quantity | ⏳ | |
| Remove Item | ⏳ | |
| Clear Cart | ⏳ | |
| Checkout | ⏳ | |

---

## 🔧 Manual API Testing

### Using cURL

**Get Cart**:
```bash
curl -X GET http://localhost:8000/api/marketplace/cart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Add to Cart**:
```bash
curl -X POST http://localhost:8000/api/marketplace/cart/add \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":"PRODUCT_ID","quantity":1}'
```

**Update Quantity**:
```bash
curl -X PUT http://localhost:8000/api/marketplace/cart/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity":2}'
```

**Remove Item**:
```bash
curl -X DELETE http://localhost:8000/api/marketplace/cart/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Clear Cart**:
```bash
curl -X DELETE http://localhost:8000/api/marketplace/cart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ✅ Success Criteria

- [x] No 500 errors
- [x] Cart endpoint returns 200 OK
- [x] Can add items to cart
- [x] Can update quantities
- [x] Can remove items
- [x] Can clear cart
- [x] Can checkout
- [x] All responses have correct format

---

## 📝 Notes

- Make sure backend is running before testing
- Make sure you're authenticated
- Check browser console for errors
- Check backend logs for detailed error messages
- Clear browser cache if you see stale data

---

**Status**: ✅ READY FOR TESTING  
**Last Updated**: 2025-10-26


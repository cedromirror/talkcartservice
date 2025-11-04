# 🧪 Marketplace Testing Guide

Quick guide to test all new marketplace features.

---

## 🚀 Quick Start

### 1. Start the Backend
```bash
cd backend
npm start
```

### 2. Start the Frontend (Web)
```bash
cd frontend
npm run dev
```

### 3. Start Mobile App
```bash
cd mobile/talkcart-mobile
npm start
```

---

## 🧪 Test Cases

### Test 1: Related Products ✅

**Backend Test**:
```bash
# Get related products for a product
curl http://localhost:8000/api/marketplace/products/{productId}/related?limit=6
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "...",
        "name": "...",
        "category": "...",
        "price": 100,
        ...
      }
    ]
  }
}
```

**Frontend Test**:
1. Navigate to any product detail page
2. Scroll to bottom
3. Verify "Related Products" section appears
4. Verify products are from same category or vendor
5. Click on a related product to navigate

---

### Test 2: Product Variants ✅

**Backend Test**:
```bash
# Create product with variants
curl -X POST http://localhost:8000/api/marketplace/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "T-Shirt",
    "description": "Cotton T-Shirt",
    "price": 20,
    "currency": "USD",
    "category": "Fashion",
    "variants": [
      {
        "name": "Size",
        "value": "Small",
        "price": 0,
        "stock": 10,
        "sku": "TS-S"
      },
      {
        "name": "Size",
        "value": "Medium",
        "price": 0,
        "stock": 15,
        "sku": "TS-M"
      },
      {
        "name": "Size",
        "value": "Large",
        "price": 2,
        "stock": 8,
        "sku": "TS-L"
      },
      {
        "name": "Color",
        "value": "Red",
        "price": 0,
        "stock": 20,
        "sku": "TS-RED"
      },
      {
        "name": "Color",
        "value": "Blue",
        "price": 1,
        "stock": 15,
        "sku": "TS-BLUE"
      }
    ]
  }'
```

**Frontend Test**:
1. Create a product with variants (or use API)
2. View product detail page
3. Verify "Product Options" section appears
4. Select different variants
5. Verify price updates when variant has additional cost
6. Verify "Selected" summary shows chosen variants
7. Verify out-of-stock variants are disabled

---

### Test 3: Bulk Discounts ✅

**Backend Test**:
```bash
# Create product with bulk discounts
curl -X POST http://localhost:8000/api/marketplace/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bulk Item",
    "description": "Item with bulk pricing",
    "price": 100,
    "currency": "USD",
    "category": "Electronics",
    "bulkDiscounts": [
      {
        "minQuantity": 10,
        "maxQuantity": 49,
        "discountPercent": 10
      },
      {
        "minQuantity": 50,
        "maxQuantity": 99,
        "discountPercent": 20
      },
      {
        "minQuantity": 100,
        "discountPercent": 30
      }
    ]
  }'
```

**Frontend Test**:
1. Create a product with bulk discounts
2. View product detail page
3. Verify "Bulk Discounts Available" section appears
4. Verify all discount tiers are displayed
5. Change quantity to trigger different tiers
6. Verify active tier is highlighted
7. Verify total price calculation is correct
8. Verify savings amount is shown

---

### Test 4: Product Comparison ✅

**Backend Test**:
```bash
# Compare products
curl -X POST http://localhost:8000/api/marketplace/products/compare \
  -H "Content-Type: application/json" \
  -d '{
    "productIds": ["productId1", "productId2", "productId3"]
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "...",
        "name": "...",
        "price": 100,
        "brand": "Apple",
        "condition": "new",
        "specifications": [...],
        ...
      }
    ]
  }
}
```

**Frontend Test**:
1. Select 2-5 products (add compare checkbox to product cards)
2. Click "Compare" button
3. Verify comparison modal opens
4. Verify all products are displayed in columns
5. Verify comparison criteria:
   - Product images
   - Prices and discounts
   - Brand and condition
   - Ratings
   - Stock availability
   - Shipping options
   - Vendor info
   - Specifications
6. Click "View Details" to navigate to product

---

### Test 5: Enhanced Product Fields ✅

**Backend Test**:
```bash
# Create product with all new fields
curl -X POST http://localhost:8000/api/marketplace/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15 Pro",
    "description": "Latest iPhone",
    "price": 999,
    "currency": "USD",
    "category": "Electronics",
    "brand": "Apple",
    "condition": "new",
    "weight": 187,
    "dimensions": {
      "length": 14.67,
      "width": 7.09,
      "height": 0.83,
      "unit": "cm"
    },
    "specifications": [
      {
        "key": "Display",
        "value": "6.1-inch Super Retina XDR"
      },
      {
        "key": "Chip",
        "value": "A17 Pro"
      },
      {
        "key": "Camera",
        "value": "48MP Main | 12MP Ultra Wide"
      },
      {
        "key": "Battery",
        "value": "Up to 23 hours video playback"
      }
    ]
  }'
```

**Frontend Test**:
1. Create product with specifications
2. View product detail page
3. Verify "Specifications" section appears
4. Verify all specs are displayed correctly
5. Verify brand is shown
6. Verify condition badge is displayed

---

## ✅ Backward Compatibility Tests

### Test 6: Existing Products Still Work

1. **View old products** (without new fields)
   - Should display normally
   - No errors in console
   - All existing features work

2. **Edit old products**
   - Can update without adding new fields
   - Optional fields remain optional
   - No validation errors

3. **Purchase old products**
   - Checkout process unchanged
   - Cart functionality works
   - Order creation successful

---

## 🔍 Integration Tests

### Test 7: Complete User Flow

**Buyer Journey**:
1. Browse marketplace
2. View product with variants
3. Select variant (size, color)
4. See bulk discount tiers
5. Adjust quantity for discount
6. View related products
7. Compare with similar products
8. Add to cart
9. Complete purchase

**Vendor Journey**:
1. Create new product
2. Add variants (sizes, colors)
3. Set bulk discount tiers
4. Add specifications
5. Link related products
6. Publish product
7. View in marketplace
8. Edit product details

---

## 📊 Performance Tests

### Test 8: Load Testing

1. **Related Products**:
   - Test with 100+ products in same category
   - Verify response time < 500ms
   - Check database query efficiency

2. **Product Comparison**:
   - Compare 5 products simultaneously
   - Verify response time < 1s
   - Check memory usage

3. **Variants**:
   - Create product with 20+ variants
   - Verify UI renders smoothly
   - Check selection performance

---

## 🐛 Error Handling Tests

### Test 9: Edge Cases

1. **Invalid Product ID**:
   ```bash
   GET /api/marketplace/products/invalid-id/related
   # Expected: 404 error
   ```

2. **Too Many Products to Compare**:
   ```bash
   POST /api/marketplace/products/compare
   Body: { "productIds": ["id1", "id2", "id3", "id4", "id5", "id6"] }
   # Expected: 400 error (max 5 products)
   ```

3. **Too Few Products to Compare**:
   ```bash
   POST /api/marketplace/products/compare
   Body: { "productIds": ["id1"] }
   # Expected: 400 error (min 2 products)
   ```

4. **Invalid Variant Data**:
   - Create product with negative variant price
   - Expected: Validation error

5. **Invalid Bulk Discount**:
   - Create discount with minQuantity > maxQuantity
   - Expected: Validation error

---

## ✅ Checklist

- [ ] Related products endpoint works
- [ ] Related products component renders
- [ ] Product variants can be created
- [ ] Variant selector works correctly
- [ ] Bulk discounts can be configured
- [ ] Bulk discount display is accurate
- [ ] Product comparison endpoint works
- [ ] Comparison modal displays correctly
- [ ] Specifications display properly
- [ ] Brand and condition fields work
- [ ] Dimensions and weight save correctly
- [ ] Old products still work
- [ ] No breaking changes
- [ ] Mobile app works
- [ ] Web app works
- [ ] All APIs return correct responses
- [ ] Error handling works
- [ ] Performance is acceptable

---

## 🎯 Success Criteria

✅ All new features work as expected  
✅ No errors in console  
✅ Backward compatibility maintained  
✅ Performance is acceptable  
✅ User experience is smooth  
✅ Mobile and web apps both work  

---

**Happy Testing!** 🚀


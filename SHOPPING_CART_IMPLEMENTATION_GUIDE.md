# 🛒 SHOPPING CART - IMPLEMENTATION GUIDE

**Priority**: CRITICAL  
**Effort**: 8-10 hours  
**Impact**: Essential for marketplace functionality

---

## STEP 1: CREATE CART MODEL

```javascript
// backend/models/Cart.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  items: [cartItemSchema],
  totalItems: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Calculate totals before saving
cartSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalPrice = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
```

---

## STEP 2: CREATE CART ENDPOINTS

```javascript
// backend/routes/marketplace.js - Add these endpoints:

// GET /api/marketplace/cart
router.get('/cart', authenticateTokenStrict, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId })
      .populate('items.productId', 'name price currency images');
    
    if (!cart) {
      return res.json({ success: true, data: { items: [], totalItems: 0, totalPrice: 0 } });
    }
    
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/marketplace/cart/add
router.post('/cart/add', authenticateTokenStrict, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    
    let cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) {
      cart = new Cart({ userId: req.user.userId, items: [] });
    }
    
    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        price: product.price,
        currency: product.currency
      });
    }
    
    await cart.save();
    res.json({ success: true, data: cart, message: 'Item added to cart' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/marketplace/cart/:productId
router.put('/cart/:productId', authenticateTokenStrict, async (req, res) => {
  try {
    const { quantity } = req.body;
    
    const cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) return res.status(404).json({ success: false, error: 'Cart not found' });
    
    const item = cart.items.find(i => i.productId.toString() === req.params.productId);
    if (!item) return res.status(404).json({ success: false, error: 'Item not in cart' });
    
    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i.productId.toString() !== req.params.productId);
    } else {
      item.quantity = quantity;
    }
    
    await cart.save();
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/marketplace/cart/:productId
router.delete('/cart/:productId', authenticateTokenStrict, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) return res.status(404).json({ success: false, error: 'Cart not found' });
    
    cart.items = cart.items.filter(i => i.productId.toString() !== req.params.productId);
    await cart.save();
    
    res.json({ success: true, data: cart, message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/marketplace/cart
router.delete('/cart', authenticateTokenStrict, async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.user.userId },
      { items: [] }
    );
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/marketplace/cart/checkout
router.post('/cart/checkout', authenticateTokenStrict, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    
    const cart = await Cart.findOne({ userId: req.user.userId })
      .populate('items.productId');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, error: 'Cart is empty' });
    }
    
    // Create order from cart
    const order = new Order({
      userId: req.user.userId,
      items: cart.items.map(item => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.price,
        quantity: item.quantity,
        currency: item.currency
      })),
      totalAmount: cart.totalPrice,
      currency: cart.items[0].currency,
      paymentMethod,
      shippingAddress,
      paymentDetails: {}
    });
    
    await order.save();
    
    // Clear cart
    await Cart.findOneAndUpdate(
      { userId: req.user.userId },
      { items: [] }
    );
    
    res.json({ success: true, data: order, message: 'Order created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

## STEP 3: CREATE FRONTEND HOOK

```typescript
// frontend/src/hooks/useCart.ts
import { useState, useCallback, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export const useCart = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/marketplace/cart');
      if (response.success) {
        setItems(response.data.items || []);
        setTotal(response.data.totalPrice || 0);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (productId: string, quantity: number = 1) => {
    try {
      const response = await api.post('/marketplace/cart/add', { productId, quantity });
      if (response.success) {
        setItems(response.data.items);
        setTotal(response.data.totalPrice);
        toast.success('Added to cart');
      }
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  }, []);

  const removeFromCart = useCallback(async (productId: string) => {
    try {
      const response = await api.delete(`/marketplace/cart/${productId}`);
      if (response.success) {
        setItems(response.data.items);
        setTotal(response.data.totalPrice);
        toast.success('Removed from cart');
      }
    } catch (error) {
      toast.error('Failed to remove from cart');
    }
  }, []);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    try {
      const response = await api.put(`/marketplace/cart/${productId}`, { quantity });
      if (response.success) {
        setItems(response.data.items);
        setTotal(response.data.totalPrice);
      }
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await api.delete('/marketplace/cart');
      setItems([]);
      setTotal(0);
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  }, []);

  const checkout = useCallback(async (shippingAddress: any, paymentMethod: string) => {
    try {
      const response = await api.post('/marketplace/cart/checkout', {
        shippingAddress,
        paymentMethod
      });
      if (response.success) {
        setItems([]);
        setTotal(0);
        return response.data;
      }
    } catch (error) {
      toast.error('Checkout failed');
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    items,
    total,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout,
    itemCount: items.length
  };
};

export default useCart;
```

---

## STEP 4: CREATE CART PAGES

```typescript
// frontend/pages/marketplace/cart.tsx
import React from 'react';
import { Container, Box, Typography, Button, Grid } from '@mui/material';
import Layout from '@/components/layout/Layout';
import useCart from '@/hooks/useCart';
import CartItem from '@/components/marketplace/CartItem';
import CartSummary from '@/components/marketplace/CartSummary';

export default function CartPage() {
  const { items, total, removeFromCart, updateQuantity, checkout } = useCart();

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>Shopping Cart</Typography>
        
        {items.length === 0 ? (
          <Typography>Your cart is empty</Typography>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              {items.map(item => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onRemove={removeFromCart}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </Grid>
            <Grid item xs={12} md={4}>
              <CartSummary
                total={total}
                itemCount={items.length}
                onCheckout={checkout}
              />
            </Grid>
          </Grid>
        )}
      </Container>
    </Layout>
  );
}
```

---

## TESTING CHECKLIST

- [ ] Add item to cart
- [ ] Remove item from cart
- [ ] Update quantity
- [ ] Clear cart
- [ ] Cart persists on page reload
- [ ] Checkout from cart
- [ ] Cart total calculates correctly
- [ ] Multiple items in cart
- [ ] Out of stock handling

---

**Estimated Implementation Time**: 8-10 hours  
**Complexity**: Medium  
**Dependencies**: Cart Model, API endpoints, Frontend components


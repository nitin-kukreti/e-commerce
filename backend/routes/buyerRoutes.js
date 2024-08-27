const express = require('express');
const { body } = require('express-validator');
const { searchProducts, addToCart, removeFromCart, getCartItem } = require('../controllers/buyerController');
const { authMiddleware, buyerMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Search for products
router.get('/search', searchProducts);

// Add a product to cart (Buyer only)
router.post(
  '/cart/add',
  authMiddleware,
  buyerMiddleware,
  [body('productId').notEmpty().withMessage('Product ID is required')],
  addToCart
);

router.get('/cart',
    authMiddleware,
    buyerMiddleware,
    getCartItem
)

// Remove a product from cart (Buyer only)
router.delete('/cart/remove/:productId', authMiddleware, buyerMiddleware, removeFromCart);

module.exports = router;

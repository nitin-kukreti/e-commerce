const express = require('express');
const { body,validationResult,param } = require('express-validator');
const { addProduct, editProduct, deleteProduct } = require('../controllers/productController');
const { authMiddleware, sellerMiddleware } = require('../middleware/authMiddleware');
const { getProductById, searchProducts } = require('../controllers/buyerController');

const router = express.Router();

// Add a product (Seller only)
router.post(
  '/add',
  authMiddleware,
  sellerMiddleware,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
    body('discount').isFloat({ min: 0 }).withMessage('Discount must be a positive number')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  addProduct
);

router.get('/',
 searchProducts
);

router.get('/:productId',  [param('productId').isInt().notEmpty().withMessage('Product ID is required')],
(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
 getProductById
);

// Edit a product (Seller only)
router.put('/edit/:id', authMiddleware, sellerMiddleware, editProduct);

// Delete a product (Seller only)
router.delete('/delete/:id', authMiddleware, sellerMiddleware, deleteProduct);

module.exports = router;

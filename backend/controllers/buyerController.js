const { Product,Cart } = require('../models');
const { Op } = require('sequelize');

// Search for products
exports.searchProducts = async (req, res) => {
  const { name, category } = req.query;

  try {
    const whereClause = {};
    if (name) whereClause.name = { [Op.iLike]: `%${name}%` };
    if (category) whereClause.category = { [Op.iLike]: `%${category}%` };

    const products = await Product.findAll({ where: whereClause });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add product to cart
exports.addToCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id; // Assuming JWT middleware has set req.user

  try {
    // Assuming Cart model exists with userId and productId
    const cartItem = await Cart.create({ userId, productId });
    res.status(201).json(cartItem);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCartItem = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id; // Assuming JWT middleware has set req.user

  try {
    const cartItem = await Cart.findAll({ where:{userId} });
    res.status(201).json(cartItem);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove product from cart
exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    const cartItem = await Cart.findOne({ where: { userId, productId } });
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await cartItem.destroy();
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProductById = async (req, res) => {
    const { productId } = req.params;
    try {
      const products = await Product.findAll({ where: {
        id: productId
      } });
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };

const { Product,Cart } = require('../models');

// Add a new product
exports.addProduct = async (req, res) => {
  const { name, category, description, price, discount } = req.body;
  const userId = req.user.id; // Assuming JWT middleware has set req.user

  try {
    const product = await Product.create({ name, category, description, price, discount, userId });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit a product
exports.editProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category, description, price, discount } = req.body;
  const userId = req.user.id;

  try {
    const product = await Product.findOne({ where: { id, userId } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name || product.name;
    product.category = category || product.category;
    product.description = description || product.description;
    product.price = price || product.price;
    product.discount = discount || product.discount;

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const product = await Product.findOne({ where: { id, userId } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    Cart.destroy({where: {productId: id}});
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

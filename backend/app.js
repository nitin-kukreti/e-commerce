const express = require('express');
// const { Sequelize } = require('sequelize');
const db = require('./models')
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const buyerRoutes = require('./routes/buyerRoutes');
const errorHandler = require('./middleware/errorHandler');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // If you want to support cookies
  }));


// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/buyers', buyerRoutes);

// Centralized error handling middleware
app.use(errorHandler);

// Sample route
app.get('/', (req, res) => {
  res.send('Welcome to the e-commerce backend!');
});

db.sequelize.sync().then((req)=>{
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
      });
})



module.exports = app; // Export app if needed for testing or other purposes

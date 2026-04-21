const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const useMongo = !!process.env.MONGO_URI && !process.env.MONGO_URI.includes('admin:admin123@cluster0.mongodb.net');

if (useMongo) {
  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => { console.error(err); process.exit(1); });
  app.use('/api/auth', require('./routes/auth.mongo'));
  app.use('/api/products', require('./routes/products.mongo'));
  app.use('/api/orders', require('./routes/orders.mongo'));
  app.use('/api/users', require('./routes/users.mongo'));
  app.use('/api/dashboard', require('./routes/dashboard.mongo'));
  console.log('Using MongoDB');
} else {
  require('./database');
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/products', require('./routes/products'));
  app.use('/api/orders', require('./routes/orders'));
  app.use('/api/users', require('./routes/users'));
  app.use('/api/dashboard', require('./routes/dashboard'));
  console.log('Using SQLite (local)');
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

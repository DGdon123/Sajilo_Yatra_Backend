const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./database/connection');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors')
const PORT = process.env.PORT || 3000;

const categoryRoutes = require('./routes/categoryRoute');
const productRoutes = require('./routes/productRoute');
const userRoutes = require('./routes/userRoute');
const orderRoutes = require('./routes/orderRoute');
const paymentRoutes = require('./routes/paymentRoute')

// Middleware
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/public/uploads', express.static('public/uploads'));
app.use(cors())

// Routes middleware
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', userRoutes);
app.use('/api', orderRoutes);
app.use('/api',paymentRoutes);



app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

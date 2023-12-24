const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./database/connection');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors')
const port = process.env.PORT || 5000;

const categoryRoutes = require('./routes/categoryRoute');
const productRoutes = require('./routes/productRoute');
const userRoutes = require('./routes/userRoute');
const orderRoutes = require('./routes/orderRoute');
const paymentRoutes = require('./routes/paymentRoute')
const vehicleRoutes = require('./routes/vehicleOwnerRoute')
const ticketRoutes = require('./routes/ticketRoute');
const rentalRoutes = require('./routes/rentalRoute');
const vehicleTicketRoutes = require('./routes/vehicleOwnerTicketRoute');
// Middleware
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/public/uploads', express.static('public/uploads'));
app.use(cors())

// Routes middleware
app.use('/api', categoryRoutes,rentalRoutes,productRoutes,userRoutes,orderRoutes,paymentRoutes,vehicleRoutes,ticketRoutes,vehicleTicketRoutes);


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

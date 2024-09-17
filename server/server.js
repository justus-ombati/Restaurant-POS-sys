const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const userRouter = require('./Router/userRouter');
const ingredientRouter = require('./Router/ingredientRouter');
const foodRouter = require('./Router/foodRouter');
const specialFoodRouter = require('./Router/specialFoodRouter');
const orderRouter = require('./Router/orderRouter');
const salesRouter = require('./Router/salesRouter')
const rolesRouter = require('./Router/rolesRouter')

const CustomError = require('./Utils/customError');
const globalErrorHandler = require('./Controllers/errorController');

// Handling uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.name, err.message);
    console.error('Shutting down due to uncaught exception...');
    process.exit(1);
});

const app = express();

// Middleware
app.use(express.json());
// Set up CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN
}));

//Routes
app.use('/user', userRouter);
app.use('/ingredient', ingredientRouter);
app.use('/food', foodRouter);
app.use('/specialFood', specialFoodRouter);
app.use('/order', orderRouter);
app.use('/sales', salesRouter);
app.use('/role', rolesRouter);

app.get('/ping', (req, res) => {
    res.send('pong');
});
// Last route for all other URL routes
app.all('*', (req, res, next) => {
    const err = new CustomError(`Can't find ${req.originalUrl} on the server!`, 404);
    next(err);
});

// Error handling middleware
app.use(globalErrorHandler);

// Connect to MongoDB and start the server
mongoose.connect(process.env.CONN_STR, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');

        // Start the server
        const PORT = process.env.PORT || 5001;
        const server = app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });

        // Handling unhandled rejections
        process.on('unhandledRejection', (err) => {
            console.error('Unhandled Rejection:', err.name, err.message);
            console.error('Shutting down due to unhandled rejection...');
            server.close(() => {
                process.exit(1);
            });
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });

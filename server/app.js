const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const userRouter = require('./routes/user.js');
const oauthRouter = require('./routes/oauth.js');
const logger = require('./middleware/logger.js');
const { authRateLimiter, standardRateLimiter } = require('./middleware/rateLimiter.js');
const redis = require('./utils/redis.js');
const app = express();

const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL || 'https://jauth.jagadesh31.tech';


app.use(cors({
  origin: CLIENT_BASE_URL,
  credentials: true
}));


app.use(cookieParser());
app.use(express.json({ limit: '10mb' })); // Add body size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(logger);
app.use(standardRateLimiter); // Apply rate limiting to all routes

app.use('/user', userRouter);
app.use('/oauth', oauthRouter);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is healthy'
  });
});



const port = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

redis.initRedis().catch(err => console.error('Redis init error:', err));

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await mongoose.connection.close();
  await redis.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await mongoose.connection.close();
  await redis.close();
  process.exit(0);
});

module.exports = app;
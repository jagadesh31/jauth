const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const userRouter = require('./routes/user.js');
const oauthRouter = require('./routes/oauth.js');
const logger = require('./middleware/logger.js');
const app = express();

const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL || 'https://jauth.jagadesh31.tech';


app.use(cors({
  origin: CLIENT_BASE_URL,
  credentials: true
}));


app.use(cookieParser());
app.use(express.json());
app.use(logger);

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
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB: ' + err);
  });
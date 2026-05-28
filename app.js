const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const hpp = require('hpp');

const config = require('@config');
const logger = require('@config/logger');

const apiRoutes = require('@routes');
const { errorHandler, requestLogger } = require('@middlewares');
//
const app = express();
 
app.disable('x-powered-by');
app.use(requestLogger);
app.use(helmet());
app.use(hpp());
app.use(cors({
  origin: config.cors.allowlist,
  credentials: config.cors.credentials,
}));
app.use(cookieParser());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

//
app.use(config.app.apiPrefix, apiRoutes);

// 
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'No endpoint found for this request',
    path: req.originalUrl,
  });
});

//
app.use(errorHandler);

module.exports = app;
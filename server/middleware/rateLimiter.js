const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

const gameSessionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit game session saves to 10 per minute
  message: {
    error: 'Too many game sessions submitted, please slow down.'
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit login/register attempts
  message: {
    error: 'Too many authentication attempts, please try again later.'
  }
});

module.exports = {
  generalLimiter,
  gameSessionLimiter,
  authLimiter
};
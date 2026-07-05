const redisUtils = require('../utils/redis');

/**
 * Rate limiter middleware using Redis
 * @param {number} maxRequests - Maximum number of requests
 * @param {number} windowInSeconds - Time window in seconds
 */
const rateLimiter = (maxRequests = 100, windowInSeconds = 60) => {
  return async (req, res, next) => {
    // Skip rate limiting if Redis is not available
    try {

      const key = `rate_limit:${req.ip}:${req.path}`;
      const current = await redisUtils.incr(key);

      // If Redis is not available, incr returns null, skip rate limiting
      if (current === null) {
        return next();
      }

      // Set expiration on first request
      if (current === 1) {
        await redisUtils.expire(key, windowInSeconds);
      }

      // Check if limit exceeded
      if (current > maxRequests) {
        return res.status(429).json({
          success: false,
          message: 'Too many requests, please try again later',
          retryAfter: windowInSeconds
        });
      }

      // Add rate limit headers
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - current));
      res.setHeader('X-RateLimit-Reset', new Date(Date.now() + windowInSeconds * 1000).toISOString());

      next();
    } catch (error) {
      console.error('Rate limiter error:', error);
      // Continue if rate limiting fails (fail open)
      next();
    }
  };
};

/**
 * Strict rate limiter for authentication endpoints
 */
const authRateLimiter = rateLimiter(5, 300); // 5 requests per 5 minutes

/**
 * Standard rate limiter for general endpoints
 */
const standardRateLimiter = rateLimiter(100, 60); // 100 requests per minute

module.exports = {
  rateLimiter,
  authRateLimiter,
  standardRateLimiter
};

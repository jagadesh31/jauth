const redis = require('redis');

let redisClient = null;

/**
 * Initialize Redis client
 */
const initRedis = async () => {
  try {
    const redisUrl = process.env.REDIS_PASSWORD
      ? `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
      : `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;

    redisClient = redis.createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error('Redis: Max reconnection attempts reached');
            return new Error('Max reconnection attempts reached');
          }
          return Math.min(retries * 100, 3000);
        }
      }
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('Redis Client Connected');
    });

    redisClient.on('ready', () => {
      console.log('Redis Client Ready');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    // Continue without Redis in development, but log the error
    return null;
  }
};

/**
 * Get value from Redis
 */
const get = async (key) => {
  if (!redisClient) return null;
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Redis GET error for key ${key}:`, error);
    return null;
  }
};

/**
 * Set value in Redis with optional expiration
 */
const set = async (key, value, expirationInSeconds = null) => {
  if (!redisClient) return false;
  try {
    const stringValue = JSON.stringify(value);
    if (expirationInSeconds) {
      await redisClient.setEx(key, expirationInSeconds, stringValue);
    } else {
      await redisClient.set(key, stringValue);
    }
    return true;
  } catch (error) {
    console.error(`Redis SET error for key ${key}:`, error);
    return false;
  }
};

/**
 * Delete value from Redis
 */
const del = async (key) => {
  if (!redisClient) return false;
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error(`Redis DEL error for key ${key}:`, error);
    return false;
  }
};

/**
 * Check if key exists in Redis
 */
const exists = async (key) => {
  if (!redisClient) return false;
  try {
    const result = await redisClient.exists(key);
    return result === 1;
  } catch (error) {
    console.error(`Redis EXISTS error for key ${key}:`, error);
    return false;
  }
};

/**
 * Set expiration on existing key
 */
const expire = async (key, seconds) => {
  if (!redisClient) return false;
  try {
    await redisClient.expire(key, seconds);
    return true;
  } catch (error) {
    console.error(`Redis EXPIRE error for key ${key}:`, error);
    return false;
  }
};

/**
 * Increment value (useful for rate limiting)
 */
const incr = async (key) => {
  if (!redisClient) return null;
  try {
    return await redisClient.incr(key);
  } catch (error) {
    console.error(`Redis INCR error for key ${key}:`, error);
    return null;
  }
};

/**
 * Close Redis connection
 */
const close = async () => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
};

module.exports = {
  initRedis,
  get,
  set,
  del,
  exists,
  expire,
  incr,
  close
};

import client from "../config/redis.db.js";


class RedisCache {
  constructor() {
    this.client = client;
  }

  async set(key, value, expireSeconds = 3600) {
    try {
      await this.client.set(key, JSON.stringify(value), {
        EX: expireSeconds
      });
      return true;
    } catch (error) {
      console.error('Redis set error:', error);
      return false;
    }
  }

  async get(key) {
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Redis delete error:', error);
      return false;
    }
  }

  // Generate cache key based on function name and parameters
  generateKey(functionName, ...args) {
    return `${functionName}:${args.map(arg => 
      typeof arg === 'string' ? arg : JSON.stringify(arg)
    ).join(':')}`;
  }
}

export const redisCache = new RedisCache();
#!/usr/bin/node

const { resolve } = require('mongodb/lib/core/topologies/read_preference');
const redis = require('redis');

class RedisClient {
	constructor() {
		this.client = redis.createClient();
		this.client.on('error', (error) => {
			console.error(`Redis client not connected to the server!. ${error.message}`);
		})
		this.client.on('connect', () => {
			console.log('Redis client connected to the server.');
		});
	}
  isAlive() {
    return this.client.connected;
  }
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (error, value) => {
        if(error) {reject(error); }
        else {resolve(value); }
      });
    });
  }

  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, 'EX', duration, (error, reply) => {
        if (error) {reject(error); }
        else {resolve(reply); };
      });
    });
  }

  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (error, reply) => {
        if(error) {reject(error);}
        else {resolve(reply);}
      });
    });
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;

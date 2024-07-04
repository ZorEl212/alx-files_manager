#!/usr/bin/node

const { MongoClient } = require('mongodb');

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || '27017';
const url = `mongodb://${host}:${port}`;

class DBClient {
	constructor() {
		this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    this.database = null;
	}

  async connect() {
    await this.client.connect(err => {
      if(err) {console.error(`MongoDB connection error!: ${err.message}`)};
    })
    this.database = this.client.db(process.env.DB_DATABASE || 'files_manager')
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    const userCollection = this.database.collection('users');
    return await userCollection.countDocuments();
  }

  async nbFiles() {
    const filesCollection = this.database.collection('files');
    return await filesCollection.countDocuments();
  }
}

const dbClient = new DBClient();
dbClient.connect();
module.exports = dbClient;

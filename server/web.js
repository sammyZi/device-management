// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const https = require('https');
const config = require('./config');  // Importing config file
const app = express();

// SSL certificate options
const options = {
  key: fs.readFileSync('./key/key.pem'),
  cert: fs.readFileSync('./key/cert.pem'),
};

// Use middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Expose the config to the client
app.get('/config', (req, res) => {
  res.json(config.server); // Send the server configuration as JSON
});

// MongoDB connection setup
const mongoURI = 'mongodb://127.0.0.1:27017/metricsdb';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('MongoDB connected successfully');
});

// Get all collection names
app.get('/getCollections', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections fetched: ', collections); // Debugging log
    const collectionNames = collections.map((collection) => collection.name);
    res.json(collectionNames);
  } catch (error) {
    console.error('Error fetching collections:', error); // Debugging log
    res.status(500).send('Error fetching collections');
  }
});

// Fetch data from the selected collection
app.get('/fetchData', async (req, res) => {
  const { collection } = req.query;

  if (!collection) {
    return res.status(400).send('Collection name is required');
  }

  try {
    const data = await mongoose.connection.db.collection(collection).find({}).toArray();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error); // Debugging log
    res.status(500).send('Error fetching data');
  }
});

// Start the server with HTTPS using the config values
const { port, ip } = config.server;
https.createServer(options, app).listen(port, ip, () => {
  console.log(`Server is running on https://${ip}:${port}`);
});

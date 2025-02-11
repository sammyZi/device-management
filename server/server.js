const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
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

// Define the schema to store all metrics
const metricsSchema = new mongoose.Schema({
  Username: { type: String, required: true, unique: true },
  CPUUsage: { type: mongoose.Schema.Types.Mixed, required: true },
  MemoryUsage: {
    TotalMemory: { type: String, required: true },
    AvailableMemory: { type: String, required: true },
    MemoryUsagePercent: { type: Number, required: true },
  },
  NetworkDataUsage: {
    SentBytes: { type: String, required: true },
    ReceivedBytes: { type: String, required: true },
  },
  DiskUsage: { type: mongoose.Schema.Types.Mixed, required: true },
  FirewallStatus: { type: String, required: true },
  BatteryDetails: {
    Percentage: { type: String, required: true },
    PluggedIn: { type: Boolean, required: true },
    TimeLeft: { type: String, required: true },
  },
  TopProcesses: [
    {
      PID: { type: Number },
      Name: { type: String },
      CPUPercent: { type: Number },
      Memory: { type: String },
    },
  ],
  timestamp: { type: Date, default: Date.now },
});

// Dynamic model creation based on username
function getMetricsModel(username) {
  return mongoose.model(`${username}_metrics`, metricsSchema, `${username}_metrics`);
}

// Route to handle real-time metric data
app.post('/api/device-info', async (req, res) => {
  try {
    const metricsData = req.body;

    if (!metricsData.Username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    console.log(`Received real-time metrics for user: ${metricsData.Username}`);

    // Dynamically get the model for the user
    const Metrics = getMetricsModel(metricsData.Username);

    // Save or update real-time metrics for the user
    await Metrics.findOneAndUpdate(
      { Username: metricsData.Username }, // Find by Username
      metricsData, // Replace existing data
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ message: 'Metrics updated successfully' });
  } catch (error) {
    console.error('Error saving metrics:', error);
    res.status(500).json({ error: 'Failed to save metrics' });
  }
});

// HTTPS server configuration
const options = {
  key: fs.readFileSync('./key/key.pem'),
  cert: fs.readFileSync('./key/cert.pem'),
};

https.createServer(options, app).listen(3000, () => {
  console.log('Secure server running on port 3000');
});

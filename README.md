# Real-Time System Metrics Collection Script

This script collects system metrics such as CPU usage, memory usage, network data usage, disk usage, firewall status, top processes, and battery details. It then sends this data securely to a server.

## Requirements

The following Python packages are required to run the script:

- `psutil` - For system and process information.
- `requests` - For sending HTTP requests to the server.
- `getpass` - For retrieving the username of the current user (standard Python library, no installation needed).
- `shutil` - For file and disk operations (standard Python library, no installation needed).
- `subprocess` - For executing system commands (standard Python library, no installation needed).
- `os` - For interacting with the operating system (standard Python library, no installation needed).
- `json` - For working with JSON data (standard Python library, no installation needed).
- `time` - For handling timing operations (standard Python library, no installation needed).

## Installation

To install the required dependencies, you can use `pip`. Run the following commands:

```bash
pip install psutil
pip install requests
```
---

 ## Server Configuration
The script uses a configuration file named config.json. You can specify the following values:

SERVER_URL: The URL of the server where data should be sent.
DATA_INTERVAL_SECONDS: The time interval (in seconds) between each data collection.
By default, the script will use the following configuration:
```bash
{
  "SERVER_URL": "https://localhost:3000/api/device-info",
  "DATA_INTERVAL_SECONDS": 15
}
```
# Configuration of Backend 

This is a Node.js server that receives and stores real-time device metrics (such as CPU, memory usage, network data, disk usage, firewall status, and battery details) into a MongoDB database. The server is built using `Express`, `Mongoose`, and supports HTTPS.

## Features

- Store device metrics in MongoDB for each user.
- Support for multiple users with dynamically created models.
- Real-time data handling via a POST request to `/api/device-info`.
- Serve data from MongoDB collections through API endpoints.
- SSL-secured HTTPS server.

## Setup

### Prerequisites

- Node.js installed on your machine.
- MongoDB running on `localhost` at port `27017`.
- SSL certificates (key.pem and cert.pem) for HTTPS.

### Installation

1. Clone or download the repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Run `npm install` to install all dependencies.
4. Start your MongoDB server if it's not running already.

### Running the Server

1. Ensure MongoDB is running locally on port 27017.
2. Run the following command to start the server:

```bash
node server.js
```
This will start the server on https://localhost:3000 with SSL encryption.

API Endpoints
POST /api/device-info: Receive real-time device metrics (CPU, memory, network data, etc.) and store them in MongoDB.

Request Body:
```bash {
  "Username": "user123",
  "CPUUsage": {...},
  "MemoryUsage": {...},
  "NetworkDataUsage": {...},
  "DiskUsage": {...},
  "FirewallStatus": "active",
  "BatteryDetails": {...},
  "TopProcesses": [...],
  "timestamp": "2025-02-11T12:00:00Z"
}
```
Response:
```bash
{ "message": "Metrics updated successfully" }
GET /getCollections: Retrieve a list of all collection names in the MongoDB database.
```
Response:
```bash
["user123_metrics", "user456_metrics", ...]
GET /fetchData: Fetch data from a specified MongoDB collection.
```
Query Parameter: collection (e.g., ?collection=user123_metrics).
Response:
```bash
[{...}, {...}, ...]
```
Configuration for web server 
The web server server configuration (like port and IP) is stored in the config.js file.

SSL Configuration
The server uses SSL certificates (key.pem and cert.pem) for secure communication. These should be placed in the key/ folder inside the project directory.

# System Metrics Collection Script

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

Configuration
The script uses a configuration file named config.json. You can specify the following values:

SERVER_URL: The URL of the server where data should be sent.
DATA_INTERVAL_SECONDS: The time interval (in seconds) between each data collection.
By default, the script will use the following configuration:
{
  "SERVER_URL": "https://localhost:3000/api/device-info",
  "DATA_INTERVAL_SECONDS": 15
}


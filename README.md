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


import psutil
import platform
import requests
import time
import json
import getpass
import shutil
import subprocess
import os

def load_config():
    config_file_path = os.path.join(os.getcwd(), 'config.json')
    if os.path.exists(config_file_path):
        with open(config_file_path, 'r') as f:
            config = json.load(f)
        return config
    else:
        print("Config file not found, using default values.")
        return {
            "SERVER_URL": "https://localhost:3000/api/device-info",
            "DATA_INTERVAL_SECONDS": 15
        }

# Load config settings
config = load_config()
SERVER_URL = config["SERVER_URL"]
DATA_INTERVAL_SECONDS = config["DATA_INTERVAL_SECONDS"]

def format_bytes(size: int) -> str:
    sizes = ["B", "KB", "MB", "GB", "TB"]
    order = 0
    size_float = float(size)
    while size_float >= 1024 and order < len(sizes) - 1:
        order += 1
        size_float /= 1024
    return f"{size_float:.2f} {sizes[order]}"


def get_network_data_usage():
    net_io = psutil.net_io_counters()
    return {
        "SentBytes": format_bytes(net_io.bytes_sent),
        "ReceivedBytes": format_bytes(net_io.bytes_recv)
    }


def get_memory_usage():
    memory = psutil.virtual_memory()
    return {
        "TotalMemory": format_bytes(memory.total),
        "AvailableMemory": format_bytes(memory.available),
        "MemoryUsagePercent": memory.percent
    }


def get_cpu_usage():
    cpu_info = {
        "Utilization": f"{psutil.cpu_percent(interval=1)}%",
        "Speed": f"{psutil.cpu_freq().current:.2f} GHz" if psutil.cpu_freq() else "N/A",
        "Up Time": time.strftime("%H:%M:%S", time.gmtime(time.time() - psutil.boot_time())),
        "Processes": len(psutil.pids()),
        "Threads": sum(proc.num_threads() for proc in psutil.process_iter(attrs=["num_threads"])),
    }
    return cpu_info


def get_disk_usage_per_partition():
    partitions = psutil.disk_partitions()
    disk_usage = {}
    for partition in partitions:
        try:
            usage = psutil.disk_usage(partition.mountpoint)
            disk_usage[partition.device] = {
                "Total": format_bytes(usage.total),
                "Used": format_bytes(usage.used),
                "Free": format_bytes(usage.free),
                "UsagePercent": usage.percent
            }
        except PermissionError:
            continue
    return disk_usage


def get_firewall_status():
    try:
        result = subprocess.run(
            ["netsh", "advfirewall", "show", "allprofiles"],
            capture_output=True, text=True
        )

        if any("State" in line and "ON" in line.upper() for line in result.stdout.splitlines()):
            return "Active"
        return "Inactive"
    except Exception:
        return "Error"


def get_top_processes():
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_info']):
        processes.append({
            "PID": proc.info["pid"],
            "Name": proc.info["name"],
            "CPU%": proc.info["cpu_percent"],
            "Memory": format_bytes(proc.info["memory_info"].rss)
        })
    return sorted(processes, key=lambda x: x["CPU%"], reverse=True)[:5]


def get_battery_details():
    battery = psutil.sensors_battery()
    if battery:
        return {
            "Percentage": f"{battery.percent}%",
            "PluggedIn": battery.power_plugged,
            "TimeLeft": f"{battery.secsleft // 3600}h {(battery.secsleft % 3600) // 60}m" if battery.secsleft != psutil.POWER_TIME_UNLIMITED else "Unlimited"
        }
    return {"Status": "No battery detected"}


def collect_metrics():
    system_metrics = {
        "Username": getpass.getuser(),
        "CPUUsage": get_cpu_usage(),
        "MemoryUsage": get_memory_usage(),
        "NetworkDataUsage": get_network_data_usage(),
        "DiskUsage": get_disk_usage_per_partition(),
        "FirewallStatus": get_firewall_status(),
        "TopProcesses": get_top_processes(),
        "BatteryDetails": get_battery_details()
    }
    return system_metrics


def send_data_to_server(metrics):
    try:
        headers = {'Content-Type': 'application/json'}
        json_payload = json.dumps(metrics)

        response = requests.post(
            SERVER_URL, data=json_payload, headers=headers, verify=False
        )

        if response.status_code in [200, 201]:
            print("Data sent successfully!")
        else:
            print(f"Failed to send data, HTTP status code: {response.status_code}")
    except Exception as e:
        print(f"Error sending data to server: {e}")


def main():
    print("Starting continuous system metrics collection...")

    while True:
        metrics = collect_metrics()
        #print("Metrics collected successfully:\n", json.dumps(metrics, indent=4)) remove comment if you want to see raw data in cmd

        print("Sending data securely to the server...")
        send_data_to_server(metrics)

        time.sleep(DATA_INTERVAL_SECONDS)


if __name__ == "__main__":
    main()

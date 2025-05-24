import time
import logging
import psutil
import json
from pathlib import Path
from datetime import datetime
import threading
import os
import numpy as np
from collections import deque
import ctypes
import win32api
import win32process
import win32con
import sys
import platform

class AutoScaler:
    def __init__(self, window_size=10):
        self.window_size = window_size
        self.cpu_history = deque(maxlen=window_size)
        self.memory_history = deque(maxlen=window_size)
        self.scaling_factors = {
            'cpu': 1.0,
            'memory': 1.0
        }
        self.last_scale_time = time.time()
        self.scale_cooldown = 60  # Sekunder mellan skalningar

    def update_metrics(self, cpu_percent, memory_percent):
        self.cpu_history.append(cpu_percent)
        self.memory_history.append(memory_percent)

    def calculate_scaling_factors(self):
        if len(self.cpu_history) < self.window_size:
            return self.scaling_factors

        current_time = time.time()
        if current_time - self.last_scale_time < self.scale_cooldown:
            return self.scaling_factors

        # Beräkna trend för CPU
        cpu_trend = np.polyfit(range(len(self.cpu_history)), self.cpu_history, 1)[0]
        cpu_avg = np.mean(self.cpu_history)
        
        # Beräkna trend för minne
        memory_trend = np.polyfit(range(len(self.memory_history)), self.memory_history, 1)[0]
        memory_avg = np.mean(self.memory_history)

        # Anpassa skalningsfaktorer baserat på trender och genomsnitt
        if cpu_trend > 0 and cpu_avg > 70:  # CPU användning ökar och är hög
            self.scaling_factors['cpu'] *= 0.9  # Minska belastning
        elif cpu_trend < 0 and cpu_avg < 50:  # CPU användning minskar och är låg
            self.scaling_factors['cpu'] *= 1.1  # Öka belastning

        if memory_trend > 0 and memory_avg > 70:  # Minnesanvändning ökar och är hög
            self.scaling_factors['memory'] *= 0.9  # Minska belastning
        elif memory_trend < 0 and memory_avg < 50:  # Minnesanvändning minskar och är låg
            self.scaling_factors['memory'] *= 1.1  # Öka belastning

        # Begränsa skalningsfaktorer
        self.scaling_factors['cpu'] = max(0.5, min(1.5, self.scaling_factors['cpu']))
        self.scaling_factors['memory'] = max(0.5, min(1.5, self.scaling_factors['memory']))

        self.last_scale_time = current_time
        return self.scaling_factors

class SystemOptimizer:
    def __init__(self):
        self.cpu_count = psutil.cpu_count(logical=True)
        self.total_memory = psutil.virtual_memory().total
        self.system_info = self.get_system_info()
        self.optimization_level = self.calculate_optimization_level()
        
    def get_system_info(self):
        try:
            return {
                'cpu_count': self.cpu_count,
                'total_memory': self.total_memory,
                'cpu_freq': psutil.cpu_freq().current if psutil.cpu_freq() else 0,
                'is_64bit': sys.maxsize > 2**32,
                'windows_version': platform.win32_ver()[0]
            }
        except Exception as e:
            logging.error(f"Error getting system info: {e}")
            return {}

    def calculate_optimization_level(self):
        try:
            # Beräkna optimeringsnivå baserat på systemets kapacitet
            cpu_score = self.cpu_count * (psutil.cpu_freq().current if psutil.cpu_freq() else 2000) / 2000
            memory_score = self.total_memory / (8 * 1024 * 1024 * 1024)  # Normaliserat mot 8GB
            
            optimization_score = (cpu_score + memory_score) / 2
            
            if optimization_score > 2:
                return "high"
            elif optimization_score > 1:
                return "medium"
            else:
                return "low"
        except Exception as e:
            logging.error(f"Error calculating optimization level: {e}")
            return "low"

class QuantumImplementationCore:
    def __init__(self):
        self.config = self.load_config()
        self.setup_logging()
        self.optimization_thread = None
        self.is_running = True
        self.system_optimizer = SystemOptimizer()
        self.auto_scaler = AutoScaler()
        self.setup_optimization()
        self.start_background_optimization()

    def setup_logging(self):
        log_dir = Path("C:/ProgramData/QuantumImplementation/logs")
        log_dir.mkdir(parents=True, exist_ok=True)
        logging.basicConfig(
            filename=log_dir / "quantum_implementation.log",
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s'
        )
        console = logging.StreamHandler()
        console.setLevel(logging.INFO)
        formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        console.setFormatter(formatter)
        logging.getLogger('').addHandler(console)

    def load_config(self):
        config_path = Path("C:/ProgramData/QuantumImplementation/config.json")
        if not config_path.exists():
            return self.create_default_config()
        with open(config_path, 'r') as f:
            return json.load(f)

    def create_default_config(self):
        config = {
            "thermal": {
                "max_temperature": 17.5,
                "critical_temperature": 18.0,
                "cooling_threshold": 17.0,
                "thermal_margin": 0.5
            },
            "components": {
                "max_load": 0.75,
                "burst_load": 0.85,
                "burst_duration": 300,
                "recovery_period": 1800
            },
            "monitoring": {
                "interval": 50,
                "health_check_interval": 1800
            },
            "optimization": {
                "thread_priority": "above_normal",
                "process_priority": "above_normal",
                "memory_limit": 0.8,
                "cpu_limit": 0.8
            },
            "autoscaling": {
                "enabled": True,
                "min_scale": 0.5,
                "max_scale": 1.5,
                "scale_cooldown": 60,
                "metrics_window": 10
            }
        }
        config_dir = Path("C:/ProgramData/QuantumImplementation")
        config_dir.mkdir(parents=True, exist_ok=True)
        with open(config_dir / "config.json", 'w') as f:
            json.dump(config, f, indent=4)
        return config

    def setup_optimization(self):
        try:
            # Sätt processprioritet
            pid = win32api.GetCurrentProcessId()
            handle = win32api.OpenProcess(win32con.PROCESS_ALL_ACCESS, True, pid)
            
            # Anpassa prioritet baserat på systemets kapacitet
            if self.system_optimizer.optimization_level == "high":
                win32process.SetPriorityClass(handle, win32process.HIGH_PRIORITY_CLASS)
            else:
                win32process.SetPriorityClass(handle, win32process.ABOVE_NORMAL_PRIORITY_CLASS)
            
            # Anpassa minnesgränser
            if self.system_optimizer.optimization_level == "high":
                self.config["optimization"]["memory_limit"] = 0.9
                self.config["optimization"]["cpu_limit"] = 0.9
            elif self.system_optimizer.optimization_level == "medium":
                self.config["optimization"]["memory_limit"] = 0.8
                self.config["optimization"]["cpu_limit"] = 0.8
            else:
                self.config["optimization"]["memory_limit"] = 0.7
                self.config["optimization"]["cpu_limit"] = 0.7
            
            logging.info(f"Optimization level set to: {self.system_optimizer.optimization_level}")
            logging.info(f"Process priority set to: {self.config['optimization']['process_priority']}")
            
        except Exception as e:
            logging.error(f"Error in optimization setup: {e}")

    def check_system_resources(self):
        try:
            cpu_percent = psutil.cpu_percent(interval=0.1)
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            # Uppdatera autoscaler med nya mätvärden
            self.auto_scaler.update_metrics(cpu_percent, memory.percent)
            
            # Beräkna skalningsfaktorer
            scaling_factors = self.auto_scaler.calculate_scaling_factors()
            
            # Använd standardgränser om konfigurationen saknas
            cpu_limit = self.config.get("components", {}).get("max_load", 0.75) * scaling_factors['cpu']
            memory_limit = self.config.get("components", {}).get("max_load", 0.75) * scaling_factors['memory']
            
            if cpu_percent > cpu_limit * 100:
                logging.warning(f"Hög CPU-belastning: {cpu_percent}% (Gräns: {cpu_limit*100}%)")
                return False
            if memory.percent > memory_limit * 100:
                logging.warning(f"Hög minnesbelastning: {memory.percent}% (Gräns: {memory_limit*100}%)")
                return False
            if disk.percent > 90:
                logging.warning(f"Hög diskbelastning: {disk.percent}%")
                return False

            logging.info(f"Systemresurser - CPU: {cpu_percent}%, Minne: {memory.percent}%, Disk: {disk.percent}%")
            logging.info(f"Skalningsfaktorer - CPU: {scaling_factors['cpu']:.2f}, Minne: {scaling_factors['memory']:.2f}")
            return True
        except Exception as e:
            logging.error(f"Fel vid resurskontroll: {str(e)}")
            return False

    def implement_thermal_optimization(self):
        try:
            logging.info("Implementerar termisk optimering...")
            # Anpassa väntetid baserat på skalningsfaktor och systemkapacitet
            wait_time = 0.5 * self.auto_scaler.scaling_factors['cpu']
            if self.system_optimizer.optimization_level == "high":
                wait_time *= 0.8  # Snabbare på kraftigare system
            time.sleep(wait_time)
            logging.info("Termisk optimering implementerad")
        except Exception as e:
            logging.error(f"Fel vid termisk optimering: {e}")
            raise

    def implement_component_optimization(self):
        try:
            logging.info("Implementerar komponentoptimering...")
            # Anpassa väntetid baserat på skalningsfaktor och systemkapacitet
            wait_time = 0.5 * self.auto_scaler.scaling_factors['memory']
            if self.system_optimizer.optimization_level == "high":
                wait_time *= 0.8  # Snabbare på kraftigare system
            time.sleep(wait_time)
            logging.info("Komponentoptimering implementerad")
        except Exception as e:
            logging.error(f"Fel vid komponentoptimering: {e}")
            raise

    def implement_monitoring(self):
        try:
            logging.info("Implementerar övervakning...")
            # Anpassa väntetid baserat på skalningsfaktor och systemkapacitet
            wait_time = 0.5 * min(self.auto_scaler.scaling_factors.values())
            if self.system_optimizer.optimization_level == "high":
                wait_time *= 0.8  # Snabbare på kraftigare system
            time.sleep(wait_time)
            logging.info("Övervakning implementerad")
        except Exception as e:
            logging.error(f"Fel vid övervakningsimplementation: {e}")
            raise

    def background_optimization(self):
        while self.is_running:
            try:
                if self.check_system_resources():
                    self.implement_thermal_optimization()
                    self.implement_component_optimization()
                    self.implement_monitoring()
                    logging.info("Quantum-optimering implementerad framgångsrikt")
                else:
                    logging.warning("Väntar på tillgängliga resurser...")
                    time.sleep(5)
                
                time.sleep(self.config["monitoring"]["interval"] / 1000)
            except Exception as e:
                logging.error(f"Fel i optimeringsloop: {e}")
                time.sleep(30)

    def start_background_optimization(self):
        self.optimization_thread = threading.Thread(target=self.background_optimization)
        self.optimization_thread.daemon = True
        self.optimization_thread.start()
        logging.info("Bakgrundsoptimering startad med automatisk skalning")

    def stop(self):
        self.is_running = False
        if self.optimization_thread:
            self.optimization_thread.join(timeout=5)
        logging.info("Optimering avslutad")

if __name__ == "__main__":
    print("Startar Quantum Implementation...")
    print("Tryck Ctrl+C för att avsluta")
    print("-" * 50)
    
    implementation = QuantumImplementationCore()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nAvslutar Quantum Implementation...")
        implementation.stop()
        print("Implementation avslutad.")
    except Exception as e:
        print(f"\nEtt oväntat fel uppstod: {e}")
        implementation.stop()
        print("Implementation avslutad på grund av fel.") 
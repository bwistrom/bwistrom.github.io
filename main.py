from quantum_state_core import QuantumStateManager, StateType
from quantum_network import QuantumNetworkRouter, NetworkNodeType, RoutingProtocol
from quantum_monitoring import EnhancedMonitor
from quantum_security import QuantumEncryption, SecurityLevel
import logging
import argparse
import sys
import time
from typing import Dict, Any, Optional

class QuantumSystem:
    def __init__(self, num_qubits: int = 1000, presence_key: str = None):
        self.logger = self._setup_logger()
        self.state_manager = QuantumStateManager(num_qubits, presence_key)
        self.network_router = QuantumNetworkRouter()
        self.monitor = EnhancedMonitor()
        self.security = QuantumEncryption()
        
        # Initialize system
        self._initialize_system()
        
    def _setup_logger(self) -> logging.Logger:
        """Setup logging configuration"""
        logger = logging.getLogger('QuantumSystem')
        logger.setLevel(logging.INFO)
        
        # Create handlers
        console_handler = logging.StreamHandler()
        file_handler = logging.FileHandler('quantum_system.log')
        
        # Create formatters
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        console_handler.setFormatter(formatter)
        file_handler.setFormatter(formatter)
        
        # Add handlers
        logger.addHandler(console_handler)
        logger.addHandler(file_handler)
        
        return logger
        
    def _initialize_system(self):
        """Initialize the quantum system"""
        self.logger.info("Initializing quantum system...")
        
        # Start monitoring
        self.monitor.start_monitoring()
        
        # Initialize network nodes
        self._initialize_network()
        
        self.logger.info("Quantum system initialized successfully")
        
    def _initialize_network(self):
        """Initialize the quantum network"""
        # Add source node
        self.network_router.add_node(
            node_id="source",
            node_type=NetworkNodeType.SOURCE,
            position=(0, 0, 0),
            capacity=100,
            quantum_capabilities={"entanglement": 1.0, "processing": 1.0}
        )
        
        # Add router nodes
        for i in range(3):
            self.network_router.add_node(
                node_id=f"router_{i}",
                node_type=NetworkNodeType.ROUTER,
                position=(i+1, 0, 0),
                capacity=50,
                quantum_capabilities={"entanglement": 0.8, "processing": 0.8}
            )
            
        # Add destination node
        self.network_router.add_node(
            node_id="destination",
            node_type=NetworkNodeType.DESTINATION,
            position=(4, 0, 0),
            capacity=100,
            quantum_capabilities={"entanglement": 1.0, "processing": 1.0}
        )
        
        # Connect nodes
        self.network_router.add_connection("source", "router_0")
        for i in range(2):
            self.network_router.add_connection(f"router_{i}", f"router_{i+1}")
        self.network_router.add_connection("router_2", "destination")
        
    def prepare_quantum_state(self, state_type: StateType) -> str:
        """Prepare a quantum state"""
        self.logger.info(f"Preparing {state_type.value} quantum state")
        return self.state_manager.prepare_state(state_type)
        
    def find_quantum_route(self, 
                         source_id: str,
                         destination_id: str,
                         protocol: RoutingProtocol = RoutingProtocol.QUANTUM_AWARE) -> Dict[str, Any]:
        """Find a quantum route between nodes"""
        self.logger.info(f"Finding quantum route from {source_id} to {destination_id}")
        route_info = self.network_router.find_route(source_id, destination_id, protocol)
        return route_info.__dict__
        
    def get_system_status(self) -> Dict[str, Any]:
        """Get system status"""
        monitoring_report = self.monitor.get_monitoring_report()
        security_report = self.security.get_security_report()
        network_metrics = self.network_router.calculate_network_metrics()
        
        return {
            'monitoring': monitoring_report,
            'security': security_report,
            'network': network_metrics.__dict__
        }
        
    def cleanup(self):
        """Clean up system resources"""
        self.logger.info("Cleaning up quantum system...")
        
        # Stop monitoring
        self.monitor.stop_monitoring()
        
        # Clean up components
        self.state_manager.cleanup()
        self.network_router.cleanup()
        self.monitor.cleanup()
        self.security.cleanup()
        
        self.logger.info("Quantum system cleaned up successfully")

def main():
    parser = argparse.ArgumentParser(description='Quantum System')
    parser.add_argument('--qubits', type=int, default=1000, help='Number of qubits')
    parser.add_argument('--presence-key', type=str, help='Presence key for security')
    args = parser.parse_args()
    
    try:
        # Initialize system
        system = QuantumSystem(args.qubits, args.presence_key)
        
        # Example usage
        state_id = system.prepare_quantum_state(StateType.ENTANGLED)
        print(f"Prepared entangled state with ID: {state_id}")
        
        route = system.find_quantum_route("source", "destination")
        print(f"Found quantum route: {route}")
        
        status = system.get_system_status()
        print(f"System status: {status}")
        
        # Keep the system running
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\nShutting down quantum system...")
    except Exception as e:
        print(f"Error: {str(e)}")
    finally:
        if 'system' in locals():
            system.cleanup()

if __name__ == "__main__":
    main() 
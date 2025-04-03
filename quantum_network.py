from typing import List, Tuple, Dict, Optional, Set, Union, Any
from dataclasses import dataclass
from enum import Enum
import numpy as np
import networkx as nx
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import time
import heapq

class NetworkNodeType(Enum):
    """Types of network nodes"""
    SOURCE = "source"
    ROUTER = "router"
    DESTINATION = "destination"
    REPEATER = "repeater"
    QUANTUM_PROCESSOR = "quantum_processor"

class RoutingProtocol(Enum):
    """Types of routing protocols"""
    SHORTEST_PATH = "shortest_path"
    FIDELITY_BASED = "fidelity_based"
    LOAD_BALANCED = "load_balanced"
    ADAPTIVE = "adaptive"
    QUANTUM_AWARE = "quantum_aware"
    MULTI_OBJECTIVE = "multi_objective"
    DYNAMIC = "dynamic"
    QUANTUM_OPTIMIZED = "quantum_optimized"
    HYBRID = "hybrid"
    PREDICTIVE = "predictive"

@dataclass
class NetworkMetrics:
    """Comprehensive network metrics"""
    fidelity: float
    latency: float
    throughput: float
    error_rate: float
    entanglement_quality: float
    coherence_time: float
    quantum_bandwidth: float
    node_utilization: float
    network_resilience: float
    quantum_efficiency: float
    congestion_level: float
    energy_efficiency: float
    scalability_score: float
    fault_tolerance: float

@dataclass
class NetworkNode:
    """Information about a network node"""
    id: str
    type: NetworkNodeType
    position: Tuple[float, float, float]
    capacity: int
    current_load: int
    error_rate: float
    coherence_time: float
    connected_nodes: Set[str]
    quantum_capabilities: Dict[str, float]
    processing_power: float
    memory_capacity: int

@dataclass
class RouteInfo:
    """Information about a quantum route"""
    source_id: str
    destination_id: str
    path: List[str]
    fidelity: float
    latency: float
    timestamp: float
    success: bool

class QuantumNetworkRouter:
    def __init__(self):
        self.nodes: Dict[str, NetworkNode] = {}
        self.connections: Dict[Tuple[str, str], Dict[str, float]] = {}
        self.routing_history: List[RouteInfo] = []
        self.network_graph = nx.Graph()
        self.metrics_history: List[NetworkMetrics] = []
        
    def add_node(self, 
                node_id: str,
                node_type: NetworkNodeType,
                position: Tuple[float, float, float],
                capacity: int = 10,
                error_rate: float = 0.01,
                coherence_time: float = 1.0,
                quantum_capabilities: Dict[str, float] = None,
                processing_power: float = 1.0,
                memory_capacity: int = 100):
        """Add a node to the quantum network"""
        if quantum_capabilities is None:
            quantum_capabilities = {}
            
        node = NetworkNode(
            id=node_id,
            type=node_type,
            position=position,
            capacity=capacity,
            current_load=0,
            error_rate=error_rate,
            coherence_time=coherence_time,
            connected_nodes=set(),
            quantum_capabilities=quantum_capabilities,
            processing_power=processing_power,
            memory_capacity=memory_capacity
        )
        
        self.nodes[node_id] = node
        self.network_graph.add_node(node_id, **node.__dict__)
        
    def add_connection(self, 
                      node1_id: str,
                      node2_id: str,
                      fidelity: float = 0.95,
                      latency: float = 0.1):
        """Add a connection between two nodes"""
        if node1_id not in self.nodes or node2_id not in self.nodes:
            raise ValueError("One or both nodes not found")
            
        self.connections[(node1_id, node2_id)] = {
            'fidelity': fidelity,
            'latency': latency
        }
        
        self.nodes[node1_id].connected_nodes.add(node2_id)
        self.nodes[node2_id].connected_nodes.add(node1_id)
        
        self.network_graph.add_edge(node1_id, node2_id, 
                                  fidelity=fidelity,
                                  latency=latency)
        
    def find_route(self,
                  source_id: str,
                  destination_id: str,
                  protocol: RoutingProtocol = RoutingProtocol.QUANTUM_AWARE) -> RouteInfo:
        """Find a route between two nodes"""
        if source_id not in self.nodes or destination_id not in self.nodes:
            raise ValueError("Source or destination node not found")
            
        if protocol == RoutingProtocol.SHORTEST_PATH:
            path = self._find_shortest_path(source_id, destination_id)
        elif protocol == RoutingProtocol.FIDELITY_BASED:
            path = self._find_fidelity_based_path(source_id, destination_id)
        elif protocol == RoutingProtocol.QUANTUM_AWARE:
            path = self._find_quantum_optimized_path(source_id, destination_id)
        else:
            path = self._find_hybrid_path(source_id, destination_id)
            
        if not path:
            return RouteInfo(
                source_id=source_id,
                destination_id=destination_id,
                path=[],
                fidelity=0.0,
                latency=float('inf'),
                timestamp=time.time(),
                success=False
            )
            
        fidelity = self._calculate_path_fidelity(path)
        latency = self._calculate_path_latency(path)
        
        route_info = RouteInfo(
            source_id=source_id,
            destination_id=destination_id,
            path=path,
            fidelity=fidelity,
            latency=latency,
            timestamp=time.time(),
            success=True
        )
        
        self.routing_history.append(route_info)
        return route_info
        
    def _find_shortest_path(self, source_id: str, destination_id: str) -> List[str]:
        """Find the shortest path between two nodes"""
        try:
            return nx.shortest_path(self.network_graph, source_id, destination_id)
        except nx.NetworkXNoPath:
            return []
            
    def _find_fidelity_based_path(self, source_id: str, destination_id: str) -> List[str]:
        """Find the path with highest fidelity"""
        def fidelity_weight(u, v, d):
            return -d['fidelity']  # Negative because we want to maximize fidelity
            
        try:
            return nx.shortest_path(self.network_graph, source_id, destination_id, weight=fidelity_weight)
        except nx.NetworkXNoPath:
            return []
            
    def _find_quantum_optimized_path(self, source_id: str, destination_id: str) -> List[str]:
        """Find a path optimized for quantum operations"""
        def quantum_weight(u, v, d):
            # Combine fidelity, latency, and quantum capabilities
            fidelity = d['fidelity']
            latency = d['latency']
            node1 = self.nodes[u]
            node2 = self.nodes[v]
            
            quantum_score = (node1.quantum_capabilities.get('entanglement', 0) +
                           node2.quantum_capabilities.get('entanglement', 0)) / 2
                           
            return (1 - fidelity) + latency + (1 - quantum_score)
            
        try:
            return nx.shortest_path(self.network_graph, source_id, destination_id, weight=quantum_weight)
        except nx.NetworkXNoPath:
            return []
            
    def _find_hybrid_path(self, source_id: str, destination_id: str) -> List[str]:
        """Find a path using hybrid optimization"""
        def hybrid_weight(u, v, d):
            # Combine multiple metrics
            fidelity = d['fidelity']
            latency = d['latency']
            node1 = self.nodes[u]
            node2 = self.nodes[v]
            
            load_factor = (node1.current_load / node1.capacity +
                         node2.current_load / node2.capacity) / 2
                         
            error_factor = (node1.error_rate + node2.error_rate) / 2
            
            return (1 - fidelity) + latency + load_factor + error_factor
            
        try:
            return nx.shortest_path(self.network_graph, source_id, destination_id, weight=hybrid_weight)
        except nx.NetworkXNoPath:
            return []
            
    def _calculate_path_fidelity(self, path: List[str]) -> float:
        """Calculate the fidelity of a path"""
        if len(path) < 2:
            return 0.0
            
        fidelity = 1.0
        for i in range(len(path) - 1):
            node1, node2 = path[i], path[i + 1]
            edge_data = self.network_graph.get_edge_data(node1, node2)
            fidelity *= edge_data['fidelity']
            
        return fidelity
        
    def _calculate_path_latency(self, path: List[str]) -> float:
        """Calculate the latency of a path"""
        if len(path) < 2:
            return 0.0
            
        latency = 0.0
        for i in range(len(path) - 1):
            node1, node2 = path[i], path[i + 1]
            edge_data = self.network_graph.get_edge_data(node1, node2)
            latency += edge_data['latency']
            
        return latency
        
    def calculate_network_metrics(self) -> NetworkMetrics:
        """Calculate comprehensive network metrics"""
        if not self.nodes:
            return NetworkMetrics(
                fidelity=0.0,
                latency=0.0,
                throughput=0.0,
                error_rate=0.0,
                entanglement_quality=0.0,
                coherence_time=0.0,
                quantum_bandwidth=0.0,
                node_utilization=0.0,
                network_resilience=0.0,
                quantum_efficiency=0.0,
                congestion_level=0.0,
                energy_efficiency=0.0,
                scalability_score=0.0,
                fault_tolerance=0.0
            )
            
        # Calculate average metrics
        total_fidelity = 0.0
        total_latency = 0.0
        total_error_rate = 0.0
        total_coherence_time = 0.0
        total_utilization = 0.0
        total_quantum_capability = 0.0
        
        for node in self.nodes.values():
            total_error_rate += node.error_rate
            total_coherence_time += node.coherence_time
            total_utilization += node.current_load / node.capacity
            total_quantum_capability += sum(node.quantum_capabilities.values())
            
        for (node1, node2), data in self.connections.items():
            total_fidelity += data['fidelity']
            total_latency += data['latency']
            
        num_connections = len(self.connections)
        num_nodes = len(self.nodes)
        
        metrics = NetworkMetrics(
            fidelity=total_fidelity / num_connections if num_connections > 0 else 0.0,
            latency=total_latency / num_connections if num_connections > 0 else 0.0,
            throughput=num_connections / num_nodes if num_nodes > 0 else 0.0,
            error_rate=total_error_rate / num_nodes if num_nodes > 0 else 0.0,
            entanglement_quality=total_quantum_capability / num_nodes if num_nodes > 0 else 0.0,
            coherence_time=total_coherence_time / num_nodes if num_nodes > 0 else 0.0,
            quantum_bandwidth=num_connections / num_nodes if num_nodes > 0 else 0.0,
            node_utilization=total_utilization / num_nodes if num_nodes > 0 else 0.0,
            network_resilience=1.0 - (total_error_rate / num_nodes) if num_nodes > 0 else 0.0,
            quantum_efficiency=total_quantum_capability / num_nodes if num_nodes > 0 else 0.0,
            congestion_level=total_utilization / num_nodes if num_nodes > 0 else 0.0,
            energy_efficiency=1.0 - (total_utilization / num_nodes) if num_nodes > 0 else 0.0,
            scalability_score=num_connections / (num_nodes * (num_nodes - 1)) if num_nodes > 1 else 0.0,
            fault_tolerance=1.0 - (total_error_rate / num_nodes) if num_nodes > 0 else 0.0
        )
        
        self.metrics_history.append(metrics)
        return metrics
        
    def visualize_network(self, show_metrics: bool = True):
        """Visualize the quantum network"""
        fig = plt.figure(figsize=(12, 8))
        ax = fig.add_subplot(111, projection='3d')
        
        # Plot nodes
        for node_id, node in self.nodes.items():
            x, y, z = node.position
            ax.scatter(x, y, z, c='blue', s=100)
            ax.text(x, y, z, node_id)
            
        # Plot connections
        for (node1_id, node2_id), data in self.connections.items():
            x1, y1, z1 = self.nodes[node1_id].position
            x2, y2, z2 = self.nodes[node2_id].position
            ax.plot([x1, x2], [y1, y2], [z1, z2], 'gray', alpha=0.5)
            
        if show_metrics:
            metrics = self.calculate_network_metrics()
            ax.text2D(0.05, 0.95, f"Fidelity: {metrics.fidelity:.2f}\n"
                                 f"Latency: {metrics.latency:.2f}\n"
                                 f"Error Rate: {metrics.error_rate:.2f}\n"
                                 f"Utilization: {metrics.node_utilization:.2f}",
                     transform=ax.transAxes)
                     
        plt.title("Quantum Network Topology")
        plt.show()
        
    def cleanup(self):
        """Clean up network resources"""
        self.nodes.clear()
        self.connections.clear()
        self.routing_history.clear()
        self.network_graph.clear()
        self.metrics_history.clear() 
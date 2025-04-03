from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
import numpy as np

def create_entangled_state(num_qubits):
    """
    Creates a maximally entangled state (Bell state) for multiple qubits
    """
    qr = QuantumRegister(num_qubits)
    cr = ClassicalRegister(num_qubits)
    circuit = QuantumCircuit(qr, cr)
    
    # Create entanglement
    circuit.h(qr[0])
    for i in range(1, num_qubits):
        circuit.cx(qr[0], qr[i])
    
    return circuit

def create_superposition_state(num_qubits):
    """
    Creates a uniform superposition state
    """
    qr = QuantumRegister(num_qubits)
    cr = ClassicalRegister(num_qubits)
    circuit = QuantumCircuit(qr, cr)
    
    # Apply Hadamard to all qubits
    for i in range(num_qubits):
        circuit.h(qr[i])
    
    return circuit

def create_phase_oracle(target_state):
    """
    Creates a phase oracle for marking a specific state
    """
    num_qubits = len(target_state)
    qr = QuantumRegister(num_qubits)
    cr = ClassicalRegister(num_qubits)
    circuit = QuantumCircuit(qr, cr)
    
    # Apply phase flip to target state
    for i, bit in enumerate(target_state):
        if bit == '1':
            circuit.x(qr[i])
    
    # Apply phase flip
    circuit.z(qr[0])
    
    # Restore state
    for i, bit in enumerate(target_state):
        if bit == '1':
            circuit.x(qr[i])
    
    return circuit

def create_quantum_adder(num_qubits):
    """
    Creates a quantum adder circuit
    """
    qr = QuantumRegister(num_qubits * 2)
    cr = ClassicalRegister(num_qubits * 2)
    circuit = QuantumCircuit(qr, cr)
    
    # Implement quantum adder logic
    for i in range(num_qubits - 1):
        circuit.ccx(qr[i], qr[i + num_qubits], qr[i + num_qubits + 1])
        circuit.cx(qr[i], qr[i + num_qubits])
        circuit.ccx(qr[i], qr[i + num_qubits], qr[i + num_qubits + 1])
    
    return circuit

def create_quantum_multiplier(num_qubits):
    """
    Creates a quantum multiplier circuit
    """
    qr = QuantumRegister(num_qubits * 3)
    cr = ClassicalRegister(num_qubits * 3)
    circuit = QuantumCircuit(qr, cr)
    
    # Implement quantum multiplier logic
    for i in range(num_qubits):
        for j in range(num_qubits):
            circuit.ccx(qr[i], qr[j + num_qubits], qr[i + j + 2 * num_qubits])
    
    return circuit

def create_quantum_phase_estimation_circuit(num_qubits, unitary_operator):
    """
    Creates a quantum phase estimation circuit
    """
    qr = QuantumRegister(num_qubits * 2)
    cr = ClassicalRegister(num_qubits * 2)
    circuit = QuantumCircuit(qr, cr)
    
    # Initialize phase estimation qubits
    for i in range(num_qubits):
        circuit.h(qr[i])
    
    # Apply controlled unitary operations
    for i in range(num_qubits):
        for _ in range(2 ** i):
            circuit.append(unitary_operator, [qr[i + num_qubits]])
    
    return circuit 
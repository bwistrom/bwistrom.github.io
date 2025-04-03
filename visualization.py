from qiskit.visualization import plot_histogram, circuit_drawer
import matplotlib.pyplot as plt
import numpy as np

def plot_circuit(circuit, filename=None):
    """
    Visualizes a quantum circuit
    """
    fig = circuit_drawer(circuit, output='mpl')
    if filename:
        plt.savefig(filename)
    plt.close()

def plot_measurement_results(counts, title="Measurement Results", filename=None):
    """
    Plots measurement results from quantum circuit execution
    """
    fig = plot_histogram(counts, title=title)
    if filename:
        plt.savefig(filename)
    plt.close()

def plot_state_vector(state_vector, title="Quantum State Vector", filename=None):
    """
    Plots the quantum state vector
    """
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.bar(range(len(state_vector)), np.abs(state_vector))
    ax.set_title(title)
    ax.set_xlabel("Basis State")
    ax.set_ylabel("Amplitude")
    if filename:
        plt.savefig(filename)
    plt.close()

def plot_density_matrix(density_matrix, title="Density Matrix", filename=None):
    """
    Plots the density matrix as a heatmap
    """
    fig, ax = plt.subplots(figsize=(8, 8))
    im = ax.imshow(np.abs(density_matrix), cmap='viridis')
    plt.colorbar(im)
    ax.set_title(title)
    if filename:
        plt.savefig(filename)
    plt.close()

def plot_phase_space(phase_space_data, title="Phase Space", filename=None):
    """
    Plots quantum phase space representation
    """
    fig, ax = plt.subplots(figsize=(8, 8))
    ax.scatter(phase_space_data[:, 0], phase_space_data[:, 1], alpha=0.5)
    ax.set_title(title)
    ax.set_xlabel("Position")
    ax.set_ylabel("Momentum")
    if filename:
        plt.savefig(filename)
    plt.close()

def plot_entanglement_entropy(entropy_data, title="Entanglement Entropy", filename=None):
    """
    Plots entanglement entropy across different bipartitions
    """
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.plot(range(len(entropy_data)), entropy_data)
    ax.set_title(title)
    ax.set_xlabel("Bipartition Size")
    ax.set_ylabel("Entanglement Entropy")
    if filename:
        plt.savefig(filename)
    plt.close() 
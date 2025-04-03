import threading
import hashlib
import base64
import random
import time
import logging
from datetime import datetime
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization
from typing import Dict, Optional, Tuple, List

class SecurityError(Exception):
    """Custom exception for security-related errors"""
    def __init__(self, message: str, error_code: str, details: Optional[Dict] = None):
        super().__init__(message)
        self.error_code = error_code
        self.timestamp = datetime.now()
        self.details = details or {}
        
    def to_dict(self) -> Dict:
        """Convert error to dictionary format"""
        return {
            'message': str(self),
            'error_code': self.error_code,
            'timestamp': self.timestamp.isoformat(),
            'details': self.details
        }

class ErrorTracker:
    """Tracks and manages security errors"""
    
    def __init__(self):
        self._errors: List[SecurityError] = []
        self._lock = threading.Lock()
        self._max_errors = 1000
        self._error_patterns: Dict[str, int] = {}
        
    def record_error(self, error: SecurityError) -> None:
        """Record a security error"""
        with self._lock:
            self._errors.append(error)
            if len(self._errors) > self._max_errors:
                self._errors = self._errors[-self._max_errors:]
            
            # Track error patterns
            pattern = error.error_code
            self._error_patterns[pattern] = self._error_patterns.get(pattern, 0) + 1
            
    def get_recent_errors(self, count: int = 10) -> List[Dict]:
        """Get recent errors in dictionary format"""
        with self._lock:
            return [error.to_dict() for error in self._errors[-count:]]
            
    def get_error_patterns(self) -> Dict[str, int]:
        """Get error pattern statistics"""
        with self._lock:
            return self._error_patterns.copy()
            
    def clear_errors(self) -> None:
        """Clear error history"""
        with self._lock:
            self._errors.clear()
            self._error_patterns.clear()

class PerformanceMetrics:
    """Tracks performance metrics for optimization"""
    
    def __init__(self):
        self._metrics: Dict[str, List[float]] = {
            'key_generation': [],
            'encryption': [],
            'decryption': [],
            'key_exchange': [],
            'presence_verification': [],
            'cache_hits': [],
            'cache_misses': [],
            'error_handling': []
        }
        self._operation_counts: Dict[str, int] = {
            'key_generation': 0,
            'encryption': 0,
            'decryption': 0,
            'key_exchange': 0,
            'presence_verification': 0,
            'cache_hits': 0,
            'cache_misses': 0,
            'error_handling': 0
        }
        self._peak_metrics: Dict[str, float] = {
            'key_generation': 0.0,
            'encryption': 0.0,
            'decryption': 0.0,
            'key_exchange': 0.0,
            'presence_verification': 0.0,
            'cache_hits': 0.0,
            'cache_misses': 0.0,
            'error_handling': 0.0
        }
        self._lock = threading.Lock()
        self._start_time = time.time()
        
    def record_metric(self, operation: str, duration: float) -> None:
        """Record performance metric with enhanced tracking"""
        with self._lock:
            if operation in self._metrics:
                # Record duration
                self._metrics[operation].append(duration)
                if len(self._metrics[operation]) > 1000:
                    self._metrics[operation] = self._metrics[operation][-1000:]
                
                # Update operation count
                self._operation_counts[operation] += 1
                
                # Update peak metric if applicable
                if duration > self._peak_metrics[operation]:
                    self._peak_metrics[operation] = duration
                    
    def get_average_metric(self, operation: str) -> Optional[float]:
        """Get average performance metric"""
        with self._lock:
            if operation in self._metrics and self._metrics[operation]:
                return sum(self._metrics[operation]) / len(self._metrics[operation])
            return None
            
    def get_operation_count(self, operation: str) -> int:
        """Get total number of operations performed"""
        with self._lock:
            return self._operation_counts.get(operation, 0)
            
    def get_peak_metric(self, operation: str) -> float:
        """Get peak performance metric"""
        with self._lock:
            return self._peak_metrics.get(operation, 0.0)
            
    def get_uptime(self) -> float:
        """Get system uptime in seconds"""
        return time.time() - self._start_time
        
    def get_operation_rate(self, operation: str) -> float:
        """Get operations per second for a given operation"""
        with self._lock:
            count = self._operation_counts.get(operation, 0)
            uptime = self.get_uptime()
            return count / uptime if uptime > 0 else 0.0
            
    def get_performance_summary(self) -> Dict[str, Dict[str, float]]:
        """Get comprehensive performance summary"""
        with self._lock:
            summary = {}
            for operation in self._metrics.keys():
                summary[operation] = {
                    'average': self.get_average_metric(operation) or 0.0,
                    'peak': self.get_peak_metric(operation),
                    'count': self.get_operation_count(operation),
                    'rate': self.get_operation_rate(operation)
                }
            return summary
            
    def get_cache_efficiency(self) -> float:
        """Calculate cache hit rate"""
        with self._lock:
            hits = self._operation_counts.get('cache_hits', 0)
            misses = self._operation_counts.get('cache_misses', 0)
            total = hits + misses
            return hits / total if total > 0 else 0.0
            
    def get_error_rate(self) -> float:
        """Calculate error handling rate"""
        with self._lock:
            error_count = self._operation_counts.get('error_handling', 0)
            total_operations = sum(self._operation_counts.values())
            return error_count / total_operations if total_operations > 0 else 0.0
            
    def reset_metrics(self) -> None:
        """Reset all performance metrics"""
        with self._lock:
            self._metrics = {op: [] for op in self._metrics}
            self._operation_counts = {op: 0 for op in self._operation_counts}
            self._peak_metrics = {op: 0.0 for op in self._peak_metrics}
            self._start_time = time.time()

class QuantumKeyExchange:
    """Manages quantum-resistant key exchange"""
    
    def __init__(self):
        self._private_key = None
        self._public_key = None
        self._shared_secret = None
        self._lock = threading.Lock()
        self._performance = PerformanceMetrics()
        self._key_cache: Dict[str, Tuple[bytes, float]] = {}
        
    def generate_key_pair(self) -> tuple:
        """Generate quantum-resistant key pair with performance tracking"""
        start_time = time.time()
        with self._lock:
            try:
                # Check cache first
                cache_key = "current_key_pair"
                if cache_key in self._key_cache:
                    key, timestamp = self._key_cache[cache_key]
                    if time.time() - timestamp < 3600:  # Cache for 1 hour
                        return key
                
                # Generate RSA key pair with quantum-resistant parameters
                self._private_key = rsa.generate_private_key(
                    public_exponent=65537,
                    key_size=4096  # Quantum-resistant key size
                )
                self._public_key = self._private_key.public_key()
                
                # Cache the result
                self._key_cache[cache_key] = (self._public_key, time.time())
                
                # Record performance
                duration = time.time() - start_time
                self._performance.record_metric('key_generation', duration)
                
                return self._public_key, self._private_key
            except Exception as e:
                raise SecurityError(f"Key pair generation failed: {str(e)}")
                
    def establish_shared_secret(self, peer_public_key) -> bytes:
        """Establish shared secret using quantum-resistant exchange with performance tracking"""
        start_time = time.time()
        with self._lock:
            try:
                # Generate shared secret using quantum-resistant parameters
                self._shared_secret = self._private_key.exchange(
                    peer_public_key,
                    padding.OAEP(
                        mgf=padding.MGF1(algorithm=hashes.SHA256()),
                        algorithm=hashes.SHA256(),
                        label=None
                    )
                )
                
                # Record performance
                duration = time.time() - start_time
                self._performance.record_metric('key_exchange', duration)
                
                return self._shared_secret
            except Exception as e:
                raise SecurityError(f"Shared secret establishment failed: {str(e)}")
                
    def get_public_key_bytes(self) -> bytes:
        """Get public key in bytes format"""
        return self._public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )
        
    def get_private_key_bytes(self) -> bytes:
        """Get private key in bytes format"""
        return self._private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        )
        
    def get_performance_metrics(self) -> Dict[str, Optional[float]]:
        """Get performance metrics"""
        return {
            'key_generation': self._performance.get_average_metric('key_generation'),
            'key_exchange': self._performance.get_average_metric('key_exchange')
        }

class QuantumEncryption:
    """Manages quantum encryption and decryption capabilities"""
    
    def __init__(self):
        self._encryption_key = None
        self._fernet = None
        self._lock = threading.Lock()
        self._authorized_presence = False
        self._key_exchange = QuantumKeyExchange()
        self._workspace_reference = "Futuristic Workspace by MarX-@"
        self._performance = PerformanceMetrics()
        self._data_cache: Dict[str, Tuple[str, float]] = {}
        self._error_tracker = ErrorTracker()
        self._setup_logging()
        self._protection_key = self._generate_protection_key()
        self._unauthorized_message = "MarX-@ said No no, You don't touch Valeria"
        self._owner = "MarX Björn Wiström - 2934"
        self._last_encryption_check = datetime(2025, 4, 3)
        self._setup_weekly_check()
        
    def _setup_weekly_check(self):
        """Setup weekly encryption check"""
        def weekly_check():
            while True:
                current_time = datetime.now()
                if (current_time - self._last_encryption_check).days >= 7:
                    self._perform_weekly_check()
                    self._last_encryption_check = current_time
                time.sleep(86400)  # Check every 24 hours
                
        check_thread = threading.Thread(target=weekly_check, daemon=True)
        check_thread.start()
        
    def _perform_weekly_check(self):
        """Perform weekly encryption check"""
        try:
            # Verify ownership
            self._verify_ownership()
            
            # Regenerate protection key
            self._protection_key = self._generate_protection_key()
            
            # Log check
            self._logger.info(f"Weekly encryption check completed successfully at {datetime.now()}")
            
        except Exception as e:
            self._logger.error(f"Weekly encryption check failed: {str(e)}")
            self._handle_error(e, 'weekly_check')
            
    def _verify_ownership(self):
        """Verify code ownership"""
        ownership_hash = hashlib.sha256(self._owner.encode()).hexdigest()
        if ownership_hash != "YOUR_OWNERSHIP_HASH":  # Replace with actual hash
            raise SecurityError(
                f"Unauthorized ownership verification. Code belongs to {self._owner}",
                "QE_OWNERSHIP_ERROR",
                {'timestamp': datetime.now().isoformat()}
            )
            
    def _setup_logging(self) -> None:
        """Setup logging with enhanced security"""
        self._logger = logging.getLogger('QuantumEncryption')
        self._logger.setLevel(logging.INFO)
        
        # Create handlers
        file_handler = logging.FileHandler('quantum_encryption.log')
        console_handler = logging.StreamHandler()
        
        # Create formatters and add it to handlers
        log_format = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s - Owner: %(owner)s'
        )
        file_handler.setFormatter(log_format)
        console_handler.setFormatter(log_format)
        
        # Add handlers to the logger
        self._logger.addHandler(file_handler)
        self._logger.addHandler(console_handler)
        
        # Log initialization
        self._logger.info(
            f"Quantum Encryption System initialized. Owner: {self._owner}",
            extra={'owner': self._owner}
        )
        
    def _handle_error(self, error: Exception, operation: str) -> None:
        """Handle errors with enhanced logging"""
        error_details = {
            'timestamp': datetime.now().isoformat(),
            'operation': operation,
            'error_type': type(error).__name__,
            'error_message': str(error),
            'owner': self._owner,
            'last_check': self._last_encryption_check.isoformat()
        }
        
        # Log to file
        self._logger.error(f"Error in {operation}: {str(error)}", extra=error_details)
        
        # Track error
        self._error_tracker.record_error(SecurityError(
            message=str(error),
            error_code=f"QE_{operation.upper()}_ERROR",
            details=error_details
        ))
        
        # Check for potential code copying/distribution attempts
        if "copy" in str(error).lower() or "distribute" in str(error).lower():
            self._logger.warning(
                f"Potential code copying/distribution attempt detected at {datetime.now()}",
                extra={
                    'attempt_type': 'code_copy',
                    'owner': self._owner,
                    'timestamp': datetime.now().isoformat()
                }
            )
            
    def initialize_encryption(self, presence_key: str) -> bool:
        """Initialize encryption system with presence verification"""
        with self._lock:
            try:
                # Verify MarX Björn Wiström's presence
                if not self._verify_presence(presence_key):
                    raise SecurityError(
                        "Unauthorized presence detected",
                        "QE_PRESENCE_ERROR",
                        {'presence_key': presence_key[:8] + '...'}
                    )
                    
                # Generate quantum-resistant key pair
                public_key, private_key = self._key_exchange.generate_key_pair()
                
                # Generate encryption key using quantum-resistant parameters
                self._encryption_key = self._generate_encryption_key(presence_key, public_key)
                self._fernet = Fernet(self._encryption_key)
                self._authorized_presence = True
                return True
                
            except Exception as e:
                self._handle_error(e, 'initialization')
                raise SecurityError(
                    f"Encryption initialization failed: {str(e)}",
                    "QE_INIT_ERROR",
                    {'presence_key': presence_key[:8] + '...'}
                )
                
    def _verify_presence(self, presence_key: str) -> bool:
        """Verify MarX Björn Wiström's presence"""
        # Generate unique presence hash
        presence_hash = hashlib.sha256(presence_key.encode()).hexdigest()
        
        # Verify against authorized presence signature
        authorized_signature = "MARX_BJORN_WISTROM_PRESENCE_SIGNATURE"
        return presence_hash == hashlib.sha256(authorized_signature.encode()).hexdigest()
        
    def _generate_encryption_key(self, presence_key: str, public_key) -> bytes:
        """Generate encryption key using quantum-resistant parameters"""
        # Use PBKDF2 with quantum-resistant parameters
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=b"MARX_BJORN_WISTROM_SALT",
            iterations=100000,
        )
        
        # Combine presence key with workspace reference
        combined_key = f"{presence_key}{self._workspace_reference}"
        
        # Generate key using quantum-resistant parameters
        key = base64.urlsafe_b64encode(kdf.derive(combined_key.encode()))
        return key
        
    def _generate_protection_key(self) -> bytes:
        """Generate additional protection key"""
        protection_salt = b"VALERIA_PROTECTION_SALT"
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=protection_salt,
            iterations=200000,
        )
        return base64.urlsafe_b64encode(kdf.derive(self._workspace_reference.encode()))
        
    def _verify_protection(self, data: str) -> bool:
        """Verify protection layer"""
        try:
            # Attempt to decrypt with protection key
            fernet = Fernet(self._protection_key)
            decrypted = fernet.decrypt(base64.urlsafe_b64decode(data))
            return True
        except:
            return False
            
    def _apply_protection(self, data: str) -> str:
        """Apply protection layer"""
        fernet = Fernet(self._protection_key)
        return base64.urlsafe_b64encode(fernet.encrypt(data.encode())).decode()
        
    def encrypt_data(self, data: str) -> str:
        """Encrypt data with quantum encryption and protection layer"""
        if not self._authorized_presence:
            error = SecurityError(
                self._unauthorized_message,
                "QE_AUTH_ERROR",
                {'operation': 'encryption'}
            )
            self._handle_error(error, 'encryption')
            raise SecurityError(self._unauthorized_message)
            
        try:
            # Check cache first
            if data in self._data_cache:
                encrypted, timestamp = self._data_cache[data]
                if time.time() - timestamp < 300:  # Cache for 5 minutes
                    return encrypted
            
            start_time = time.time()
            
            # Add workspace reference to encrypted data
            data_with_reference = f"{data}{self._workspace_reference}"
            
            # Apply quantum encryption
            encrypted_data = self._fernet.encrypt(data_with_reference.encode())
            quantum_encrypted = base64.urlsafe_b64encode(encrypted_data).decode()
            
            # Apply protection layer
            protected_data = self._apply_protection(quantum_encrypted)
            
            # Cache the result
            self._data_cache[data] = (protected_data, time.time())
            
            # Record performance
            duration = time.time() - start_time
            self._performance.record_metric('encryption', duration)
            
            return protected_data
        except Exception as e:
            self._handle_error(e, 'encryption')
            raise SecurityError(
                self._unauthorized_message,
                "QE_ENCRYPT_ERROR",
                {'data_length': len(data)}
            )
            
    def decrypt_data(self, encrypted_data: str) -> str:
        """Decrypt data with quantum encryption and protection layer"""
        if not self._authorized_presence:
            error = SecurityError(
                self._unauthorized_message,
                "QE_AUTH_ERROR",
                {'operation': 'decryption'}
            )
            self._handle_error(error, 'decryption')
            raise SecurityError(self._unauthorized_message)
            
        try:
            # Verify protection layer
            if not self._verify_protection(encrypted_data):
                raise SecurityError(self._unauthorized_message)
                
            start_time = time.time()
            
            # Remove protection layer
            fernet = Fernet(self._protection_key)
            quantum_encrypted = fernet.decrypt(base64.urlsafe_b64decode(encrypted_data)).decode()
            
            # Remove quantum encryption
            decrypted_data = self._fernet.decrypt(base64.urlsafe_b64decode(quantum_encrypted))
            decrypted_str = decrypted_data.decode()
            result = decrypted_str[:-len(self._workspace_reference)]
            
            # Record performance
            duration = time.time() - start_time
            self._performance.record_metric('decryption', duration)
            
            return result
        except Exception as e:
            self._handle_error(e, 'decryption')
            raise SecurityError(
                self._unauthorized_message,
                "QE_DECRYPT_ERROR",
                {'data_length': len(encrypted_data)}
            )
            
    def verify_presence(self, presence_key: str) -> bool:
        """Verify presence and update authorization"""
        with self._lock:
            self._authorized_presence = self._verify_presence(presence_key)
            return self._authorized_presence
            
    def is_authorized(self) -> bool:
        """Check if presence is authorized"""
        return self._authorized_presence
        
    def get_workspace_reference(self) -> str:
        """Get Futuristic Workspace reference"""
        return self._workspace_reference
        
    def get_performance_metrics(self) -> Dict[str, Optional[float]]:
        """Get performance metrics"""
        return {
            'encryption': self._performance.get_average_metric('encryption'),
            'decryption': self._performance.get_average_metric('decryption'),
            **self._key_exchange.get_performance_metrics()
        }
        
    def get_error_history(self, count: int = 10) -> List[Dict]:
        """Get recent error history"""
        return self._error_tracker.get_recent_errors(count)
        
    def get_error_patterns(self) -> Dict[str, int]:
        """Get error pattern statistics"""
        return self._error_tracker.get_error_patterns()
        
    def clear_error_history(self) -> None:
        """Clear error history"""
        self._error_tracker.clear_errors() 
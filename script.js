// Scene Manager
class SceneManager {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('workspace-canvas'),
            antialias: true,
            alpha: true
        });
        
        this.setupRenderer();
        this.setupCamera();
        this.setupControls();
        this.setupLights();
        this.setupGrids();
        this.setupParticles();
        this.setupQuantumEffects();
        this.setupSpecialGrid();
        this.setupEventListeners();
    }

    setupRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
    }

    setupCamera() {
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);
    }

    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = true;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 100;
        this.controls.maxPolarAngle = Math.PI / 2;
    }

    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // Point light
        this.pointLight = new THREE.PointLight(0x00ffc8, 1, 100);
        this.pointLight.position.set(0, 5, 0);
        this.pointLight.castShadow = true;
        this.scene.add(this.pointLight);

        // Spotlight
        this.spotLight = new THREE.SpotLight(0x00ffc8, 1);
        this.spotLight.position.set(10, 10, 10);
        this.spotLight.angle = Math.PI / 4;
        this.spotLight.penumbra = 0.1;
        this.spotLight.decay = 2;
        this.spotLight.distance = 100;
        this.spotLight.castShadow = true;
        this.scene.add(this.spotLight);
    }

    setupGrids() {
        // Main grid
        const gridHelper = new THREE.GridHelper(20, 20, 0x00ffc8, 0x00ffc8);
        gridHelper.material.opacity = 0.2;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);

        // Multiple grid layers
        for (let i = 0; i < 1000; i++) {
            const grid = new THREE.GridHelper(20, 20, 0x00ffc8, 0x00ffc8);
            grid.material.opacity = 0.1;
            grid.material.transparent = true;
            
            const radius = 10 + (i * 0.5);
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            grid.position.x = radius * Math.sin(phi) * Math.cos(theta);
            grid.position.y = radius * Math.sin(phi) * Math.sin(theta);
            grid.position.z = radius * Math.cos(phi);
            
            grid.rotation.x = Math.random() * Math.PI;
            grid.rotation.y = Math.random() * Math.PI;
            
            this.scene.add(grid);
        }
    }

    setupParticles() {
        const particleCount = 1000;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 50;
            positions[i3 + 1] = (Math.random() - 0.5) * 50;
            positions[i3 + 2] = (Math.random() - 0.5) * 50;

            colors[i3] = 0;
            colors[i3 + 1] = 1;
            colors[i3 + 2] = 0.8;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });

        this.particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particles);
    }

    setupQuantumEffects() {
        // Quantum field
        const fieldGeometry = new THREE.SphereGeometry(15, 32, 32);
        const fieldMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x00ffc8) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;

                void main() {
                    float pulse = sin(time * 2.0 + vUv.x * 10.0) * 0.5 + 0.5;
                    vec3 finalColor = color * (0.5 + pulse * 0.5);
                    float alpha = 0.2 + pulse * 0.1;
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        this.quantumField = new THREE.Mesh(fieldGeometry, fieldMaterial);
        this.scene.add(this.quantumField);

        // Quantum portals
        for (let i = 0; i < 5; i++) {
            const portalGeometry = new THREE.RingGeometry(1, 1.5, 32);
            const portalMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0x00ffc8) }
                },
                vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform vec3 color;
                    varying vec2 vUv;

                    void main() {
                        float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
                        float radius = length(vUv - vec2(0.5));
                        float pulse = sin(time * 3.0 + angle * 10.0) * 0.5 + 0.5;
                        vec3 finalColor = color * (0.5 + pulse * 0.5);
                        float alpha = 0.3 + pulse * 0.2;
                        gl_FragColor = vec4(finalColor, alpha);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide
            });

            const portal = new THREE.Mesh(portalGeometry, portalMaterial);
            portal.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );
            portal.rotation.x = Math.random() * Math.PI;
            portal.rotation.y = Math.random() * Math.PI;
            this.scene.add(portal);
        }
    }

    setupSpecialGrid() {
        // Special grid at specific coordinates
        this.specialGrid = new THREE.GridHelper(30, 30, 0x00ffc8, 0x00ffc8);
        this.specialGrid.material.opacity = 0.3;
        this.specialGrid.material.transparent = true;
        this.specialGrid.position.set(567.23, 164.13, 239.88);
        
        // Grid glow
        this.gridGlow = new THREE.PointLight(0x00ffc8, 2, 50);
        this.gridGlow.position.copy(this.specialGrid.position);
        this.gridGlow.castShadow = true;
        
        // Grid particles
        this.gridParticles = new THREE.Points(
            new THREE.BufferGeometry(),
            new THREE.PointsMaterial({
                color: 0x00ffc8,
                size: 0.2,
                transparent: true,
                opacity: 0.8
            })
        );
        
        const particlePositions = new Float32Array(1000 * 3);
        for (let i = 0; i < 1000; i++) {
            const i3 = i * 3;
            particlePositions[i3] = this.specialGrid.position.x + (Math.random() - 0.5) * 20;
            particlePositions[i3 + 1] = this.specialGrid.position.y + (Math.random() - 0.5) * 20;
            particlePositions[i3 + 2] = this.specialGrid.position.z + (Math.random() - 0.5) * 20;
        }
        
        this.gridParticles.geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        this.gridParticles.position.copy(this.specialGrid.position);
        
        this.scene.add(this.specialGrid);
        this.scene.add(this.gridGlow);
        this.scene.add(this.gridParticles);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        document.querySelector('.reset-camera').addEventListener('click', () => {
            this.camera.position.set(5, 5, 5);
            this.camera.lookAt(0, 0, 0);
            this.controls.reset();
        });

        let autoRotate = false;
        document.querySelector('.toggle-auto-rotate').addEventListener('click', () => {
            autoRotate = !autoRotate;
            this.controls.autoRotate = autoRotate;
            document.querySelector('.toggle-auto-rotate').textContent = 
                autoRotate ? 'Stop Rotation' : 'Auto Rotate';
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        
        const time = Date.now() * 0.001;
        
        // Animate lights
        this.pointLight.position.x = Math.sin(time) * 3;
        this.pointLight.position.z = Math.cos(time) * 3;
        this.spotLight.position.x = Math.cos(time) * 10;
        this.spotLight.position.z = Math.sin(time) * 10;
        
        // Animate special grid particles
        const gridParticlePositions = this.gridParticles.geometry.attributes.position.array;
        for (let i = 0; i < gridParticlePositions.length; i += 3) {
            gridParticlePositions[i] += Math.sin(time + i) * 0.02;
            gridParticlePositions[i + 1] += Math.cos(time + i) * 0.02;
            gridParticlePositions[i + 2] += Math.sin(time + i) * 0.02;
        }
        this.gridParticles.geometry.attributes.position.needsUpdate = true;
        
        // Animate special grid glow
        this.gridGlow.intensity = 1 + Math.sin(time * 2) * 0.5;
        
        // Animate particles
        const particlePositions = this.particles.geometry.attributes.position.array;
        for (let i = 0; i < particlePositions.length; i += 3) {
            particlePositions[i] += Math.sin(time + i) * 0.01;
            particlePositions[i + 1] += Math.cos(time + i) * 0.01;
            particlePositions[i + 2] += Math.sin(time + i) * 0.01;
        }
        this.particles.geometry.attributes.position.needsUpdate = true;
        
        // Animate quantum field
        this.quantumField.material.uniforms.time.value = time;
        this.quantumField.rotation.y = time * 0.2;
        
        // Animate portals
        this.scene.children.forEach(child => {
            if (child instanceof THREE.Mesh && child !== this.quantumField) {
                child.rotation.z += 0.01;
                child.material.uniforms.time.value = time;
            }
        });
        
        this.renderer.render(this.scene, this.camera);
    }
}

// UI Manager
class UIManager {
    constructor() {
        this.setupLoadingScreen();
        this.setupTimeMessage();
        this.setupTimeCounter();
        this.setupMindControl();
    }

    setupLoadingScreen() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.querySelector('.loading-screen').style.opacity = '0';
                document.getElementById('app').style.display = 'block';
                setTimeout(() => {
                    document.querySelector('.loading-screen').style.display = 'none';
                }, 1000);
            }, 2000);
        });
    }

    setupTimeMessage() {
        const timeMessage = document.querySelector('.time-message');
        if (localStorage.getItem('returnFromTech') === 'true') {
            timeMessage.classList.add('visible');
            setTimeout(() => {
                timeMessage.classList.remove('visible');
                localStorage.removeItem('returnFromTech');
            }, 3000);
        }
    }

    setupTimeCounter() {
        const timeCounter = document.querySelector('.time-counter');
        if (localStorage.getItem('returnFromTech') === 'true') {
            timeCounter.classList.add('visible');
            this.startTimeCounter();
        }
    }

    startTimeCounter() {
        let startTime = Date.now();
        setInterval(() => {
            const elapsed = Date.now() - startTime;
            const hours = Math.floor(elapsed / (1000 * 60 * 60));
            const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

            document.querySelector('.hours').textContent = hours.toString().padStart(2, '0');
            document.querySelector('.minutes').textContent = minutes.toString().padStart(2, '0');
            document.querySelector('.seconds').textContent = seconds.toString().padStart(2, '0');
        }, 1000);
    }

    setupMindControl() {
        const mindControl = document.querySelector('.mind-control');
        let lastActivity = Date.now();
        const inactivityTimeout = 10000; // 10 seconds

        const updateActivity = () => {
            lastActivity = Date.now();
            mindControl.classList.add('visible');
        };

        const checkInactivity = () => {
            if (Date.now() - lastActivity > inactivityTimeout) {
                mindControl.classList.remove('visible');
            }
        };

        document.addEventListener('mousemove', updateActivity);
        document.addEventListener('click', updateActivity);
        document.addEventListener('keypress', updateActivity);
        setInterval(checkInactivity, 1000);
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    const sceneManager = new SceneManager();
    const uiManager = new UIManager();
    sceneManager.animate();
});
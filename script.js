class FuturisticWorkspace {
    constructor() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);

        // Performance monitoring with optimized updates
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fpsUpdateInterval = 1000;
        this.lastFpsUpdate = performance.now();
        
        // Drag state
        this.isDragging = false;
        this.dragStartTime = 0;
        this.dragStartPosition = null;
        this.dragDirection = new THREE.Vector3();
        this.dragSpeed = 0.3; // Increased from 0.1 to 0.3 for faster movement
        this.dragDistance = 70; // 70km distance check
        this.dragAcceleration = 0.1; // Smooth acceleration
        this.currentSpeed = 0;
        this.maxSpeed = 0.5; // Maximum movement speed
        
        // Create FPS counter with optimized styling
        this.fpsElement = document.createElement('div');
        Object.assign(this.fpsElement.style, {
            position: 'fixed',
            top: '10px',
            left: '10px',
            color: '#00ffc8',
            fontFamily: 'monospace',
            zIndex: '1000',
            background: 'rgba(0, 0, 0, 0.5)',
            padding: '5px 10px',
            borderRadius: '4px',
            backdropFilter: 'blur(5px)'
        });
        document.body.appendChild(this.fpsElement);

        // Create navigation menu
        this.createNavigationMenu();

        // Camera setup with optimized initial position
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(7, 5, 5);
        this.camera.lookAt(0, 0, 0);

        // Renderer setup with optimized settings
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('workspace-canvas'),
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

        // Controls with modified target
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.target.set(0, 0, 0); // Set orbit target to center
        this.controls.update();

        // Time management
        this.clock = new THREE.Clock();
        this.windows = [];
        
        // Performance optimization flags
        this.isLowPerformance = false;
        this.lastPerformanceCheck = 0;
        this.performanceCheckInterval = 5000; // Check every 5 seconds

        // Initialize the workspace
        this.init();
    }

    init() {
        // Set canvas size to match window size
        const canvas = document.getElementById('workspace-canvas');
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '1';

        // Create environment
        this.createEnvironment();

        // Setup event listeners
        window.addEventListener('resize', () => this.onWindowResize(), false);
        window.addEventListener('mousemove', (event) => this.createFloatingParticle(event));
        window.addEventListener('click', (event) => this.createFloatingParticle(event));

        // Start animation loop
        this.animate();

        // Initialize time counter
        this.initializeTimeCounter();
        this.startTimeCounter();

        // Show love message
        this.showLoveMessage();

        // Setup interaction
        this.setupInteraction();
    }

    createEnvironment() {
        // Create main platform
        this.createPlatform();
        
        // Create grid
        this.createGrid();
        
        // Create pyramid
        this.pyramid = this.createPyramid();
        this.scene.add(this.pyramid);
        
        // Add lighting
        this.setupLighting();
        
        // Add particle systems
        this.createParticleSystems();
        
        // Add ambient elements
        this.createAmbientElements();

        // Add Google search box
        this.createGoogleSearchBox();

        // Create duplicate environment
        this.createDuplicateEnvironment();

        // Create portal
        this.createPortal();

        // Create Blue Globe
        this.createBlueGlobe();

        // Create Grid Mapping System
        this.createGridMapping();

        // Create Infinite Timeline
        this.createInfiniteTimeline();

        // Add new elements
        this.createFloatingCrystal();
        this.createHolographicSphere();
        this.createEnergyPlatform();
        this.createMatrixEffect();
        this.createHolographicDisplay();
        this.createEnergyOrb();
        this.createDataNetwork();
        this.createCommandCenter();
        this.createQuantumField();
        this.createTimeSphere();
        this.createNeuralNetwork();
        this.createDataArchive();
        this.createNavigationSystem();
        this.createQuantumCore();
        this.createTimeField();
        this.createNeuralTerminal();
    }

    createPlatform() {
        // Create main platform
        const geometry = new THREE.CircleGeometry(10, 32);
        const material = new THREE.ShaderMaterial({
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
                    float dist = length(vUv - 0.5);
                    float pulse = sin(dist * 10.0 - time * 2.0) * 0.5 + 0.5;
                    float alpha = smoothstep(0.5, 0.4, dist);
                    gl_FragColor = vec4(color * (0.5 + pulse * 0.5), alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        this.platform = new THREE.Mesh(geometry, material);
        this.platform.rotation.x = -Math.PI / 2;
        this.platform.position.y = -0.5;
        this.scene.add(this.platform);

        // Create 4 additional platforms with globes
        const platformPositions = [
            { x: 15, z: 15, rotation: Math.PI / 4 },    // Top-right
            { x: -15, z: 15, rotation: -Math.PI / 4 },  // Top-left
            { x: 15, z: -15, rotation: 3 * Math.PI / 4 }, // Bottom-right
            { x: -15, z: -15, rotation: -3 * Math.PI / 4 } // Bottom-left
        ];

        platformPositions.forEach((pos, index) => {
            const platformGeometry = new THREE.CircleGeometry(5, 32);
            const platformMaterial = new THREE.ShaderMaterial({
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
                        float dist = length(vUv - 0.5);
                        float pulse = sin(dist * 10.0 - time * 2.0 + ${index * Math.PI / 2}) * 0.5 + 0.5;
                        float alpha = smoothstep(0.5, 0.4, dist);
                        gl_FragColor = vec4(color * (0.5 + pulse * 0.5), alpha);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide
            });

            const platform = new THREE.Mesh(platformGeometry, platformMaterial);
            platform.rotation.x = -Math.PI / 2;
            platform.position.set(pos.x, -0.5, pos.z);
            platform.rotation.y = pos.rotation;
            this.scene.add(platform);
            this.windows.push(platform);

            // Add globe to each platform
            this.createPlatformGlobe(platform.position, index);
        });

        // Create luxury house platform
        this.createLuxuryHousePlatform();
    }

    createPlatformGlobe(platformPosition, index) {
        const globeGeometry = new THREE.SphereGeometry(1.5, 32, 32);
        const globeMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x0088ff) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    vNormal = normal;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;

                void main() {
                    float pulse = sin(time * 2.0 + vUv.x * 10.0) * 0.5 + 0.5;
                    float glow = 1.0 - length(vPosition) * 0.5;
                    vec3 finalColor = color * (0.5 + pulse * 0.5);
                    float alpha = 0.8 + pulse * 0.2;
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const globe = new THREE.Mesh(globeGeometry, globeMaterial);
        globe.position.set(platformPosition.x, 1, platformPosition.z);

        // Add energy rings around the globe
        for (let i = 0; i < 3; i++) {
            const ringGeometry = new THREE.RingGeometry(1.7 + i * 0.3, 1.8 + i * 0.3, 32);
            const ringMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0x0088ff) }
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
                        float pulse = sin(angle * 10.0 + time * 2.0) * 0.5 + 0.5;
                        vec3 finalColor = color * (0.5 + pulse * 0.5);
                        float alpha = 0.3 + pulse * 0.2;
                        gl_FragColor = vec4(finalColor, alpha);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide
            });

            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            globe.add(ring);
        }

        this.scene.add(globe);
        this.platformGlobes = this.platformGlobes || [];
        this.platformGlobes.push(globe);
    }

    createLuxuryHousePlatform() {
        // Create large platform for the house
        const platformGeometry = new THREE.CircleGeometry(15, 32);
        const platformMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xffd700) }
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
                    float dist = length(vUv - 0.5);
                    float pulse = sin(dist * 10.0 - time * 2.0) * 0.5 + 0.5;
                    float alpha = smoothstep(0.5, 0.4, dist);
                    gl_FragColor = vec4(color * (0.5 + pulse * 0.5), alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.rotation.x = -Math.PI / 2;
        platform.position.set(0, -0.5, 25); // Positioned far away in Z direction
        this.scene.add(platform);

        // Create luxury house
        const houseGroup = new THREE.Group();

        // House base
        const baseGeometry = new THREE.BoxGeometry(8, 6, 8);
        const baseMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xffd700) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                void main() {
                    vUv = uv;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                varying vec3 vPosition;

                void main() {
                    float pulse = sin(time * 2.0 + vUv.x * 10.0) * 0.5 + 0.5;
                    vec3 finalColor = color * (0.5 + pulse * 0.5);
                    gl_FragColor = vec4(finalColor, 0.8 + pulse * 0.2);
                }
            `,
            transparent: true
        });

        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 3;
        houseGroup.add(base);

        // House roof
        const roofGeometry = new THREE.ConeGeometry(6, 4, 4);
        const roofMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xff4500) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                void main() {
                    vUv = uv;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                varying vec3 vPosition;

                void main() {
                    float pulse = sin(time * 2.0 + vUv.x * 10.0) * 0.5 + 0.5;
                    vec3 finalColor = color * (0.5 + pulse * 0.5);
                    gl_FragColor = vec4(finalColor, 0.8 + pulse * 0.2);
                }
            `,
            transparent: true
        });

        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 8;
        houseGroup.add(roof);

        // Add windows
        for (let i = 0; i < 4; i++) {
            const windowGeometry = new THREE.BoxGeometry(1, 1, 0.1);
            const windowMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0x00ffff) }
                },
                vertexShader: `
                    varying vec2 vUv;
                    varying vec3 vPosition;
                    void main() {
                        vUv = uv;
                        vPosition = position;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform vec3 color;
                    varying vec2 vUv;
                    varying vec3 vPosition;

                    void main() {
                        float pulse = sin(time * 2.0 + vUv.x * 10.0) * 0.5 + 0.5;
                        vec3 finalColor = color * (0.5 + pulse * 0.5);
                        gl_FragColor = vec4(finalColor, 0.8 + pulse * 0.2);
                    }
                `,
                transparent: true
            });

            const window = new THREE.Mesh(windowGeometry, windowMaterial);
            const angle = (i / 4) * Math.PI * 2;
            window.position.set(
                Math.cos(angle) * 4,
                4,
                Math.sin(angle) * 4
            );
            houseGroup.add(window);
        }

        // Position the house on the platform
        houseGroup.position.set(0, 0, 25);
        this.scene.add(houseGroup);

        // Store references for animation
        this.luxuryHouse = houseGroup;
        this.luxuryPlatform = platform;
    }

    createGrid() {
        const size = 20;
        const divisions = 20;
        this.grid = new THREE.GridHelper(size, divisions, 0x00ffc8, 0x004433);
        this.grid.position.y = -0.49;
        this.scene.add(this.grid);
    }

    createPyramid() {
        const pyramidGroup = new THREE.Group();
        
        // Create pyramid base
        const baseGeometry = new THREE.BoxGeometry(4, 0.2, 4);
        const baseMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                baseColor: { value: new THREE.Color(0x00ffc8) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 baseColor;
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    float pulse = sin(time * 2.0 + vUv.x * 10.0) * 0.5 + 0.5;
                    vec3 color = baseColor * (0.5 + pulse * 0.5);
                    float alpha = 0.8 + pulse * 0.2;
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true
        });

        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 0.1;
        pyramidGroup.add(base);

        // Create pyramid sides
        const sideGeometry = new THREE.ConeGeometry(2, 4, 4);
        const sideMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                sideColor: { value: new THREE.Color(0x0088ff) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    vNormal = normal;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 sideColor;
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    float pulse = sin(time * 2.0 + vUv.x * 10.0) * 0.5 + 0.5;
                    float height = vPosition.y / 4.0;
                    vec3 color = mix(sideColor, vec3(1.0), height);
                    color += pulse * 0.3;
                    float alpha = 0.7 + pulse * 0.3;
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const pyramid = new THREE.Mesh(sideGeometry, sideMaterial);
        pyramid.position.y = 2;
        pyramidGroup.add(pyramid);

        // Add energy rings around the pyramid
        for (let i = 0; i < 3; i++) {
            const ringGeometry = new THREE.RingGeometry(2.2 + i * 0.5, 2.3 + i * 0.5, 32);
            const ringMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    ringColor: { value: new THREE.Color(0xff00ff) }
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
                    uniform vec3 ringColor;
                    varying vec2 vUv;
                    
                    void main() {
                        float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
                        float pulse = sin(angle * 10.0 + time * 2.0) * 0.5 + 0.5;
                        vec3 color = ringColor * (0.5 + pulse * 0.5);
                        float alpha = 0.3 + pulse * 0.2;
                        gl_FragColor = vec4(color, alpha);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide
            });

            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = i * 1.5;
            pyramidGroup.add(ring);
        }

        // Add floating particles around the pyramid
        const particleCount = 100;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            const radius = 3 + Math.random() * 2;
            const angle = Math.random() * Math.PI * 2;
            const height = Math.random() * 6;

            positions[i] = Math.cos(angle) * radius;
            positions[i + 1] = height;
            positions[i + 2] = Math.sin(angle) * radius;

            colors[i] = Math.random();
            colors[i + 1] = Math.random();
            colors[i + 2] = Math.random();
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        pyramidGroup.add(particles);

        return pyramidGroup;
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambientLight);

        // Main directional light
        const mainLight = new THREE.DirectionalLight(0x00ffc8, 1);
        mainLight.position.set(5, 5, 5);
        mainLight.castShadow = true;
        this.scene.add(mainLight);

        // Add point lights for dramatic effect
        const colors = [0x00ffc8, 0x0088ff, 0xff00ff];
        this.pointLights = colors.map((color, i) => {
            const light = new THREE.PointLight(color, 1, 10);
            const angle = (i / colors.length) * Math.PI * 2;
            light.position.set(
                Math.cos(angle) * 5,
                2,
                Math.sin(angle) * 5
            );
            this.scene.add(light);
            return light;
        });
    }

    createParticleSystems() {
        const particlesGeometry = new THREE.BufferGeometry();
        const particleCount = 2000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            // Position
            positions[i] = (Math.random() - 0.5) * 20;
            positions[i + 1] = Math.random() * 10;
            positions[i + 2] = (Math.random() - 0.5) * 20;

            // Color
            colors[i] = Math.random();
            colors[i + 1] = Math.random();
            colors[i + 2] = Math.random();
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(this.particles);
    }

    createAmbientElements() {
        // Create floating holographic elements
        for (let i = 0; i < 5; i++) {
            const element = this.createHolographicElement();
            element.position.set(
                (Math.random() - 0.5) * 8,
                Math.random() * 3 + 1,
                (Math.random() - 0.5) * 8
            );
            this.scene.add(element);
        }
    }

    createHolographicElement() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                varying vec3 vPosition;
                void main() {
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                varying vec3 vPosition;
                
                void main() {
                    vec3 color = vec3(0.0, 1.0, 0.8);
                    float pulse = sin(time * 2.0 + vPosition.y * 5.0) * 0.5 + 0.5;
                    float scanline = step(0.98, fract(vPosition.y * 10.0 + time));
                    gl_FragColor = vec4(color * (0.5 + pulse * 0.5), 0.5 + scanline * 0.5);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        return new THREE.Mesh(geometry, material);
    }

    createGoogleSearchBox() {
        // Create a larger box for the search interface
        const geometry = new THREE.BoxGeometry(2, 1, 0.1);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                searchText: { value: "Search Google..." }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    vNormal = normal;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 searchText;
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;

                // Function to create text effect
                float text(vec2 uv, vec2 pos, float scale) {
                    vec2 p = uv - pos;
                    float d = length(p) - scale;
                    return smoothstep(0.0, 0.01, d);
                }
                
                void main() {
                    // Base holographic effect
                    vec3 color = vec3(0.0, 1.0, 0.8);
                    float pulse = sin(time * 2.0 + vPosition.y * 5.0) * 0.5 + 0.5;
                    float scanline = step(0.98, fract(vPosition.y * 10.0 + time));
                    
                    // Create search bar effect
                    float searchBar = smoothstep(0.0, 0.1, abs(vPosition.y)) * 
                                    smoothstep(0.0, 0.1, abs(vPosition.x - 0.5));
                    
                    // Add text effect
                    float textEffect = text(vUv, vec2(0.5, 0.5), 0.1);
                    
                    // Combine effects
                    vec3 finalColor = mix(color, vec3(1.0), textEffect * 0.5);
                    float alpha = 0.5 + pulse * 0.3 + searchBar * 0.2;
                    
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const searchBox = new THREE.Mesh(geometry, material);
        
        // Position the search box
        searchBox.position.set(0, 2, 0);
        searchBox.scale.set(1.5, 0.5, 1); // Make it wider and flatter
        
        // Add to scene
        this.scene.add(searchBox);
        
        // Store reference for animation
        this.searchBox = searchBox;
    }

    createDuplicateEnvironment() {
        // Create a group to hold all duplicated elements
        const duplicateGroup = new THREE.Group();

        // Clone and position the platform
        const platformClone = this.platform.clone();
        platformClone.position.set(53.43, 29.59, 12.21); // Adjusted Y to account for platform height
        duplicateGroup.add(platformClone);

        // Clone and position the grid
        const gridClone = this.grid.clone();
        gridClone.position.set(53.43, 29.51, 12.21); // Adjusted Y to account for grid height
        duplicateGroup.add(gridClone);

        // Clone and position the pyramid
        const pyramidClone = this.pyramid.clone();
        pyramidClone.position.set(53.43, 30.09, 12.21);
        duplicateGroup.add(pyramidClone);

        // Clone and position the search box
        if (this.searchBox) {
            const searchBoxClone = this.searchBox.clone();
            searchBoxClone.position.set(53.43, 32.09, 12.21); // Adjusted Y to maintain relative position
            duplicateGroup.add(searchBoxClone);
        }

        // Clone and position ambient elements
        for (let i = 0; i < 5; i++) {
            const element = this.createHolographicElement();
            element.position.set(
                53.43 + (Math.random() - 0.5) * 8,
                30.09 + Math.random() * 3 + 1,
                12.21 + (Math.random() - 0.5) * 8
            );
            duplicateGroup.add(element);
        }

        // Add vertical portal to the corner of the top grid
        this.createVerticalPortal(53.43, 29.59, 12.21);

        // Add the duplicate group to the scene
        this.scene.add(duplicateGroup);

        // Store reference for animation
        this.duplicateEnvironment = duplicateGroup;
    }

    createVerticalPortal(x, y, z) {
        // Create portal group
        const portalGroup = new THREE.Group();

        // Create larger portal ring
        const ringGeometry = new THREE.TorusGeometry(2, 0.3, 64, 200);
        const ringMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x800080) } // Purple
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    vNormal = normal;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;

                void main() {
                    float pulse = sin(time * 2.0 + vUv.x * 10.0) * 0.5 + 0.5;
                    float glow = 1.0 - length(vPosition) * 0.5;
                    vec3 finalColor = mix(color, vec3(0.5), pulse); // Mix purple with grey
                    float alpha = 0.8 + pulse * 0.2;
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const portalRing = new THREE.Mesh(ringGeometry, ringMaterial);
        portalRing.position.set(x, y + 2, z); // Raised position
        portalRing.rotation.x = 0; // Vertical orientation
        portalGroup.add(portalRing);

        // Create portal effect
        const portalEffectGeometry = new THREE.CircleGeometry(2, 64);
        const portalEffectMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x800080) } // Purple
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                varying vec3 vPosition;

                void main() {
                    float dist = length(vUv - 0.5);
                    float pulse = sin(dist * 10.0 - time * 2.0) * 0.5 + 0.5;
                    vec3 finalColor = mix(color, vec3(0.5), pulse); // Mix purple with grey
                    float alpha = smoothstep(0.5, 0.4, dist) * (0.5 + pulse * 0.5);
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const portalEffect = new THREE.Mesh(portalEffectGeometry, portalEffectMaterial);
        portalEffect.position.set(x, y + 2, z); // Raised position
        portalEffect.rotation.x = -Math.PI / 2; // Vertical orientation
        portalGroup.add(portalEffect);

        // Create fancy stairs
        const stairCount = 5;
        const stairHeight = 0.3;
        const stairDepth = 0.5;
        const stairWidth = 4;

        for (let i = 0; i < stairCount; i++) {
            const stairGeometry = new THREE.BoxGeometry(stairWidth, stairHeight, stairDepth);
            const stairMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0x800080) } // Purple
                },
                vertexShader: `
                    varying vec2 vUv;
                    varying vec3 vPosition;
                    
                    void main() {
                        vUv = uv;
                        vPosition = position;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform vec3 color;
                    varying vec2 vUv;
                    varying vec3 vPosition;
                    
                    void main() {
                        float pulse = sin(time * 2.0 + vUv.x * 10.0) * 0.5 + 0.5;
                        vec3 finalColor = mix(color, vec3(0.5), pulse); // Mix purple with grey
                        float alpha = 0.8 + pulse * 0.2;
                        gl_FragColor = vec4(finalColor, alpha);
                    }
                `,
                transparent: true
            });

            const stair = new THREE.Mesh(stairGeometry, stairMaterial);
            stair.position.set(
                x,
                y + (i * stairHeight),
                z + (i * stairDepth)
            );
            portalGroup.add(stair);

            // Add glowing edge to each stair
            const edgeGeometry = new THREE.BoxGeometry(stairWidth + 0.1, stairHeight + 0.1, 0.1);
            const edgeMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0x800080) } // Purple
                },
                vertexShader: `
                    varying vec2 vUv;
                    varying vec3 vPosition;
                    
                    void main() {
                        vUv = uv;
                        vPosition = position;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform vec3 color;
                    varying vec2 vUv;
                    varying vec3 vPosition;
                    
                    void main() {
                        float pulse = sin(time * 2.0 + vUv.x * 10.0) * 0.5 + 0.5;
                        vec3 finalColor = mix(color, vec3(0.5), pulse); // Mix purple with grey
                        float alpha = 0.6 + pulse * 0.4;
                        gl_FragColor = vec4(finalColor, alpha);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending
            });

            const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
            edge.position.set(
                x,
                y + (i * stairHeight),
                z + (i * stairDepth) + (stairDepth / 2)
            );
            portalGroup.add(edge);
        }

        // Add to scene
        this.scene.add(portalGroup);

        // Store reference for animation
        this.verticalPortal = portalGroup;

        // Add portal interaction
        this.setupVerticalPortalInteraction(portalGroup);
    }

    setupVerticalPortalInteraction(portalGroup) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let isNearPortal = false;
        let portalEntryTime = null;

        // Add mouse move listener
        this.renderer.domElement.addEventListener('mousemove', (event) => {
            const rect = this.renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        });

        // Add click listener
        this.renderer.domElement.addEventListener('click', () => {
            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObject(portalGroup, true);

            if (intersects.length > 0) {
                this.showVerticalPortalPrompt();
            }
        });

        // Add portal proximity check to animation loop
        this.checkPortalProximity = () => {
            if (!portalGroup) return;

            const distance = this.camera.position.distanceTo(portalGroup.position);
            
            // Check if camera is near portal
            if (distance < 3) {
                if (!isNearPortal) {
                    isNearPortal = true;
                    portalEntryTime = Date.now();
                    this.showPortalEntryEffect();
                }
                
                // Check if camera has been near portal for 2 seconds
                if (Date.now() - portalEntryTime > 2000) {
                    this.triggerPortalReload();
                }
            } else {
                isNearPortal = false;
                portalEntryTime = null;
            }
        };
    }

    showVerticalPortalPrompt() {
        // Create prompt container
        const promptContainer = document.createElement('div');
        promptContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(10, 10, 15, 0.9);
            padding: 2rem;
            border-radius: 10px;
            border: 2px solid #800080;
            color: #800080;
            font-family: 'Orbitron', sans-serif;
            z-index: 1000;
            text-align: center;
            box-shadow: 0 0 20px rgba(128, 0, 128, 0.3);
        `;

        // Create prompt content
        promptContainer.innerHTML = `
            <h2 style="margin-bottom: 1rem;">Enter the Vertical Portal</h2>
            <p style="margin-bottom: 1.5rem;">Would you like to enter the vertical portal?</p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button id="enterVerticalPortal" style="
                    background: #800080;
                    color: #ffffff;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 5px;
                    cursor: pointer;
                    font-family: 'Orbitron', sans-serif;
                    transition: all 0.3s ease;
                ">Enter Portal</button>
                <button id="cancelVerticalPortal" style="
                    background: transparent;
                    color: #800080;
                    border: 2px solid #800080;
                    padding: 0.5rem 1rem;
                    border-radius: 5px;
                    cursor: pointer;
                    font-family: 'Orbitron', sans-serif;
                    transition: all 0.3s ease;
                ">Cancel</button>
            </div>
        `;

        // Add to document
        document.body.appendChild(promptContainer);

        // Add button event listeners
        document.getElementById('enterVerticalPortal').addEventListener('click', () => {
            window.location.reload();
        });

        document.getElementById('cancelVerticalPortal').addEventListener('click', () => {
            promptContainer.remove();
        });

        // Add hover effects
        const buttons = promptContainer.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('mouseover', () => {
                button.style.transform = 'scale(1.05)';
                button.style.boxShadow = '0 0 10px rgba(128, 0, 128, 0.5)';
            });
            button.addEventListener('mouseout', () => {
                button.style.transform = 'scale(1)';
                button.style.boxShadow = 'none';
            });
        });
    }

    showPortalEntryEffect() {
        // Create portal entry effect
        const effectContainer = document.createElement('div');
        effectContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, rgba(128, 0, 128, 0.8) 0%, rgba(128, 0, 128, 0) 70%);
            z-index: 999;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;
        document.body.appendChild(effectContainer);

        // Fade in
        setTimeout(() => {
            effectContainer.style.opacity = '1';
        }, 10);

        // Fade out and remove
        setTimeout(() => {
            effectContainer.style.opacity = '0';
            setTimeout(() => {
                effectContainer.remove();
            }, 500);
        }, 1500);
    }

    triggerPortalReload() {
        // Create reload effect
        const reloadContainer = document.createElement('div');
        reloadContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #800080;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.5s ease;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-family: 'Orbitron', sans-serif;
            font-size: 2rem;
            text-align: center;
        `;
        reloadContainer.innerHTML = 'Entering New Dimension...';
        document.body.appendChild(reloadContainer);

        // Fade in
        setTimeout(() => {
            reloadContainer.style.opacity = '1';
        }, 10);

        // Reload page after effect
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }

    createPortal() {
        // Create portal ring
        const ringGeometry = new THREE.TorusGeometry(2, 0.2, 32, 100);
        const ringMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x00ffc8) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    vNormal = normal;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;

                void main() {
                    float pulse = sin(time * 2.0 + vUv.x * 10.0) * 0.5 + 0.5;
                    float glow = 1.0 - length(vPosition) * 0.5;
                    vec3 finalColor = color * (0.5 + pulse * 0.5);
                    float alpha = 0.8 + pulse * 0.2;
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const portalRing = new THREE.Mesh(ringGeometry, ringMaterial);
        portalRing.position.set(0, 3, 0);
        portalRing.rotation.x = Math.PI / 2;

        // Create portal effect
        const portalEffectGeometry = new THREE.CircleGeometry(2, 32);
        const portalEffectMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x00ffc8) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                varying vec3 vPosition;

                void main() {
                    float dist = length(vUv - 0.5);
                    float pulse = sin(dist * 10.0 - time * 2.0) * 0.5 + 0.5;
                    float alpha = smoothstep(0.5, 0.4, dist) * (0.5 + pulse * 0.5);
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const portalEffect = new THREE.Mesh(portalEffectGeometry, portalEffectMaterial);
        portalEffect.position.set(0, 3, 0);
        portalEffect.rotation.x = -Math.PI / 2;

        // Create portal group
        const portalGroup = new THREE.Group();
        portalGroup.add(portalRing);
        portalGroup.add(portalEffect);

        // Add to scene
        this.scene.add(portalGroup);

        // Store reference for animation
        this.portal = portalGroup;

        // Add portal interaction
        this.setupPortalInteraction(portalGroup);

        // Initialize portal distance tracking
        this.portalDistanceTracking = {
            startPosition: new THREE.Vector3(99.86, 846.70, 388),
            portalCenter: new THREE.Vector3(0, 3, 0),
            startTime: Date.now(),
            lastUpdate: Date.now(),
            isTracking: false
        };
    }

    setupPortalInteraction(portalGroup) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        // Add mouse move listener
        this.renderer.domElement.addEventListener('mousemove', (event) => {
            const rect = this.renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        });

        // Add click listener
        this.renderer.domElement.addEventListener('click', () => {
            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObject(portalGroup, true);

            if (intersects.length > 0) {
                this.portalDistanceTracking.isTracking = true;
                this.portalDistanceTracking.startTime = Date.now();
                this.portalDistanceTracking.lastUpdate = Date.now();
                this.showStellariumPrompt();
            }
        });

        // Add portal distance tracking
        this.trackPortalDistance = () => {
            if (!this.portalDistanceTracking.isTracking) return;

            const currentTime = Date.now();
            const timeElapsed = (currentTime - this.portalDistanceTracking.startTime) / 1000;
            const timeSinceLastUpdate = (currentTime - this.portalDistanceTracking.lastUpdate) / 1000;

            // Calculate current position based on time
            const progress = Math.min(1, timeElapsed / 10); // 10 seconds total journey
            const currentPosition = new THREE.Vector3();
            currentPosition.lerpVectors(
                this.portalDistanceTracking.startPosition,
                this.portalDistanceTracking.portalCenter,
                progress
            );

            // Calculate distance to portal center
            const distance = currentPosition.distanceTo(this.portalDistanceTracking.portalCenter);

            // Calculate speed (units per second)
            const speed = distance / (10 - timeElapsed);

            // Log information every 0.1 seconds
            if (timeSinceLastUpdate >= 0.1) {
                console.log(`Time: ${timeElapsed.toFixed(1)}s | Distance: ${distance.toFixed(2)} units | Speed: ${speed.toFixed(2)} units/s`);
                this.portalDistanceTracking.lastUpdate = currentTime;
            }

            // Stop tracking when reached portal
            if (progress >= 1) {
                this.portalDistanceTracking.isTracking = false;
                console.log('Reached portal center!');
            }
        };
    }

    showStellariumPrompt() {
        // Create prompt container
        const promptContainer = document.createElement('div');
        promptContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(10, 10, 15, 0.9);
            padding: 2rem;
            border-radius: 10px;
            border: 2px solid #00ffc8;
            color: #00ffc8;
            font-family: 'Orbitron', sans-serif;
            z-index: 1000;
            text-align: center;
            box-shadow: 0 0 20px rgba(0, 255, 200, 0.3);
        `;

        // Create prompt content
        promptContainer.innerHTML = `
            <h2 style="margin-bottom: 1rem;">Enter the Stellar Portal</h2>
            <p style="margin-bottom: 1.5rem;">Would you like to download Stellarium to explore the universe?</p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button id="downloadStellarium" style="
                    background: #00ffc8;
                    color: #0a0a0f;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 5px;
                    cursor: pointer;
                    font-family: 'Orbitron', sans-serif;
                    transition: all 0.3s ease;
                ">Download Stellarium</button>
                <button id="cancelDownload" style="
                    background: transparent;
                    color: #00ffc8;
                    border: 2px solid #00ffc8;
                    padding: 0.5rem 1rem;
                    border-radius: 5px;
                    cursor: pointer;
                    font-family: 'Orbitron', sans-serif;
                    transition: all 0.3s ease;
                ">Cancel</button>
            </div>
        `;

        // Add to document
        document.body.appendChild(promptContainer);

        // Add button event listeners
        document.getElementById('downloadStellarium').addEventListener('click', () => {
            window.open('https://stellarium.org/releases/software/', '_blank');
            promptContainer.remove();
        });

        document.getElementById('cancelDownload').addEventListener('click', () => {
            promptContainer.remove();
        });

        // Add hover effects
        const buttons = promptContainer.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('mouseover', () => {
                button.style.transform = 'scale(1.05)';
                button.style.boxShadow = '0 0 10px rgba(0, 255, 200, 0.5)';
            });
            button.addEventListener('mouseout', () => {
                button.style.transform = 'scale(1)';
                button.style.boxShadow = 'none';
            });
        });
    }

    setupInteraction() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let clickCount = 0;
        let lastClickTime = 0;
        const doubleClickDelay = 250; // Reduced from 300ms to 250ms for more responsive double-click
        const tripleClickDelay = 200; // Added separate delay for triple-click

        const handleMouseMove = (event) => {
            const rect = this.renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObjects(this.scene.children, true);

            // Update cursor style based on intersection and drag state
            if (this.isDragging) {
                this.renderer.domElement.style.cursor = 'grabbing';
            } else if (intersects.length > 0) {
                const distance = intersects[0].distance;
                if (distance <= this.dragDistance) {
                    this.renderer.domElement.style.cursor = 'grab';
                } else {
                    this.renderer.domElement.style.cursor = 'pointer';
                }
            } else {
                this.renderer.domElement.style.cursor = 'default';
            }

            // Handle drag movement with improved behavior
            if (this.isDragging && event.ctrlKey) {
                const currentTime = Date.now();
                const deltaTime = (currentTime - this.dragStartTime) * 0.001;
                this.dragStartTime = currentTime;

                // Calculate movement based on mouse position with improved sensitivity
                const movement = new THREE.Vector3(
                    mouse.x * this.dragSpeed * deltaTime * 2, // Doubled horizontal sensitivity
                    0,
                    mouse.y * this.dragSpeed * deltaTime * 1.5 // Increased vertical sensitivity
                );

                // Smooth acceleration
                this.currentSpeed = Math.min(this.currentSpeed + this.dragAcceleration * deltaTime, this.maxSpeed);
                movement.multiplyScalar(this.currentSpeed);

                // Apply movement in camera's direction with improved control
                const cameraDirection = new THREE.Vector3();
                this.camera.getWorldDirection(cameraDirection);
                cameraDirection.y = 0; // Keep movement horizontal
                cameraDirection.normalize();

                // Calculate right vector for strafing
                const rightVector = new THREE.Vector3();
                rightVector.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0)).normalize();

                // Combine forward/backward and strafing movement
                const finalMovement = new THREE.Vector3();
                finalMovement.addScaledVector(cameraDirection, movement.z);
                finalMovement.addScaledVector(rightVector, movement.x);

                // Apply movement with smooth transition
                this.camera.position.add(finalMovement);
                this.controls.target.add(finalMovement);
                this.controls.update();
            } else if (!this.isDragging) {
                // Reset speed when not dragging
                this.currentSpeed = 0;
            }
        };

        const handleClick = (event) => {
            const currentTime = Date.now();
            const rect = this.renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObjects(this.scene.children, true);

            if (intersects.length > 0) {
                const distance = intersects[0].distance;
                
                // Reset click count if too much time has passed
                if (currentTime - lastClickTime > doubleClickDelay) {
                    clickCount = 0;
                }
                
                clickCount++;
                lastClickTime = currentTime;

                // Handle triple click to release with separate timing
                if (clickCount === 3 && currentTime - lastClickTime <= tripleClickDelay) {
                    this.isDragging = false;
                    clickCount = 0;
                    this.currentSpeed = 0;
                    this.renderer.domElement.style.cursor = 'default';
                    return;
                }

                // Handle ctrl + double click to start dragging with improved timing
                if (clickCount === 2 && event.ctrlKey && distance <= this.dragDistance && 
                    currentTime - lastClickTime <= doubleClickDelay) {
                    this.isDragging = true;
                    this.dragStartTime = currentTime;
                    this.dragStartPosition = this.camera.position.clone();
                    this.dragDirection = new THREE.Vector3();
                    this.currentSpeed = 0; // Reset speed when starting drag
                    this.renderer.domElement.style.cursor = 'grabbing';
                } else if (distance > this.dragDistance) {
                    // Normal click behavior for distant objects
                    const point = intersects[0].point;
                    this.travelToPoint(point);
                }
            }
        };

        // Add event listeners with optimized handling
        this.renderer.domElement.addEventListener('mousemove', handleMouseMove);
        this.renderer.domElement.addEventListener('click', handleClick);

        // Store references for cleanup
        this.eventListeners = {
            mousemove: handleMouseMove,
            click: handleClick
        };
    }

    travelToPoint(targetPoint) {
        // Don't travel if dragging
        if (this.isDragging) return;

        const duration = 1000;
        const startPosition = this.camera.position.clone();
        const startTarget = this.controls.target.clone();
        const startTime = Date.now();

        // Calculate target position slightly offset from the clicked point
        const targetPosition = targetPoint.clone().add(new THREE.Vector3(0, 2, 0));
        const targetLookAt = targetPoint.clone();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth transition
            const easeProgress = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            this.camera.position.lerpVectors(startPosition, targetPosition, easeProgress);
            this.controls.target.lerpVectors(startTarget, targetLookAt, easeProgress);
            this.controls.update();

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    toggleGridVisibility() {
        // Toggle main grid
        if (this.grid) {
            this.grid.visible = !this.grid.visible;
            
            // Toggle grid mapping system if it exists
            if (this.gridMapping) {
                this.gridMapping.visible = !this.gridMapping.visible;
            }

            // Toggle grid lines
            if (this.grid.lines) {
                this.grid.lines.visible = this.grid.visible;
            }

            // Toggle grid points
            if (this.grid.points) {
                this.grid.points.visible = this.grid.visible;
            }

            // Show visual feedback
            this.showGridToggleFeedback();
        }
    }

    showGridToggleFeedback() {
        const feedback = document.createElement('div');
        feedback.className = 'grid-feedback';
        feedback.textContent = this.grid.visible ? 'Grid: ON' : 'Grid: OFF';
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: rgba(0, 255, 255, 0.8);
            padding: 10px 20px;
            border-radius: 5px;
            font-family: 'Orbitron', sans-serif;
            font-size: 14px;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 255, 255, 0.3);
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        `;

        document.body.appendChild(feedback);

        // Fade in
        requestAnimationFrame(() => {
            feedback.style.opacity = '1';
        });

        // Fade out and remove
        setTimeout(() => {
            feedback.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(feedback);
            }, 300);
        }, 1500);
    }

    createWorkspaceWindow() {
        // Create a floating window element
        const window = this.createHolographicElement();
        window.scale.set(2, 1.5, 0.1);
        window.position.set(
            (Math.random() - 0.5) * 6,
            Math.random() * 2 + 1,
            (Math.random() - 0.5) * 6
        );
        this.scene.add(window);
        this.windows.push(window);
    }

    createFloatingParticle(event) {
        // Calculate mouse position in normalized device coordinates (-1 to +1)
        const rect = this.renderer.domElement.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Create a plane at z=0 to intersect with
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);

        // Find intersection point
        const intersectionPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, intersectionPoint);

        // Create particle geometry
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(3);
        positions[0] = intersectionPoint.x;
        positions[1] = intersectionPoint.y;
        positions[2] = intersectionPoint.z;
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // Create particle material with custom shader
        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x00ffc8) }
            },
            vertexShader: `
                varying vec3 vPosition;
                void main() {
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec3 vPosition;
                
                void main() {
                    float pulse = sin(time * 2.0 + vPosition.y * 5.0) * 0.5 + 0.5;
                    float glow = 1.0 - length(vPosition) * 0.5;
                    vec3 finalColor = color * (0.5 + pulse * 0.5);
                    gl_FragColor = vec4(finalColor, glow * (0.5 + pulse * 0.5));
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        // Create particle mesh
        const particle = new THREE.Points(particleGeometry, particleMaterial);
        particle.scale.set(0.5, 0.5, 0.5);
        particle.userData.creationTime = this.clock.getElapsedTime();

        // Add to scene
        this.scene.add(particle);

        // Store reference for animation
        if (!this.floatingParticles) {
            this.floatingParticles = [];
        }
        this.floatingParticles.push({
            mesh: particle,
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                Math.random() * 0.02,
                (Math.random() - 0.5) * 0.02
            ),
            rotation: new THREE.Vector3(
                Math.random() * 0.02,
                Math.random() * 0.02,
                Math.random() * 0.02
            )
        });
    }

    createBlueGlobe() {
        // Create the globe sphere
        const globeGeometry = new THREE.SphereGeometry(1, 32, 32);
        const globeMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x0088ff) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    vNormal = normal;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;

                void main() {
                    float pulse = sin(time * 2.0 + vUv.x * 10.0) * 0.5 + 0.5;
                    float glow = 1.0 - length(vPosition) * 0.5;
                    vec3 finalColor = color * (0.5 + pulse * 0.5);
                    float alpha = 0.8 + pulse * 0.2;
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const globe = new THREE.Mesh(globeGeometry, globeMaterial);
        globe.position.set(5, 2, 5);

        // Create energy rings around the globe
        for (let i = 0; i < 3; i++) {
            const ringGeometry = new THREE.RingGeometry(1.2 + i * 0.3, 1.3 + i * 0.3, 32);
            const ringMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0x0088ff) }
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
                        float pulse = sin(angle * 10.0 + time * 2.0) * 0.5 + 0.5;
                        vec3 finalColor = color * (0.5 + pulse * 0.5);
                        float alpha = 0.3 + pulse * 0.2;
                        gl_FragColor = vec4(finalColor, alpha);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide
            });

            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            globe.add(ring);
        }

        // Add to scene
        this.scene.add(globe);

        // Store reference for animation and interaction
        this.blueGlobe = globe;
        this.isBeingPulled = false;
        this.lastClickTime = 0;
        this.clickCount = 0;

        // Add interaction
        this.setupGlobeInteraction();

        // Add time control button
        this.createTimeControlButton();

        // Initialize time counter
        this.initializeTimeCounter();
    }

    initializeTimeCounter() {
        // Create counter container
        const counterContainer = document.createElement('div');
        counterContainer.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1000;
            background: rgba(10, 10, 15, 0.8);
            padding: 0.5rem 1rem;
            border-radius: 5px;
            border: 2px solid #00ffc8;
            color: #00ffc8;
            font-family: 'Orbitron', sans-serif;
            text-align: center;
            box-shadow: 0 0 20px rgba(0, 255, 200, 0.3);
        `;

        // Create counter display
        const counterDisplay = document.createElement('div');
        counterDisplay.id = 'timeCounter';
        counterDisplay.style.cssText = `
            font-size: 1.2rem;
            font-weight: bold;
        `;
        counterDisplay.textContent = '00:00:00';
        counterContainer.appendChild(counterDisplay);

        // Add to document
        document.body.appendChild(counterContainer);

        // Initialize counter variables
        this.counterStartTime = Date.now();
        this.counterInterval = null;
        this.isCounterRunning = true;

        // Start counter
        this.startTimeCounter();
    }

    startTimeCounter() {
        this.counterInterval = setInterval(() => {
            if (this.isCounterRunning) {
                const elapsedTime = Date.now() - this.counterStartTime;
                const seconds = Math.floor((elapsedTime / 1000) % 60);
                const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
                const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
                
                const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                document.getElementById('timeCounter').textContent = timeString;
            }
        }, 1000);
    }

    showLoveMessage() {
        // Remove the love message functionality
        return;
    }

    setupGlobeInteraction() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        // Add mouse move listener
        this.renderer.domElement.addEventListener('mousemove', (event) => {
            const rect = this.renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        });

        // Add click listener for escape mechanism
        this.renderer.domElement.addEventListener('click', (event) => {
            if (event.ctrlKey && this.isBeingPulled) {
                const currentTime = new Date().getTime();
                if (currentTime - this.lastClickTime < 300) { // Double click within 300ms
                    this.isBeingPulled = false;
                    this.clickCount = 0;
                    // Resume time counter when escaping
                    this.isCounterRunning = true;
                    this.counterStartTime = Date.now() - (Date.now() - this.counterStartTime);
                }
                this.lastClickTime = currentTime;
                this.clickCount++;
            }
        });

        // Add to animation loop
        this.checkGlobeProximity = () => {
            if (!this.isBeingPulled) {
                const distance = this.camera.position.distanceTo(this.blueGlobe.position);
                if (distance < 5) {
                    this.isBeingPulled = true;
                    // Stop time counter and show love message when pulled in
                    this.isCounterRunning = false;
                    this.showLoveMessage();
                }
            }
        };
    }

    createTimeControlButton() {
        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            cursor: pointer;
            transition: transform 0.3s ease;
        `;

        // Create hourglass icon using SVG
        const hourglassSVG = `
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#00ffc8"/>
                <path d="M12 6v6l4 4" stroke="#00ffc8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 18v-6l-4 4" stroke="#00ffc8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        buttonContainer.innerHTML = hourglassSVG;

        // Add hover effect
        buttonContainer.addEventListener('mouseover', () => {
            buttonContainer.style.transform = 'scale(1.1)';
        });
        buttonContainer.addEventListener('mouseout', () => {
            buttonContainer.style.transform = 'scale(1)';
        });

        // Add click handler
        buttonContainer.addEventListener('click', () => {
            this.showTimeStopWarning();
        });

        // Add to document
        document.body.appendChild(buttonContainer);

        // Store reference
        this.timeControlButton = buttonContainer;
    }

    showTimeStopWarning() {
        // Create warning container
        const warningContainer = document.createElement('div');
        warningContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(10, 10, 15, 0.95);
            padding: 2rem;
            border-radius: 10px;
            border: 2px solid #00ffc8;
            color: #00ffc8;
            font-family: 'Orbitron', sans-serif;
            z-index: 1001;
            text-align: center;
            box-shadow: 0 0 20px rgba(0, 255, 200, 0.3);
            max-width: 500px;
            width: 90%;
        `;

        // Create warning content
        warningContainer.innerHTML = `
            <h2 style="margin-bottom: 1rem; color: #ff6b6b;">⚠️ Time Stop Warning ⚠️</h2>
            <p style="margin-bottom: 1rem;">Stopping time would have catastrophic consequences:</p>
            <ul style="text-align: left; margin-bottom: 1.5rem;">
                <li>All molecular motion would cease</li>
                <li>Light would stop propagating</li>
                <li>Gravity would be suspended</li>
                <li>Consciousness would be frozen</li>
                <li>Entropy would be halted</li>
            </ul>
            <p style="margin-bottom: 1.5rem; color: #ff6b6b;">Are you sure you want to proceed?</p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button id="confirmTimeStop" style="
                    background: #ff6b6b;
                    color: #0a0a0f;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 5px;
                    cursor: pointer;
                    font-family: 'Orbitron', sans-serif;
                    transition: all 0.3s ease;
                ">Stop Time</button>
                <button id="cancelTimeStop" style="
                    background: transparent;
                    color: #00ffc8;
                    border: 2px solid #00ffc8;
                    padding: 0.5rem 1rem;
                    border-radius: 5px;
                    cursor: pointer;
                    font-family: 'Orbitron', sans-serif;
                    transition: all 0.3s ease;
                ">Cancel</button>
            </div>
        `;

        // Add to document
        document.body.appendChild(warningContainer);

        // Add button event listeners
        document.getElementById('confirmTimeStop').addEventListener('click', () => {
            this.stopTimeline();
            warningContainer.remove();
        });

        document.getElementById('cancelTimeStop').addEventListener('click', () => {
            warningContainer.remove();
        });

        // Add hover effects
        const buttons = warningContainer.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('mouseover', () => {
                button.style.transform = 'scale(1.05)';
                button.style.boxShadow = '0 0 10px rgba(0, 255, 200, 0.5)';
            });
            button.addEventListener('mouseout', () => {
                button.style.transform = 'scale(1)';
                button.style.boxShadow = 'none';
            });
        });
    }

    stopTimeline() {
        // Store current timeline state
        this.timelinePaused = true;
        this.pauseTime = Date.now();

        // Add visual feedback
        if (this.timeline) {
            this.timeline.children.forEach(child => {
                if (child.material) {
                    child.material.opacity = 0.5;
                }
            });
        }

        // Show pause message
        const pauseMessage = document.createElement('div');
        pauseMessage.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(10, 10, 15, 0.9);
            padding: 0.5rem 1rem;
            border-radius: 5px;
            border: 2px solid #00ffc8;
            color: #00ffc8;
            font-family: 'Orbitron', sans-serif;
            z-index: 1000;
            text-align: center;
            box-shadow: 0 0 20px rgba(0, 255, 200, 0.3);
        `;
        pauseMessage.textContent = 'Time Paused';
        document.body.appendChild(pauseMessage);

        // Remove message after 3 seconds
        setTimeout(() => {
            pauseMessage.remove();
        }, 3000);
    }

    createGridMapping() {
        // Create a group to hold all grid elements
        const gridMappingGroup = new THREE.Group();

        // Constants for grid mapping
        const GRID_SIZE = 20; // Size of each grid cell
        const GRID_DIVISIONS = 20; // Number of divisions in each grid
        const DISTANCE_BETWEEN_GRIDS = 70; // Distance in kilometers
        const SCALE_FACTOR = 0.1; // Scale factor to convert km to scene units

        // Create main grid
        const mainGrid = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS, 0x00ffc8, 0x004433);
        mainGrid.position.y = -0.49;
        gridMappingGroup.add(mainGrid);

        // Create distant grid
        const distantGrid = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS, 0x0088ff, 0x004466);
        distantGrid.position.set(
            DISTANCE_BETWEEN_GRIDS * SCALE_FACTOR,
            -0.49,
            0
        );
        gridMappingGroup.add(distantGrid);

        // Create grid connection lines
        const connectionGeometry = new THREE.BufferGeometry();
        const connectionMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x00ffc8) }
            },
            vertexShader: `
                varying vec3 vPosition;
                void main() {
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec3 vPosition;
                
                void main() {
                    float pulse = sin(time * 2.0 + vPosition.y * 5.0) * 0.5 + 0.5;
                    float glow = 1.0 - length(vPosition) * 0.5;
                    vec3 finalColor = color * (0.5 + pulse * 0.5);
                    gl_FragColor = vec4(finalColor, glow * (0.5 + pulse * 0.5));
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        // Create connection points
        const connectionPoints = new Float32Array([
            0, 0, 0,  // Start point
            DISTANCE_BETWEEN_GRIDS * SCALE_FACTOR, 0, 0  // End point
        ]);

        connectionGeometry.setAttribute('position', new THREE.BufferAttribute(connectionPoints, 3));
        const connectionLine = new THREE.Line(connectionGeometry, connectionMaterial);
        gridMappingGroup.add(connectionLine);

        // Add distance markers
        const markerGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.5);
        const markerMaterial = new THREE.ShaderMaterial({
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
                    gl_FragColor = vec4(finalColor, 0.8 + pulse * 0.2);
                }
            `,
            transparent: true
        });

        // Add markers at each grid center
        const mainMarker = new THREE.Mesh(markerGeometry, markerMaterial);
        mainMarker.position.set(0, 0, 0);
        gridMappingGroup.add(mainMarker);

        const distantMarker = new THREE.Mesh(markerGeometry, markerMaterial);
        distantMarker.position.set(DISTANCE_BETWEEN_GRIDS * SCALE_FACTOR, 0, 0);
        gridMappingGroup.add(distantMarker);

        // Add to scene
        this.scene.add(gridMappingGroup);

        // Store reference for animation
        this.gridMapping = gridMappingGroup;
    }

    createInfiniteTimeline() {
        // Create timeline container
        const timelineContainer = document.createElement('div');
        timelineContainer.className = 'timeline-container';
        timelineContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 60px;
            background: rgba(0, 0, 0, 0.7);
            border: 1px solid rgba(0, 255, 255, 0.3);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(10px);
        `;

        // Create timeline axis
        const timelineAxis = document.createElement('div');
        timelineAxis.className = 'timeline-axis';
        timelineAxis.style.cssText = `
            position: relative;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, 
                rgba(0, 255, 255, 0.3),
                rgba(0, 255, 255, 0.8),
                rgba(0, 255, 255, 0.3)
            );
            margin: 0 20px;
        `;

        // Create timeline markers
        const markersContainer = document.createElement('div');
        markersContainer.style.cssText = `
            position: absolute;
            top: -20px;
            left: 0;
            width: 100%;
            height: 40px;
            pointer-events: none;
        `;

        // Create markers for different spacetime points
        const spacetimePoints = [
            { value: 'Big Bang', position: 0 },
            { value: 'First Stars', position: 25 },
            { value: 'Galaxy Formation', position: 50 },
            { value: 'Present', position: 75 },
            { value: 'Future', position: 100 }
        ];

        spacetimePoints.forEach(point => {
            const marker = document.createElement('div');
            marker.className = 'timeline-marker';
            marker.style.cssText = `
                position: absolute;
                left: ${point.position}%;
                width: 2px;
                height: 20px;
                background: rgba(0, 255, 255, 0.8);
                transform-origin: bottom;
                transition: transform 0.3s ease;
            `;

            const label = document.createElement('div');
            label.className = 'timeline-label';
            label.textContent = point.value;
            label.style.cssText = `
                position: absolute;
                left: ${point.position}%;
                top: -25px;
                transform: translateX(-50%);
                color: rgba(0, 255, 255, 0.8);
                font-size: 12px;
                font-family: 'Orbitron', sans-serif;
                text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
                white-space: nowrap;
                pointer-events: none;
            `;

            markersContainer.appendChild(marker);
            markersContainer.appendChild(label);
        });

        // Create time value display
        const timeValue = document.createElement('div');
        timeValue.className = 'time-value';
        timeValue.style.cssText = `
            position: absolute;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            color: rgba(0, 255, 255, 0.8);
            font-size: 14px;
            font-family: 'Orbitron', sans-serif;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
            pointer-events: none;
        `;

        // Create time control button
        const timeControl = document.createElement('button');
        timeControl.className = 'time-control';
        timeControl.innerHTML = '⏸';
        timeControl.style.cssText = `
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: 1px solid rgba(0, 255, 255, 0.3);
            color: rgba(0, 255, 255, 0.8);
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            transition: all 0.3s ease;
        `;

        timeControl.addEventListener('mouseover', () => {
            timeControl.style.background = 'rgba(0, 255, 255, 0.1)';
            timeControl.style.borderColor = 'rgba(0, 255, 255, 0.8)';
        });

        timeControl.addEventListener('mouseout', () => {
            timeControl.style.background = 'none';
            timeControl.style.borderColor = 'rgba(0, 255, 255, 0.3)';
        });

        // Add elements to timeline
        timelineAxis.appendChild(markersContainer);
        timelineAxis.appendChild(timeValue);
        timelineContainer.appendChild(timelineAxis);
        timelineContainer.appendChild(timeControl);

        // Add timeline to document
        document.body.appendChild(timelineContainer);

        // Timeline interaction
        let isDragging = false;
        let startX = 0;
        let currentPosition = 50; // Start at present time
        let isPlaying = false;
        let playInterval;

        const updateTimeValue = (position) => {
            const spacetimeValue = spacetimePoints.reduce((acc, point, index) => {
                if (position >= point.position) {
                    return point.value;
                }
                return acc;
            }, spacetimePoints[0].value);

            timeValue.textContent = `Spacetime: ${spacetimeValue}`;
        };

        const handleMouseDown = (e) => {
            isDragging = true;
            startX = e.clientX;
            if (isPlaying) {
                isPlaying = false;
                clearInterval(playInterval);
                timeControl.innerHTML = '▶';
            }
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - startX;
            const containerWidth = timelineContainer.offsetWidth;
            const newPosition = Math.max(0, Math.min(100, currentPosition + (deltaX / containerWidth) * 100));
            
            currentPosition = newPosition;
            updateTimeValue(currentPosition);
            startX = e.clientX;
        };

        const handleMouseUp = () => {
            isDragging = false;
        };

        const handlePlayPause = () => {
            isPlaying = !isPlaying;
            timeControl.innerHTML = isPlaying ? '⏸' : '▶';

            if (isPlaying) {
                playInterval = setInterval(() => {
                    currentPosition = (currentPosition + 0.1) % 100;
                    updateTimeValue(currentPosition);
                }, 50);
            } else {
                clearInterval(playInterval);
            }
        };

        timelineContainer.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        timeControl.addEventListener('click', handlePlayPause);

        // Initialize time value
        updateTimeValue(currentPosition);
    }

    createFloatingCrystal() {
        const crystalGeometry = new THREE.OctahedronGeometry(1, 0);
        const crystalMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x00ffff) }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                void main() {
                    vNormal = normal;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec3 vNormal;
                varying vec3 vPosition;

                void main() {
                    float pulse = sin(time * 2.0 + vPosition.y * 2.0) * 0.5 + 0.5;
                    vec3 glowColor = color * (0.5 + pulse * 0.5);
                    float alpha = 0.8 + pulse * 0.2;
                    gl_FragColor = vec4(glowColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        this.crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
        this.crystal.position.set(5, 3, 5);
        this.scene.add(this.crystal);

        // Add energy rings around crystal
        for (let i = 0; i < 3; i++) {
            const ringGeometry = new THREE.RingGeometry(1.2 + i * 0.3, 1.3 + i * 0.3, 32);
            const ringMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0x00ffff) }
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
                        float pulse = sin(angle * 10.0 + time * 2.0) * 0.5 + 0.5;
                        vec3 finalColor = color * (0.5 + pulse * 0.5);
                        float alpha = 0.3 + pulse * 0.2;
                        gl_FragColor = vec4(finalColor, alpha);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide
            });

            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            this.crystal.add(ring);
        }
    }

    createHolographicSphere() {
        const sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);
        const sphereMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xff00ff) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    vNormal = normal;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;

                void main() {
                    float noise = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time) * 0.5 + 0.5;
                    float scanline = step(0.5, fract(vUv.y * 20.0 + time * 2.0));
                    vec3 finalColor = color * (0.5 + noise * 0.5);
                    float alpha = 0.6 + scanline * 0.2;
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        this.holographicSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.holographicSphere.position.set(-5, 3, 5);
        this.scene.add(this.holographicSphere);

        // Add data stream effect
        const streamGeometry = new THREE.TorusGeometry(2, 0.05, 16, 100);
        const streamMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xff00ff) }
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
                    float stream = step(0.5, fract(vUv.x * 10.0 + time * 3.0));
                    vec3 finalColor = color * (0.5 + stream * 0.5);
                    float alpha = 0.4 + stream * 0.3;
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const stream = new THREE.Mesh(streamGeometry, streamMaterial);
        stream.rotation.x = Math.PI / 2;
        this.holographicSphere.add(stream);
    }

    createEnergyPlatform() {
        const platformGeometry = new THREE.CircleGeometry(2, 32);
        const platformMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xffff00) }
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
                    float dist = length(vUv - 0.5);
                    float pulse = sin(dist * 10.0 - time * 2.0) * 0.5 + 0.5;
                    float alpha = smoothstep(0.5, 0.4, dist);
                    gl_FragColor = vec4(color * (0.5 + pulse * 0.5), alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        this.energyPlatform = new THREE.Mesh(platformGeometry, platformMaterial);
        this.energyPlatform.rotation.x = -Math.PI / 2;
        this.energyPlatform.position.set(0, 2, 8);
        this.scene.add(this.energyPlatform);

        // Add energy beams
        for (let i = 0; i < 4; i++) {
            const beamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
            const beamMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0xffff00) }
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
                        float pulse = sin(vUv.y * 10.0 + time * 2.0) * 0.5 + 0.5;
                        vec3 finalColor = color * (0.5 + pulse * 0.5);
                        float alpha = 0.6 + pulse * 0.2;
                        gl_FragColor = vec4(finalColor, alpha);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide
            });

            const beam = new THREE.Mesh(beamGeometry, beamMaterial);
            beam.position.set(
                Math.cos(i * Math.PI / 2) * 1.5,
                3.5,
                Math.sin(i * Math.PI / 2) * 1.5
            );
            this.energyPlatform.add(beam);
        }
    }

    createMatrixEffect() {
        // Create a group to hold all matrix elements
        const matrixGroup = new THREE.Group();

        // Create matrix background
        const matrixGeometry = new THREE.PlaneGeometry(4, 6);
        const matrixMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x00ff00) }
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

                // Random function
                float random(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                }

                void main() {
                    vec2 grid = vec2(20.0, 30.0);
                    vec2 pos = fract(vUv * grid);
                    float r = random(floor(vUv * grid + time * vec2(0.0, 2.0)));
                    
                    float alpha = step(0.95, r) * (0.5 + 0.5 * sin(time * 2.0 + vUv.y * 10.0));
                    vec3 finalColor = color * alpha;
                    
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const matrixBackground = new THREE.Mesh(matrixGeometry, matrixMaterial);
        matrixBackground.position.set(-8, 2, 0);
        matrixBackground.rotation.y = Math.PI / 4;
        matrixGroup.add(matrixBackground);

        // Add glowing frame
        const frameGeometry = new THREE.BoxGeometry(4.2, 6.2, 0.1);
        const frameMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x00ff00) }
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
                    float alpha = 0.3 + pulse * 0.2;
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(-8, 2, 0);
        frame.rotation.y = Math.PI / 4;
        matrixGroup.add(frame);

        // Add to scene
        this.scene.add(matrixGroup);
        this.matrixEffect = matrixGroup;
    }

    createHolographicDisplay() {
        // Create a group to hold all display elements
        const displayGroup = new THREE.Group();

        // Create main display panel
        const panelGeometry = new THREE.BoxGeometry(3, 2, 0.1);
        const panelMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x00ffff) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                void main() {
                    vUv = uv;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                varying vec3 vPosition;

                void main() {
                    float scanline = step(0.5, fract(vUv.y * 20.0 + time * 2.0));
                    float noise = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time) * 0.5 + 0.5;
                    vec3 finalColor = color * (0.5 + noise * 0.5);
                    float alpha = 0.6 + scanline * 0.2;
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        panel.position.set(8, 2, 0);
        displayGroup.add(panel);

        // Create rotating information panels
        for (let i = 0; i < 3; i++) {
            const infoPanelGeometry = new THREE.PlaneGeometry(1, 0.5);
            const infoPanelMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0x00ffff) }
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
                        float alpha = 0.4 + pulse * 0.2;
                        gl_FragColor = vec4(finalColor, alpha);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide
            });

            const infoPanel = new THREE.Mesh(infoPanelGeometry, infoPanelMaterial);
            infoPanel.position.set(
                8 + Math.cos(i * Math.PI * 2 / 3) * 2,
                2 + Math.sin(i * Math.PI * 2 / 3) * 1,
                0
            );
            displayGroup.add(infoPanel);
        }

        // Add to scene
        this.scene.add(displayGroup);
        this.holographicDisplay = displayGroup;
    }

    createEnergyOrb() {
        // Create a group to hold all orb elements
        const orbGroup = new THREE.Group();

        // Create main orb
        const orbGeometry = new THREE.SphereGeometry(1, 32, 32);
        const orbMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xff00ff) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    vNormal = normal;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;

                void main() {
                    float noise = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time) * 0.5 + 0.5;
                    float glow = 1.0 - length(vPosition) * 0.5;
                    vec3 finalColor = color * (0.5 + noise * 0.5);
                    float alpha = 0.8 + glow * 0.2;
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const orb = new THREE.Mesh(orbGeometry, orbMaterial);
        orb.position.set(0, 4, -5);
        orbGroup.add(orb);

        // Create particle system
        const particleCount = 100;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            const radius = 2 + Math.random() * 2;
            const angle = Math.random() * Math.PI * 2;
            const height = Math.random() * 4;

            positions[i] = Math.cos(angle) * radius;
            positions[i + 1] = height;
            positions[i + 2] = Math.sin(angle) * radius;

            colors[i] = 1;
            colors[i + 1] = 0;
            colors[i + 2] = 1;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        particles.position.set(0, 4, -5);
        orbGroup.add(particles);

        // Add energy rings
        for (let i = 0; i < 3; i++) {
            const ringGeometry = new THREE.RingGeometry(1.5 + i * 0.5, 1.6 + i * 0.5, 32);
            const ringMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0xff00ff) }
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
                        float pulse = sin(angle * 10.0 + time * 2.0) * 0.5 + 0.5;
                        vec3 finalColor = color * (0.5 + pulse * 0.5);
                        float alpha = 0.3 + pulse * 0.2;
                        gl_FragColor = vec4(finalColor, alpha);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide
            });

            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            orbGroup.add(ring);
        }

        // Add to scene
        this.scene.add(orbGroup);
        this.energyOrb = orbGroup;
    }

    createDataNetwork() {
        const networkGroup = new THREE.Group();

        // Create network nodes
        const nodeCount = 20;
        const nodes = [];
        const connections = [];

        for (let i = 0; i < nodeCount; i++) {
            const nodeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
            const nodeMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0x00ff00) }
                },
                vertexShader: `
                    varying vec2 vUv;
                    varying vec3 vPosition;
                    void main() {
                        vUv = uv;
                        vPosition = position;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform vec3 color;
                    varying vec2 vUv;
                    varying vec3 vPosition;

                    void main() {
                        float pulse = sin(time * 2.0 + vPosition.y * 2.0) * 0.5 + 0.5;
                        vec3 glowColor = color * (0.5 + pulse * 0.5);
                        float alpha = 0.8 + pulse * 0.2;
                        gl_FragColor = vec4(glowColor, alpha);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide
            });

            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            node.position.set(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            );
            networkGroup.add(node);
            nodes.push(node);
        }

        // Create connections between nodes
        for (let i = 0; i < nodeCount; i++) {
            for (let j = i + 1; j < nodeCount; j++) {
                if (Math.random() < 0.3) { // 30% chance of connection
                    const connectionGeometry = new THREE.BufferGeometry();
                    const positions = new Float32Array(6);
                    positions[0] = nodes[i].position.x;
                    positions[1] = nodes[i].position.y;
                    positions[2] = nodes[i].position.z;
                    positions[3] = nodes[j].position.x;
                    positions[4] = nodes[j].position.y;
                    positions[5] = nodes[j].position.z;
                    connectionGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

                    const connectionMaterial = new THREE.ShaderMaterial({
                        uniforms: {
                            time: { value: 0 },
                            color: { value: new THREE.Color(0x00ff00) }
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
                                float alpha = 0.3 + pulse * 0.2;
                                gl_FragColor = vec4(finalColor, alpha);
                            }
                        `,
                        transparent: true,
                        side: THREE.DoubleSide
                    });

                    const connection = new THREE.Line(connectionGeometry, connectionMaterial);
                    networkGroup.add(connection);
                    connections.push(connection);
                }
            }
        }

        this.scene.add(networkGroup);
        this.dataNetwork = networkGroup;
    }

    createCommandCenter() {
        const centerGroup = new THREE.Group();

        // Create main console
        const consoleGeometry = new THREE.BoxGeometry(4, 2, 0.5);
        const consoleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x0088ff) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                void main() {
                    vUv = uv;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                varying vec3 vPosition;

                void main() {
                    float scanline = step(0.5, fract(vUv.y * 20.0 + time * 2.0));
                    float noise = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time) * 0.5 + 0.5;
                    vec3 finalColor = color * (0.5 + noise * 0.5);
                    float alpha = 0.6 + scanline * 0.2;
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const console = new THREE.Mesh(consoleGeometry, consoleMaterial);
        console.position.set(5, 1, -3);
        centerGroup.add(console);

        // Add holographic displays
        for (let i = 0; i < 3; i++) {
            const displayGeometry = new THREE.PlaneGeometry(1, 0.5);
            const displayMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0x0088ff) }
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
                        float alpha = 0.4 + pulse * 0.2;
                        gl_FragColor = vec4(finalColor, alpha);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide
            });

            const display = new THREE.Mesh(displayGeometry, displayMaterial);
            display.position.set(
                5 + Math.cos(i * Math.PI * 2 / 3) * 1.5,
                2 + Math.sin(i * Math.PI * 2 / 3) * 0.5,
                -3
            );
            centerGroup.add(display);
        }

        this.scene.add(centerGroup);
        this.commandCenter = centerGroup;
    }

    createQuantumField() {
        const fieldGroup = new THREE.Group();

        // Create quantum field sphere
        const fieldGeometry = new THREE.SphereGeometry(2, 32, 32);
        const fieldMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xff00ff) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    vNormal = normal;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;

                void main() {
                    float noise = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time) * 0.5 + 0.5;
                    float glow = 1.0 - length(vPosition) * 0.5;
                    vec3 finalColor = color * (0.5 + noise * 0.5);
                    float alpha = 0.8 + glow * 0.2;
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
        field.position.set(-5, 3, -3);
        fieldGroup.add(field);

        // Add quantum particles
        const particleCount = 50;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            const radius = 3 + Math.random() * 2;
            const angle = Math.random() * Math.PI * 2;
            const height = Math.random() * 4;

            positions[i] = Math.cos(angle) * radius;
            positions[i + 1] = height;
            positions[i + 2] = Math.sin(angle) * radius;

            colors[i] = 1;
            colors[i + 1] = 0;
            colors[i + 2] = 1;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        particles.position.set(-5, 3, -3);
        fieldGroup.add(particles);

        this.scene.add(fieldGroup);
        this.quantumField = fieldGroup;
    }

    createTimeSphere() {
        const sphereGroup = new THREE.Group();

        // Create time sphere
        const sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);
        const sphereMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xffff00) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    vNormal = normal;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;

                void main() {
                    float noise = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time) * 0.5 + 0.5;
                    float glow = 1.0 - length(vPosition) * 0.5;
                    vec3 finalColor = color * (0.5 + noise * 0.5);
                    float alpha = 0.8 + glow * 0.2;
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(0, 3, 5);
        sphereGroup.add(sphere);

        // Add time rings
        for (let i = 0; i < 3; i++) {
            const ringGeometry = new THREE.RingGeometry(1.7 + i * 0.3, 1.8 + i * 0.3, 32);
            const ringMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0xffff00) }
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
                        float pulse = sin(angle * 10.0 + time * 2.0) * 0.5 + 0.5;
                        vec3 finalColor = color * (0.5 + pulse * 0.5);
                        float alpha = 0.3 + pulse * 0.2;
                        gl_FragColor = vec4(finalColor, alpha);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide
            });

            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            sphereGroup.add(ring);
        }

        this.scene.add(sphereGroup);
        this.timeSphere = sphereGroup;
    }

    createNeuralNetwork() {
        const networkGroup = new THREE.Group();

        // Create neural nodes
        const nodeCount = 15;
        const nodes = [];
        const connections = [];

        for (let i = 0; i < nodeCount; i++) {
            const nodeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
            const nodeMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0xff8800) }
                },
                vertexShader: `
                    varying vec2 vUv;
                    varying vec3 vPosition;
                    void main() {
                        vUv = uv;
                        vPosition = position;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform vec3 color;
                    varying vec2 vUv;
                    varying vec3 vPosition;

                    void main() {
                        float pulse = sin(time * 2.0 + vPosition.y * 2.0) * 0.5 + 0.5;
                        vec3 glowColor = color * (0.5 + pulse * 0.5);
                        float alpha = 0.8 + pulse * 0.2;
                        gl_FragColor = vec4(glowColor, alpha);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide
            });

            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            node.position.set(
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8
            );
            networkGroup.add(node);
            nodes.push(node);
        }

        // Create neural connections
        for (let i = 0; i < nodeCount; i++) {
            for (let j = i + 1; j < nodeCount; j++) {
                if (Math.random() < 0.4) { // 40% chance of connection
                    const connectionGeometry = new THREE.BufferGeometry();
                    const positions = new Float32Array(6);
                    positions[0] = nodes[i].position.x;
                    positions[1] = nodes[i].position.y;
                    positions[2] = nodes[i].position.z;
                    positions[3] = nodes[j].position.x;
                    positions[4] = nodes[j].position.y;
                    positions[5] = nodes[j].position.z;
                    connectionGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

                    const connectionMaterial = new THREE.ShaderMaterial({
                        uniforms: {
                            time: { value: 0 },
                            color: { value: new THREE.Color(0xff8800) }
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
                                float alpha = 0.3 + pulse * 0.2;
                                gl_FragColor = vec4(finalColor, alpha);
                            }
                        `,
                        transparent: true,
                        side: THREE.DoubleSide
                    });

                    const connection = new THREE.Line(connectionGeometry, connectionMaterial);
                    networkGroup.add(connection);
                    connections.push(connection);
                }
            }
        }

        networkGroup.position.set(5, 3, -5);
        this.scene.add(networkGroup);
        this.neuralNetwork = networkGroup;
    }

    createDataArchive() {
        const archiveGroup = new THREE.Group();

        // Create main archive structure
        const archiveGeometry = new THREE.BoxGeometry(3, 4, 2);
        const archiveMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x00ff00) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                void main() {
                    vUv = uv;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                varying vec3 vPosition;

                void main() {
                    float scanline = step(0.5, fract(vUv.y * 20.0 + time * 2.0));
                    float noise = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time) * 0.5 + 0.5;
                    vec3 finalColor = color * (0.5 + noise * 0.5);
                    float alpha = 0.6 + scanline * 0.2;
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const archive = new THREE.Mesh(archiveGeometry, archiveMaterial);
        archive.position.set(-8, 2, -5);
        archiveGroup.add(archive);

        // Add data streams
        for (let i = 0; i < 5; i++) {
            const streamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
            const streamMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0x00ff00) }
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
                        float pulse = sin(vUv.y * 10.0 + time * 2.0) * 0.5 + 0.5;
                        vec3 finalColor = color * (0.5 + pulse * 0.5);
                        float alpha = 0.6 + pulse * 0.2;
                        gl_FragColor = vec4(finalColor, alpha);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide
            });

            const stream = new THREE.Mesh(streamGeometry, streamMaterial);
            stream.position.set(
                -8 + Math.cos(i * Math.PI * 2 / 5) * 1.5,
                3,
                -5 + Math.sin(i * Math.PI * 2 / 5) * 1.5
            );
            archiveGroup.add(stream);
        }

        this.scene.add(archiveGroup);
        this.dataArchive = archiveGroup;
    }

    createNavigationSystem() {
        const navGroup = new THREE.Group();

        // Create main navigation panel
        const panelGeometry = new THREE.PlaneGeometry(4, 3);
        const panelMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x0088ff) }
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
                    float alpha = 0.4 + pulse * 0.2;
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        panel.position.set(8, 2, -5);
        navGroup.add(panel);

        // Add navigation markers
        for (let i = 0; i < 8; i++) {
            const markerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
            const markerMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0x0088ff) }
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
                        float alpha = 0.8 + pulse * 0.2;
                        gl_FragColor = vec4(finalColor, alpha);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide
            });

            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            marker.position.set(
                8 + Math.cos(i * Math.PI * 2 / 8) * 2,
                2 + Math.sin(i * Math.PI * 2 / 8) * 1,
                -5
            );
            navGroup.add(marker);
        }

        this.scene.add(navGroup);
        this.navigationSystem = navGroup;
    }

    createQuantumCore() {
        const coreGroup = new THREE.Group();

        // Create main quantum core
        const coreGeometry = new THREE.OctahedronGeometry(1.5, 0);
        const coreMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xff00ff) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    vNormal = normal;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;

                void main() {
                    float noise = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time) * 0.5 + 0.5;
                    float glow = 1.0 - length(vPosition) * 0.5;
                    vec3 finalColor = color * (0.5 + noise * 0.5);
                    float alpha = 0.8 + glow * 0.2;
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        core.position.set(0, 3, -8);
        coreGroup.add(core);

        // Add quantum particles
        const particleCount = 30;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            const radius = 2 + Math.random() * 2;
            const angle = Math.random() * Math.PI * 2;
            const height = Math.random() * 4;

            positions[i] = Math.cos(angle) * radius;
            positions[i + 1] = height;
            positions[i + 2] = Math.sin(angle) * radius;

            colors[i] = 1;
            colors[i + 1] = 0;
            colors[i + 2] = 1;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        particles.position.set(0, 3, -8);
        coreGroup.add(particles);

        this.scene.add(coreGroup);
        this.quantumCore = coreGroup;
    }

    createTimeField() {
        const fieldGroup = new THREE.Group();

        // Create time field sphere
        const fieldGeometry = new THREE.SphereGeometry(2, 32, 32);
        const fieldMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xffff00) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    vNormal = normal;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;

                void main() {
                    float noise = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time) * 0.5 + 0.5;
                    float glow = 1.0 - length(vPosition) * 0.5;
                    vec3 finalColor = color * (0.5 + noise * 0.5);
                    float alpha = 0.8 + glow * 0.2;
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
        field.position.set(-5, 3, 5);
        fieldGroup.add(field);

        // Add time rings
        for (let i = 0; i < 3; i++) {
            const ringGeometry = new THREE.RingGeometry(2.2 + i * 0.3, 2.3 + i * 0.3, 32);
            const ringMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0xffff00) }
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
                        float pulse = sin(angle * 10.0 + time * 2.0) * 0.5 + 0.5;
                        vec3 finalColor = color * (0.5 + pulse * 0.5);
                        float alpha = 0.3 + pulse * 0.2;
                        gl_FragColor = vec4(finalColor, alpha);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide
            });

            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            fieldGroup.add(ring);
        }

        this.scene.add(fieldGroup);
        this.timeField = fieldGroup;
    }

    createNeuralTerminal() {
        const terminalGroup = new THREE.Group();

        // Create main terminal
        const terminalGeometry = new THREE.BoxGeometry(2, 3, 0.5);
        const terminalMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xff8800) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                void main() {
                    vUv = uv;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                varying vec3 vPosition;

                void main() {
                    float scanline = step(0.5, fract(vUv.y * 20.0 + time * 2.0));
                    float noise = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time) * 0.5 + 0.5;
                    vec3 finalColor = color * (0.5 + noise * 0.5);
                    float alpha = 0.6 + scanline * 0.2;
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const terminal = new THREE.Mesh(terminalGeometry, terminalMaterial);
        terminal.position.set(5, 1.5, 5);
        terminalGroup.add(terminal);

        // Add neural interface elements
        for (let i = 0; i < 4; i++) {
            const elementGeometry = new THREE.PlaneGeometry(0.5, 0.5);
            const elementMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0xff8800) }
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
                        float alpha = 0.4 + pulse * 0.2;
                        gl_FragColor = vec4(finalColor, alpha);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide
            });

            const element = new THREE.Mesh(elementGeometry, elementMaterial);
            element.position.set(
                5 + Math.cos(i * Math.PI * 2 / 4) * 1.5,
                2 + Math.sin(i * Math.PI * 2 / 4) * 0.5,
                5
            );
            terminalGroup.add(element);
        }

        this.scene.add(terminalGroup);
        this.neuralTerminal = terminalGroup;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Update time with optimized calculation
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) * 0.001;
        this.lastTime = currentTime;

        // Update FPS counter with optimized interval
        this.frameCount++;
        if (currentTime - this.lastFpsUpdate >= this.fpsUpdateInterval) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastFpsUpdate));
            this.fpsElement.textContent = `FPS: ${this.fps}`;
            this.frameCount = 0;
            this.lastFpsUpdate = currentTime;
        }

        // Update controls with optimized checks
        if (this.controls && this.controls.enabled) {
            this.controls.update();
        }

        // Update all visual elements with optimized checks
        if (this.particleSystems) this.updateParticleSystems(deltaTime);
        if (this.matrixEffect) this.updateMatrixEffect(deltaTime);
        if (this.quantumField) this.updateQuantumField(deltaTime);
        if (this.neuralNetwork) this.updateNeuralNetwork(deltaTime);
        if (this.timeSphere) this.updateTimeDependentElements();

        // Update coordinates with optimized frequency
        if (this.frameCount % 2 === 0) {
            this.updateCoordinates();
        }

        // Render scene with optimized settings
        this.renderer.render(this.scene, this.camera);
    }

    updateParticleSystems(deltaTime) {
        if (this.particleSystems) {
            this.particleSystems.forEach(system => {
                if (system.material?.uniforms?.time) {
                    system.material.uniforms.time.value += deltaTime;
                }
            });
        }
    }

    updateMatrixEffect(deltaTime) {
        if (this.matrixEffect?.material?.uniforms?.time) {
            this.matrixEffect.material.uniforms.time.value += deltaTime;
        }
    }

    updateQuantumField(deltaTime) {
        if (this.quantumField?.material?.uniforms?.time) {
            this.quantumField.material.uniforms.time.value += deltaTime;
        }
    }

    updateNeuralNetwork(deltaTime) {
        if (this.neuralNetwork?.material?.uniforms?.time) {
            this.neuralNetwork.material.uniforms.time.value += deltaTime;
        }
    }

    updateTimeDependentElements() {
        if (this.timeSphere?.material?.uniforms?.time) {
            this.timeSphere.material.uniforms.time.value += 0.001;
        }
        if (this.timeField?.material?.uniforms?.time) {
            this.timeField.material.uniforms.time.value += 0.001;
        }
    }

    checkPerformance() {
        // Only log performance, don't adjust quality
        console.log(`Current FPS: ${this.fps}`);
    }

    updateCoordinates() {
        const coords = document.querySelectorAll('.coordinates span');
        // Format numbers to show 2 decimal places and handle positive values
        coords[0].textContent = this.camera.position.x.toFixed(2);
        coords[1].textContent = this.camera.position.y.toFixed(2);
        coords[2].textContent = this.camera.position.z.toFixed(2);

        // Add color indication for positive/negative values
        coords.forEach((span, index) => {
            const value = parseFloat(span.textContent);
            if (value > 0) {
                span.style.color = '#00ffc8'; // Positive values in cyan
            } else if (value < 0) {
                span.style.color = '#ff6b6b'; // Negative values in red
            } else {
                span.style.color = '#00ffc8'; // Zero in cyan
            }
        });
    }

    onWindowResize() {
        // Optimize window resize handling
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Update camera aspect ratio
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        // Update renderer size
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Update canvas size
        const canvas = document.getElementById('workspace-canvas');
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
    }

    createNavigationMenu() {
        const menu = document.createElement('div');
        Object.assign(menu.style, {
            position: 'fixed',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            zIndex: '1000',
            background: 'rgba(0, 0, 0, 0.7)',
            padding: '20px',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 255, 200, 0.2)',
            boxShadow: '0 0 20px rgba(0, 255, 200, 0.1)'
        });

        const buttons = [
            { name: 'Toggle Grid', icon: '📏', action: () => this.toggleGridVisibility() },
            { name: 'Front View', icon: '⬅️', action: () => this.setView('Front') },
            { name: 'Side View', icon: '➡️', action: () => this.setView('Side') },
            { name: 'Top View', icon: '⬆️', action: () => this.setView('Top') }
        ];

        buttons.forEach(button => {
            const btn = document.createElement('button');
            Object.assign(btn.style, {
                background: 'rgba(0, 255, 200, 0.1)',
                border: '1px solid rgba(0, 255, 200, 0.3)',
                color: '#00ffc8',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontFamily: 'monospace',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                width: '100%',
                textAlign: 'left'
            });

            btn.innerHTML = `${button.icon} ${button.name}`;

            btn.addEventListener('mouseover', () => {
                btn.style.background = 'rgba(0, 255, 200, 0.2)';
                btn.style.borderColor = 'rgba(0, 255, 200, 0.8)';
            });

            btn.addEventListener('mouseout', () => {
                btn.style.background = 'rgba(0, 255, 200, 0.1)';
                btn.style.borderColor = 'rgba(0, 255, 200, 0.3)';
            });

            btn.addEventListener('click', button.action);
            menu.appendChild(btn);
        });

        document.body.appendChild(menu);
    }

    setView(view) {
        const distance = 10;
        const duration = 1000;
        const startPosition = this.camera.position.clone();
        const startTarget = this.controls.target.clone();
        const startTime = Date.now();

        let targetPosition, targetLookAt;

        switch (view) {
            case 'Top':
                targetPosition = new THREE.Vector3(0, distance, 0);
                targetLookAt = new THREE.Vector3(0, 0, 0);
                break;
            case 'Front':
                targetPosition = new THREE.Vector3(0, 0, distance);
                targetLookAt = new THREE.Vector3(0, 0, 0);
                break;
            case 'Side':
                targetPosition = new THREE.Vector3(distance, 0, 0);
                targetLookAt = new THREE.Vector3(0, 0, 0);
                break;
        }

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth transition
            const easeProgress = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            this.camera.position.lerpVectors(startPosition, targetPosition, easeProgress);
            this.controls.target.lerpVectors(startTarget, targetLookAt, easeProgress);
            this.controls.update();

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }
}

// Initialize workspace
const workspace = new FuturisticWorkspace();

// Handle window resize
window.addEventListener('resize', () => workspace.onWindowResize());
class FuturisticWorkspace {
    constructor() {
        this.init();
        this.createEnvironment();
        this.setupInteraction();
        this.setupChatula();
        this.createConnectedGrids();
        this.createInfiniteTimelineV2();
        this.createGlobeWithGravity();
        this.createAdditionalWorkspace();
        this.createNeuralPlatform();
        this.createCityGrid();
        this.createSolklarrSystem();
        this.createGalaxySystem();
        this.animate();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x0a0a0f, 0.02);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(5, 5, 5);

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('workspace-canvas'),
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

        // Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // Time management
        this.clock = new THREE.Clock();
        this.windows = [];

        // Add universal physics
        this.createUniversalPhysics();

        // Create infinite timeline
        this.createInfiniteTimeline();

        // Setup camera
        this.setupCamera();
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
    }

    createPlatform() {
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

        // Add the duplicate group to the scene
        this.scene.add(duplicateGroup);

        // Store reference for animation
        this.duplicateEnvironment = duplicateGroup;
    }

    setupInteraction() {
        // Add window creation
        document.querySelector('.add-window').addEventListener('click', () => {
            this.createWorkspaceWindow();
        });

        // Add view controls
        document.querySelector('.view-front').addEventListener('click', () => {
            this.setView('front');
        });
        document.querySelector('.view-top').addEventListener('click', () => {
            this.setView('top');
        });
        document.querySelector('.view-side').addEventListener('click', () => {
            this.setView('side');
        });

        // Toggle grid
        document.querySelector('.toggle-grid').addEventListener('click', () => {
            this.grid.visible = !this.grid.visible;
        });

        // Add shift-click particle creation
        this.renderer.domElement.addEventListener('click', (event) => {
            if (event.shiftKey) {
                this.createFloatingParticle(event);
            }
        });
    }

    setView(view) {
        const positions = {
            front: { x: 0, y: 0, z: 8 },
            top: { x: 0, y: 8, z: 0 },
            side: { x: 8, y: 0, z: 0 }
        };

        gsap.to(this.camera.position, {
            ...positions[view],
            duration: 1,
            ease: 'power2.inOut'
        });
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

    createQuantumParticleSystem() {
        // Create particle group
        const particleGroup = new THREE.Group();
        
        // Particle parameters
        const particleCount = 100;
        const particleSize = 0.1;
        const fieldSize = 10;

        // Create particle geometry and materials
        const particleGeometry = new THREE.SphereGeometry(particleSize, 8, 8);
        const particleMaterials = [
            new THREE.MeshPhongMaterial({
                color: 0x00ffff,
                emissive: 0x00ffff,
                transparent: true,
                opacity: 0.6
            }),
            new THREE.MeshPhongMaterial({
                color: 0xff00ff,
                emissive: 0xff00ff,
                transparent: true,
                opacity: 0.6
            }),
            new THREE.MeshPhongMaterial({
                color: 0xffff00,
                emissive: 0xffff00,
                transparent: true,
                opacity: 0.6
            })
        ];

        // Create particles
        this.quantumParticles = [];
        for (let i = 0; i < particleCount; i++) {
            const particle = new THREE.Mesh(
                particleGeometry,
                particleMaterials[Math.floor(Math.random() * particleMaterials.length)]
            );

            // Random initial position
            particle.position.set(
                (Math.random() - 0.5) * fieldSize,
                (Math.random() - 0.5) * fieldSize,
                (Math.random() - 0.5) * fieldSize
            );

            // Add quantum properties
            particle.userData.phase = Math.random() * Math.PI * 2;
            particle.userData.frequency = 0.5 + Math.random();
            particle.userData.amplitude = 0.5 + Math.random();
            particle.userData.entangled = null;

            // Random particle pairs are quantum entangled
            if (i % 2 === 0 && i < particleCount - 1) {
                const nextParticle = this.quantumParticles[i + 1];
                if (nextParticle) {
                    particle.userData.entangled = nextParticle;
                    nextParticle.userData.entangled = particle;
                }
            }

            this.quantumParticles.push(particle);
            particleGroup.add(particle);
        }

        // Add glow effect to the particle field
        const glowGeometry = new THREE.SphereGeometry(fieldSize * 0.6, 32, 32);
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x00ffff) }
            },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec3 vNormal;
                
                void main() {
                    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    float pulse = sin(time * 0.5) * 0.1 + 0.9;
                    vec3 finalColor = color * intensity * pulse;
                    gl_FragColor = vec4(finalColor, intensity * 0.3);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide
        });

        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        particleGroup.add(glow);

        // Position the system
        particleGroup.position.set(-50, 50, -50);

        // Add to scene
        this.scene.add(particleGroup);

        // Store references for animation
        this.quantumParticleSystem = particleGroup;
        this.quantumGlowMaterial = glowMaterial;

        return particleGroup;
    }

    updateQuantumParticles() {
        if (!this.quantumParticles) return;

        const time = Date.now() * 0.001;

        this.quantumParticles.forEach(particle => {
            // Update particle position based on quantum wave function
            const phase = particle.userData.phase;
            const frequency = particle.userData.frequency;
            const amplitude = particle.userData.amplitude;

            particle.position.x += Math.sin(time * frequency + phase) * amplitude * 0.02;
            particle.position.y += Math.cos(time * frequency + phase) * amplitude * 0.02;
            particle.position.z += Math.sin(time * frequency * 0.5 + phase) * amplitude * 0.02;

            // Update entangled particle if it exists
            if (particle.userData.entangled) {
                const entangled = particle.userData.entangled;
                entangled.position.x = -particle.position.x;
                entangled.position.y = -particle.position.y;
                entangled.position.z = -particle.position.z;
            }

            // Update particle opacity based on quantum probability
            particle.material.opacity = 0.3 + Math.sin(time * frequency) * 0.3;
        });

        // Update glow effect
        if (this.quantumGlowMaterial) {
            this.quantumGlowMaterial.uniforms.time.value = time;
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.updateCamera();

        const time = this.clock.getElapsedTime();

        // Update platform
        this.platform.material.uniforms.time.value = time;

        // Update pyramid
        if (this.pyramid) {
            this.pyramid.children.forEach(child => {
                if (child.material && child.material.uniforms) {
                    child.material.uniforms.time.value = time;
                }
            });
            this.pyramid.rotation.y = time * 0.1;
        }

        // Update duplicate environment
        if (this.duplicateEnvironment) {
            this.duplicateEnvironment.children.forEach(child => {
                if (child.material && child.material.uniforms) {
                    child.material.uniforms.time.value = time;
                }
                if (child.children) {
                    child.children.forEach(subChild => {
                        if (subChild.material && subChild.material.uniforms) {
                            subChild.material.uniforms.time.value = time;
                        }
                    });
                }
            });
            // Rotate the duplicate pyramid in the opposite direction
            const duplicatePyramid = this.duplicateEnvironment.children.find(child => 
                child.geometry && child.geometry.type === 'ConeGeometry'
            );
            if (duplicatePyramid) {
                duplicatePyramid.rotation.y = -time * 0.1;
            }
        }

        // Update search box
        if (this.searchBox) {
            this.searchBox.material.uniforms.time.value = time;
            // Make the search box always face the camera
            this.searchBox.lookAt(this.camera.position);
        }

        // Update particles
        this.particles.rotation.y = time * 0.05;

        // Update floating particles
        if (this.floatingParticles) {
            this.floatingParticles.forEach(particle => {
                // Update position
                particle.mesh.position.add(particle.velocity);
                
                // Update rotation
                particle.mesh.rotation.x += particle.rotation.x;
                particle.mesh.rotation.y += particle.rotation.y;
                particle.mesh.rotation.z += particle.rotation.z;
                
                // Update shader time
                particle.mesh.material.uniforms.time.value = time;
                
                // Fade out over time
                const age = time - particle.mesh.userData.creationTime;
                if (age > 5) { // Particles last for 5 seconds
                    particle.mesh.material.opacity = 1 - (age - 5);
                    if (age > 6) {
                        this.scene.remove(particle.mesh);
                        this.floatingParticles = this.floatingParticles.filter(p => p !== particle);
                    }
                }
            });
        }

        // Update holographic elements
        this.scene.traverse(child => {
            if (child.material && child.material.uniforms) {
                child.material.uniforms.time.value = time;
            }
        });

        // Animate point lights
        this.pointLights.forEach((light, i) => {
            const angle = time * 0.5 + (i * Math.PI * 2) / this.pointLights.length;
            light.position.x = Math.cos(angle) * 5;
            light.position.z = Math.sin(angle) * 5;
        });

        // Update quantum particle system
        this.updateQuantumParticles();

        // Update controls
        this.controls.update();

        // Render
        this.renderer.render(this.scene, this.camera);

        // Update coordinates display
        this.updateCoordinates();

        // Update additional workspace
        if (this.additionalWorkspace) {
            this.additionalWorkspace.children.forEach(child => {
                if (child.material && child.material.uniforms) {
                    child.material.uniforms.time.value = time;
                }
            });
            this.additionalWorkspace.rotation.y = time * 0.05;
        }

        // Update neural platform
        if (this.neuralPlatform) {
            // Update nodes
            this.neuralPlatform.nodes.forEach(node => {
                if (node.material && node.material.uniforms) {
                    node.material.uniforms.time.value = time;
                }
            });

            // Update vortex rotation
            const vortex = this.neuralPlatform.group.children.find(child => 
                child.geometry && child.geometry.type === 'CylinderGeometry'
            );
            if (vortex) {
                vortex.rotation.y = time * 2;
            }

            // Update particle positions based on gravitational pull
            const positions = this.neuralPlatform.particles.positions;
            const velocities = this.neuralPlatform.particles.velocities;

            for (let i = 0; i < positions.length; i += 3) {
                // Calculate distance from center
                const x = positions[i];
                const y = positions[i + 1];
                const z = positions[i + 2];
                const dist = Math.sqrt(x * x + y * y + z * z);

                // Apply gravitational force
                const force = 0.0002 / (dist * dist); // Stronger gravitational pull
                velocities[i] -= x * force;
                velocities[i + 1] -= y * force;
                velocities[i + 2] -= z * force;

                // Update positions
                positions[i] += velocities[i];
                positions[i + 1] += velocities[i + 1];
                positions[i + 2] += velocities[i + 2];
            }

            this.neuralPlatform.particles.mesh.geometry.attributes.position.needsUpdate = true;
        }

        // Update city grid
        if (this.cityGrid) {
            // Update building materials
            this.cityGrid.buildings.forEach(building => {
                if (building.material && building.material.uniforms) {
                    building.material.uniforms.time.value = time;
                }
            });

            // Update gravitational core
            if (this.cityGrid.gravitationalCore.material && this.cityGrid.gravitationalCore.material.uniforms) {
                this.cityGrid.gravitationalCore.material.uniforms.time.value = time;
            }

            // Update particle positions with realistic gravitational effects
            const positions = this.cityGrid.particles.positions;
            const velocities = this.cityGrid.particles.velocities;
            const masses = this.cityGrid.particles.masses;
            const corePosition = this.cityGrid.gravitationalCore.position;

            for (let i = 0; i < positions.length; i += 3) {
                // Calculate distance from core
                const dx = positions[i] - corePosition.x;
                const dy = positions[i + 1] - corePosition.y;
                const dz = positions[i + 2] - corePosition.z;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                // Calculate gravitational force (F = G * m1 * m2 / r^2)
                const G = 0.0001; // Gravitational constant (scaled for visualization)
                const force = G * masses[i / 3] / (dist * dist);

                // Apply force to velocity
                velocities[i] -= (dx / dist) * force;
                velocities[i + 1] -= (dy / dist) * force;
                velocities[i + 2] -= (dz / dist) * force;

                // Update positions
                positions[i] += velocities[i];
                positions[i + 1] += velocities[i + 1];
                positions[i + 2] += velocities[i + 2];
            }

            this.cityGrid.particles.mesh.geometry.attributes.position.needsUpdate = true;
        }

        // Update Solklarr system
        if (this.solklarrSystem) {
            // Update star
            if (this.solklarrSystem.star.material && this.solklarrSystem.star.material.uniforms) {
                this.solklarrSystem.star.material.uniforms.time.value = time;
            }

            // Update planets
            this.solklarrSystem.planets.forEach(planet => {
                if (planet.material && planet.material.uniforms) {
                    planet.material.uniforms.time.value = time;
                }

                // Update planet position
                planet.userData.angle += planet.userData.speed;
                planet.position.x = Math.cos(planet.userData.angle) * planet.userData.orbit;
                planet.position.z = Math.sin(planet.userData.angle) * planet.userData.orbit;
            });

            // Rotate asteroid belt
            this.solklarrSystem.asteroidBelt.rotation.y = time * 0.05;
        }

        // Update galaxy system
        if (this.galaxySystem) {
            // Update black hole
            if (this.galaxySystem.blackHole.material && this.galaxySystem.blackHole.material.uniforms) {
                this.galaxySystem.blackHole.material.uniforms.time.value = time;
            }

            // Update accretion disk
            if (this.galaxySystem.group.children[1].material && this.galaxySystem.group.children[1].material.uniforms) {
                this.galaxySystem.group.children[1].material.uniforms.time.value = time;
            }

            // Update planets
            this.galaxySystem.planets.forEach(planet => {
                if (planet.material && planet.material.uniforms) {
                    planet.material.uniforms.time.value = time;
                }

                // Update planet position
                planet.userData.angle += planet.userData.speed;
                planet.position.x = Math.cos(planet.userData.angle) * planet.userData.orbit;
                planet.position.z = Math.sin(planet.userData.angle) * planet.userData.orbit;
            });

            // Update nebula
            if (this.galaxySystem.nebula.material && this.galaxySystem.nebula.material.uniforms) {
                this.galaxySystem.nebula.material.uniforms.time.value = time;
            }

            // Rotate the entire galaxy around the central object
            if (this.galaxyCentralObject) {
                this.galaxySystem.group.rotation.y = time * 0.05;
                this.galaxySystem.group.position.x = this.galaxyCentralObject.position.x + Math.cos(time * 0.05) * 1000;
                this.galaxySystem.group.position.z = this.galaxyCentralObject.position.z + Math.sin(time * 0.05) * 1000;
            }
        }

        // Update central object
        if (this.galaxyCentralObject) {
            // Update central object glow
            if (this.galaxyCentralObject.children[0].material && this.galaxyCentralObject.children[0].material.uniforms) {
                this.galaxyCentralObject.children[0].material.uniforms.time.value = time;
            }

            // Update rings
            for (let i = 1; i <= 5; i++) {
                if (this.galaxyCentralObject.children[i].material && this.galaxyCentralObject.children[i].material.uniforms) {
                    this.galaxyCentralObject.children[i].material.uniforms.time.value = time;
                }
                this.galaxyCentralObject.children[i].rotation.y = time * (0.1 + i * 0.05);
            }

            // Update tendrils
            for (let i = 6; i < 14; i++) {
                if (this.galaxyCentralObject.children[i].material && this.galaxyCentralObject.children[i].material.uniforms) {
                    this.galaxyCentralObject.children[i].material.uniforms.time.value = time;
                }
                this.galaxyCentralObject.children[i].rotation.y = time * (0.2 + (i - 6) * 0.1);
            }

            // Update energy field
            if (this.galaxyCentralObject.children[14].material && this.galaxyCentralObject.children[14].material.uniforms) {
                this.galaxyCentralObject.children[14].material.uniforms.time.value = time;
            }
        }
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
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    createUniversalPhysics() {
        // Universal Constants
        this.physics = {
            G: 6.67430e-11,  // Gravitational constant
            c: 299792458,     // Speed of light
            h: 6.62607015e-34, // Planck constant
            scaleFactor: 1e-20 // Scale factor for visualization
        };

        // Forces
        this.forces = {
            // Gravitational Force
            calculateGravity: (mass1, mass2, distance) => {
                return (this.physics.G * mass1 * mass2) / (distance * distance);
            },
            
            // Electromagnetic Force
            calculateElectromagnetic: (charge1, charge2, distance) => {
                const k = 8.9875517923e9; // Coulomb constant
                return (k * charge1 * charge2) / (distance * distance);
            },
            
            // Strong Nuclear Force
            calculateStrongNuclear: (distance) => {
                const strongCoupling = 1;
                return strongCoupling * Math.exp(-distance / 1e-15);
            },
            
            // Weak Nuclear Force
            calculateWeakNuclear: (distance) => {
                const weakCoupling = 1e-6;
                return weakCoupling * Math.exp(-distance / 1e-18);
            }
        };

        // Spacetime properties
        this.spacetime = {
            curvature: 0,
            expansion: 70.0, // Hubble constant in km/s/Mpc
            darkEnergy: 0.7, // Dark energy density
            darkMatter: 0.25, // Dark matter density
            normalMatter: 0.05 // Normal matter density
        };
    }

    createInfiniteTimeline() {
        // Create timeline container
        const timelineContainer = document.createElement('div');
        timelineContainer.className = 'infinite-timeline';
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
            background: linear-gradient(
                90deg,
                rgba(0, 255, 255, 0) 0%,
                rgba(0, 255, 255, 0.8) 50%,
                rgba(0, 255, 255, 0) 100%
            );
        `;

        // Create time markers
        const epochs = [
            { name: 'Big Bang', time: -13.8e9 },
            { name: 'Galaxy Formation', time: -13e9 },
            { name: 'Solar System', time: -4.6e9 },
            { name: 'Present', time: 0 },
            { name: 'Future', time: Infinity }
        ];

        epochs.forEach(epoch => {
            const marker = document.createElement('div');
            marker.className = 'timeline-marker';
            marker.style.cssText = `
                position: absolute;
                left: ${epoch.time === Infinity ? '100%' : (epoch.time + 13.8e9) / 27.6e9 * 100 + '%'};
                transform: translateX(-50%);
                width: 2px;
                height: 10px;
                background: rgba(0, 255, 255, 0.8);
            `;

            const label = document.createElement('div');
            label.textContent = epoch.name;
            label.style.cssText = `
                position: absolute;
                top: -20px;
                left: 50%;
                transform: translateX(-50%);
                color: rgba(0, 255, 255, 0.8);
                font-size: 12px;
                white-space: nowrap;
            `;

            marker.appendChild(label);
            timelineAxis.appendChild(marker);
        });

        timelineContainer.appendChild(timelineAxis);
        document.body.appendChild(timelineContainer);
    }

    setupCamera() {
        // Enhanced camera settings
        this.camera.fov = 60; // Wider field of view
        this.camera.near = 0.1;
        this.camera.far = 10000; // Increased far plane for better distance viewing
        this.camera.updateProjectionMatrix();

        // Improved camera controls
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.rotateSpeed = 0.8;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.8;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 1000;
        this.controls.maxPolarAngle = Math.PI * 0.85; // Prevent camera from going under objects
        this.controls.screenSpacePanning = true;

        // Add smooth transitions
        this.cameraTransitions = {
            inProgress: false,
            duration: 1000,
            easing: t => t<.5 ? 2*t*t : -1+(4-2*t)*t // Smooth easing function
        };

        // Add camera shake effect
        this.cameraShake = {
            enabled: false,
            intensity: 0.2,
            decay: 0.95
        };
    }

    smoothCameraTransition(targetPosition, targetLookAt) {
        if (this.cameraTransitions.inProgress) return;
        
        const startPosition = this.camera.position.clone();
        const startTarget = this.controls.target.clone();
        const startTime = Date.now();

        this.cameraTransitions.inProgress = true;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / this.cameraTransitions.duration, 1);
            const easeProgress = this.cameraTransitions.easing(progress);

            // Update camera position
            this.camera.position.lerpVectors(startPosition, targetPosition, easeProgress);
            this.controls.target.lerpVectors(startTarget, targetLookAt, easeProgress);
            this.controls.update();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.cameraTransitions.inProgress = false;
            }
        };

        animate();
    }

    addCameraShake(intensity = 0.5, duration = 500) {
        this.cameraShake.enabled = true;
        this.cameraShake.intensity = intensity;
        
        setTimeout(() => {
            this.cameraShake.enabled = false;
        }, duration);
    }

    updateCamera() {
        // Apply camera shake if enabled
        if (this.cameraShake.enabled) {
            const shake = {
                x: (Math.random() - 0.5) * this.cameraShake.intensity,
                y: (Math.random() - 0.5) * this.cameraShake.intensity,
                z: (Math.random() - 0.5) * this.cameraShake.intensity
            };

            this.camera.position.add(new THREE.Vector3(shake.x, shake.y, shake.z));
            this.cameraShake.intensity *= this.cameraShake.decay;
        }

        // Update controls
        this.controls.update();
    }

    setupChatula() {
        this.chatulaContainer = document.querySelector('.chatula-container');
        this.toggleChatulaBtn = document.querySelector('.toggle-chatula');
        this.chatulaCloseBtn = document.querySelector('.chatula-close');
        this.chatulaContent = document.querySelector('.chatula-content');

        // Add event listeners
        this.toggleChatulaBtn.addEventListener('click', () => this.toggleChatula());
        this.chatulaCloseBtn.addEventListener('click', () => this.toggleChatula());

        // Initialize Chatula content
        this.initializeChatulaContent();
    }

    toggleChatula() {
        this.chatulaContainer.classList.toggle('active');
        if (this.chatulaContainer.classList.contains('active')) {
            // Pause workspace animations when Chatula is active
            this.pauseWorkspace();
        } else {
            // Resume workspace animations when Chatula is closed
            this.resumeWorkspace();
        }
    }

    pauseWorkspace() {
        // Store current animation state
        this.wasAnimating = this.isAnimating;
        if (this.isAnimating) {
            this.isAnimating = false;
        }
    }

    resumeWorkspace() {
        // Restore animation state
        if (this.wasAnimating) {
            this.isAnimating = true;
        }
    }

    initializeChatulaContent() {
        // Add welcome message
        const welcomeMessage = document.createElement('div');
        welcomeMessage.innerHTML = `
            <h2 style="color: #00ffc8; margin-bottom: 20px;">Welcome to Chatula Workspace</h2>
            <p style="color: #00ffc8; opacity: 0.8;">
                This is an integrated environment combining the power of Chatula with an immersive 3D workspace.
                Use the controls to navigate and interact with both interfaces.
            </p>
        `;
        this.chatulaContent.appendChild(welcomeMessage);

        // Add feature list
        const featuresList = document.createElement('div');
        featuresList.innerHTML = `
            <h3 style="color: #00ffc8; margin: 20px 0;">Features</h3>
            <ul style="color: #00ffc8; opacity: 0.8; list-style: none; padding: 0;">
                <li style="margin: 10px 0;">• Interactive 3D Environment</li>
                <li style="margin: 10px 0;">• Quantum Particle System</li>
                <li style="margin: 10px 0;">• Universal Physics Simulation</li>
                <li style="margin: 10px 0;">• Infinite Timeline</li>
                <li style="margin: 10px 0;">• Dynamic Window Management</li>
            </ul>
        `;
        this.chatulaContent.appendChild(featuresList);
    }

    createNewWorkspaceGrid() {
        // Create a new grid at the specified coordinates
        const gridSize = 20;
        const gridDivisions = 20;
        const gridColor = 0x00ffc8;
        const gridHelperColor = 0x004433;

        // Create the main grid
        this.workspaceGrid = new THREE.GridHelper(gridSize, gridDivisions, gridColor, gridHelperColor);
        this.workspaceGrid.position.set(68.98, 41.00, -6.38);
        this.scene.add(this.workspaceGrid);

        // Create a creative platform layout
        this.createCreativePlatform();
    }

    createCreativePlatform() {
        // Create a group to hold all platform elements
        const platformGroup = new THREE.Group();
        platformGroup.position.set(68.98, 41.00, -6.38);

        // Create the main platform base
        const baseGeometry = new THREE.CircleGeometry(5, 32);
        const baseMaterial = new THREE.ShaderMaterial({
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

        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.rotation.x = -Math.PI / 2;
        base.position.y = 0.1;
        platformGroup.add(base);

        // Create elevated platforms
        const platformPositions = [
            { x: -2, y: 1, z: -2, size: 1.5 },
            { x: 2, y: 1.5, z: -2, size: 1.2 },
            { x: 0, y: 2, z: 2, size: 1.8 },
            { x: -2, y: 1.8, z: 2, size: 1.3 },
            { x: 2, y: 1.2, z: 0, size: 1.4 }
        ];

        platformPositions.forEach(pos => {
            const platform = this.createElevatedPlatform(pos.size);
            platform.position.set(pos.x, pos.y, pos.z);
            platformGroup.add(platform);
        });

        // Create connecting bridges
        this.createBridges(platformGroup, platformPositions);

        // Add ambient effects
        this.addPlatformEffects(platformGroup);

        // Add the platform group to the scene
        this.scene.add(platformGroup);
        this.workspacePlatform = platformGroup;
    }

    createElevatedPlatform(size) {
        const geometry = new THREE.CircleGeometry(size, 32);
        const material = new THREE.ShaderMaterial({
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
                    float dist = length(vUv - 0.5);
                    float pulse = sin(dist * 8.0 - time * 1.5) * 0.5 + 0.5;
                    float height = vPosition.y / 2.0;
                    vec3 finalColor = mix(color, vec3(1.0), height);
                    float alpha = smoothstep(0.5, 0.4, dist) * (0.7 + pulse * 0.3);
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const platform = new THREE.Mesh(geometry, material);
        platform.rotation.x = -Math.PI / 2;

        // Add support structure
        const supportGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8);
        const supportMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ffc8,
            transparent: true,
            opacity: 0.6
        });
        const support = new THREE.Mesh(supportGeometry, supportMaterial);
        support.position.y = -0.25;
        platform.add(support);

        return platform;
    }

    createBridges(platformGroup, positions) {
        positions.forEach((pos1, i) => {
            positions.slice(i + 1).forEach(pos2 => {
                const bridge = this.createBridge(
                    new THREE.Vector3(pos1.x, pos1.y, pos1.z),
                    new THREE.Vector3(pos2.x, pos2.y, pos2.z)
                );
                platformGroup.add(bridge);
            });
        });
    }

    createBridge(start, end) {
        const direction = new THREE.Vector3().subVectors(end, start);
        const length = direction.length();
        direction.normalize();

        const geometry = new THREE.CylinderGeometry(0.05, 0.05, length, 8);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xff00ff) }
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
                    float pulse = sin(vPosition.y * 10.0 + time * 2.0) * 0.5 + 0.5;
                    vec3 finalColor = color * (0.5 + pulse * 0.5);
                    float alpha = 0.6 + pulse * 0.4;
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true
        });

        const bridge = new THREE.Mesh(geometry, material);
        bridge.position.copy(start.clone().add(end).multiplyScalar(0.5));
        bridge.lookAt(end);
        bridge.rotateX(Math.PI / 2);

        return bridge;
    }

    addPlatformEffects(platformGroup) {
        // Add floating particles around the platform
        const particleCount = 50;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 10;
            positions[i + 1] = Math.random() * 3;
            positions[i + 2] = (Math.random() - 0.5) * 10;

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
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        platformGroup.add(particles);
        this.workspaceParticles = particles;
    }

    createConnectedGrids() {
        // Create a group to hold all grids
        this.gridGroup = new THREE.Group();
        
        // Create three grids with different positions
        const gridSize = 20;
        const gridDivisions = 20;
        const gridColor = 0x00ffc8;
        const gridHelperColor = 0x004433;

        // Main grid at origin (0,0,0)
        this.mainGrid = new THREE.GridHelper(gridSize, gridDivisions, gridColor, gridHelperColor);
        this.mainGrid.position.set(0, 0, 0);
        this.gridGroup.add(this.mainGrid);

        // Second grid at specified coordinates
        this.secondGrid = new THREE.GridHelper(gridSize, gridDivisions, gridColor, gridHelperColor);
        this.secondGrid.position.set(68.98, 48.36, -5.90);
        this.gridGroup.add(this.secondGrid);

        // Third grid at another position
        this.thirdGrid = new THREE.GridHelper(gridSize, gridDivisions, gridColor, gridHelperColor);
        this.thirdGrid.position.set(-68.98, 48.36, 5.90);
        this.gridGroup.add(this.thirdGrid);

        // Add connecting lines between grids
        this.createGridConnections();

        // Add cool elements to top grids
        this.addCoolElementsToGrids();

        // Add ambient particle effects
        this.addGridAmbientEffects();

        // Add the grid group to the scene
        this.scene.add(this.gridGroup);
    }

    createGridConnections() {
        const material = new THREE.ShaderMaterial({
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
                    vec3 finalColor = color * (0.5 + pulse * 0.5);
                    gl_FragColor = vec4(finalColor, 0.6 + pulse * 0.4);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        // Create connections between grids
        const positions = [
            this.mainGrid.position,
            this.secondGrid.position,
            this.thirdGrid.position
        ];

        positions.forEach((pos1, i) => {
            positions.slice(i + 1).forEach(pos2 => {
                const geometry = new THREE.BufferGeometry();
                const vertices = new Float32Array([
                    pos1.x, pos1.y, pos1.z,
                    pos2.x, pos2.y, pos2.z
                ]);
                geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
                const line = new THREE.Line(geometry, material);
                this.gridGroup.add(line);
            });
        });
    }

    addCoolElementsToGrids() {
        // Create holographic rings for top grids
        [this.secondGrid, this.thirdGrid].forEach((grid, index) => {
            // Create multiple rings with different sizes and effects
            for (let i = 0; i < 3; i++) {
                const ringGeometry = new THREE.RingGeometry(5 + i * 2, 5.1 + i * 2, 64);
                const ringMaterial = new THREE.ShaderMaterial({
                    uniforms: {
                        time: { value: 0 },
                        color: { value: new THREE.Color(index === 0 ? 0xff00ff : 0x00ffff) }
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
                ring.position.y = 0.1 + i * 0.5;
                grid.add(ring);
            }

            // Add floating energy orbs
            const orbGeometry = new THREE.SphereGeometry(0.5, 16, 16);
            const orbMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(index === 0 ? 0xff00ff : 0x00ffff) }
                },
                vertexShader: `
                    varying vec3 vNormal;
                    varying vec3 vPosition;
                    void main() {
                        vNormal = normalize(normalMatrix * normal);
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
                        float pulse = sin(time * 2.0 + vPosition.y * 5.0) * 0.5 + 0.5;
                        vec3 finalColor = color * (0.5 + pulse * 0.5);
                        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                        gl_FragColor = vec4(finalColor * intensity, 0.8 + pulse * 0.2);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending
            });

            const orb = new THREE.Mesh(orbGeometry, orbMaterial);
            orb.position.y = 2;
            grid.add(orb);
        });
    }

    addGridAmbientEffects() {
        // Create a large particle system surrounding the grid group
        const particleCount = 500;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);

        // Calculate the bounding box of the grid group
        const box = new THREE.Box3().setFromObject(this.gridGroup);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        for (let i = 0; i < particleCount * 3; i += 3) {
            // Position particles in a larger volume around the grid group
            positions[i] = center.x + (Math.random() - 0.5) * size.x * 2;
            positions[i + 1] = center.y + (Math.random() - 0.5) * size.y * 2;
            positions[i + 2] = center.z + (Math.random() - 0.5) * size.z * 2;

            // Random colors with some variation
            colors[i] = Math.random() * 0.5 + 0.5;     // R
            colors[i + 1] = Math.random() * 0.5 + 0.5; // G
            colors[i + 2] = Math.random() * 0.5 + 0.5; // B

            // Random velocities for particle movement
            velocities[i] = (Math.random() - 0.5) * 0.02;
            velocities[i + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i + 2] = (Math.random() - 0.5) * 0.02;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        this.gridGroup.add(particles);
        this.gridParticles = {
            mesh: particles,
            velocities: velocities,
            positions: positions
        };
    }

    createInfiniteTimelineV2() {
        // Create a 3D timeline in the scene
        const timelineGroup = new THREE.Group();
        
        // Create timeline axis
        const axisGeometry = new THREE.CylinderGeometry(0.05, 0.05, 100, 8);
        const axisMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xff00ff) }
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
                    vec3 finalColor = color * (0.5 + pulse * 0.5);
                    gl_FragColor = vec4(finalColor, 0.8 + pulse * 0.2);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        const timelineAxis = new THREE.Mesh(axisGeometry, axisMaterial);
        timelineAxis.rotation.x = Math.PI / 2;
        timelineAxis.position.y = 10;
        timelineGroup.add(timelineAxis);

        // Add time markers
        const epochs = [
            { name: 'Big Bang', time: -13.8e9 },
            { name: 'Galaxy Formation', time: -13e9 },
            { name: 'Solar System', time: -4.6e9 },
            { name: 'Present', time: 0 },
            { name: 'Future', time: Infinity }
        ];

        epochs.forEach(epoch => {
            const markerGeometry = new THREE.SphereGeometry(0.2, 16, 16);
            const markerMaterial = new THREE.MeshPhongMaterial({
                color: 0x00ffff,
                emissive: 0x00ffff,
                transparent: true,
                opacity: 0.8
            });
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            
            // Position marker along the timeline
            const position = epoch.time === Infinity ? 50 : (epoch.time + 13.8e9) / 27.6e9 * 50;
            marker.position.set(position, 10, 0);
            
            timelineGroup.add(marker);
        });

        // Add the timeline group to the scene
        this.scene.add(timelineGroup);
        this.timelineGroup = timelineGroup;
    }

    createGlobeWithGravity() {
        const globeGroup = new THREE.Group();
        
        // Create Earth-like globe
        const globeGeometry = new THREE.SphereGeometry(5, 64, 64);
        const globeMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x0088ff) }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
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
                    float pulse = sin(time * 2.0 + vPosition.y * 5.0) * 0.5 + 0.5;
                    vec3 finalColor = color * (0.5 + pulse * 0.5);
                    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    gl_FragColor = vec4(finalColor * intensity, 0.8 + pulse * 0.2);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        const globe = new THREE.Mesh(globeGeometry, globeMaterial);
        globeGroup.add(globe);

        // Add gravitational field
        const fieldGeometry = new THREE.SphereGeometry(15, 32, 32);
        const fieldMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xff00ff) }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
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
                    float dist = length(vPosition);
                    float intensity = 1.0 - smoothstep(5.0, 15.0, dist);
                    float pulse = sin(time * 2.0 + dist * 5.0) * 0.5 + 0.5;
                    vec3 finalColor = color * intensity * (0.5 + pulse * 0.5);
                    gl_FragColor = vec4(finalColor, intensity * 0.3);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide
        });

        const gravitationalField = new THREE.Mesh(fieldGeometry, fieldMaterial);
        globeGroup.add(gravitationalField);

        // Add orbiting particles
        const particleCount = 100;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            const radius = 7 + Math.random() * 3;
            const angle = Math.random() * Math.PI * 2;
            const height = (Math.random() - 0.5) * 2;

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
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        globeGroup.add(particles);

        // Position the globe group
        globeGroup.position.set(0, 20, 0);

        // Add to scene
        this.scene.add(globeGroup);
        this.globeGroup = globeGroup;
    }

    createAdditionalWorkspace() {
        // Create a group to hold the new workspace elements
        const additionalWorkspaceGroup = new THREE.Group();
        additionalWorkspaceGroup.position.set(18.06, 36.28, 20.97);

        // Create grid
        const gridSize = 20;
        const gridDivisions = 20;
        const gridColor = 0x00ffc8;
        const gridHelperColor = 0x004433;
        const grid = new THREE.GridHelper(gridSize, gridDivisions, gridColor, gridHelperColor);
        grid.position.y = 0.1;
        additionalWorkspaceGroup.add(grid);

        // Create main platform
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
        platform.position.y = 0.2;
        additionalWorkspaceGroup.add(platform);

        // Add floating elements
        for (let i = 0; i < 5; i++) {
            const element = this.createHolographicElement();
            element.scale.set(1.5, 1.5, 1.5);
            element.position.set(
                (Math.random() - 0.5) * 8,
                Math.random() * 3 + 1,
                (Math.random() - 0.5) * 8
            );
            additionalWorkspaceGroup.add(element);
        }

        // Add particle system
        const particleCount = 200;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 10;
            positions[i + 1] = Math.random() * 5;
            positions[i + 2] = (Math.random() - 0.5) * 10;

            colors[i] = Math.random() * 0.5 + 0.5;
            colors[i + 1] = Math.random() * 0.5 + 0.5;
            colors[i + 2] = Math.random() * 0.5 + 0.5;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        additionalWorkspaceGroup.add(particles);

        // Add energy rings
        for (let i = 0; i < 3; i++) {
            const ringGeometry = new THREE.RingGeometry(3 + i * 1.5, 3.1 + i * 1.5, 64);
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
            ring.position.y = 0.3 + i * 0.5;
            additionalWorkspaceGroup.add(ring);
        }

        // Add to scene
        this.scene.add(additionalWorkspaceGroup);
        this.additionalWorkspace = additionalWorkspaceGroup;
    }

    createNeuralPlatform() {
        // Create a group to hold all elements
        const neuralGroup = new THREE.Group();
        neuralGroup.position.set(-47.99, 46.95, 42.40);

        // Create base platform
        const platformGeometry = new THREE.CircleGeometry(8, 32);
        const platformMaterial = new THREE.ShaderMaterial({
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
                    float alpha = smoothstep(0.5, 0.4, dist);
                    gl_FragColor = vec4(color * (0.5 + pulse * 0.5), alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.rotation.x = -Math.PI / 2;
        platform.position.y = 0.1;
        neuralGroup.add(platform);

        // Create neural system
        const neuralNodes = [];
        const nodeCount = 50;
        const connectionCount = 100;

        // Create nodes
        for (let i = 0; i < nodeCount; i++) {
            const nodeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
            const nodeMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0xff00ff) }
                },
                vertexShader: `
                    varying vec3 vNormal;
                    varying vec3 vPosition;
                    void main() {
                        vNormal = normalize(normalMatrix * normal);
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
                        float pulse = sin(time * 2.0 + vPosition.y * 5.0) * 0.5 + 0.5;
                        vec3 finalColor = color * (0.5 + pulse * 0.5);
                        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                        gl_FragColor = vec4(finalColor * intensity, 0.8 + pulse * 0.2);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending
            });

            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            node.position.set(
                (Math.random() - 0.5) * 6,
                Math.random() * 4 + 1,
                (Math.random() - 0.5) * 6
            );
            neuralNodes.push(node);
            neuralGroup.add(node);
        }

        // Create connections between nodes
        for (let i = 0; i < connectionCount; i++) {
            const startNode = neuralNodes[Math.floor(Math.random() * nodeCount)];
            const endNode = neuralNodes[Math.floor(Math.random() * nodeCount)];
            
            const connectionGeometry = new THREE.BufferGeometry();
            const vertices = new Float32Array([
                startNode.position.x, startNode.position.y, startNode.position.z,
                endNode.position.x, endNode.position.y, endNode.position.z
            ]);
            connectionGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

            const connectionMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0x00ffff) }
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
                        vec3 finalColor = color * (0.5 + pulse * 0.5);
                        gl_FragColor = vec4(finalColor, 0.6 + pulse * 0.4);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending
            });

            const connection = new THREE.Line(connectionGeometry, connectionMaterial);
            neuralGroup.add(connection);
        }

        // Create vortex
        const vortexGeometry = new THREE.CylinderGeometry(0.5, 2, 4, 32);
        const vortexMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xff00ff) }
            },
            vertexShader: `
                varying vec3 vPosition;
                varying vec2 vUv;
                void main() {
                    vPosition = position;
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec3 vPosition;
                varying vec2 vUv;
                
                void main() {
                    float angle = atan(vPosition.x, vPosition.z);
                    float height = vPosition.y / 4.0;
                    float pulse = sin(angle * 10.0 + time * 2.0 + height * 5.0) * 0.5 + 0.5;
                    vec3 finalColor = color * (0.5 + pulse * 0.5);
                    float alpha = 0.3 + pulse * 0.2;
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        const vortex = new THREE.Mesh(vortexGeometry, vortexMaterial);
        vortex.position.y = 2;
        neuralGroup.add(vortex);

        // Create gravitational globe
        const globeGeometry = new THREE.SphereGeometry(1.5, 32, 32);
        const globeMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x0088ff) }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
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
                    float pulse = sin(time * 2.0 + vPosition.y * 5.0) * 0.5 + 0.5;
                    vec3 finalColor = color * (0.5 + pulse * 0.5);
                    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    gl_FragColor = vec4(finalColor * intensity, 0.8 + pulse * 0.2);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        const globe = new THREE.Mesh(globeGeometry, globeMaterial);
        globe.position.y = 4;
        neuralGroup.add(globe);

        // Add gravitational field
        const fieldGeometry = new THREE.SphereGeometry(6, 32, 32);
        const fieldMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xff00ff) }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
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
                    float dist = length(vPosition);
                    float intensity = 1.0 - smoothstep(1.5, 6.0, dist);
                    float pulse = sin(time * 2.0 + dist * 5.0) * 0.5 + 0.5;
                    vec3 finalColor = color * intensity * (0.5 + pulse * 0.5);
                    gl_FragColor = vec4(finalColor, intensity * 0.3);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide
        });

        const gravitationalField = new THREE.Mesh(fieldGeometry, fieldMaterial);
        globe.add(gravitationalField);

        // Add orbiting particles
        const particleCount = 50;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            const radius = 3 + Math.random() * 2;
            const angle = Math.random() * Math.PI * 2;
            const height = (Math.random() - 0.5) * 2;

            positions[i] = Math.cos(angle) * radius;
            positions[i + 1] = height;
            positions[i + 2] = Math.sin(angle) * radius;

            colors[i] = Math.random();
            colors[i + 1] = Math.random();
            colors[i + 2] = Math.random();

            // Initialize velocities for orbital motion
            velocities[i] = -Math.sin(angle) * 0.02;
            velocities[i + 1] = (Math.random() - 0.5) * 0.01;
            velocities[i + 2] = Math.cos(angle) * 0.02;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        neuralGroup.add(particles);

        // Store references for animation
        this.neuralPlatform = {
            group: neuralGroup,
            nodes: neuralNodes,
            particles: {
                mesh: particles,
                positions: positions,
                velocities: velocities
            }
        };

        // Add to scene
        this.scene.add(neuralGroup);
    }

    createCityGrid() {
        // Create a group to hold all city elements
        const cityGroup = new THREE.Group();
        cityGroup.position.set(0, 0, -50); // Position it away from other elements

        // Create larger grid
        const gridSize = 40; // Bigger grid
        const gridDivisions = 40;
        const gridColor = 0x00ffc8;
        const gridHelperColor = 0x004433;
        const grid = new THREE.GridHelper(gridSize, gridDivisions, gridColor, gridHelperColor);
        grid.position.y = 0.1;
        cityGroup.add(grid);

        // Create city structures
        const buildings = [];
        const buildingCount = 20;

        for (let i = 0; i < buildingCount; i++) {
            const height = 2 + Math.random() * 8; // Random building heights
            const width = 1 + Math.random() * 2;
            const depth = 1 + Math.random() * 2;

            const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
            const buildingMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0x0088ff) }
                },
                vertexShader: `
                    varying vec3 vNormal;
                    varying vec3 vPosition;
                    void main() {
                        vNormal = normalize(normalMatrix * normal);
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
                        float pulse = sin(time * 2.0 + vPosition.y * 5.0) * 0.5 + 0.5;
                        vec3 finalColor = color * (0.5 + pulse * 0.5);
                        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                        gl_FragColor = vec4(finalColor * intensity, 0.8 + pulse * 0.2);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending
            });

            const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
            
            // Position buildings randomly on the grid
            building.position.set(
                (Math.random() - 0.5) * (gridSize - 2),
                height / 2,
                (Math.random() - 0.5) * (gridSize - 2)
            );

            buildings.push(building);
            cityGroup.add(building);
        }

        // Create central gravitational core
        const coreGeometry = new THREE.SphereGeometry(2, 32, 32);
        const coreMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xff00ff) }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
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
                    float pulse = sin(time * 2.0 + vPosition.y * 5.0) * 0.5 + 0.5;
                    vec3 finalColor = color * (0.5 + pulse * 0.5);
                    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    gl_FragColor = vec4(finalColor * intensity, 0.8 + pulse * 0.2);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        const gravitationalCore = new THREE.Mesh(coreGeometry, coreMaterial);
        gravitationalCore.position.y = 3;
        cityGroup.add(gravitationalCore);

        // Add gravitational field
        const fieldGeometry = new THREE.SphereGeometry(15, 32, 32);
        const fieldMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xff00ff) }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
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
                    float dist = length(vPosition);
                    float intensity = 1.0 - smoothstep(2.0, 15.0, dist);
                    float pulse = sin(time * 2.0 + dist * 5.0) * 0.5 + 0.5;
                    vec3 finalColor = color * intensity * (0.5 + pulse * 0.5);
                    gl_FragColor = vec4(finalColor, intensity * 0.3);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide
        });

        const gravitationalField = new THREE.Mesh(fieldGeometry, fieldMaterial);
        gravitationalCore.add(gravitationalField);

        // Add orbiting particles with realistic gravitational effects
        const particleCount = 100;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        const masses = new Float32Array(particleCount);

        for (let i = 0; i < particleCount * 3; i += 3) {
            const radius = 5 + Math.random() * 10;
            const angle = Math.random() * Math.PI * 2;
            const height = (Math.random() - 0.5) * 4;

            positions[i] = Math.cos(angle) * radius;
            positions[i + 1] = height;
            positions[i + 2] = Math.sin(angle) * radius;

            colors[i] = Math.random();
            colors[i + 1] = Math.random();
            colors[i + 2] = Math.random();

            // Initialize velocities for orbital motion
            const orbitalSpeed = Math.sqrt(0.0001 / radius); // Realistic orbital velocity
            velocities[i] = -Math.sin(angle) * orbitalSpeed;
            velocities[i + 1] = (Math.random() - 0.5) * 0.01;
            velocities[i + 2] = Math.cos(angle) * orbitalSpeed;

            // Random mass for each particle
            masses[i / 3] = 0.1 + Math.random() * 0.9;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        cityGroup.add(particles);

        // Store references for animation
        this.cityGrid = {
            group: cityGroup,
            buildings: buildings,
            gravitationalCore: gravitationalCore,
            particles: {
                mesh: particles,
                positions: positions,
                velocities: velocities,
                masses: masses
            }
        };

        // Add to scene
        this.scene.add(cityGroup);
    }

    createSolklarrSystem() {
        // Create a group to hold all Solklarr elements
        const solklarrGroup = new THREE.Group();
        solklarrGroup.position.set(-66.11, 212.08, 160.22);

        // Create central star
        const starGeometry = new THREE.SphereGeometry(3, 64, 64);
        const starMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xff6600) }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
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
                    float pulse = sin(time * 2.0 + vPosition.y * 5.0) * 0.5 + 0.5;
                    vec3 finalColor = color * (0.5 + pulse * 0.5);
                    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    gl_FragColor = vec4(finalColor * intensity, 0.8 + pulse * 0.2);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        const star = new THREE.Mesh(starGeometry, starMaterial);
        solklarrGroup.add(star);

        // Create star corona effect
        const coronaGeometry = new THREE.SphereGeometry(4, 32, 32);
        const coronaMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xff8800) }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
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
                    float dist = length(vPosition);
                    float intensity = 1.0 - smoothstep(3.0, 4.0, dist);
                    float pulse = sin(time * 2.0 + dist * 5.0) * 0.5 + 0.5;
                    vec3 finalColor = color * intensity * (0.5 + pulse * 0.5);
                    gl_FragColor = vec4(finalColor, intensity * 0.3);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide
        });

        const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
        star.add(corona);

        // Create planets
        const planets = [];
        const planetConfigs = [
            { radius: 0.5, orbit: 8, speed: 0.2, color: 0x00ff00, rings: true },
            { radius: 0.8, orbit: 12, speed: 0.15, color: 0xff00ff, rings: false },
            { radius: 1.2, orbit: 16, speed: 0.1, color: 0x0000ff, rings: true },
            { radius: 0.6, orbit: 20, speed: 0.08, color: 0xffff00, rings: false }
        ];

        planetConfigs.forEach(config => {
            const planetGeometry = new THREE.SphereGeometry(config.radius, 32, 32);
            const planetMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(config.color) }
                },
                vertexShader: `
                    varying vec3 vNormal;
                    varying vec3 vPosition;
                    void main() {
                        vNormal = normalize(normalMatrix * normal);
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
                        float pulse = sin(time * 2.0 + vPosition.y * 5.0) * 0.5 + 0.5;
                        vec3 finalColor = color * (0.5 + pulse * 0.5);
                        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                        gl_FragColor = vec4(finalColor * intensity, 0.8 + pulse * 0.2);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending
            });

            const planet = new THREE.Mesh(planetGeometry, planetMaterial);
            planet.userData.orbit = config.orbit;
            planet.userData.speed = config.speed;
            planet.userData.angle = Math.random() * Math.PI * 2;
            solklarrGroup.add(planet);

            if (config.rings) {
                const ringGeometry = new THREE.RingGeometry(config.radius * 1.5, config.radius * 2, 32);
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
                planet.add(ring);
            }

            planets.push(planet);
        });

        // Create asteroid belt
        const asteroidCount = 100;
        const asteroidGeometry = new THREE.BufferGeometry();
        const asteroidPositions = new Float32Array(asteroidCount * 3);
        const asteroidColors = new Float32Array(asteroidCount * 3);

        for (let i = 0; i < asteroidCount * 3; i += 3) {
            const radius = 14 + Math.random() * 4;
            const angle = Math.random() * Math.PI * 2;
            const height = (Math.random() - 0.5) * 2;

            asteroidPositions[i] = Math.cos(angle) * radius;
            asteroidPositions[i + 1] = height;
            asteroidPositions[i + 2] = Math.sin(angle) * radius;

            asteroidColors[i] = Math.random() * 0.5 + 0.5;
            asteroidColors[i + 1] = Math.random() * 0.5 + 0.5;
            asteroidColors[i + 2] = Math.random() * 0.5 + 0.5;
        }

        asteroidGeometry.setAttribute('position', new THREE.BufferAttribute(asteroidPositions, 3));
        asteroidGeometry.setAttribute('color', new THREE.BufferAttribute(asteroidColors, 3));

        const asteroidMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const asteroidBelt = new THREE.Points(asteroidGeometry, asteroidMaterial);
        solklarrGroup.add(asteroidBelt);

        // Add energy field
        const fieldGeometry = new THREE.SphereGeometry(25, 32, 32);
        const fieldMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xff00ff) }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
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
                    float dist = length(vPosition);
                    float intensity = 1.0 - smoothstep(20.0, 25.0, dist);
                    float pulse = sin(time * 2.0 + dist * 5.0) * 0.5 + 0.5;
                    vec3 finalColor = color * intensity * (0.5 + pulse * 0.5);
                    gl_FragColor = vec4(finalColor, intensity * 0.1);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide
        });

        const energyField = new THREE.Mesh(fieldGeometry, fieldMaterial);
        solklarrGroup.add(energyField);

        // Store references for animation
        this.solklarrSystem = {
            group: solklarrGroup,
            star: star,
            planets: planets,
            asteroidBelt: asteroidBelt
        };

        // Add to scene
        this.scene.add(solklarrGroup);

        // Add camera focus button
        const focusButton = document.createElement('button');
        focusButton.className = 'focus-solklarr';
        focusButton.innerHTML = 'Focus on Solklarr';
        focusButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 20px;
            background: rgba(0, 255, 200, 0.2);
            border: 1px solid rgba(0, 255, 200, 0.5);
            color: #00ffc8;
            cursor: pointer;
            font-family: 'Arial', sans-serif;
            border-radius: 5px;
            z-index: 1000;
        `;

        focusButton.addEventListener('mouseover', () => {
            focusButton.style.background = 'rgba(0, 255, 200, 0.3)';
        });

        focusButton.addEventListener('mouseout', () => {
            focusButton.style.background = 'rgba(0, 255, 200, 0.2)';
        });

        // Store the button reference
        this.solklarrSystem.focusButton = focusButton;
        this.solklarrSystem.isFocused = false;

        focusButton.addEventListener('click', () => {
            this.toggleSolklarrFocus();
        });

        document.body.appendChild(focusButton);
    }

    toggleSolklarrFocus() {
        if (!this.solklarrSystem) return;

        const button = this.solklarrSystem.focusButton;
        const isFocused = this.solklarrSystem.isFocused;

        if (isFocused) {
            // Return to origin
            button.innerHTML = 'Focus on Solklarr';
            this.solklarrSystem.isFocused = false;

            // Restore camera control limitations
            this.controls.minDistance = 1;
            this.controls.maxDistance = 1000;
            this.controls.maxPolarAngle = Math.PI * 0.85;
            this.controls.screenSpacePanning = true;

            // Smooth camera transition back to origin
            gsap.to(this.camera.position, {
                x: 5,
                y: 5,
                z: 5,
                duration: 2,
                ease: 'power2.inOut'
            });

            gsap.to(this.controls.target, {
                x: 0,
                y: 0,
                z: 0,
                duration: 2,
                ease: 'power2.inOut'
            });
        } else {
            // Focus on Solklarr
            button.innerHTML = 'Return to Origin';
            this.solklarrSystem.isFocused = true;

            // Remove camera control limitations for Solklarr view
            this.controls.minDistance = 0;
            this.controls.maxDistance = Infinity;
            this.controls.maxPolarAngle = Infinity;
            this.controls.screenSpacePanning = true;

            const targetPosition = this.solklarrSystem.group.position.clone();

            // Smooth camera transition to Solklarr
            gsap.to(this.camera.position, {
                x: targetPosition.x + 30,
                y: targetPosition.y + 20,
                z: targetPosition.z + 30,
                duration: 2,
                ease: 'power2.inOut'
            });

            gsap.to(this.controls.target, {
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z,
                duration: 2,
                ease: 'power2.inOut'
            });
        }
    }

    createGalaxySystem() {
        // Create a group to hold all galaxy elements
        const galaxyGroup = new THREE.Group();
        galaxyGroup.position.set(42454884643760463872.00, 28303256463275806720.00, 42454884666616602624.00);

        // Create central black hole
        const blackHoleGeometry = new THREE.SphereGeometry(10, 64, 64);
        const blackHoleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x000000) }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
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
                    float pulse = sin(time * 2.0 + vPosition.y * 5.0) * 0.5 + 0.5;
                    vec3 finalColor = color * (0.5 + pulse * 0.5);
                    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    gl_FragColor = vec4(finalColor * intensity, 0.8 + pulse * 0.2);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
        galaxyGroup.add(blackHole);

        // Create accretion disk
        const diskGeometry = new THREE.RingGeometry(12, 20, 128);
        const diskMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xff00ff) }
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
                    float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
                    float pulse = sin(angle * 20.0 + time * 3.0) * 0.5 + 0.5;
                    vec3 finalColor = color * (0.5 + pulse * 0.5);
                    float alpha = 0.3 + pulse * 0.2;
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const accretionDisk = new THREE.Mesh(diskGeometry, diskMaterial);
        accretionDisk.rotation.x = Math.PI / 2;
        galaxyGroup.add(accretionDisk);

        // Create spiral arms
        const armCount = 4;
        const armParticles = 1000;
        const armGeometry = new THREE.BufferGeometry();
        const armPositions = new Float32Array(armParticles * 3);
        const armColors = new Float32Array(armParticles * 3);

        for (let i = 0; i < armParticles; i++) {
            const angle = (i / armParticles) * Math.PI * 8;
            const radius = 20 + (i / armParticles) * 30;
            const spiralOffset = (i % armCount) * (Math.PI * 2 / armCount);
            
            armPositions[i * 3] = Math.cos(angle + spiralOffset) * radius;
            armPositions[i * 3 + 1] = (Math.random() - 0.5) * 2;
            armPositions[i * 3 + 2] = Math.sin(angle + spiralOffset) * radius;

            armColors[i * 3] = Math.random() * 0.5 + 0.5;
            armColors[i * 3 + 1] = Math.random() * 0.5 + 0.5;
            armColors[i * 3 + 2] = Math.random() * 0.5 + 0.5;
        }

        armGeometry.setAttribute('position', new THREE.BufferAttribute(armPositions, 3));
        armGeometry.setAttribute('color', new THREE.BufferAttribute(armColors, 3));

        const armMaterial = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const spiralArms = new THREE.Points(armGeometry, armMaterial);
        galaxyGroup.add(spiralArms);

        // Create planets
        const planets = [];
        const planetCount = 25;
        const planetConfigs = [
            { radius: 2, orbit: 40, speed: 0.05, color: 0x00ff00, rings: true },
            { radius: 3, orbit: 60, speed: 0.04, color: 0xff00ff, rings: false },
            { radius: 1.5, orbit: 80, speed: 0.03, color: 0x0000ff, rings: true },
            { radius: 2.5, orbit: 100, speed: 0.02, color: 0xffff00, rings: false },
            { radius: 1.8, orbit: 120, speed: 0.015, color: 0xff6600, rings: true }
        ];

        for (let i = 0; i < planetCount; i++) {
            const config = planetConfigs[i % planetConfigs.length];
            const planetGeometry = new THREE.SphereGeometry(config.radius, 32, 32);
            const planetMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(config.color) }
                },
                vertexShader: `
                    varying vec3 vNormal;
                    varying vec3 vPosition;
                    void main() {
                        vNormal = normalize(normalMatrix * normal);
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
                        float pulse = sin(time * 2.0 + vPosition.y * 5.0) * 0.5 + 0.5;
                        vec3 finalColor = color * (0.5 + pulse * 0.5);
                        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                        gl_FragColor = vec4(finalColor * intensity, 0.8 + pulse * 0.2);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending
            });

            const planet = new THREE.Mesh(planetGeometry, planetMaterial);
            planet.userData.orbit = config.orbit;
            planet.userData.speed = config.speed;
            planet.userData.angle = Math.random() * Math.PI * 2;
            galaxyGroup.add(planet);

            if (config.rings) {
                const ringGeometry = new THREE.RingGeometry(config.radius * 1.5, config.radius * 2, 32);
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
                planet.add(ring);
            }

            planets.push(planet);
        }

        // Create nebula effect
        const nebulaGeometry = new THREE.SphereGeometry(150, 64, 64);
        const nebulaMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xff00ff) }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
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
                    float dist = length(vPosition);
                    float intensity = 1.0 - smoothstep(100.0, 150.0, dist);
                    float pulse = sin(time * 2.0 + dist * 5.0) * 0.5 + 0.5;
                    vec3 finalColor = color * intensity * (0.5 + pulse * 0.5);
                    gl_FragColor = vec4(finalColor, intensity * 0.1);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide
        });

        const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
        galaxyGroup.add(nebula);

        // Add galaxy focus button
        const galaxyButton = document.createElement('button');
        galaxyButton.className = 'focus-galaxy';
        galaxyButton.innerHTML = 'Travel to Galaxy';
        galaxyButton.style.cssText = `
            position: fixed;
            bottom: 70px;
            right: 20px;
            padding: 10px 20px;
            background: rgba(255, 0, 255, 0.2);
            border: 1px solid rgba(255, 0, 255, 0.5);
            color: #ff00ff;
            cursor: pointer;
            font-family: 'Arial', sans-serif;
            border-radius: 5px;
            z-index: 1000;
        `;

        galaxyButton.addEventListener('mouseover', () => {
            galaxyButton.style.background = 'rgba(255, 0, 255, 0.3)';
        });

        galaxyButton.addEventListener('mouseout', () => {
            galaxyButton.style.background = 'rgba(255, 0, 255, 0.2)';
        });

        galaxyButton.addEventListener('click', () => {
            this.travelToGalaxy();
        });

        document.body.appendChild(galaxyButton);

        // Store references for animation
        this.galaxySystem = {
            group: galaxyGroup,
            blackHole: blackHole,
            planets: planets,
            spiralArms: spiralArms,
            nebula: nebula
        };

        // Add to scene
        this.scene.add(galaxyGroup);
    }

    travelToGalaxy() {
        if (!this.galaxySystem) return;

        // Disable camera controls temporarily
        this.controls.enabled = false;

        const targetPosition = this.galaxySystem.group.position.clone();
        const cameraStart = this.camera.position.clone();
        const cameraEnd = new THREE.Vector3(
            targetPosition.x + 200,
            targetPosition.y + 100,
            targetPosition.z + 200
        );

        // Create a curved path for the camera
        const curve = new THREE.QuadraticBezierCurve3(
            cameraStart,
            new THREE.Vector3(
                (cameraStart.x + cameraEnd.x) / 2,
                (cameraStart.y + cameraEnd.y) / 2 + 1000,
                (cameraStart.z + cameraEnd.z) / 2
            ),
            cameraEnd
        );

        // Animate camera along the curve
        gsap.to(this.camera.position, {
            duration: 5,
            ease: 'power2.inOut',
            onUpdate: () => {
                const progress = this.camera.position.distanceTo(cameraStart) / cameraStart.distanceTo(cameraEnd);
                const point = curve.getPoint(progress);
                this.camera.position.copy(point);
                this.camera.lookAt(targetPosition);
            },
            onComplete: () => {
                // Enable camera controls with gravitational effect
                this.controls.enabled = true;
                this.controls.target.copy(targetPosition);
                this.controls.update();

                // Add gravitational effect to camera
                this.controls.minDistance = 100;
                this.controls.maxDistance = 300;
                this.controls.maxPolarAngle = Math.PI * 0.85;
                this.controls.screenSpacePanning = true;

                // Add camera shake effect
                this.addCameraShake(0.5, 1000);

                // Create and show the coordinate system
                if (!this.galaxyCoordinateSystem) {
                    this.createGalaxyCoordinateSystem();
                }

                // Create and show the central object
                if (!this.galaxyCentralObject) {
                    this.createGalaxyCentralObject();
                }

                // Create and show the relative coordinate system
                if (!this.galaxyRelativeSystem) {
                    this.createGalaxyRelativeCoordinateSystem();
                }
            }
        });
    }

    createGalaxyCoordinateSystem() {
        // Create a group to hold the coordinate system
        const coordSystem = new THREE.Group();
        
        // Set the position to the galaxy coordinates
        coordSystem.position.set(42454884643760463872.00, 28303256463275806720.00, 42454884666616602624.00);

        // Create axes
        const axisLength = 1000;
        const axisThickness = 2;

        // X-axis (Red)
        const xAxisGeometry = new THREE.CylinderGeometry(axisThickness, axisThickness, axisLength, 32);
        const xAxisMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        const xAxis = new THREE.Mesh(xAxisGeometry, xAxisMaterial);
        xAxis.rotation.z = Math.PI / 2;
        xAxis.position.x = axisLength / 2;
        coordSystem.add(xAxis);

        // Y-axis (Green)
        const yAxisGeometry = new THREE.CylinderGeometry(axisThickness, axisThickness, axisLength, 32);
        const yAxisMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        const yAxis = new THREE.Mesh(yAxisGeometry, yAxisMaterial);
        yAxis.position.y = axisLength / 2;
        coordSystem.add(yAxis);

        // Z-axis (Blue)
        const zAxisGeometry = new THREE.CylinderGeometry(axisThickness, axisThickness, axisLength, 32);
        const zAxisMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
        const zAxis = new THREE.Mesh(zAxisGeometry, zAxisMaterial);
        zAxis.rotation.x = Math.PI / 2;
        zAxis.position.z = axisLength / 2;
        coordSystem.add(zAxis);

        // Add coordinate labels
        const labelDistance = axisLength + 50;
        const labelSize = 20;
        const labelColor = 0xffffff;

        // X label
        const xLabelGeometry = new THREE.TextGeometry('X', {
            font: this.font,
            size: labelSize,
            height: 5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.5,
            bevelSize: 0.3,
            bevelSegments: 5
        });
        const xLabelMaterial = new THREE.MeshPhongMaterial({ color: labelColor });
        const xLabel = new THREE.Mesh(xLabelGeometry, xLabelMaterial);
        xLabel.position.set(labelDistance, 0, 0);
        xLabel.rotation.y = -Math.PI / 2;
        coordSystem.add(xLabel);

        // Y label
        const yLabelGeometry = new THREE.TextGeometry('Y', {
            font: this.font,
            size: labelSize,
            height: 5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.5,
            bevelSize: 0.3,
            bevelSegments: 5
        });
        const yLabelMaterial = new THREE.MeshPhongMaterial({ color: labelColor });
        const yLabel = new THREE.Mesh(yLabelGeometry, yLabelMaterial);
        yLabel.position.set(0, labelDistance, 0);
        coordSystem.add(yLabel);

        // Z label
        const zLabelGeometry = new THREE.TextGeometry('Z', {
            font: this.font,
            size: labelSize,
            height: 5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.5,
            bevelSize: 0.3,
            bevelSegments: 5
        });
        const zLabelMaterial = new THREE.MeshPhongMaterial({ color: labelColor });
        const zLabel = new THREE.Mesh(zLabelGeometry, zLabelMaterial);
        zLabel.position.set(0, 0, labelDistance);
        zLabel.rotation.x = Math.PI / 2;
        coordSystem.add(zLabel);

        // Add grid planes
        const gridSize = 2000;
        const gridDivisions = 20;
        const gridColor = 0x444444;

        // XY plane
        const xyGrid = new THREE.GridHelper(gridSize, gridDivisions, gridColor, gridColor);
        coordSystem.add(xyGrid);

        // XZ plane
        const xzGrid = new THREE.GridHelper(gridSize, gridDivisions, gridColor, gridColor);
        xzGrid.rotation.x = Math.PI / 2;
        coordSystem.add(xzGrid);

        // YZ plane
        const yzGrid = new THREE.GridHelper(gridSize, gridDivisions, gridColor, gridColor);
        yzGrid.rotation.z = Math.PI / 2;
        coordSystem.add(yzGrid);

        // Add glow effect to axes
        const glowIntensity = 0.5;
        const glowColor = 0xffffff;

        // X-axis glow
        const xGlow = new THREE.PointLight(0xff0000, glowIntensity, axisLength);
        xGlow.position.x = axisLength / 2;
        coordSystem.add(xGlow);

        // Y-axis glow
        const yGlow = new THREE.PointLight(0x00ff00, glowIntensity, axisLength);
        yGlow.position.y = axisLength / 2;
        coordSystem.add(yGlow);

        // Z-axis glow
        const zGlow = new THREE.PointLight(0x0000ff, glowIntensity, axisLength);
        zGlow.position.z = axisLength / 2;
        coordSystem.add(zGlow);

        // Store reference
        this.galaxyCoordinateSystem = coordSystem;

        // Add to scene
        this.scene.add(coordSystem);
    }

    createGalaxyCentralObject() {
        // Create a group to hold the central object and its effects
        const centralObjectGroup = new THREE.Group();
        centralObjectGroup.position.set(42454884643760463872.00, 28303256463275806720.00, 42454884666616602624.00);

        // Create the main central object (a massive energy sphere)
        const centralGeometry = new THREE.SphereGeometry(50, 64, 64);
        const centralMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x00ffff) }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
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
                    float pulse = sin(time * 2.0 + vPosition.y * 5.0) * 0.5 + 0.5;
                    vec3 finalColor = color * (0.5 + pulse * 0.5);
                    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    gl_FragColor = vec4(finalColor * intensity, 0.8 + pulse * 0.2);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        const centralObject = new THREE.Mesh(centralGeometry, centralMaterial);
        centralObjectGroup.add(centralObject);

        // Create energy rings around the central object
        const ringCount = 5;
        for (let i = 0; i < ringCount; i++) {
            const ringGeometry = new THREE.RingGeometry(60 + i * 20, 65 + i * 20, 128);
            const ringMaterial = new THREE.ShaderMaterial({
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
                        float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
                        float pulse = sin(angle * 20.0 + time * (3.0 + ${i})) * 0.5 + 0.5;
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
            ring.rotation.z = (i * Math.PI) / ringCount;
            centralObjectGroup.add(ring);
        }

        // Create energy tendrils
        const tendrilCount = 8;
        for (let i = 0; i < tendrilCount; i++) {
            const tendrilGeometry = new THREE.CylinderGeometry(2, 0, 200, 32);
            const tendrilMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0x00ffff) }
                },
                vertexShader: `
                    varying vec3 vNormal;
                    varying vec3 vPosition;
                    void main() {
                        vNormal = normalize(normalMatrix * normal);
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
                        float pulse = sin(time * 2.0 + vPosition.y * 5.0) * 0.5 + 0.5;
                        vec3 finalColor = color * (0.5 + pulse * 0.5);
                        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                        gl_FragColor = vec4(finalColor * intensity, 0.8 + pulse * 0.2);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending
            });

            const tendril = new THREE.Mesh(tendrilGeometry, tendrilMaterial);
            tendril.position.y = 100;
            tendril.rotation.x = (i * Math.PI * 2) / tendrilCount;
            centralObjectGroup.add(tendril);
        }

        // Create energy field
        const fieldGeometry = new THREE.SphereGeometry(300, 64, 64);
        const fieldMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x00ffff) }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
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
                    float dist = length(vPosition);
                    float intensity = 1.0 - smoothstep(250.0, 300.0, dist);
                    float pulse = sin(time * 2.0 + dist * 5.0) * 0.5 + 0.5;
                    vec3 finalColor = color * intensity * (0.5 + pulse * 0.5);
                    gl_FragColor = vec4(finalColor, intensity * 0.1);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide
        });

        const energyField = new THREE.Mesh(fieldGeometry, fieldMaterial);
        centralObjectGroup.add(energyField);

        // Store reference
        this.galaxyCentralObject = centralObjectGroup;

        // Add to scene
        this.scene.add(centralObjectGroup);
    }

    createGalaxyRelativeCoordinateSystem() {
        // Create a group to hold the relative coordinate system
        const relativeCoordSystem = new THREE.Group();
        
        // Store the galaxy's base coordinates
        const galaxyBaseX = 42454884643760463872.00;
        const galaxyBaseY = 28303256463275806720.00;
        const galaxyBaseZ = 42454884666616602624.00;

        // Create a coordinate display panel
        const panelGeometry = new THREE.PlaneGeometry(400, 300);
        const panelMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x000000) }
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
                    float border = 0.05;
                    float glow = sin(time * 2.0) * 0.5 + 0.5;
                    vec3 finalColor = mix(color, vec3(0.2, 0.2, 0.2), glow);
                    float alpha = 0.8;
                    
                    if (vUv.x < border || vUv.x > 1.0 - border || 
                        vUv.y < border || vUv.y > 1.0 - border) {
                        finalColor = vec3(0.5, 0.5, 0.5);
                        alpha = 1.0;
                    }
                    
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        panel.position.set(0, 0, -100);
        relativeCoordSystem.add(panel);

        // Create coordinate text
        const createCoordinateText = (text, position, color) => {
            const textGeometry = new THREE.TextGeometry(text, {
                font: this.font,
                size: 15,
                height: 2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.5,
                bevelSize: 0.3,
                bevelSegments: 5
            });
            const textMaterial = new THREE.MeshPhongMaterial({ color: color });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.copy(position);
            relativeCoordSystem.add(textMesh);
            return textMesh;
        };

        // Create coordinate labels
        const baseXText = createCoordinateText('Base X: ' + galaxyBaseX.toExponential(2), new THREE.Vector3(-180, 100, -99), 0xff0000);
        const baseYText = createCoordinateText('Base Y: ' + galaxyBaseY.toExponential(2), new THREE.Vector3(-180, 50, -99), 0x00ff00);
        const baseZText = createCoordinateText('Base Z: ' + galaxyBaseZ.toExponential(2), new THREE.Vector3(-180, 0, -99), 0x0000ff);

        // Create relative coordinate inputs
        const createRelativeInput = (label, position, color) => {
            const inputGeometry = new THREE.PlaneGeometry(150, 30);
            const inputMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
            const input = new THREE.Mesh(inputGeometry, inputMaterial);
            input.position.copy(position);
            relativeCoordSystem.add(input);

            const labelText = createCoordinateText(label, new THREE.Vector3(position.x - 70, position.y, position.z + 1), color);
            return { input, labelText };
        };

        const xInput = createRelativeInput('ΔX:', new THREE.Vector3(-180, -50, -99), 0xff0000);
        const yInput = createRelativeInput('ΔY:', new THREE.Vector3(-180, -100, -99), 0x00ff00);
        const zInput = createRelativeInput('ΔZ:', new THREE.Vector3(-180, -150, -99), 0x0000ff);

        // Create update button
        const buttonGeometry = new THREE.PlaneGeometry(100, 40);
        const buttonMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
        const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
        button.position.set(0, -200, -99);
        relativeCoordSystem.add(button);

        const buttonText = createCoordinateText('Update Position', new THREE.Vector3(-40, -205, -98), 0xffffff);

        // Create coordinate visualization
        const createAxis = (color, rotation, position) => {
            const axisGeometry = new THREE.CylinderGeometry(2, 2, 100, 32);
            const axisMaterial = new THREE.MeshPhongMaterial({ color: color });
            const axis = new THREE.Mesh(axisGeometry, axisMaterial);
            axis.rotation.copy(rotation);
            axis.position.copy(position);
            relativeCoordSystem.add(axis);
            return axis;
        };

        const xAxis = createAxis(0xff0000, new THREE.Euler(0, 0, Math.PI / 2), new THREE.Vector3(50, 0, 0));
        const yAxis = createAxis(0x00ff00, new THREE.Euler(0, 0, 0), new THREE.Vector3(0, 50, 0));
        const zAxis = createAxis(0x0000ff, new THREE.Euler(Math.PI / 2, 0, 0), new THREE.Vector3(0, 0, 50));

        // Store references
        this.galaxyRelativeSystem = {
            group: relativeCoordSystem,
            baseCoordinates: { x: galaxyBaseX, y: galaxyBaseY, z: galaxyBaseZ },
            inputs: { x: xInput, y: yInput, z: zInput },
            axes: { x: xAxis, y: yAxis, z: zAxis }
        };

        // Add to scene
        this.scene.add(relativeCoordSystem);

        // Add click handler for the update button
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        window.addEventListener('click', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObject(button);

            if (intersects.length > 0) {
                // Update the galaxy system position based on relative coordinates
                const deltaX = parseFloat(xInput.labelText.geometry.parameters.text) || 0;
                const deltaY = parseFloat(yInput.labelText.geometry.parameters.text) || 0;
                const deltaZ = parseFloat(zInput.labelText.geometry.parameters.text) || 0;

                const newX = galaxyBaseX + deltaX;
                const newY = galaxyBaseY + deltaY;
                const newZ = galaxyBaseZ + deltaZ;

                // Update galaxy system position
                if (this.galaxySystem) {
                    this.galaxySystem.group.position.set(newX, newY, newZ);
                }

                // Update central object position
                if (this.galaxyCentralObject) {
                    this.galaxyCentralObject.position.set(newX, newY, newZ);
                }

                // Update coordinate system position
                if (this.galaxyCoordinateSystem) {
                    this.galaxyCoordinateSystem.position.set(newX, newY, newZ);
                }
            }
        });
    }
}

// Initialize workspace
const workspace = new FuturisticWorkspace();

// Handle window resize
window.addEventListener('resize', () => workspace.onWindowResize());
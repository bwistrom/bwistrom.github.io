class FuturisticWorkspace {
    constructor() {
        this.init();
        this.createEnvironment();
        this.setupInteraction();
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
                this.showStellariumPrompt();
            }
        });
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
                }
            }
        };
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const time = this.clock.getElapsedTime();

        // Update platform
        this.platform.material.uniforms.time.value = time;

        // Update Blue Globe
        if (this.blueGlobe) {
            this.blueGlobe.children.forEach(child => {
                if (child.material && child.material.uniforms) {
                    child.material.uniforms.time.value = time;
                }
            });
            this.blueGlobe.rotation.y = time * 0.2;

            // Check proximity and apply gravitational pull
            this.checkGlobeProximity();
            if (this.isBeingPulled) {
                const direction = this.blueGlobe.position.clone().sub(this.camera.position);
                const distance = direction.length();
                const pullStrength = Math.min(1, (5 - distance) / 5);
                this.camera.position.add(direction.normalize().multiplyScalar(0.02 * pullStrength));
            }
        }

        // Update portal
        if (this.portal) {
            this.portal.children.forEach(child => {
                if (child.material && child.material.uniforms) {
                    child.material.uniforms.time.value = time;
                }
            });
            this.portal.rotation.y = time * 0.2;
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

        // Update controls
        this.controls.update();

        // Render
        this.renderer.render(this.scene, this.camera);

        // Update coordinates display
        this.updateCoordinates();
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
}

// Initialize workspace
const workspace = new FuturisticWorkspace();

// Handle window resize
window.addEventListener('resize', () => workspace.onWindowResize());
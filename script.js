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

    animate() {
        requestAnimationFrame(this.animate.bind(this));

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

        // Update particles
        this.particles.rotation.y = time * 0.05;

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
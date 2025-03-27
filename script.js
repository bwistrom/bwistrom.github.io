class FuturisticWorkspace {
    constructor() {
        this.init();
        this.createEnvironment();
        this.setupInteraction();
        this.animate();
        this.measurementMode = false;
        this.compassMode = false;
        this.measurementPoints = [];
        this.measurementLine = null;
        this.compass = null;
        this.atmosphereEffect = null;
        this.cameraState = {
            isAutoRotating: false,
            currentPreset: null,
            targetPosition: new THREE.Vector3(),
            targetLookAt: new THREE.Vector3()
        };
        
        this.cameraPresets = {
            orbit: {
                radius: 10,
                height: 5,
                speed: 0.001,
                autoRotate: true
            },
            dynamic: {
                positions: [
                    { pos: [8, 5, 8], lookAt: [0, 0, 0], duration: 5 },
                    { pos: [-8, 3, -8], lookAt: [0, 1, 0], duration: 5 },
                    { pos: [0, 8, 0], lookAt: [0, 0, 0], duration: 5 },
                    { pos: [8, 2, -8], lookAt: [0, 1, 0], duration: 5 }
                ],
                currentIndex: 0
            },
            topDown: {
                pos: [0, 15, 0],
                lookAt: [0, 0, 0],
                duration: 2
            },
            cinematic: {
                radius: 12,
                height: 3,
                speed: 0.0005,
                wobble: true
            }
        };
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
        this.camera.lookAt(0, 0, 0);

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
        this.controls.minDistance = 5;
        this.controls.maxDistance = 50;

        // Time management
        this.clock = new THREE.Clock();
        this.windows = [];

        // Add raycaster for measurements
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Create measurement line material
        this.measurementLineMaterial = new THREE.LineBasicMaterial({
            color: 0x00ffc8,
            linewidth: 2
        });

        // Add compass materials
        this.compassMaterials = {
            north: new THREE.LineBasicMaterial({ color: 0xff0000 }),
            east: new THREE.LineBasicMaterial({ color: 0x00ff00 }),
            main: new THREE.LineBasicMaterial({ color: 0x00ffc8 })
        };

        // Configure fog for atmosphere
        this.renderer.setClearColor(0x0a0a0f);

        // Add post-processing
        const composer = new THREE.EffectComposer(this.renderer);
        const renderPass = new THREE.RenderPass(this.scene, this.camera);
        composer.addPass(renderPass);

        const bloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.5,
            0.4,
            0.85
        );
        composer.addPass(bloomPass);

        this.composer = composer;

        this.setupCameraControls();
        this.createDepthAndOrientation();
        this.createMenu();
    }

    createEnvironment() {
        // Create main platform
        this.createPlatform();
        
        // Create grid
        this.createGrid();
        
        // Create time ring
        this.timeRing = this.createTimeRing();
        this.scene.add(this.timeRing);

        // Create space sphere
        this.spaceSphere = this.createSpaceSphere();
        this.scene.add(this.spaceSphere);

        // Create vortex
        this.vortex = this.createVortex();
        this.scene.add(this.vortex);
        
        // Add lighting
        this.setupLighting();
        
        // Add particle systems
        this.createParticleSystems();
        
        // Add ambient elements
        this.createAmbientElements();

        // Add TimeMatrix
        this.timeMatrix = new TimeMatrix(this.scene);
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

    createTimeRing() {
        const ringGeometry = new THREE.TorusGeometry(40, 0.5, 16, 100);
        const ringMaterial = new THREE.ShaderMaterial({
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
                    float pulse = sin(vUv.x * 50.0 - time * 2.0) * 0.5 + 0.5;
                    float timeLine = smoothstep(0.0, 0.05, abs(vUv.x - mod(time * 0.1, 1.0)));
                    vec3 color = mix(baseColor, vec3(1.0), timeLine);
                    color += pulse * 0.3;
                    float alpha = 0.8 + pulse * 0.2;
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true
        });

        const timeRing = new THREE.Mesh(ringGeometry, ringMaterial);
        timeRing.rotation.x = Math.PI / 2;
        timeRing.position.y = 2;

        // Add time markers
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const marker = this.createTimeMarker();
            marker.position.x = Math.cos(angle) * 40;
            marker.position.z = Math.sin(angle) * 40;
            marker.position.y = 2;
            marker.rotation.y = -angle;
            timeRing.add(marker);
        }

        return timeRing;
    }

    createTimeMarker() {
        const markerGeometry = new THREE.BoxGeometry(0.5, 2, 0.1);
        const markerMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                markerColor: { value: new THREE.Color(0x00ffc8) }
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
                uniform vec3 markerColor;
                varying vec2 vUv;
                
                void main() {
                    float pulse = sin(time * 2.0 + vUv.y * 5.0) * 0.5 + 0.5;
                    vec3 color = markerColor * (0.5 + pulse * 0.5);
                    float alpha = 0.7 + pulse * 0.3;
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true
        });

        return new THREE.Mesh(markerGeometry, markerMaterial);
    }

    createSpaceSphere() {
        const sphereGeometry = new THREE.SphereGeometry(60, 32, 32);
        const sphereMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec2 vUv;
                
                void main() {
                    vNormal = normal;
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                varying vec3 vNormal;
                varying vec2 vUv;
                
                void main() {
                    float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
                    vec3 atmosphere = vec3(0.0, 0.5, 1.0) * intensity;
                    float pulse = sin(time + vUv.x * 10.0) * 0.5 + 0.5;
                    atmosphere += vec3(0.0, 1.0, 0.8) * pulse * 0.2;
                    gl_FragColor = vec4(atmosphere, intensity * 0.3);
                }
            `,
            transparent: true,
            side: THREE.BackSide
        });

        return new THREE.Mesh(sphereGeometry, sphereMaterial);
    }

    createVortex() {
        const vortexGroup = new THREE.Group();
        
        // Create main vortex spiral
        const spiralGeometry = new THREE.CylinderGeometry(0.1, 15, 20, 32, 1, true);
        const spiralMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                baseColor: { value: new THREE.Color(0x00ffc8) },
                accentColor: { value: new THREE.Color(0xff00ff) }
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
                uniform vec3 accentColor;
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    float spiral = fract(vUv.x * 10.0 + vUv.y * 5.0 - time * 0.5);
                    float height = vPosition.y / 20.0;
                    float pulse = sin(time * 2.0 + vUv.x * 20.0) * 0.5 + 0.5;
                    
                    vec3 color = mix(baseColor, accentColor, spiral);
                    color += pulse * 0.3;
                    float alpha = (0.8 - height) * (0.5 + spiral * 0.5);
                    
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const spiral = new THREE.Mesh(spiralGeometry, spiralMaterial);
        spiral.rotation.x = Math.PI / 2;
        vortexGroup.add(spiral);

        // Create energy particles
        const particleCount = 1000;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            const radius = Math.random() * 15;
            const angle = Math.random() * Math.PI * 2;
            const height = Math.random() * 20;

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
        vortexGroup.add(particles);

        // Create energy rings
        for (let i = 0; i < 5; i++) {
            const ringGeometry = new THREE.RingGeometry(2 + i * 2, 2.1 + i * 2, 32);
            const ringMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    ringColor: { value: new THREE.Color(0x00ffc8) }
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
            ring.position.y = i * 4;
            vortexGroup.add(ring);
        }

        vortexGroup.position.y = 10;
        return vortexGroup;
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
            positions[i] = (Math.random() - 0.5) * 20;
            positions[i + 1] = Math.random() * 10;
            positions[i + 2] = (Math.random() - 0.5) * 20;

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

        // Update time ring
        if (this.timeRing) {
            this.timeRing.material.uniforms.time.value = time;
            this.timeRing.rotation.z = time * 0.1;
            
            // Update time markers
            this.timeRing.children.forEach(child => {
                if (child.material && child.material.uniforms) {
                    child.material.uniforms.time.value = time;
                }
            });
        }

        // Update space sphere
        if (this.spaceSphere) {
            this.spaceSphere.material.uniforms.time.value = time;
        }

        // Update vortex
        if (this.vortex) {
            this.vortex.children.forEach(child => {
                if (child.material && child.material.uniforms) {
                    child.material.uniforms.time.value = time;
                }
            });
            this.vortex.rotation.y = time * 0.2;
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

        // Update TimeMatrix
        if (this.timeMatrix) {
            this.timeMatrix.update(time);
        }

        // Update controls
        this.controls.update();

        // Render
        this.composer.render();

        // Update coordinates display
        this.updateCoordinates();
    }

    updateCoordinates() {
        const coords = document.querySelectorAll('.coordinates span');
        coords[0].textContent = this.camera.position.x.toFixed(2);
        coords[1].textContent = this.camera.position.y.toFixed(2);
        coords[2].textContent = this.camera.position.z.toFixed(2);
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
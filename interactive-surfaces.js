// Interactive Surfaces and Functions
class InteractiveSurfaces {
    constructor(workspace) {
        this.workspace = workspace;
        this.surfaces = new Map();
        this.activeSurface = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.setupEventListeners();
        this.createSurfaces();
    }

    setupEventListeners() {
        window.addEventListener('mousemove', (event) => this.onMouseMove(event));
        window.addEventListener('click', (event) => this.onMouseClick(event));
        window.addEventListener('touchstart', (event) => this.onTouchStart(event));
        window.addEventListener('touchmove', (event) => this.onTouchMove(event));
    }

    createSurfaces() {
        // Create Holographic Control Panel
        this.createHolographicPanel();
        
        // Create Data Visualization Surface
        this.createDataVisualizationSurface();
        
        // Create Gesture Recognition Surface
        this.createGestureSurface();
        
        // Create Drawing Surface
        this.createDrawingSurface();
    }

    createHolographicPanel() {
        const geometry = new THREE.PlaneGeometry(2, 2);
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
                    gl_FragColor = vec4(color * (0.5 + pulse * 0.5), alpha * 0.5);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const panel = new THREE.Mesh(geometry, material);
        panel.position.set(5, 2, 0);
        panel.rotation.y = -Math.PI / 4;
        
        // Add interactive elements
        const controls = this.createPanelControls();
        panel.add(controls);
        
        this.surfaces.set('holographicPanel', {
            mesh: panel,
            controls: controls,
            type: 'panel'
        });
        
        this.workspace.scene.add(panel);
    }

    createPanelControls() {
        const controls = new THREE.Group();
        
        // Create buttons
        const buttonGeometry = new THREE.PlaneGeometry(0.3, 0.3);
        const buttonMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffc8,
            transparent: true,
            opacity: 0.5
        });

        const buttons = [
            { position: new THREE.Vector3(-0.5, 0.5, 0), label: 'Light' },
            { position: new THREE.Vector3(0.5, 0.5, 0), label: 'Dark' },
            { position: new THREE.Vector3(-0.5, -0.5, 0), label: 'On' },
            { position: new THREE.Vector3(0.5, -0.5, 0), label: 'Off' }
        ];

        buttons.forEach(button => {
            const mesh = new THREE.Mesh(buttonGeometry, buttonMaterial);
            mesh.position.copy(button.position);
            mesh.userData.label = button.label;
            controls.add(mesh);
        });

        return controls;
    }

    createDataVisualizationSurface() {
        const geometry = new THREE.PlaneGeometry(3, 2);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                data: { value: new Float32Array(100) }
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
                uniform float data[100];
                varying vec2 vUv;

                void main() {
                    int index = int(vUv.x * 100.0);
                    float value = data[index];
                    float y = vUv.y;
                    
                    vec3 color = vec3(0.0, 1.0, 0.8);
                    float alpha = smoothstep(0.0, 0.1, abs(y - value));
                    
                    gl_FragColor = vec4(color, alpha * 0.5);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const surface = new THREE.Mesh(geometry, material);
        surface.position.set(-5, 2, 0);
        surface.rotation.y = Math.PI / 4;
        
        this.surfaces.set('dataVisualization', {
            mesh: surface,
            type: 'visualization'
        });
        
        this.workspace.scene.add(surface);
    }

    createGestureSurface() {
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                gesture: { value: new THREE.Vector2(0, 0) }
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
                uniform vec2 gesture;
                varying vec2 vUv;

                void main() {
                    float dist = length(vUv - gesture);
                    float pulse = sin(dist * 10.0 - time * 2.0) * 0.5 + 0.5;
                    float alpha = smoothstep(0.5, 0.4, dist);
                    gl_FragColor = vec4(1.0, 0.0, 0.8, alpha * 0.5);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const surface = new THREE.Mesh(geometry, material);
        surface.position.set(0, 2, 5);
        surface.rotation.x = -Math.PI / 4;
        
        this.surfaces.set('gestureSurface', {
            mesh: surface,
            type: 'gesture'
        });
        
        this.workspace.scene.add(surface);
    }

    createDrawingSurface() {
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                drawing: { value: new THREE.Texture() }
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
                uniform sampler2D drawing;
                varying vec2 vUv;

                void main() {
                    vec4 color = texture2D(drawing, vUv);
                    gl_FragColor = vec4(color.rgb, color.a * 0.5);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        const surface = new THREE.Mesh(geometry, material);
        surface.position.set(0, 2, -5);
        surface.rotation.x = Math.PI / 4;
        
        this.surfaces.set('drawingSurface', {
            mesh: surface,
            type: 'drawing',
            canvas: document.createElement('canvas'),
            ctx: null
        });
        
        this.workspace.scene.add(surface);
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.workspace.camera);
        const intersects = this.raycaster.intersectObjects(this.workspace.scene.children, true);
        
        if (intersects.length > 0) {
            const surface = this.findSurface(intersects[0].object);
            if (surface) {
                this.handleSurfaceHover(surface, intersects[0]);
            }
        }
    }

    onMouseClick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.workspace.camera);
        const intersects = this.raycaster.intersectObjects(this.workspace.scene.children, true);
        
        if (intersects.length > 0) {
            const surface = this.findSurface(intersects[0].object);
            if (surface) {
                this.handleSurfaceClick(surface, intersects[0]);
            }
        }
    }

    onTouchStart(event) {
        event.preventDefault();
        const touch = event.touches[0];
        this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.workspace.camera);
        const intersects = this.raycaster.intersectObjects(this.workspace.scene.children, true);
        
        if (intersects.length > 0) {
            const surface = this.findSurface(intersects[0].object);
            if (surface) {
                this.handleSurfaceTouch(surface, intersects[0]);
            }
        }
    }

    onTouchMove(event) {
        event.preventDefault();
        const touch = event.touches[0];
        this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.workspace.camera);
        const intersects = this.raycaster.intersectObjects(this.workspace.scene.children, true);
        
        if (intersects.length > 0) {
            const surface = this.findSurface(intersects[0].object);
            if (surface) {
                this.handleSurfaceTouchMove(surface, intersects[0]);
            }
        }
    }

    findSurface(object) {
        for (const [key, surface] of this.surfaces) {
            if (surface.mesh === object || surface.mesh.children.includes(object)) {
                return surface;
            }
        }
        return null;
    }

    handleSurfaceHover(surface, intersect) {
        switch (surface.type) {
            case 'panel':
                this.handlePanelHover(surface, intersect);
                break;
            case 'visualization':
                this.handleVisualizationHover(surface, intersect);
                break;
            case 'gesture':
                this.handleGestureHover(surface, intersect);
                break;
            case 'drawing':
                this.handleDrawingHover(surface, intersect);
                break;
        }
    }

    handleSurfaceClick(surface, intersect) {
        switch (surface.type) {
            case 'panel':
                this.handlePanelClick(surface, intersect);
                break;
            case 'visualization':
                this.handleVisualizationClick(surface, intersect);
                break;
            case 'gesture':
                this.handleGestureClick(surface, intersect);
                break;
            case 'drawing':
                this.handleDrawingClick(surface, intersect);
                break;
        }
    }

    handleSurfaceTouch(surface, intersect) {
        this.handleSurfaceClick(surface, intersect);
    }

    handleSurfaceTouchMove(surface, intersect) {
        this.handleSurfaceHover(surface, intersect);
    }

    // Surface-specific handlers
    handlePanelHover(surface, intersect) {
        const point = intersect.point;
        surface.controls.children.forEach(button => {
            const distance = point.distanceTo(button.position);
            button.material.opacity = distance < 0.3 ? 1 : 0.5;
        });
    }

    handlePanelClick(surface, intersect) {
        const point = intersect.point;
        surface.controls.children.forEach(button => {
            const distance = point.distanceTo(button.position);
            if (distance < 0.3) {
                this.handlePanelButtonClick(button.userData.label);
            }
        });
    }

    handlePanelButtonClick(label) {
        switch (label) {
            case 'Light':
                this.workspace.scene.background = new THREE.Color(0xffffff);
                break;
            case 'Dark':
                this.workspace.scene.background = new THREE.Color(0x000000);
                break;
            case 'On':
                this.workspace.renderer.setPixelRatio(2);
                break;
            case 'Off':
                this.workspace.renderer.setPixelRatio(1);
                break;
        }
    }

    handleVisualizationHover(surface, intersect) {
        const point = intersect.point;
        const data = surface.mesh.material.uniforms.data.value;
        
        // Update data based on hover position
        const index = Math.floor((point.x + 1.5) * 50);
        if (index >= 0 && index < 100) {
            data[index] = point.y;
        }
    }

    handleVisualizationClick(surface, intersect) {
        // Add data point on click
        const point = intersect.point;
        const data = surface.mesh.material.uniforms.data.value;
        const index = Math.floor((point.x + 1.5) * 50);
        if (index >= 0 && index < 100) {
            data[index] = point.y;
        }
    }

    handleGestureHover(surface, intersect) {
        const point = intersect.point;
        surface.mesh.material.uniforms.gesture.value.set(
            (point.x + 1) / 2,
            (point.y + 1) / 2
        );
    }

    handleGestureClick(surface, intersect) {
        // Start gesture recognition
        const point = intersect.point;
        surface.mesh.material.uniforms.gesture.value.set(
            (point.x + 1) / 2,
            (point.y + 1) / 2
        );
    }

    handleDrawingHover(surface, intersect) {
        if (surface.isDrawing) {
            const point = intersect.point;
            const ctx = surface.ctx;
            const x = (point.x + 1) * surface.canvas.width / 2;
            const y = (point.y + 1) * surface.canvas.height / 2;
            
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }

    handleDrawingClick(surface, intersect) {
        surface.isDrawing = !surface.isDrawing;
        if (surface.isDrawing) {
            const point = intersect.point;
            const ctx = surface.ctx;
            const x = (point.x + 1) * surface.canvas.width / 2;
            const y = (point.y + 1) * surface.canvas.height / 2;
            
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
    }

    update() {
        // Update all surface animations
        this.surfaces.forEach(surface => {
            surface.mesh.material.uniforms.time.value = this.workspace.clock.getElapsedTime();
        });
    }
}

// Initialize interactive surfaces
const interactiveSurfaces = new InteractiveSurfaces(workspace);
workspace.animate = function() {
    requestAnimationFrame(workspace.animate);
    interactiveSurfaces.update();
    workspace.renderer.render(workspace.scene, workspace.camera);
}; 
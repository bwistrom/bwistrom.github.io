// Portal Controls Module - Extends current functionality without modifying existing code
class PortalControls {
    constructor() {
        this.waitForWorkspace();
    }

    waitForWorkspace() {
        // Wait for the workspace to be available
        const checkWorkspace = () => {
            if (window.workspace) {
                this.createPortal();
            } else {
                setTimeout(checkWorkspace, 100);
            }
        };
        checkWorkspace();
    }

    createPortal() {
        if (!window.workspace || !window.workspace.scene) return;

        // Create portal ring with holographic effect
        const ringGeometry = new THREE.TorusGeometry(3, 0.2, 32, 200);
        const ringMaterial = new THREE.ShaderMaterial({
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
                    float glow = sin(vUv.x * 10.0 + time) * 0.5 + 0.5;
                    vec3 finalColor = mix(color, vec3(1.0), glow * 0.3);
                    gl_FragColor = vec4(finalColor, 0.8);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
        const portalRing = new THREE.Mesh(ringGeometry, ringMaterial);
        portalRing.rotation.x = Math.PI / 2;

        // Create portal surface with holographic effect
        const portalGeometry = new THREE.CircleGeometry(2.8, 64);
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
                    float dist = length(vUv - vec2(0.5));
                    float pulse = sin(time * 2.0) * 0.5 + 0.5;
                    float alpha = smoothstep(0.5, 0.0, dist) * (0.3 + pulse * 0.2);
                    vec3 finalColor = mix(color, vec3(1.0), pulse * 0.5);
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
        const portalSurface = new THREE.Mesh(portalGeometry, portalMaterial);
        portalSurface.rotation.x = -Math.PI / 2;
        portalSurface.position.y = 0.01;

        // Create portal glow with holographic effect
        const glowGeometry = new THREE.CircleGeometry(3.2, 64);
        const glowMaterial = new THREE.ShaderMaterial({
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
                    float dist = length(vUv - vec2(0.5));
                    float pulse = sin(time * 1.5) * 0.5 + 0.5;
                    float alpha = smoothstep(0.7, 0.0, dist) * (0.1 + pulse * 0.05);
                    vec3 finalColor = mix(color, vec3(1.0), pulse * 0.3);
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
        const portalGlow = new THREE.Mesh(glowGeometry, glowMaterial);
        portalGlow.rotation.x = -Math.PI / 2;
        portalGlow.position.y = 0.02;

        // Create portal group
        const portal = new THREE.Group();
        portal.add(portalRing);
        portal.add(portalSurface);
        portal.add(portalGlow);

        // Position portal at the center of the workspace
        portal.position.set(0, 1, 0); // Raised higher for better visibility

        // Add portal to scene
        window.workspace.scene.add(portal);

        // Add portal animation
        this.animatePortal(portal, portalSurface, portalGlow, ringMaterial, portalMaterial, glowMaterial);

        // Add click interaction
        this.addPortalInteraction(portal);

        // Add portal label with holographic effect
        this.addPortalLabel(portal);
    }

    animatePortal(portal, portalSurface, portalGlow, ringMaterial, portalMaterial, glowMaterial) {
        const animate = () => {
            const time = Date.now() * 0.001;
            
            // Update shader uniforms
            ringMaterial.uniforms.time.value = time;
            portalMaterial.uniforms.time.value = time;
            glowMaterial.uniforms.time.value = time;
            
            // Rotate portal ring
            portal.rotation.y = time * 0.5;
            
            // Add floating effect
            portal.position.y = 1 + Math.sin(time) * 0.1;
            
            requestAnimationFrame(animate);
        };
        animate();
    }

    addPortalInteraction(portal) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        window.addEventListener('click', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, window.workspace.camera);

            const intersects = raycaster.intersectObject(portal, true);
            if (intersects.length > 0) {
                window.open('https://www.google.com', '_blank');
            }
        });
    }

    addPortalLabel(portal) {
        // Create holographic label
        const labelGeometry = new THREE.PlaneGeometry(4, 0.8);
        const labelMaterial = new THREE.ShaderMaterial({
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
                    float glow = sin(vUv.x * 5.0 + time) * 0.5 + 0.5;
                    vec3 finalColor = mix(color, vec3(1.0), glow * 0.3);
                    gl_FragColor = vec4(finalColor, 0.6);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.y = 2.5;
        label.rotation.x = -Math.PI / 4;

        // Add text to label
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;
        
        context.fillStyle = '#00ffc8';
        context.font = 'bold 48px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('Click to Open Google', canvas.width/2, canvas.height/2);

        const texture = new THREE.CanvasTexture(canvas);
        labelMaterial.map = texture;
        labelMaterial.needsUpdate = true;

        portal.add(label);
    }
}

// Initialize portal controls when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.portalControls = new PortalControls();
}); 
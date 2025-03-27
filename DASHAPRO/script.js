// Initialize Three.js scene
let scene, camera, renderer, platform;
let widgets = {};
let isDragging = false;
let currentWidget = null;

// Initialize Dexie database
const db = new Dexie('DashproDatabase');
db.version(1).stores({
    workspaceState: 'id, sceneData, platformPosition, platformRotation, cameraPosition'
});

// Database initialization
const dbWorkspaces = new Dexie('DashProDB');
dbWorkspaces.version(1).stores({
    workspaces: '++id, name, layout',
    savedContent: '++id, title, url, category, timestamp'
});

// Initialize 3D environment
function initThreeJS() {
    try {
        // Scene setup
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // Renderer setup
        renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        
        const workspace = document.getElementById('workspace');
        if (workspace) {
            workspace.appendChild(renderer.domElement);
        } else {
            console.error('Workspace element not found');
            return;
        }

        // Platform setup
        const platformGeometry = new THREE.BoxGeometry(15, 0.5, 15);
        const platformMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x3498db,
            transparent: true,
            opacity: 0.8,
            shininess: 100
        });
        platform = new THREE.Mesh(platformGeometry, platformMaterial);
        scene.add(platform);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Camera position
        camera.position.z = 20;
        camera.position.y = 5;

        // Start animation
        animate();

        // Handle window resize
        window.addEventListener('resize', onWindowResize, false);

    } catch (error) {
        console.error('Error initializing Three.js scene:', error);
    }
}

function onWindowResize() {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

function animate() {
    if (!scene || !camera || !renderer || !platform) return;

    requestAnimationFrame(animate);
    
    // Platform animation
    platform.rotation.y += 0.001;
    platform.position.y = Math.sin(Date.now() * 0.001) * 0.5;
    
    renderer.render(scene, camera);
}

// Widget Management
class WidgetManager {
    constructor() {
        this.widgets = document.querySelectorAll('.widget');
        this.setupDragAndResize();
    }

    setupDragAndResize() {
        this.widgets.forEach(widget => {
            this.makeWidgetDraggable(widget);
            this.makeWidgetResizable(widget);
        });
    }

    makeWidgetDraggable(widget) {
        widget.addEventListener('mousedown', this.startDragging.bind(this));
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.stopDragging.bind(this));
    }

    makeWidgetResizable(widget) {
        const resizer = document.createElement('div');
        resizer.className = 'resizer';
        widget.appendChild(resizer);
        // Implement resize logic
    }

    startDragging(e) {
        if (e.target.classList.contains('widget')) {
            isDragging = true;
            currentWidget = e.target;
        }
    }

    drag(e) {
        if (isDragging && currentWidget) {
            currentWidget.style.left = e.clientX + 'px';
            currentWidget.style.top = e.clientY + 'px';
        }
    }

    stopDragging() {
        isDragging = false;
        currentWidget = null;
    }
}

// Theme Management
class ThemeManager {
    constructor() {
        this.themes = {
            cyber: {
                primary: '#00ff9d',
                secondary: '#ff00ff',
                background: '#0a0a0a'
            },
            neon: {
                primary: '#ff0066',
                secondary: '#00ffff',
                background: '#000033'
            },
            minimal: {
                primary: '#ffffff',
                secondary: '#cccccc',
                background: '#111111'
            },
            space: {
                primary: '#4400ff',
                secondary: '#ff0044',
                background: '#000000'
            }
        };
        
        this.initThemeSelector();
    }

    initThemeSelector() {
        const selector = document.getElementById('theme-select');
        selector.addEventListener('change', (e) => this.applyTheme(e.target.value));
    }

    applyTheme(themeName) {
        const theme = this.themes[themeName];
        document.documentElement.style.setProperty('--primary-color', theme.primary);
        document.documentElement.style.setProperty('--secondary-color', theme.secondary);
        document.documentElement.style.setProperty('--background-color', theme.background);
    }
}

// Workspace Management
class WorkspaceManager {
    async saveWorkspace() {
        const layout = this.captureLayout();
        try {
            await dbWorkspaces.workspaces.add({
                name: 'Workspace ' + new Date().toLocaleString(),
                layout: layout
            });
        } catch (error) {
            console.error('Error saving workspace:', error);
        }
    }

    captureLayout() {
        const layout = {};
        document.querySelectorAll('.widget').forEach(widget => {
            layout[widget.id] = {
                position: {
                    x: widget.offsetLeft,
                    y: widget.offsetTop
                },
                size: {
                    width: widget.offsetWidth,
                    height: widget.offsetHeight
                }
            };
        });
        return layout;
    }
}

// Social Media Integration
class SocialMediaManager {
    constructor() {
        this.initializeSocialAPIs();
        this.setupTabNavigation();
    }

    initializeSocialAPIs() {
        // Initialize Facebook SDK
        window.fbAsyncInit = function() {
            FB.init({
                appId: 'YOUR_FB_APP_ID', // Replace with your Facebook App ID
                autoLogAppEvents: true,
                xfbml: true,
                version: 'v12.0'
            });
        };

        // Load Twitter widgets
        if (typeof twttr !== 'undefined') {
            twttr.widgets.load();
        }
    }

    setupTabNavigation() {
        const tabs = document.querySelectorAll('.social-tabs .tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;
                this.switchTab(tab, target, '.social-feeds .feed-section');
            });
        });
    }

    switchTab(clickedTab, targetId, contentSelector) {
        // Remove active class from all tabs and content
        clickedTab.parentElement.querySelectorAll('.tab-btn').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll(contentSelector).forEach(content => {
            content.classList.remove('active');
        });

        // Add active class to clicked tab and corresponding content
        clickedTab.classList.add('active');
        document.getElementById(`${targetId}-feed`).classList.add('active');
    }
}

// Music Player Manager
class MusicPlayerManager {
    constructor() {
        this.setupTabNavigation();
    }

    setupTabNavigation() {
        const tabs = document.querySelectorAll('.music-tabs .tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;
                this.switchTab(tab, target, '.music-players .player-section');
            });
        });
    }

    switchTab(clickedTab, targetId, contentSelector) {
        clickedTab.parentElement.querySelectorAll('.tab-btn').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll(contentSelector).forEach(content => {
            content.classList.remove('active');
        });

        clickedTab.classList.add('active');
        document.getElementById(`${targetId}-player`).classList.add('active');
    }
}

// Content Library Manager
class ContentLibraryManager {
    constructor() {
        this.initializeBookmarkSystem();
    }

    async initializeBookmarkSystem() {
        this.setupEventListeners();
        await this.loadBookmarks();
    }

    setupEventListeners() {
        document.getElementById('save-bookmark').addEventListener('click', () => this.saveBookmark());
        document.getElementById('search-bookmarks').addEventListener('input', (e) => this.filterBookmarks(e.target.value));
    }

    async saveBookmark() {
        const url = document.getElementById('bookmark-url').value;
        const tags = document.getElementById('bookmark-tags').value.split(',').map(tag => tag.trim());
        
        if (url) {
            try {
                await dbWorkspaces.savedContent.add({
                    url,
                    tags,
                    timestamp: new Date(),
                    title: await this.fetchPageTitle(url)
                });
                this.loadBookmarks();
            } catch (error) {
                console.error('Error saving bookmark:', error);
            }
        }
    }

    async fetchPageTitle(url) {
        // In a real implementation, you would use a server-side proxy to fetch the page title
        // For demo purposes, we'll extract the domain name
        try {
            const domain = new URL(url).hostname;
            return domain;
        } catch (error) {
            return url;
        }
    }

    async loadBookmarks() {
        const bookmarks = await dbWorkspaces.savedContent.toArray();
        const container = document.querySelector('.bookmarks-list');
        container.innerHTML = bookmarks.map(bookmark => this.createBookmarkElement(bookmark)).join('');
    }

    createBookmarkElement(bookmark) {
        return `
            <div class="bookmark-item">
                <a href="${bookmark.url}" target="_blank">${bookmark.title}</a>
                <div class="bookmark-tags">
                    ${bookmark.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
    }
}

// RSS Feed Manager
class RSSFeedManager {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('add-feed').addEventListener('click', () => this.addFeed());
    }

    async addFeed() {
        const feedUrl = document.getElementById('rss-url').value;
        if (feedUrl) {
            try {
                // In a real implementation, you would use a server-side proxy to fetch RSS feeds
                // For demo purposes, we'll just show a placeholder
                this.addFeedPlaceholder(feedUrl);
            } catch (error) {
                console.error('Error adding feed:', error);
            }
        }
    }

    addFeedPlaceholder(url) {
        const feedsContainer = document.querySelector('.feed-sources');
        const feedItem = document.createElement('div');
        feedItem.className = 'feed-source';
        feedItem.innerHTML = `
            <div class="feed-source-url">${url}</div>
            <button class="remove-feed">Remove</button>
        `;
        feedsContainer.appendChild(feedItem);
    }
}

// Menu Manager
class MenuManager {
    constructor() {
        this.initializeSideMenu();
        this.initializeMainNav();
        this.initializeCategories();
    }

    initializeSideMenu() {
        const menuToggle = document.getElementById('side-menu-toggle');
        const sideMenu = document.querySelector('.side-menu');
        const closeButton = document.querySelector('.close-side-menu');

        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            sideMenu.classList.toggle('active');
        });

        closeButton.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            sideMenu.classList.remove('active');
        });
    }

    initializeMainNav() {
        document.querySelectorAll('.nav-items .submenu a').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const action = e.target.dataset;
                
                if (action.category) {
                    this.showCategoryWidgets(action.category);
                } else if (action.theme) {
                    this.applyTheme(action.theme);
                } else if (action.layout) {
                    this.handleLayout(action.layout);
                }
            });
        });
    }

    initializeCategories() {
        document.querySelectorAll('.widget-category h3').forEach(header => {
            header.addEventListener('click', () => {
                const category = header.parentElement;
                category.classList.toggle('active');
            });
        });
    }

    showCategoryWidgets(category) {
        const sideMenu = document.querySelector('.side-menu');
        const menuToggle = document.getElementById('side-menu-toggle');
        const targetCategory = document.querySelector(`.widget-category[data-category="${category}"]`);

        // Open side menu
        sideMenu.classList.add('active');
        menuToggle.classList.add('active');

        // Activate target category
        document.querySelectorAll('.widget-category').forEach(cat => {
            cat.classList.remove('active');
        });
        targetCategory.classList.add('active');

        // Scroll to category
        targetCategory.scrollIntoView({ behavior: 'smooth' });
    }

    applyTheme(theme) {
        // Your existing theme application logic
    }

    handleLayout(action) {
        switch(action) {
            case 'save':
                // Your save layout logic
                break;
            case 'load':
                // Your load layout logic
                break;
            case 'reset':
                // Your reset layout logic
                break;
        }
    }
}

// Add this new class to handle the expandable menu
class ExpandableMenu {
    constructor() {
        this.menu = document.querySelector('.expandable-menu');
        this.button = document.querySelector('.menu-button');
        this.sections = document.querySelectorAll('.menu-section');
        this.menuItems = document.querySelectorAll('.menu-item');
        
        this.init();
    }

    init() {
        // Menu toggle
        this.button.addEventListener('click', () => this.toggleMenu());

        // Section toggles
        this.sections.forEach(section => {
            const header = section.querySelector('.section-header');
            header.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleSection(section);
            });
        });

        // Menu items
        this.menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleMenuItemClick(item);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.menu.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.menu.classList.toggle('active');
        this.button.classList.toggle('active');
    }

    closeMenu() {
        this.menu.classList.remove('active');
        this.button.classList.remove('active');
    }

    toggleSection(section) {
        // Close other sections
        this.sections.forEach(s => {
            if (s !== section && s.classList.contains('active')) {
                s.classList.remove('active');
            }
        });

        // Toggle clicked section
        section.classList.toggle('active');
    }

    handleMenuItemClick(item) {
        const appType = item.dataset.app;
        
        // Create spawn effect
        this.createSpawnEffect().then(() => {
            // Launch app
            this.launchApp(appType);
            // Close menu
            this.closeMenu();
        });
    }

    createSpawnEffect() {
        return new Promise(resolve => {
            const effect = document.createElement('div');
            effect.className = 'spawn-effect';
            document.body.appendChild(effect);

            effect.addEventListener('animationend', () => {
                effect.remove();
                resolve();
            });
        });
    }

    launchApp(appType) {
        // Your app launching logic here
        console.log(`Launching ${appType}`);
    }
}

// Environment Manager
class EnvironmentManager {
    constructor() {
        this.initializeEnvironment();
    }

    initializeEnvironment() {
        // Add particle system
        this.addParticles();
        
        // Add ambient light effects
        this.addAmbientLight();
    }

    addParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        document.body.appendChild(particlesContainer);

        // Create floating particles
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.top = `${Math.random() * 100}vh`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            particlesContainer.appendChild(particle);
        }
    }

    addAmbientLight() {
        const ambientLight = document.createElement('div');
        ambientLight.className = 'ambient-light';
        document.body.appendChild(ambientLight);
    }
}

// Add these styles for the environment
const environmentStyles = `
    .particles-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    }

    .particle {
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(0, 255, 157, 0.2);
        border-radius: 50%;
        animation: particleFloat 20s infinite linear;
    }

    .ambient-light {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(
            circle at 50% 50%,
            rgba(0, 255, 157, 0.1) 0%,
            transparent 70%
        );
        pointer-events: none;
        z-index: 0;
    }

    @keyframes particleFloat {
        0% {
            transform: translateY(0) translateX(0);
        }
        50% {
            transform: translateY(-100px) translateX(50px);
        }
        100% {
            transform: translateY(0) translateX(0);
        }
    }
`;

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    const widgetManager = new WidgetManager();
    const themeManager = new ThemeManager();
    const workspaceManager = new WorkspaceManager();

    // Dark mode toggle
    document.getElementById('dark-mode-toggle').addEventListener('click', () => {
        document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    });

    // Save workspace
    document.getElementById('save-workspace').addEventListener('click', async () => {
        try {
            // Collect current state
            const workspaceState = {
                id: 'workspace1', // Using a fixed ID for simplicity
                sceneData: {
                    ambientLightIntensity: ambientLight.intensity,
                    directionalLightIntensity: directionalLight.intensity
                },
                platformPosition: {
                    x: platform.position.x,
                    y: platform.position.y,
                    z: platform.position.z
                },
                platformRotation: {
                    x: platform.rotation.x,
                    y: platform.rotation.y,
                    z: platform.rotation.z
                },
                cameraPosition: {
                    x: camera.position.x,
                    y: camera.position.y,
                    z: camera.position.z
                }
            };

            // Save to database
            await db.workspaceState.put(workspaceState);
            
            // Show success message
            alert('Workspace saved successfully!');
        } catch (error) {
            console.error('Error saving workspace:', error);
            alert('Error saving workspace');
        }
    });

    // Animation loop
    animate();

    const socialMediaManager = new SocialMediaManager();
    const musicPlayerManager = new MusicPlayerManager();
    const contentLibraryManager = new ContentLibraryManager();
    const rssFeedManager = new RSSFeedManager();

    const menuManager = new MenuManager();
    const expandableMenu = new ExpandableMenu();

    // Initialize environment
    new EnvironmentManager();
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add environment styles
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = environmentStyles;
    document.head.appendChild(style);
});

class FolderTreeMenu {
    constructor() {
        this.menuToggle = document.querySelector('.menu-toggle');
        this.folderTree = document.querySelector('.folder-tree');
        this.closeMenu = document.querySelector('.close-menu');
        this.folders = document.querySelectorAll('.folder');
        this.widgetItems = document.querySelectorAll('.widget-item');
        this.activeWidgets = new Map(); // Track active widgets
        
        this.initializeMenu();
    }

    initializeMenu() {
        // Menu toggle
        this.menuToggle.addEventListener('click', () => {
            this.menuToggle.classList.toggle('active');
            this.folderTree.classList.toggle('active');
        });

        this.closeMenu.addEventListener('click', () => {
            this.menuToggle.classList.remove('active');
            this.folderTree.classList.remove('active');
        });

        // Folder toggle
        this.folders.forEach(folder => {
            const label = folder.querySelector('.folder-label');
            label.addEventListener('click', () => {
                folder.classList.toggle('active');
            });
        });

        // Widget spawn
        this.widgetItems.forEach(item => {
            item.addEventListener('click', () => {
                const widgetType = item.dataset.widget;
                this.toggleWidget(widgetType, item);
            });
        });
    }

    toggleWidget(type, item) {
        if (this.activeWidgets.has(type)) {
            // Remove widget if it exists
            const widget = this.activeWidgets.get(type);
            widget.remove();
            this.activeWidgets.delete(type);
            item.classList.remove('active');
        } else {
            // Create new widget
            const widget = this.createWidget(type);
            this.activeWidgets.set(type, widget);
            item.classList.add('active');
        }
    }

    createWidget(type) {
        const widget = document.createElement('div');
        widget.className = 'widget-box spawning';
        widget.dataset.widgetType = type;

        // Add widget content based on type
        widget.innerHTML = this.getWidgetContent(type);

        // Position widget
        const position = this.calculateWidgetPosition();
        widget.style.left = `${position.x}px`;
        widget.style.top = `${position.y}px`;

        // Add to container
        document.querySelector('.widgets-container').appendChild(widget);

        // Initialize floating effect
        new FloatingWidgetManager().addUniqueFloating(widget);

        return widget;
    }

    calculateWidgetPosition() {
        const existing = document.querySelectorAll('.widget-box');
        const baseX = 400; // Starting X position (menu width + margin)
        const baseY = 100; // Starting Y position
        const gap = 50; // Gap between widgets
        
        let x = baseX + (existing.length % 3) * (300 + gap);
        let y = baseY + Math.floor(existing.length / 3) * (200 + gap);

        return { x, y };
    }

    getWidgetContent(type) {
        const contents = {
            instagram: `
                <div class="widget-header">Instagram Feed</div>
                <div class="widget-content">
                    <div class="instagram-feed"></div>
                </div>
            `,
            twitter: `
                <div class="widget-header">Twitter Feed</div>
                <div class="widget-content">
                    <div class="twitter-feed"></div>
                </div>
            `,
            // Add more widget contents...
        };

        return contents[type] || `
            <div class="widget-header">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
            <div class="widget-content">
                <div class="${type}-container"></div>
            </div>
        `;
    }

    spawnWindow(type) {
        const position = this.calculatePosition();
        new AppWindow(type, position);
    }

    calculatePosition() {
        const windows = document.querySelectorAll('.app-window');
        const offset = windows.length * 30;
        return {
            x: 100 + offset,
            y: 100 + offset
        };
    }
}

// Initialize on document load
document.addEventListener('DOMContentLoaded', () => {
    const folderMenu = new FolderTreeMenu();
});

class WorkspaceController {
    constructor() {
        this.workspace = document.querySelector('.widgets-container');
        this.rotation = { x: 0, y: 0, z: 0 };
        this.scale = 1;
        this.isAutoRotating = false;
        this.autoRotateInterval = null;
        
        this.initializeControls();
        this.updateWorkspaceTransform();
    }

    initializeControls() {
        // Rotation controls
        document.querySelectorAll('.control-btn[data-axis]').forEach(btn => {
            btn.addEventListener('click', () => {
                const axis = btn.dataset.axis;
                const direction = parseInt(btn.dataset.direction);
                this.rotate(axis, direction * 45);
            });
        });

        // Zoom controls
        document.querySelector('.zoom-in').addEventListener('click', () => this.zoom(0.1));
        document.querySelector('.zoom-out').addEventListener('click', () => this.zoom(-0.1));

        // Reset control
        document.querySelector('.reset-view').addEventListener('click', () => this.resetView());

        // Auto-rotate toggle
        document.querySelector('.toggle-auto-rotate').addEventListener('click', (e) => {
            this.toggleAutoRotate();
            e.currentTarget.classList.toggle('active');
        });

        // Add keyboard controls
        this.initializeKeyboardControls();

        // Add touch/drag controls
        this.initializeDragControls();
    }

    rotate(axis, angle) {
        this.rotation[axis] += angle;
        this.updateWorkspaceTransform();
        this.updatePositionIndicator();
    }

    zoom(delta) {
        this.scale = Math.max(0.5, Math.min(2, this.scale + delta));
        this.updateWorkspaceTransform();
    }

    resetView() {
        this.rotation = { x: 0, y: 0, z: 0 };
        this.scale = 1;
        this.updateWorkspaceTransform();
        this.updatePositionIndicator();
    }

    toggleAutoRotate() {
        this.isAutoRotating = !this.isAutoRotating;
        if (this.isAutoRotating) {
            this.autoRotateInterval = setInterval(() => {
                this.rotate('y', 1);
            }, 50);
        } else {
            clearInterval(this.autoRotateInterval);
        }
    }

    updateWorkspaceTransform() {
        const transform = `
            scale3d(${this.scale}, ${this.scale}, ${this.scale})
            rotateX(${this.rotation.x}deg)
            rotateY(${this.rotation.y}deg)
            rotateZ(${this.rotation.z}deg)
        `;
        
        this.workspace.style.transform = transform;
    }

    updatePositionIndicator() {
        document.querySelector('.x-value').textContent = `${this.rotation.x}°`;
        document.querySelector('.y-value').textContent = `${this.rotation.y}°`;
        document.querySelector('.z-value').textContent = `${this.rotation.z}°`;
    }

    initializeKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    this.rotate('x', -45);
                    break;
                case 'ArrowDown':
                    this.rotate('x', 45);
                    break;
                case 'ArrowLeft':
                    this.rotate('y', -45);
                    break;
                case 'ArrowRight':
                    this.rotate('y', 45);
                    break;
                case 'z':
                    this.rotate('z', 45);
                    break;
                case 'x':
                    this.rotate('z', -45);
                    break;
                case 'r':
                    this.resetView();
                    break;
            }
        });
    }

    initializeDragControls() {
        let isDragging = false;
        let previousPosition = { x: 0, y: 0 };

        this.workspace.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousPosition = { x: e.clientX, y: e.clientY };
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - previousPosition.x;
            const deltaY = e.clientY - previousPosition.y;

            this.rotate('y', deltaX * 0.5);
            this.rotate('x', deltaY * 0.5);

            previousPosition = { x: e.clientX, y: e.clientY };
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
}

// Initialize workspace controller
document.addEventListener('DOMContentLoaded', () => {
    const workspaceController = new WorkspaceController();
});

class AppWindow {
    constructor(type, position) {
        this.type = type;
        this.position = position;
        this.window = null;
        this.isMinimized = false;
        this.isMaximized = false;
        this.createWindow();
    }

    createWindow() {
        // Clone template
        const template = document.getElementById('app-window-template');
        this.window = template.content.cloneNode(true).querySelector('.app-window');
        
        // Set initial position
        this.window.style.left = `${this.position.x}px`;
        this.window.style.top = `${this.position.y}px`;
        
        // Set window content based on type
        this.setWindowContent();
        
        // Initialize window controls
        this.initializeControls();
        
        // Add to workspace
        document.querySelector('.widgets-container').appendChild(this.window);
    }

    setWindowContent() {
        const config = APP_CONFIGS[this.type];
        if (!config) return;

        // Set title and icon
        this.window.querySelector('.app-icon').textContent = config.icon;
        this.window.querySelector('.title-text').textContent = config.title;

        // Set content
        const content = this.window.querySelector('.window-content');
        content.innerHTML = config.template;

        // Initialize app-specific functionality
        if (config.init) {
            config.init(content);
        }
    }

    initializeControls() {
        // Window dragging
        this.initializeDrag();
        
        // Window resizing
        this.initializeResize();
        
        // Window buttons
        const controls = this.window.querySelector('.window-controls');
        controls.querySelector('.minimize-btn').onclick = () => this.minimize();
        controls.querySelector('.maximize-btn').onclick = () => this.maximize();
        controls.querySelector('.close-btn').onclick = () => this.close();
    }

    initializeDrag() {
        const header = this.window.querySelector('.window-header');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        header.onmousedown = (e) => {
            if (this.isMaximized) return;
            
            isDragging = true;
            initialX = e.clientX - this.window.offsetLeft;
            initialY = e.clientY - this.window.offsetTop;

            document.onmousemove = (e) => {
                if (!isDragging) return;

                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                this.window.style.left = `${currentX}px`;
                this.window.style.top = `${currentY}px`;
            };

            document.onmouseup = () => {
                isDragging = false;
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };
    }

    initializeResize() {
        const handle = this.window.querySelector('.resize-handle');
        let isResizing = false;
        let initialWidth;
        let initialHeight;
        let initialX;
        let initialY;

        handle.onmousedown = (e) => {
            if (this.isMaximized) return;
            
            isResizing = true;
            initialWidth = this.window.offsetWidth;
            initialHeight = this.window.offsetHeight;
            initialX = e.clientX;
            initialY = e.clientY;

            document.onmousemove = (e) => {
                if (!isResizing) return;

                const width = initialWidth + (e.clientX - initialX);
                const height = initialHeight + (e.clientY - initialY);

                if (width >= 300) this.window.style.width = `${width}px`;
                if (height >= 200) this.window.style.height = `${height}px`;
            };

            document.onmouseup = () => {
                isResizing = false;
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };
    }

    minimize() {
        this.isMinimized = !this.isMinimized;
        this.window.classList.toggle('minimized');
    }

    maximize() {
        this.isMaximized = !this.isMaximized;
        this.window.classList.toggle('maximized');
    }

    close() {
        this.window.remove();
    }
}

// App configurations
const APP_CONFIGS = {
    instagram: {
        icon: '📱',
        title: 'Instagram Feed',
        template: `
            <div class="instagram-container">
                <!-- Instagram Embed Code -->
                <iframe src="https://www.instagram.com/embed" frameborder="0"></iframe>
            </div>
        `,
        init: (container) => {
            // Initialize Instagram embed
        }
    },
    twitter: {
        icon: '🐦',
        title: 'Twitter Feed',
        template: `
            <div class="twitter-container">
                <!-- Twitter Timeline Embed -->
                <a class="twitter-timeline" href="https://twitter.com/Twitter"></a>
            </div>
        `,
        init: (container) => {
            // Initialize Twitter embed
        }
    },
    spotify: {
        icon: '🎵',
        title: 'Spotify Player',
        template: `
            <div class="spotify-container">
                <!-- Spotify Embed -->
                <iframe src="https://open.spotify.com/embed/playlist/37i9dQZF1DX5Ejj0EkURtP" 
                        width="100%" height="100%" frameborder="0" 
                        allowtransparency="true" allow="encrypted-media">
                </iframe>
            </div>
        `,
        init: (container) => {
            // Initialize Spotify player
        }
    },
    // Add more app configurations...
};

class SpaceEnvironment {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.starField = [];
        this.nebulas = [];
        this.platform = null;
        this.clock = new THREE.Clock();
        
        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x000000);
        document.getElementById('workspace').appendChild(this.renderer.domElement);

        // Setup camera
        this.camera.position.set(0, 20, 40);
        this.camera.lookAt(0, 0, 0);

        // Create environment
        this.createStarfield();
        this.createNebulas();
        this.createPlatform();
        this.createAmbientParticles();
        this.addLighting();
        
        // Start animation
        this.animate();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    createStarfield() {
        // Create star particles
        const starsGeometry = new THREE.BufferGeometry();
        const starPositions = [];
        const starColors = [];

        for (let i = 0; i < 10000; i++) {
            // Random sphere distribution
            const radius = Math.random() * 1000 + 100;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            starPositions.push(x, y, z);

            // Random star colors (white to blue)
            const r = Math.random() * 0.3 + 0.7;
            const g = Math.random() * 0.3 + 0.7;
            const b = 1;
            starColors.push(r, g, b);
        }

        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
        starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));

        const starsMaterial = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true
        });

        this.starField = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(this.starField);
    }

    createNebulas() {
        // Create colorful nebula clouds
        for (let i = 0; i < 5; i++) {
            const nebulaGeometry = new THREE.BufferGeometry();
            const nebulaPositions = [];
            const nebulaColors = [];

            const color = new THREE.Color();
            color.setHSL(Math.random(), 0.8, 0.5);

            for (let j = 0; j < 1000; j++) {
                const radius = Math.random() * 200 + 300;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(Math.random() * 2 - 1);

                const x = radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.sin(phi) * Math.sin(theta);
                const z = radius * Math.cos(phi);

                nebulaPositions.push(x, y, z);
                nebulaColors.push(color.r, color.g, color.b);
            }

            nebulaGeometry.setAttribute('position', new THREE.Float32BufferAttribute(nebulaPositions, 3));
            nebulaGeometry.setAttribute('color', new THREE.Float32BufferAttribute(nebulaColors, 3));

            const nebulaMaterial = new THREE.PointsMaterial({
                size: 5,
                vertexColors: true,
                transparent: true,
                opacity: 0.3,
                blending: THREE.AdditiveBlending
            });

            const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
            this.nebulas.push(nebula);
            this.scene.add(nebula);
        }
    }

    createPlatform() {
        // Create floating platform
        const platformGeometry = new THREE.BoxGeometry(15, 0.5, 15);
        const platformMaterial = new THREE.MeshPhongMaterial({
            color: 0x3498db,
            transparent: true,
            opacity: 0.8,
            shininess: 100
        });

        this.platform = new THREE.Mesh(platformGeometry, platformMaterial);
        
        // Add platform glow
        const glowGeometry = new THREE.BoxGeometry(15.2, 0.6, 15.2);
        const glowMaterial = new THREE.MeshPhongMaterial({
            color: 0x3498db,
            transparent: true,
            opacity: 0.3,
            shininess: 100
        });

        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.platform.add(glow);

        // Add floating animation
        this.platform.position.y = 0;
        this.scene.add(this.platform);
    }

    createAmbientParticles() {
        // Create floating particles around platform
        const particlesGeometry = new THREE.BufferGeometry();
        const particlePositions = [];
        const particleColors = [];

        for (let i = 0; i < 200; i++) {
            const radius = Math.random() * 20 + 15;
            const theta = Math.random() * Math.PI * 2;
            const y = Math.random() * 20 - 10;

            const x = radius * Math.cos(theta);
            const z = radius * Math.sin(theta);

            particlePositions.push(x, y, z);
            particleColors.push(0, 1, 0.6); // Cyan color
        }

        particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
        particlesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(particleColors, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        this.ambientParticles = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(this.ambientParticles);
    }

    addLighting() {
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);

        // Add point light under platform
        const platformLight = new THREE.PointLight(0x00ff9d, 2, 50);
        platformLight.position.set(0, -5, 0);
        this.platform.add(platformLight);

        // Add distant stars light
        const starLight = new THREE.DirectionalLight(0x6666ff, 0.5);
        starLight.position.set(100, 100, 100);
        this.scene.add(starLight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = this.clock.getElapsedTime();

        // Rotate starfield slowly
        this.starField.rotation.y += 0.0001;

        // Animate nebulas
        this.nebulas.forEach((nebula, i) => {
            nebula.rotation.y = time * 0.05 * (i + 1) * 0.1;
            nebula.rotation.z = time * 0.03 * (i + 1) * 0.1;
        });

        // Platform floating animation
        this.platform.position.y = Math.sin(time * 0.5) * 0.5;
        this.platform.rotation.y += 0.001;

        // Ambient particles movement
        const positions = this.ambientParticles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += Math.sin(time + i) * 0.01;
        }
        this.ambientParticles.geometry.attributes.position.needsUpdate = true;

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Initialize in your main script
document.addEventListener('DOMContentLoaded', () => {
    const spaceEnv = new SpaceEnvironment();
    // ... rest of your initialization code
});

class DashPro {
    constructor() {
        this.initialized = false;
        this.menuSystem = null;
        this.spaceEnvironment = null;
        this.init();
    }

    async init() {
        // Initialize space environment first
        this.spaceEnvironment = new SpaceEnvironment();
        
        // Initialize menu system but keep it hidden
        await this.initializeMenuSystem();
        
        // Add menu trigger functionality
        this.initializeMenuTrigger();
        
        this.initialized = true;
    }

    async initializeMenuSystem() {
        const menuStructure = await this.loadMenuStructure();
        this.menuSystem = new MenuSystem(menuStructure);
    }

    async loadMenuStructure() {
        // Menu structure that will be loaded dynamically
        return {
            categories: [
                {
                    id: 'social',
                    icon: '🌐',
                    title: 'Social Media',
                    items: [
                        { id: 'instagram', icon: '📱', title: 'Instagram' },
                        { id: 'twitter', icon: '🐦', title: 'Twitter' },
                        { id: 'facebook', icon: '👥', title: 'Facebook' }
                    ]
                },
                // Add more categories as needed
            ]
        };
    }

    initializeMenuTrigger() {
        const trigger = document.getElementById('menu-trigger');
        trigger.addEventListener('click', () => this.toggleMenu());
    }

    toggleMenu() {
        if (!this.initialized) return;
        this.menuSystem.toggle();
    }
}

class MenuSystem {
    constructor(structure) {
        this.structure = structure;
        this.element = document.querySelector('.menu-system');
        this.isVisible = false;
        this.init();
    }

    init() {
        this.buildMenuStructure();
        this.setupEventListeners();
    }

    buildMenuStructure() {
        // Build menu HTML dynamically
        const menuContent = document.createElement('div');
        menuContent.className = 'menu-content';

        this.structure.categories.forEach(category => {
            const categoryElement = this.createCategoryElement(category);
            menuContent.appendChild(categoryElement);
        });

        this.element.appendChild(menuContent);
    }

    createCategoryElement(category) {
        const div = document.createElement('div');
        div.className = 'menu-category collapsed';
        div.innerHTML = `
            <div class="category-header">
                <span class="category-icon">${category.icon}</span>
                <span class="category-title">${category.title}</span>
                <span class="category-arrow">▼</span>
            </div>
            <div class="category-content">
                ${category.items.map(item => `
                    <div class="menu-item" data-app="${item.id}">
                        <span class="item-icon">${item.icon}</span>
                        <span class="item-title">${item.title}</span>
                    </div>
                `).join('')}
            </div>
        `;
        return div;
    }

    setupEventListeners() {
        // Category toggles
        this.element.querySelectorAll('.category-header').forEach(header => {
            header.addEventListener('click', (e) => {
                const category = e.currentTarget.parentElement;
                this.toggleCategory(category);
            });
        });

        // Menu items
        this.element.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const appId = e.currentTarget.dataset.app;
                this.launchApp(appId);
            });
        });
    }

    toggle() {
        this.isVisible = !this.isVisible;
        this.element.classList.toggle('visible');
        document.getElementById('menu-trigger').classList.toggle('active');
    }

    toggleCategory(category) {
        // Close other categories
        this.element.querySelectorAll('.menu-category').forEach(cat => {
            if (cat !== category) cat.classList.add('collapsed');
        });
        
        category.classList.toggle('collapsed');
    }

    launchApp(appId) {
        // Create spawn effect and launch app
        this.createSpawnEffect().then(() => {
            new AppWindow(appId);
        });
        
        // Auto-collapse menu
        this.toggle();
    }

    async createSpawnEffect() {
        return new Promise(resolve => {
            const effect = document.createElement('div');
            effect.className = 'spawn-effect';
            document.body.appendChild(effect);

            effect.addEventListener('animationend', () => {
                effect.remove();
                resolve();
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Toggle mobile menu
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Animate hamburger
        const hamburger = navToggle.querySelector('.hamburger');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-menu')) {
            navLinks.classList.remove('active');
        }
    });
});

// Load saved state on page load
async function loadSavedState() {
    try {
        const savedState = await db.workspaceState.get('workspace1');
        if (savedState) {
            // Restore platform position
            platform.position.set(
                savedState.platformPosition.x,
                savedState.platformPosition.y,
                savedState.platformPosition.z
            );

            // Restore platform rotation
            platform.rotation.set(
                savedState.platformRotation.x,
                savedState.platformRotation.y,
                savedState.platformRotation.z
            );

            // Restore camera position
            camera.position.set(
                savedState.cameraPosition.x,
                savedState.cameraPosition.y,
                savedState.cameraPosition.z
            );

            // Restore lighting
            ambientLight.intensity = savedState.sceneData.ambientLightIntensity;
            directionalLight.intensity = savedState.sceneData.directionalLightIntensity;
        }
    } catch (error) {
        console.error('Error loading workspace:', error);
    }
}

// Call loadSavedState after scene initialization
loadSavedState();

// Folder tree functionality
document.addEventListener('DOMContentLoaded', () => {
    // Handle folder toggling
    document.querySelectorAll('.folder-header').forEach(header => {
        header.addEventListener('click', (e) => {
            const folder = header.parentElement;
            folder.classList.toggle('open');
            
            // Add animation effect
            const content = folder.querySelector('.folder-content');
            if (folder.classList.contains('open')) {
                gsap.from(content, {
                    height: 0,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
            
            e.stopPropagation(); // Prevent event bubbling
        });
    });

    // Handle file clicking
    document.querySelectorAll('.file').forEach(file => {
        file.addEventListener('click', (e) => {
            const fileName = file.querySelector('.file-name').textContent;
            // You can add custom file handling here
            console.log(`File clicked: ${fileName}`);
            e.stopPropagation();
        });
    });
});

// Menu button functionality
document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.querySelector('.menu-button');
    const menuContent = document.querySelector('.menu-content');
    
    menuButton.addEventListener('click', () => {
        menuButton.classList.toggle('active');
        menuContent.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuButton.contains(e.target) && !menuContent.contains(e.target)) {
            menuButton.classList.remove('active');
            menuContent.classList.remove('active');
        }
    });
});

function rotateLeft() {
    const container = document.querySelector('.rotate-container');
    container.classList.remove('rotate-right');
    container.classList.add('rotate-left');
}

function rotateRight() {
    const container = document.querySelector('.rotate-container');
    container.classList.remove('rotate-left');
    container.classList.add('rotate-right');
}

function resetRotation() {
    const container = document.querySelector('.rotate-container');
    container.classList.remove('rotate-left', 'rotate-right');
}
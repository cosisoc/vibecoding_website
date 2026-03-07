// =====================================
// CUSTOM CURSOR
// =====================================
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

let mouseX = 0;
let mouseY = 0;
let followerX = 0;
let followerY = 0;
let isMouseMoving = false;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Show cursor on first mouse move
    if (!isMouseMoving) {
        cursor.style.opacity = '1';
        cursorFollower.style.opacity = '0.3';
        isMouseMoving = true;
    }
    
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

// Smooth follower animation
function animateFollower() {
    const distX = mouseX - followerX;
    const distY = mouseY - followerY;
    
    followerX += distX * 0.1;
    followerY += distY * 0.1;
    
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    
    requestAnimationFrame(animateFollower);
}
animateFollower();

// Click effect for cursor
document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(2)';
    cursor.style.borderWidth = '1px';
});

document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursor.style.borderWidth = '2px';
});

// Cursor hover effects
const hoverElements = document.querySelectorAll('a, .grid-item, .project-card');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(2)';
        cursor.style.borderWidth = '1px';
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.borderWidth = '2px';
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
    });
});

// =====================================
// BACKGROUND STYLE SWITCHER
// =====================================
const bgStyles = [
    { name: 'Original', class: 'bg-original' },
    { name: 'Gradient', class: 'bg-gradient' },
    { name: 'Grid', class: 'bg-grid' },
    { name: 'Mesh', class: 'bg-mesh' },
    { name: 'Grain', class: 'bg-grain' }
];

let currentBgIndex = 0;
const bgSwitchBtn = document.getElementById('bgSwitchBtn');
const bgStyleName = document.getElementById('bgStyleName');

// Set initial style
document.body.classList.add(bgStyles[currentBgIndex].class);

bgSwitchBtn.addEventListener('click', () => {
    // Remove current class
    document.body.classList.remove(bgStyles[currentBgIndex].class);
    
    // Move to next style (loop back to start)
    currentBgIndex = (currentBgIndex + 1) % bgStyles.length;
    
    // Add new class and update label
    document.body.classList.add(bgStyles[currentBgIndex].class);
    bgStyleName.textContent = bgStyles[currentBgIndex].name;
});

// =====================================
// INTERACTIVE GRID COLORS
// =====================================
const gridItems = document.querySelectorAll('.grid-item');

gridItems.forEach(item => {
    const color = item.dataset.color;
    
    item.addEventListener('mouseenter', () => {
        item.style.setProperty('--hover-color', color);
    });
    
    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// =====================================
// SCROLL ANIMATIONS
// =====================================
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

// Animate elements on scroll
const animateOnScroll = document.querySelectorAll('.grid-item, .project-card, .section-title');
animateOnScroll.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// =====================================
// TEXT REVEAL ON SCROLL
// =====================================
const revealText = document.querySelector('.reveal-text');

if (revealText) {
    const text = revealText.textContent;
    revealText.innerHTML = '';
    
    // Split text into words and wrap each in a span
    const words = text.split(' ');
    words.forEach((word, index) => {
        const span = document.createElement('span');
        span.textContent = word + ' ';
        span.style.opacity = '0.2';
        span.style.transition = 'opacity 0.3s ease';
        span.style.display = 'inline-block';
        revealText.appendChild(span);
    });
    
    // Reveal words on scroll
    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const spans = revealText.querySelectorAll('span');
                spans.forEach((span, index) => {
                    setTimeout(() => {
                        span.style.opacity = '1';
                    }, index * 100);
                });
            }
        });
    }, { threshold: 0.5 });
    
    textObserver.observe(revealText);
}

// =====================================
// PARALLAX EFFECT FOR SHAPES
// =====================================
const shapes = document.querySelectorAll('.shape');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.2);
        const yPos = -(scrolled * speed);
        shape.style.transform = `translate(0, ${yPos}px)`;
    });
});

// =====================================
// SMOOTH SCROLL FOR NAVIGATION
// =====================================
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// =====================================
// PROJECT CARD CLICK INTERACTION
// =====================================
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach((card, index) => {
    card.addEventListener('click', () => {
        // Add a fun bounce animation
        card.style.animation = 'cardBounce 0.5s ease';
        
        setTimeout(() => {
            card.style.animation = '';
        }, 500);
        
        console.log(`Project card ${index + 1} clicked!`);
        // Hier kannst du später eine Modal oder neue Seite öffnen
    });
});

// Add bounce animation keyframes via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes cardBounce {
        0%, 100% { transform: translateY(-10px) scale(1); }
        50% { transform: translateY(-20px) scale(1.05); }
    }
`;
document.head.appendChild(style);

// =====================================
// RANDOM COLOR CHANGE FOR GRID ITEMS
// =====================================
const colors = ['#FF3366', '#FF6B35', '#F7931E', '#C1272D', '#E74C3C', '#FF5252'];

gridItems.forEach(item => {
    item.addEventListener('click', () => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        item.style.setProperty('--hover-color', randomColor);
        
        // Trigger the hover effect programmatically
        const beforeElement = window.getComputedStyle(item, '::before');
        item.style.background = randomColor;
        
        setTimeout(() => {
            item.style.background = '';
        }, 300);
    });
});

// =====================================
// TEXT EFFECTS UTILITY
// =====================================
function splitTextIntoLetters(element) {
    const text = element.textContent;
    element.textContent = '';
    
    [...text].forEach(char => {
        const span = document.createElement('span');
        span.className = 'letter';
        span.textContent = char;
        // Preserve spaces
        if (char === ' ') {
            span.style.width = '0.5em';
        }
        element.appendChild(span);
    });
}

// =====================================
// EFFECT 1: LETTER TUMBLE (Magnetic Repulsion)
// Buchstaben werden von der Maus weggedrückt
// =====================================

// Split letter tumble text into letters
const letterTumbleText = document.getElementById('letterTumbleText');
if (letterTumbleText) {
    splitTextIntoLetters(letterTumbleText);
}

// Letter Tumble effect function (repulsion)
function applyLetterTumbleEffect(e, letters, strength = 30, maxDistance = 150) {
    letters.forEach(letter => {
        const rect = letter.getBoundingClientRect();
        const letterCenterX = rect.left + rect.width / 2;
        const letterCenterY = rect.top + rect.height / 2;
        
        // Calculate distance from mouse to letter center
        const deltaX = e.clientX - letterCenterX;
        const deltaY = e.clientY - letterCenterY;
        const distance = Math.hypot(deltaX, deltaY);
        
        // Calculate force (0 to 1, stronger when closer)
        const force = Math.max(0, (maxDistance - distance) / maxDistance);
        
        if (distance < maxDistance && distance > 0) {
            // Calculate repulsion direction (push away from mouse)
            const angle = Math.atan2(deltaY, deltaX);
            const pushX = Math.cos(angle) * strength * force * -1;
            const pushY = Math.sin(angle) * strength * force * -1;
            
            // Add slight rotation based on position
            const rotation = (deltaX / distance) * force * 15;
            
            letter.style.transform = `translate(${pushX}px, ${pushY}px) rotate(${rotation}deg) scale(${1 + force * 0.2})`;
        } else {
            letter.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';
        }
    });
}

// Apply to letter tumble section (stronger effect)
const letterTumbleLetters = document.querySelectorAll('#letterTumbleText .letter');
const letterTumbleSection = document.querySelector('.letter-tumble-section');

if (letterTumbleSection) {
    letterTumbleSection.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 768) {
            applyLetterTumbleEffect(e, letterTumbleLetters, 50, 250);
        }
    });
    
    letterTumbleSection.addEventListener('mouseleave', () => {
        letterTumbleLetters.forEach(letter => {
            letter.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';
        });
    });
}

// =====================================
// HERO 3D TEXT - Exact copy of CUBE code
// =====================================

const heroContainer = document.getElementById('threejs-hero');

if (heroContainer && typeof THREE !== 'undefined') {
    // Scene setup
    const heroScene = new THREE.Scene();
    
    // Orthographische Kamera für frontale Ansicht ohne Perspektiv-Verzerrung
    const aspect = window.innerWidth / (window.innerHeight * 0.5);
    const viewSize = 30;
    const heroCamera = new THREE.OrthographicCamera(
        -viewSize * aspect / 2, // left
        viewSize * aspect / 2,  // right
        viewSize / 2,           // top
        -viewSize / 2,          // bottom
        0.1,                    // near
        1000                    // far
    );
    
    const heroRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    heroRenderer.setSize(window.innerWidth, window.innerHeight * 0.5);
    heroRenderer.setClearColor(0x000000, 0);
    heroContainer.appendChild(heroRenderer.domElement);
    
    heroCamera.position.set(0, 0, 50);
    heroCamera.lookAt(0, 0, 0);
    
    // Lights
    const heroAmbientLight = new THREE.AmbientLight(0xffffff, 0.7);
    heroScene.add(heroAmbientLight);
    
    const heroDirectionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    heroDirectionalLight.position.set(10, 10, 5);
    heroScene.add(heroDirectionalLight);
    
    const heroDirectionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    heroDirectionalLight2.position.set(-10, -10, -5);
    heroScene.add(heroDirectionalLight2);
    
    // Letter meshes array
    const heroLetterMeshes = [];
    const text1 = 'Hi im Cosima';
    const spacing1 = 5.5;
    
    // Load font and create text geometry
    const heroLoader = new THREE.FontLoader();
    heroLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
        
        const letterSpacing = 0.7; // Abstand zwischen Buchstaben innerhalb eines Wortes
        const wordSpacing = 3; // Abstand zwischen Wörtern
        
        function createTextLine(text, yPos, color, fontSize) {
            const words = text.split(' ');
            
            // Erst alle Breiten berechnen
            const wordData = [];
            let totalWidth = 0;
            
            words.forEach((word, wordIndex) => {
                const charData = [];
                let wordWidth = 0;
                
                word.split('').forEach((char) => {
                    const tempGeometry = new THREE.TextGeometry(char, {
                        font: font,
                        size: fontSize,
                        height: 2.5,
                        curveSegments: 12,
                        bevelEnabled: true,
                        bevelThickness: 0.4,
                        bevelSize: 0.25,
                        bevelOffset: 0,
                        bevelSegments: 5
                    });
                    tempGeometry.computeBoundingBox();
                    const width = tempGeometry.boundingBox.max.x - tempGeometry.boundingBox.min.x;
                    charData.push({ char, width });
                    wordWidth += width;
                });
                
                wordData.push({ charData, wordWidth });
                totalWidth += wordWidth;
                
                // Spacing zwischen Wörtern (aber nicht nach dem letzten Wort)
                if (wordIndex < words.length - 1) {
                    totalWidth += wordSpacing;
                }
                
                // Spacing zwischen Buchstaben innerhalb des Wortes
                const letterSpacingTotal = letterSpacing * (word.length - 1);
                totalWidth += letterSpacingTotal;
            });
            
            // Startposition (zentriert)
            let currentX = -totalWidth / 2;
            
            // Jetzt Buchstaben erstellen
            wordData.forEach((word, wordIndex) => {
                word.charData.forEach((charInfo, charIndex) => {
                    const textGeometry = new THREE.TextGeometry(charInfo.char, {
                        font: font,
                        size: fontSize,
                        height: 2.5,
                        curveSegments: 12,
                        bevelEnabled: true,
                        bevelThickness: 0.4,
                        bevelSize: 0.25,
                        bevelOffset: 0,
                        bevelSegments: 5
                    });
                    
                    textGeometry.computeBoundingBox();
                    const charWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
                    const bbox = textGeometry.boundingBox.clone();
                    
                    // Für Rotation muss die Geometrie komplett zentriert sein
                    // Aber wir merken uns das Offset zur Baseline
                    const baselineOffset = bbox.min.y; // Wie weit unter dem Zentrum ist die Baseline
                    const centerY = (bbox.max.y + bbox.min.y) / 2;
                    
                    textGeometry.center();
                    
                    const material = new THREE.MeshStandardMaterial({
                        color: color,
                        roughness: 0.4,
                        metalness: 0.1
                    });
                    
                    const mesh = new THREE.Mesh(textGeometry, material);
                    mesh.position.x = currentX + charWidth / 2;
                    // yPos ist die Baseline, wir müssen die Höhe zum Zentrum addieren
                    mesh.position.y = yPos + centerY;
                    mesh.rotation.set(0, 0, 0);
                    
                    mesh.userData = {
                        char: charInfo.char,
                        originalX: mesh.position.x,
                        originalY: mesh.position.y,
                        isRotating: false,
                        hasRotated: false,
                        rotationStart: 0,
                        rotationTarget: 0,
                        rotationProgress: 0,
                        rotationAxis: 'y'
                    };
                    
                    heroScene.add(mesh);
                    heroLetterMeshes.push(mesh);
                    
                    // Bewege currentX zur rechten Kante dieses Buchstabens
                    currentX += charWidth;
                    
                    // Letter Spacing nur zwischen Buchstaben, nicht nach dem letzten
                    if (charIndex < word.charData.length - 1) {
                        currentX += letterSpacing;
                    }
                });
                
                // Nach jedem Wort (außer dem letzten) Word-Spacing hinzufügen
                if (wordIndex < wordData.length - 1) {
                    currentX += wordSpacing;
                }
            });
        }
        
        // Erste Zeile
        createTextLine(text1, 3, 0x4A5C3E, 5);
        
        // Zweite Zeile
        const text2 = 'a interactiondesign student';
        createTextLine(text2, -3, 0xC3756B, 3.5);
    });
    
    // Raycaster for precise mouse detection
    const heroRaycaster = new THREE.Raycaster();
    const heroMouse = new THREE.Vector2();
    
    // Track previous mouse position for direction detection
    let heroPrevMouseX = 0;
    let heroPrevMouseY = 0;
    
    heroContainer.addEventListener('mousemove', (e) => {
        const rect = heroContainer.getBoundingClientRect();
        heroMouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        heroMouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Calculate mouse movement direction
        const deltaX = heroMouse.x - heroPrevMouseX;
        const deltaY = heroMouse.y - heroPrevMouseY;
        
        // Update raycaster
        heroRaycaster.setFromCamera(heroMouse, heroCamera);
        
        // Check intersections with letters
        const intersects = heroRaycaster.intersectObjects(heroLetterMeshes);
        
        // Reset hasRotated flag for all letters not being hovered
        heroLetterMeshes.forEach(mesh => {
            const isIntersected = intersects.find(i => i.object === mesh);
            if (!isIntersected && !mesh.userData.isRotating) {
                mesh.userData.hasRotated = false;
            }
        });
        
        // Trigger rotation for intersected letter
        if (intersects.length > 0) {
            const hoveredMesh = intersects[0].object;
            
            if (!hoveredMesh.userData.isRotating && !hoveredMesh.userData.hasRotated) {
                hoveredMesh.userData.isRotating = true;
                hoveredMesh.userData.hasRotated = true;
                
                const absDeltaX = Math.abs(deltaX);
                const absDeltaY = Math.abs(deltaY);
                
                if (absDeltaX > absDeltaY) {
                    hoveredMesh.userData.rotationAxis = 'y';
                    hoveredMesh.userData.rotationStart = hoveredMesh.rotation.y;
                    hoveredMesh.userData.rotationTarget = hoveredMesh.rotation.y + Math.PI * 2 * Math.sign(deltaX);
                } else {
                    hoveredMesh.userData.rotationAxis = 'x';
                    hoveredMesh.userData.rotationStart = hoveredMesh.rotation.x;
                    hoveredMesh.userData.rotationTarget = hoveredMesh.rotation.x + Math.PI * 2 * -Math.sign(deltaY);
                }
                
                hoveredMesh.userData.rotationProgress = 0;
            }
        }
        
        heroPrevMouseX = heroMouse.x;
        heroPrevMouseY = heroMouse.y;
    });
    
    // Animation loop
    function animateHero() {
        requestAnimationFrame(animateHero);
        
        heroLetterMeshes.forEach((mesh) => {
            if (mesh.userData.isRotating) {
                mesh.userData.rotationProgress += 0.08;
                
                if (mesh.userData.rotationProgress >= 1) {
                    mesh.userData.isRotating = false;
                    mesh.userData.rotationProgress = 0;
                    if (mesh.userData.rotationAxis === 'y') {
                        mesh.rotation.y = mesh.userData.rotationTarget;
                    } else {
                        mesh.rotation.x = mesh.userData.rotationTarget;
                    }
                } else {
                    const t = mesh.userData.rotationProgress;
                    const eased = t < 0.5 
                        ? 4 * t * t * t 
                        : 1 - Math.pow(-2 * t + 2, 3) / 2;
                    
                    const rotationValue = mesh.userData.rotationStart + 
                        (mesh.userData.rotationTarget - mesh.userData.rotationStart) * eased;
                    
                    if (mesh.userData.rotationAxis === 'y') {
                        mesh.rotation.y = rotationValue;
                    } else {
                        mesh.rotation.x = rotationValue;
                    }
                }
            }
            
            // Keine Floating-Animation - Buchstaben bleiben auf fester Höhe
        });
        
        heroRenderer.render(heroScene, heroCamera);
    }
    
    animateHero();
    
    // Handle resize
    window.addEventListener('resize', () => {
        const aspect = window.innerWidth / (window.innerHeight * 0.5);
        const viewSize = 30;
        heroCamera.left = -viewSize * aspect / 2;
        heroCamera.right = viewSize * aspect / 2;
        heroCamera.top = viewSize / 2;
        heroCamera.bottom = -viewSize / 2;
        heroCamera.updateProjectionMatrix();
        heroRenderer.setSize(window.innerWidth, window.innerHeight * 0.5);
    });
}

// =====================================
// EFFECT 2: 3D CUBE ROTATION (Three.js WebGL)
// Echte 3D-Würfel-Buchstaben mit WebGL
// =====================================

const threejsContainer = document.getElementById('threejs-container');

if (threejsContainer && typeof THREE !== 'undefined') {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, threejsContainer.clientWidth / threejsContainer.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(threejsContainer.clientWidth, threejsContainer.clientHeight);
    renderer.setClearColor(0x4a90a4, 0);
    threejsContainer.appendChild(renderer.domElement);
    
    camera.position.z = 50;
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-10, -10, -5);
    scene.add(directionalLight2);
    
    // Letter meshes array
    const letterMeshes = [];
    const text = 'CUBE';
    const spacing = 15;
    
    // Load font and create text geometry
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
        
        text.split('').forEach((char, index) => {
            // Create text geometry with extrusion (depth)
            const textGeometry = new THREE.TextGeometry(char, {
                font: font,
                size: 8,
                height: 4, // Depth/Extrusion
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.5,
                bevelSize: 0.3,
                bevelOffset: 0,
                bevelSegments: 5
            });
            
            // Center the geometry so it rotates around its center
            textGeometry.center();
            
            // Material with nice lighting
            const material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.4,
                metalness: 0.1
            });
            
            const mesh = new THREE.Mesh(textGeometry, material);
            mesh.position.x = (index - text.length / 2) * spacing + spacing/2;
            mesh.position.y = -3;
            
            // Store original position and rotation state
            mesh.userData = {
                char,
                originalX: mesh.position.x,
                isRotating: false,
                hasRotated: false, // Prevents multiple rotations
                rotationStart: 0,
                rotationTarget: 0,
                rotationProgress: 0,
                rotationAxis: 'y' // 'x' or 'y' depending on mouse direction
            };
            
            scene.add(mesh);
            letterMeshes.push(mesh);
        });
    });
    
    // Raycaster for precise mouse detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    // Track previous mouse position for direction detection
    let prevMouseX = 0;
    let prevMouseY = 0;
    
    threejsContainer.addEventListener('mousemove', (e) => {
        const rect = threejsContainer.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Calculate mouse movement direction
        const deltaX = mouse.x - prevMouseX;
        const deltaY = mouse.y - prevMouseY;
        
        // Update raycaster
        raycaster.setFromCamera(mouse, camera);
        
        // Check intersections with letters
        const intersects = raycaster.intersectObjects(letterMeshes);
        
        // Reset hasRotated flag for all letters not being hovered
        letterMeshes.forEach(mesh => {
            const isIntersected = intersects.find(i => i.object === mesh);
            if (!isIntersected && !mesh.userData.isRotating) {
                // Mouse left the letter, allow rotation again next time
                mesh.userData.hasRotated = false;
            }
        });
        
        // Trigger rotation for intersected letter
        if (intersects.length > 0) {
            const hoveredMesh = intersects[0].object;
            
            // Only rotate if not already rotating and hasn't rotated yet
            if (!hoveredMesh.userData.isRotating && !hoveredMesh.userData.hasRotated) {
                hoveredMesh.userData.isRotating = true;
                hoveredMesh.userData.hasRotated = true;
                
                // Determine rotation axis and direction based on mouse movement
                const absDeltaX = Math.abs(deltaX);
                const absDeltaY = Math.abs(deltaY);
                
                // Choose axis based on dominant movement direction
                if (absDeltaX > absDeltaY) {
                    // Horizontal movement -> rotate around Y axis
                    hoveredMesh.userData.rotationAxis = 'y';
                    hoveredMesh.userData.rotationStart = hoveredMesh.rotation.y;
                    // Rotate in direction of mouse movement
                    hoveredMesh.userData.rotationTarget = hoveredMesh.rotation.y + Math.PI * 2 * Math.sign(deltaX);
                } else {
                    // Vertical movement -> rotate around X axis
                    hoveredMesh.userData.rotationAxis = 'x';
                    hoveredMesh.userData.rotationStart = hoveredMesh.rotation.x;
                    // Rotate in direction of mouse movement (inverted for natural feel)
                    hoveredMesh.userData.rotationTarget = hoveredMesh.rotation.x + Math.PI * 2 * -Math.sign(deltaY);
                }
                
                hoveredMesh.userData.rotationProgress = 0;
            }
        }
        
        // Update previous mouse position
        prevMouseX = mouse.x;
        prevMouseY = mouse.y;
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        letterMeshes.forEach((mesh) => {
            // Animate rotation if triggered
            if (mesh.userData.isRotating) {
                mesh.userData.rotationProgress += 0.08; // Rotation speed
                
                if (mesh.userData.rotationProgress >= 1) {
                    // Rotation complete
                    mesh.userData.isRotating = false;
                    mesh.userData.rotationProgress = 0;
                    if (mesh.userData.rotationAxis === 'y') {
                        mesh.rotation.y = mesh.userData.rotationTarget;
                    } else {
                        mesh.rotation.x = mesh.userData.rotationTarget;
                    }
                } else {
                    // Smooth easing (ease-in-out)
                    const t = mesh.userData.rotationProgress;
                    const eased = t < 0.5 
                        ? 4 * t * t * t 
                        : 1 - Math.pow(-2 * t + 2, 3) / 2;
                    
                    const rotationValue = mesh.userData.rotationStart + 
                        (mesh.userData.rotationTarget - mesh.userData.rotationStart) * eased;
                    
                    // Apply rotation to correct axis
                    if (mesh.userData.rotationAxis === 'y') {
                        mesh.rotation.y = rotationValue;
                    } else {
                        mesh.rotation.x = rotationValue;
                    }
                }
            }
            
            // Gentle floating animation
            mesh.position.y = -3 + Math.sin(Date.now() * 0.001 + mesh.userData.originalX) * 0.3;
        });
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
        if (threejsContainer.clientWidth > 0) {
            camera.aspect = threejsContainer.clientWidth / threejsContainer.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(threejsContainer.clientWidth, threejsContainer.clientHeight);
        }
    });
}

// =====================================
// CONSOLE MESSAGE
// =====================================
console.log('%c🎨 Vibe Coding Website ', 'background: #FF3366; color: white; font-size: 20px; padding: 10px;');
console.log('%cExperimental Playground loaded! Viel Spaß beim Rumspielen 🚀', 'font-size: 14px; color: #FF6B35;');

// =====================================
// PERFORMANCE: Reduce animations on mobile
// =====================================
if (window.innerWidth < 768) {
    document.body.style.cursor = 'auto';
    if (cursor) cursor.style.display = 'none';
    if (cursorFollower) cursorFollower.style.display = 'none';
}

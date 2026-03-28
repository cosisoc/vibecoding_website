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
        const isSelectedProject = el.classList.contains('grid-item') && el.classList.contains('active');
        cursor.classList.toggle('cursor-selected', isSelectedProject);
        cursor.style.transform = 'translate(-50%, -50%) scale(2)';
        cursor.style.borderWidth = '1px';
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-selected');
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.borderWidth = '2px';
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
    });
});

// Background: minimal default
document.body.classList.add('bg-original');
document.body.classList.remove('bg-grid');

// =====================================
// INTERACTIVE GRID COLORS
// =====================================
const gridItems = document.querySelectorAll('.grid-item');

gridItems.forEach(item => {
    const color = item.dataset.color;

    function pauseSectionVideos(section) {
        const videos = section.querySelectorAll('video');
        videos.forEach(video => {
            video.pause();
        });
    }
    
    item.addEventListener('mouseenter', () => {
        item.style.setProperty('--hover-color', color);
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = '';
    });

    // Click to show/hide project detail
    item.addEventListener('click', () => {
        const targetId = item.dataset.target;
        if (targetId) {
            // Hide active project sections and pause their videos
            document.querySelectorAll('.project-detail-section.active').forEach(section => {
                pauseSectionVideos(section);
                section.classList.remove('active');
            });
            
            // Remove active state from all grid items
            gridItems.forEach(gridItem => {
                gridItem.classList.remove('active');
            });
            
            // Show selected project section
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                item.classList.add('active');

                // Cursor selected state (user is clicking the active card)
                cursor.classList.add('cursor-selected');
                
                // Scroll to the project section smoothly
                setTimeout(() => {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
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

// Animate elements on scroll — replaced by dedicated scroll system below
const animateOnScroll = document.querySelectorAll('.project-card');
animateOnScroll.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Text reveal removed per request

// =====================================
// SCROLL PROGRESS BAR
// =====================================
const scrollProgressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgressBar) scrollProgressBar.style.width = pct + '%';
}, { passive: true });

// =====================================
// SCROLL REVEAL — GRID TITLE + CARDS
// =====================================
const gridSectionTitle = document.querySelector('.grid-section .section-title');
const gridCards = document.querySelectorAll('.interactive-grid .grid-item');

// Set initial hidden state
gridCards.forEach(card => card.classList.add('scroll-hidden'));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target === gridSectionTitle) {
                entry.target.classList.add('revealed');
            } else {
                entry.target.classList.remove('scroll-hidden');
                entry.target.classList.add('scroll-visible');
            }
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

if (gridSectionTitle) revealObserver.observe(gridSectionTitle);
gridCards.forEach(card => revealObserver.observe(card));

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
// SCROLL REVEAL — PROJECT DETAIL CONTENT
// =====================================
const detailRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // stagger each element slightly based on its index among siblings
            const siblings = Array.from(entry.target.parentElement.children);
            const idx = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = (idx * 0.08) + 's';
            entry.target.classList.add('is-visible');
            detailRevealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

function observeDetailSection(section) {
    const els = section.querySelectorAll(
        '.project-section, .project-video-wrapper, .project-pdfs, ' +
        '.project-detail-title, .project-detail-subtitle, .project-image-wrapper'
    );
    els.forEach(el => detailRevealObserver.observe(el));
}

// Observe already-active sections and any that become active later
document.querySelectorAll('.project-detail-section.active').forEach(observeDetailSection);

// Hook into grid-item click so newly shown sections get observed
document.querySelectorAll('.grid-item').forEach(item => {
    item.addEventListener('click', () => {
        const targetId = item.dataset.target;
        if (targetId) {
            const section = document.querySelector(targetId);
            if (section) {
                // slight delay so display:block kicks in before observing
                setTimeout(() => observeDetailSection(section), 50);
            }
        }
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

// Letter tumble removed per request

// =====================================
// HERO 3D TEXT - Exact copy of CUBE code
// =====================================

const heroContainer = document.getElementById('threejs-hero');

if (heroContainer && typeof THREE !== 'undefined') {
    // Only these words should respond to hover/rotation
    const interactiveWords = new Set(['interaction', 'design', 'interaktionsgestaltungs']);
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
    heroRenderer.setPixelRatio(window.devicePixelRatio);
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

    // One-time intro: type-on + spin-in
    let heroIntroPlayed = false;
    const heroIntroConfig = {
        letterDelayMs: 75,
        wordExtraDelayMs: 160,
        durationMs: 520
    };

    function setMeshOpacity(mesh, opacity) {
        const mat = mesh.material;
        if (Array.isArray(mat)) {
            mat.forEach(m => {
                m.transparent = true;
                m.opacity = opacity;
            });
        } else if (mat) {
            mat.transparent = true;
            mat.opacity = opacity;
        }
    }

    function prepareHeroIntro({ play }) {
        const startMs = performance.now();

        let cursorMs = 0;
        let prevWord = null;
        heroLetterMeshes.forEach((mesh, idx) => {
            const ud = mesh.userData || (mesh.userData = {});
            const word = (ud.word || '').toString();

            if (prevWord !== null && word && word !== prevWord) {
                cursorMs += heroIntroConfig.wordExtraDelayMs;
            }
            prevWord = word;

            ud.intro = {
                enabled: Boolean(play),
                done: !play,
                startMs: startMs + cursorMs,
                durationMs: heroIntroConfig.durationMs,
                index: idx
            };

            if (play) {
                mesh.visible = false;
                setMeshOpacity(mesh, 0);
                mesh.rotation.set(0, 0, 0);
            } else {
                mesh.visible = true;
                setMeshOpacity(mesh, 1);
            }

            cursorMs += heroIntroConfig.letterDelayMs;
        });
    }
    
    // Load font and prepare hero text builder
    const heroLoader = new THREE.FontLoader();
    let heroFont = null;
    let heroFontLoaded = false;

    heroLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
        heroFont = font;
        heroFontLoaded = true;

        // Expose a rebuild function on window so other code can request hero text updates
        window.rebuildHeroText = function(lang) {
            if (!heroFontLoaded) return;

            // Remove old meshes
            while (heroLetterMeshes.length) {
                const m = heroLetterMeshes.pop();
                heroScene.remove(m);
                if (m.geometry) m.geometry.dispose();
                if (m.material) {
                    if (Array.isArray(m.material)) {
                        m.material.forEach(mat => mat.dispose());
                    } else {
                        m.material.dispose();
                    }
                }
            }

            const letterSpacing = 0.7;
            const wordSpacing = 3;

            function createTextLine(text, yPos, color, fontSize) {
                const words = text.split(' ');
                const wordData = [];
                let totalWidth = 0;

                words.forEach((word, wordIndex) => {
                    const charData = [];
                    let wordWidth = 0;

                    word.split('').forEach((char) => {
                        const tempGeometry = new THREE.TextGeometry(char, {
                            font: heroFont,
                            size: fontSize,
                            height: 2.5,
                            curveSegments: 64,
                            bevelEnabled: true,
                            bevelThickness: 0.4,
                            bevelSize: 0.25,
                            bevelOffset: 0,
                            bevelSegments: 12
                        });
                        tempGeometry.computeBoundingBox();
                        const width = tempGeometry.boundingBox.max.x - tempGeometry.boundingBox.min.x;
                        charData.push({ char, width });
                        wordWidth += width;
                        tempGeometry.dispose();
                    });

                    wordData.push({ charData, wordWidth });
                    totalWidth += wordWidth;

                    if (wordIndex < words.length - 1) totalWidth += wordSpacing;
                    const letterSpacingTotal = letterSpacing * (word.length - 1);
                    totalWidth += letterSpacingTotal;
                });

                let currentX = -totalWidth / 2;

                wordData.forEach((word, wordIndex) => {
                    const currentWordText = words[wordIndex];
                    word.charData.forEach((charInfo, charIndex) => {
                        const textGeometry = new THREE.TextGeometry(charInfo.char, {
                            font: heroFont,
                            size: fontSize,
                            height: 2.5,
                            curveSegments: 64,
                            bevelEnabled: true,
                            bevelThickness: 0.4,
                            bevelSize: 0.25,
                            bevelOffset: 0,
                            bevelSegments: 12
                        });

                        textGeometry.computeBoundingBox();
                        const charWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
                        const bbox = textGeometry.boundingBox.clone();
                        const centerY = (bbox.max.y + bbox.min.y) / 2;
                        textGeometry.center();

                        const material = new THREE.MeshStandardMaterial({
                            color: 0xffffff,
                            roughness: 0.4,
                            metalness: 0.1
                        });

                        const mesh = new THREE.Mesh(textGeometry, material);
                        mesh.position.x = currentX + charWidth / 2;
                        mesh.position.y = yPos + centerY;
                        mesh.rotation.set(0, 0, 0);

                        mesh.userData = {
                            char: charInfo.char,
                            word: currentWordText,
                            wordLower: currentWordText.toLowerCase(),
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

                        currentX += charWidth;
                        if (charIndex < word.charData.length - 1) currentX += letterSpacing;
                    });

                    if (wordIndex < wordData.length - 1) currentX += wordSpacing;
                });
            }

            // Choose texts based on language
            const heroText1 = (lang === 'DE') ? 'Hi ich bin Cosima' : 'Hi I\'m Cosima';
            const heroText2 = (lang === 'DE') ? 'Interaktionsgestaltungs Studentin' : 'interaction design student';

            createTextLine(heroText1, 3, 0x4A5C3E, 5);
            createTextLine(heroText2, -3, 0xC3756B, 3.5);

            // Intro animation should only play on first load
            prepareHeroIntro({ play: !heroIntroPlayed });
            heroIntroPlayed = true;
        };

        // Build initial hero text (default language)
        if (window.rebuildHeroText) window.rebuildHeroText(currentLang);
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

            // Ignore letters that are still in the intro animation
            if (hoveredMesh.userData?.intro?.enabled && !hoveredMesh.userData.intro.done) return;

            // Only allow rotation for explicitly interactive words (substring match)
            const wl = (hoveredMesh.userData.wordLower || '').toLowerCase();
            const allowed = Array.from(interactiveWords).some(k => wl.includes(k));
            if (!allowed) return;

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
                // hover rotations are a bit snappier
                // make hover rotations snappier across the board
                const hoverBaseSpeed = 0.06;
                if ((wl || '').includes('jan')) {
                    hoveredMesh.userData.rotationSpeed = 0.12; // extra fast for 'jan'
                } else {
                    hoveredMesh.userData.rotationSpeed = hoverBaseSpeed;
                }
                hoveredMesh.userData.rotationProgress = 0;
            }
        }
        
        heroPrevMouseX = heroMouse.x;
        heroPrevMouseY = heroMouse.y;
    });

    heroContainer.addEventListener('click', (e) => {
        const rect = heroContainer.getBoundingClientRect();
        heroMouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        heroMouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        heroRaycaster.setFromCamera(heroMouse, heroCamera);
        const intersects = heroRaycaster.intersectObjects(heroLetterMeshes);
        if (intersects.length === 0) return;

        const clickedMesh = intersects[0].object;

        // Ignore letters that are still in the intro animation
        if (clickedMesh.userData?.intro?.enabled && !clickedMesh.userData.intro.done) return;
        const wl = (clickedMesh.userData.wordLower || '').toLowerCase();
        const allowed = Array.from(interactiveWords).some(k => wl.includes(k));
        if (!allowed) return;
        if (clickedMesh.userData.isRotating) return;

        clickedMesh.userData.isRotating = true;
        clickedMesh.userData.hasRotated = true;
        clickedMesh.userData.rotationAxis = 'y';
        clickedMesh.userData.rotationStart = clickedMesh.rotation.y;
        clickedMesh.userData.rotationTarget = clickedMesh.rotation.y + Math.PI * 2;
        clickedMesh.userData.rotationProgress = 0;
        // make click spins faster
        clickedMesh.userData.rotationSpeed = 0.12;
    });
    
    // Animation loop
    function animateHero() {
        requestAnimationFrame(animateHero);

        const nowMs = performance.now();
        
        heroLetterMeshes.forEach((mesh) => {
            const ud = mesh.userData || {};

            // Intro: type-on + rotate-in (per letter)
            if (ud.intro && ud.intro.enabled && !ud.intro.done) {
                const { startMs, durationMs } = ud.intro;
                if (nowMs < startMs) {
                    mesh.visible = false;
                    return;
                }

                mesh.visible = true;
                const t = Math.min(1, Math.max(0, (nowMs - startMs) / durationMs));
                const eased = t < 0.5
                    ? 4 * t * t * t
                    : 1 - Math.pow(-2 * t + 2, 3) / 2;

                setMeshOpacity(mesh, eased);
                // Straight intro spin (no tilt): rotate around Y only
                mesh.rotation.y = (1 - eased) * (Math.PI * 2);
                mesh.rotation.x = 0;
                mesh.rotation.z = 0;

                if (t >= 1) {
                    ud.intro.done = true;
                    setMeshOpacity(mesh, 1);
                    mesh.rotation.set(0, 0, 0);
                }
                return;
            }

            if (mesh.userData.isRotating) {
                const rotSpeed = typeof mesh.userData.rotationSpeed === 'number' ? mesh.userData.rotationSpeed : 0.06;
                mesh.userData.rotationProgress += rotSpeed;
                
                if (mesh.userData.rotationProgress >= 1) {
                    // Finish rotation. For auto-spins we complete the full rotation and do not return.
                    mesh.userData.isRotating = false;
                    mesh.userData.rotationProgress = 0;
                    if (mesh.userData.rotationAxis === 'y') {
                        mesh.rotation.y = mesh.userData.rotationTarget;
                    } else {
                        mesh.rotation.x = mesh.userData.rotationTarget;
                    }
                    // clear auto flags
                    mesh.userData.isAuto = false;
                    mesh.userData.autoReturning = false;
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
        heroRenderer.setPixelRatio(window.devicePixelRatio);
        heroRenderer.setSize(window.innerWidth, window.innerHeight * 0.5);
    });

    // =====================================
    // AUTO-ROTATE ON IDLE (7s) - relaxed timings
    // =====================================
    let idleTimeoutId = null;
    const idleDelay = 7000; // 7 seconds (restored)
    let isAutoRotating = false;
    let autoSeqTimer = null;

    function stopAutoRotate() {
        isAutoRotating = false;
        if (autoSeqTimer) {
            clearTimeout(autoSeqTimer);
            autoSeqTimer = null;
        }
        // For meshes currently auto-tilted, animate them back quickly.
        // For others, clear auto flags so hover works as normal.
        heroLetterMeshes.forEach(m => {
            const ud = m.userData || {};
            if (ud.isAuto && !ud.autoReturning) {
                // start a quick return animation from current angle to original
                ud.autoReturning = true;
                ud.rotationStart = m.rotation.y;
                ud.rotationTarget = (ud.autoOrig !== undefined) ? ud.autoOrig : ud.rotation.y;
                ud.rotationProgress = 0;
                ud.rotationSpeed = 0.12; // quick return (restored)
                ud.isRotating = true;
                // keep isAuto true until return finishes (animate loop clears it)
            } else {
                if (!ud.isRotating) ud.hasRotated = false;
                // clear non-essential auto flags
                ud.isAuto = false;
            }
        });
    }

    function startAutoRotate() {
        if (isAutoRotating) return;
        if (!heroLetterMeshes || heroLetterMeshes.length === 0) return;
        isAutoRotating = true;

        let idx = 0;

        function step() {
            if (!isAutoRotating) return;

            // If we've completed a full pass, wait a longer pause then restart
            if (idx >= heroLetterMeshes.length) {
                idx = 0;
                autoSeqTimer = setTimeout(step, 4000); // 4s pause after full caption (restored)
                return;
            }

            const mesh = heroLetterMeshes[idx];

            // Only auto-rotate words that are also interactive (same rule as hover/click)
            const wl = (mesh.userData.wordLower || '').toLowerCase();
            const allowed = Array.from(interactiveWords).some(k => wl.includes(k));
            if (!allowed) {
                idx += 1;
                autoSeqTimer = setTimeout(step, 40);
                return;
            }

            // Skip if currently being rotated by hover
            if (!mesh.userData.isRotating) {
                // Auto-rotate: perform a full 360° spin per letter (clockwise around Y)
                const fullSpins = 1; // number of full rotations
                const direction = 1; // 1 = clockwise, -1 = counter-clockwise
                mesh.userData.isRotating = true;
                mesh.userData.isAuto = true;
                mesh.userData.autoReturning = false;
                mesh.userData.hasRotated = true;
                mesh.userData.rotationAxis = 'y';
                mesh.userData.autoOrig = mesh.rotation.y;
                mesh.userData.rotationStart = mesh.rotation.y;
                mesh.userData.rotationTarget = mesh.rotation.y + (Math.PI * 2 * fullSpins * direction);
                mesh.userData.rotationProgress = 0;
                mesh.userData.rotationSpeed = 0.06; // restored speed for auto full spin
            }

            // Determine delay to next letter; longer between words
            const next = heroLetterMeshes[idx + 1];
            let delay = 180; // ms between letters (restored)
            if (next) {
                const curWord = (mesh.userData.word || '').toString();
                const nextWord = (next.userData.word || '').toString();
                if (curWord !== nextWord) delay = 600; // longer pause between words (restored)
            } else {
                // end of line -> pause then will hit full-pass branch
                delay = 600;
            }

            idx += 1;
            autoSeqTimer = setTimeout(step, delay);
        }

        step();
    }

    function resetIdleTimer() {
        if (idleTimeoutId) clearTimeout(idleTimeoutId);
        // stop auto-rotate when user moves mouse
        stopAutoRotate();
        idleTimeoutId = setTimeout(() => {
            startAutoRotate();
        }, idleDelay);
    }

    // Start the idle timer for the first time
    resetIdleTimer();

    // Cancel or reset when user moves mouse or touches
    document.addEventListener('mousemove', resetIdleTimer, { passive: true });
    document.addEventListener('touchstart', resetIdleTimer, { passive: true });
}

// Cube rotation section removed per request

// =====================================
// EN / DE LANGUAGE TOGGLE (with flags)
// =====================================
const langToggleBtn = document.getElementById('langToggle');

// Translation dictionary
const translations = {
    EN: {
        nav: ['Projects', 'About me'],
        contact: 'Contact me',
        'mobile-notice': 'This website is optimized for desktop. For the best experience, please view on a larger screen.',
        hero1: 'Hi im Cosima',
        hero2: 'an interaction dessign student',
        projectsTitle: 'Recent work',
        'work-cta': 'View work',
        
        // About Section
        'about-title': 'About me',
        'about-text': 'I\'m currently studying interaction design at the HfG - Hochschule für Gestaltung in Schwäbisch Gmünd in my 3rd semester',
        
        // Grid items
        'iks-title': 'Interactive Communication Systems',
        'iks-subtitle': 'Exhibition Design',
        'dataviz-title': 'Data Visualization',
        'interface-title': 'Interface',
        'interface-subtitle': 'Interaction Design',
        
        // IKS Project Detail
        'iks-detail-subtitle': 'Interactive Communication Systems — Comparative Brain Anatomy',
        'iks-intro': '"Anatomy of Minds – A Comparison Journey" is an interactive prototype that examines the differences and similarities of brains across various species, focusing on anatomy, environment, intelligence, and emotions. Developed by Cosima Bühler, María Jesús Fonseca, and Yannik Stegmaier in the "Interactive Communication Systems" course (HfG, Winter Semester 2025-2026), the project primarily compares the human brain with that of the ant to illuminate definitions of intelligence beyond anthropocentric perspectives.',
        'iks-section1-title': 'Project Process',
        'iks-section1-text1': 'The project began with choosing between supersonic jets and the human head, with the latter selected due to its broad possibilities for interactive approaches. After brainstorming about emotions, brain regions, and species comparisons, the focus was placed on comparative anatomy, as extensive, reliable data was available for this; emotions were integrated as a subcategory.',
        'iks-section1-text2': 'Research included 3D-printed brain models, mind maps, and schemas on dominant emotions and intelligence in selected animals (e.g., empathy in humans/elephants, collective aggression in ants, swarm intelligence in bees, social intelligence in elephants), leading to the selection of human and ant – due to strong contrasts in size, structure, and social behavior.',
        'iks-section2-title': 'Interaction Concept',
        'iks-section2-text1': 'Interaction occurs through a game-like table surface with projection: Five sensor points detect NFC-marked, rotatable 3D figures (human/ant) via Arduino ESP32-S3 and rotary encoders. Two main points show overviews and rotatable 3D brains; three theme points (environment, intelligence, emotions) highlight relevant brain areas and compare aspects such as collective vs. individual intelligence.',
        'iks-section2-text2': 'When placing a figure, information appears (e.g., antennal lobes in ants for pheromones, prefrontal cortex in humans for social behavior); a second figure activates comparisons. The control is intuitive, non-linear, and cross-generational, with real-time projections for quick, non-overwhelming learning moments.',
        'iks-section3-title': 'Technical Implementation',
        'iks-section3-text': 'The table integrates NFC readers and rotary encoders into a tangible-based interaction. Communication between Arduino and website functions via a serial interface (Serial Monitor), which transmits position/rotation data to a JavaScript website for dynamic visualizations. Custom-made illustrations in cartoon-like style with Pacaembu font provide accessible aesthetics.',
        
        // Data Visualization Project
        'dataviz-detail-title': 'Data Visualization',
        'dataviz-section1-title': 'Project Overview',
        'dataviz-section1-text': 'The project "When Money Means Help: Tracing the Flow of Global Aid Funds (1960–2023)" analyzes international aid fund flows over more than 60 years. It was developed by Cosima Bühler, Magali Wilhelm, Shilei Xu, and Yannik Stegmaier and uses OECD datasets on development assistance.',
        'dataviz-section2-title': 'Goals and Research Questions',
        'dataviz-section2-text': 'The project examines which countries give and receive the most aid funds. It pursues the question of the relevance of international aid and its distribution patterns across over 100 countries.',
        'dataviz-section3-title': 'Data Sources and Processing',
        'dataviz-section3-text': 'The data comes from reliable OECD sources with over 9 million rows and 2 GB of CSV data. These were cleaned, standardized, and reduced to essential variables such as donor, recipient, year, and amount; top 20,000 entries for donors and recipients were filtered.',
        'dataviz-section4-title': 'Visualization and Design',
        'dataviz-section4-text': 'A circular chord diagram visualization shows flows between top donor countries (e.g., USA, Germany, Japan) and recipient countries (e.g., China, Ethiopia, Nigeria). The layout enables interaction through selection of donors (\'D\') or recipients (\'R\'), focusing on top-15/20 and transparency for overlapping arcs.',
        'dataviz-section5-title': 'Technical Challenges',
        'dataviz-section5-text': 'Development problems included overlapping nodes (solved through distance and transparency adjustments), performance (through preprocessing and focus on top-10 donors), and color balancing (turquoise blue for donors, orange for recipients). Hover and click functions highlight details.',
        'dataviz-section6-title': 'Insights and Outlook',
        'dataviz-section6-text': 'The visualization reveals dominant donors like the USA and Germany as well as recipients like Ethiopia and Bangladesh. Future extensions plan motives behind aid (humanitarian, political, economic), economic development of recipients, and expanded interactivity.',
        'dataviz-try-it': 'Try the interactive visualization',
        
        // Interface Project
        'interface-detail-subtitle': 'Interface Design — Controller Development',
        'interface-section1-title': 'Introduction',
        'interface-section1-text': 'In the subject Interface Design, we dealt extensively with user-oriented design. The task was to develop a controller suitable for a provided robot. The functions of the robot were also already specified and had to be considered in the design of the controller. The area of application and the associated target group could be defined and developed internally within the group.',
        'interface-section2-title': 'Concept',
        'interface-section2-text': 'The basic concept consisted of developing a controller that is perfectly suited for use in children\'s everyday life. For this, we wanted to use the functions of the robot to make the tidying-up process easier for children and turn an unloved task into a playful experience.',
        'interface-section3-title': 'Ideation',
        'interface-section4-title': 'User Testing',
        'interface-section4-text': 'To test our conceptualized idea, we turned to students at HfG Schwäbisch Gmünd. Among other things, we asked about previous experience with controllers, the comprehensibility of the functions, and the visibility of all components. The expertise of the students helped us immensely in further optimizing our concept.',
        'interface-section5-title': 'Technical Implementation',
        'interface-section5-list': [
            'Movement: A joycon with two rollers to visually distinguish the two differently mapped axes.',
            'Crabwalk: Two buttons in a specially crafted 3D-printed housing to prevent slipping or breaking out.',
            'Slow mode: An on/off switch to make the activity of slow mode visually visible.',
            'Gripper: A limit switch to integrate the natural movement of gripping into the controller.',
            'Height-adjustable gripper arm: Potentiometer with a specially crafted rotary wheel attachment through 3D printing for good operability with just one thumb.',
            'Ground / 3.3V hub: A hub to centrally provide power to all components and save cables.'
        ],
        'interface-section6-title': 'User Testing 2',
        'interface-section6-text': 'After we had largely succeeded in optimizing our concept based on the constructive criticism of HfG students and the findings drawn from testing, we had the opportunity to conduct another user test with representatives of our actual target group (5th graders from a secondary school). In doing so, we gained further important insights – both in terms of form and visual design.',
        'interface-section7-title': 'Final Concept',
        'interface-section7-text': 'Our final concept combines a playful form with ergonomics and functionality. The placement of the components was changed so that there is a division of functions – on the one hand, the control of the robot itself, on the other hand for interaction with the gripper arm. This spatial division is also reflected in the visual design.',
        'interface-caption1': 'Robot Control',
        'interface-caption2': 'Movement of the Gripper Arm',
        
        // Contact Section
        'contact-title': 'Contact',
        'contact-copy': 'Write me an email — I usually reply quickly.',
        'copy-email-btn': 'Copy email',
        'copied': 'Copied!',
        
        // Video fallback
        'video-unsupported': 'Your browser does not support videos.'
    },
    DE: {
        nav: ['Projekte', 'Über mich'],
        contact: 'Kontaktiere mich',
        'mobile-notice': 'Diese Website ist für Desktop optimiert. Für die beste Erfahrung bitte auf einem größeren Bildschirm ansehen.',
        hero1: 'Hi ich bin Cosima',
        hero2: 'eine Interaktionsgestaltungs Studentin',
        projectsTitle: 'Recent projects',
        'work-cta': 'Zum Projekt',
        
        // About Section
        'about-title': 'Über mich',
        'about-text': 'Ich studiere gerade Interaktionsgestaltung an der HfG - Hochschule für Gestaltung in Schwäbisch Gmünd im 3. Semester',
        
        // Grid items
        'iks-title': 'Interaktive Kommunikationssysteme',
        'iks-subtitle': 'Ausstellungsgestaltung',
        'dataviz-title': 'Datenvisualisierung',
        'interface-title': 'Interface',
        'interface-subtitle': 'Interaktionsdesign',
        
        // IKS Project Detail
        'iks-detail-subtitle': 'Interactive Communication Systems — Vergleichende Gehirnanatomie',
        'iks-intro': '„Anatomy of Minds – A Comparison Journey" ist ein interaktiver Prototyp, der die Unterschiede und Gemeinsamkeiten von Gehirnen verschiedener Arten untersucht, mit Fokus auf Anatomie, Umwelt, Intelligenz und Emotionen. Entwickelt von Cosima Bühler, María Jesús Fonseca und Yannik Stegmaier im Kurs „Interactive Communication Systems" (HfG, Wintersemester 2025-2026), vergleicht das Projekt vor allem das menschliche Gehirn mit dem der Ameise, um Intelligenzdefinitionen jenseits anthropozentrischer Sichtweisen zu beleuchten.',
        'iks-section1-title': 'Projektprozess',
        'iks-section1-text1': 'Das Projekt begann mit der Themenwahl zwischen Überschalljets und dem menschlichen Kopf, wobei letzterer aufgrund seiner breiten Möglichkeiten für interaktive Ansätze gewählt wurde. Nach Brainstorming zu Emotionen, Gehirnregionen und Artenvergleichen wurde der Fokus auf vergleichende Anatomie gelegt, da hierzu umfangreiche, zuverlässige Daten vorlagen; Emotionen wurden als Unterkategorie integriert.',
        'iks-section1-text2': 'Recherche umfasste 3D-gedruckte Gehirnmodelle, Mindmaps und Schemata zu dominanten Emotionen und Intelligenz bei ausgewählten Tieren (z. B. Empathie beim Menschen/Elefanten, kollektive Aggression bei Ameisen, Schwarmintelligenz bei Bienen, Sozialintelligenz bei Elefanten), was zur Auswahl von Mensch und Ameise führte – aufgrund starker Kontraste in Größe, Struktur und Sozialverhalten.',
        'iks-section2-title': 'Interaktionskonzept',
        'iks-section2-text1': 'Die Interaktion erfolgt über eine spieleähnliche Tischoberfläche mit Projektion: Fünf Sensorpunkte erkennen NFC-markierte, drehbare 3D-Figuren (Mensch/Ameise) via Arduino ESP32-S3 und Rotary-Encodern. Zwei Hauptpunkte zeigen Überblicke und rotierbare 3D-Gehirne; drei Themenpunkte (Umwelt, Intelligenz, Emotionen) heben relevante Hirnareale hervor und vergleichen Aspekte wie kollektive vs. individuelle Intelligenz.',
        'iks-section2-text2': 'Beim Platzieren einer Figur erscheinen Infos (z. B. Antennenlappen bei Ameisen für Pheromone, präfrontaler Cortex beim Menschen für Sozialverhalten); eine zweite Figur aktiviert Vergleiche. Die Steuerung ist intuitiv, nicht-linear und altersübergreifend, mit Echtzeit-Projektionen für schnelle, überforderungsfreie Lernmomente.',
        'iks-section3-title': 'Technische Umsetzung',
        'iks-section3-text': 'Der Tisch integriert NFC-Reader und Rotary-Encoder zu einer Tangible-basierten Interaktion. Die Kommunikation zwischen Arduino und Webseite funktioniert über eine serielle Schnittstelle (Serial Monitor), welche Positions-/Drehdaten an eine JavaScript-Website für dynamische Visualisierungen überträgt. Individuell angefertigte Illustrationen in cartoonartigem Stil mit Pacaembu-Font sorgen für zugängliche Ästhetik.',
        
        // Data Visualization Project
        'dataviz-detail-title': 'Datenvisualisierung',
        'dataviz-section1-title': 'Projektübersicht',
        'dataviz-section1-text': 'Das Projekt „When Money Means Help: Tracing the Flow of Global Aid Funds (1960–2023)" analysiert internationale Hilfsgelderströme über mehr als 60 Jahre. Es wurde von Cosima Bühler, Magali Wilhelm, Shilei Xu und Yannik Stegmaier entwickelt und nutzt OECD-Datensätze zu Entwicklungsbeihilfe.',
        'dataviz-section2-title': 'Ziele und Forschungsfragen',
        'dataviz-section2-text': 'Das Projekt untersucht, welche Länder die meisten Hilfsgelder geben und empfangen. Es verfolgt die Frage nach der Relevanz internationaler Hilfe und deren Verteilungsmustern über über 100 Länder hinweg.',
        'dataviz-section3-title': 'Datenquellen und Verarbeitung',
        'dataviz-section3-text': 'Die Daten stammen aus zuverlässigen OECD-Quellen mit über 9 Millionen Zeilen und 2 GB CSV-Daten. Diese wurden bereinigt, standardisiert und auf wesentliche Variablen wie Spender, Empfänger, Jahr und Betrag reduziert; Top-20.000 Einträge für Spender und Empfänger wurden gefiltert.',
        'dataviz-section4-title': 'Visualisierung und Design',
        'dataviz-section4-text': 'Eine kreisförmige Chord-Diagramm-Visualisierung zeigt Flüsse zwischen Top-Donor-Ländern (z. B. USA, Deutschland, Japan) und Empfängerländern (z. B. China, Äthiopien, Nigeria). Das Layout ermöglicht Interaktion durch Auswahl von Donors (\'D\') oder Recipients (\'R\'), mit Fokus auf Top-15/20 und Transparenz für überlappende Bogen.',
        'dataviz-section5-title': 'Technische Herausforderungen',
        'dataviz-section5-text': 'Entwicklungsprobleme umfassten überlappende Knoten (gelöst durch Abstands- und Transparenzanpassungen), Performance (durch Vorverarbeitung und Fokus auf Top-10-Donors) sowie Farbbalancierung (Türkisblau für Spender, Orange für Empfänger). Hover- und Klick-Funktionen heben Details hervor.',
        'dataviz-section6-title': 'Erkenntnisse und Ausblick',
        'dataviz-section6-text': 'Die Visualisierung offenbart dominante Spender wie USA und Deutschland sowie Empfänger wie Äthiopien und Bangladesch. Zukünftige Erweiterungen planen Motive hinter Hilfe (humanitär, politisch, wirtschaftlich), wirtschaftliche Entwicklung von Empfängern und erweiterte Interaktivität.',
        'dataviz-try-it': 'Interaktive Visualisierung ausprobieren',
        
        // Interface Project
        'interface-detail-subtitle': 'Interface Design — Controllerentwicklung',
        'interface-section1-title': 'Einleitung',
        'interface-section1-text': 'Im Fach Interface Design beschäftigten wir uns viel mit nutzerorientierter Gestaltung. Aufgabe war es passend zu einem bereitgestellten Roboter einen Controller zu entwickeln. Die Funktionen des Roboters waren ebenfalls schon vorgegeben und galten bei der Gestaltung des Controllers zu beachten. Der Einsatzbereich und die daran gebundene Zielgruppe durften gruppenintern festgelegt und ausgearbeitet werden.',
        'interface-section2-title': 'Konzept',
        'interface-section2-text': 'Das grundliegende Konzept bestand aus der Entwicklung eines Controllers der sich perfekt für den Einsatz im Kinderalltag eignet. Dafür wollten wir die Funktionen des Roboters nutzen, um Kindern den Aufräumprozess zu erleichtern und aus einer nichtgemochten Aufgabe ein spielerisches Erlebnis zu gestalten.',
        'interface-section3-title': 'Ideenfindung',
        'interface-section4-title': 'Usertesting',
        'interface-section4-text': 'Um die von uns konzeptionierte Idee zu testen, wandten wir uns an Studierende der HfG Schwäbisch Gmünd. Dabei fragten wir unter Anderem nach Vorerfahrungen mit Controllern, der Verständlichkeit der Funktionen, sowie der Ersichtlichkeit aller Bauteile. Das Fachwissen der Studierenden half uns bei der weiteren Optimierung unseres Konzepts ungemein.',
        'interface-section5-title': 'Technische Umsetzung',
        'interface-section5-list': [
            'Fortbewegung: Ein Joycon mit zwei Walzen um die zwei verschieden gemappten Achsen visuell unterschieden zu können.',
            'Crabwalk: Zwei Buttons in einem speziell angefertigtem 3D-gedruckten Gehäuse um Verrutschen oder Herausbrechen vorzubeugen.',
            'Slowmodus: Ein On/Off-Switch um die Aktivität des Slowmodus visuell ersichtlich zu machen.',
            'Greifer: Ein Limit-Switch um die natürliche Bewegung des Greifens in den Controller zu integrieren.',
            'Höhenverstellbarer Greifarm: Potentiometer mit einem durch 3D-Druck speziell angefertigtem Drehrad-Aufsatz für gute Bedienbarkeit mit nur einem Daumen.',
            'Ground- / 3,3V-Hub: Ein Hub um die Stromversorgung zentral für alle Bauteile bereitzustellen und Kabel zu sparen.'
        ],
        'interface-section6-title': 'Usertesting 2',
        'interface-section6-text': 'Nachdem uns die Optimierung unseres Konzepts, basierend auf der konstruktiven Kritik der HfG Studierenden und den aus dem Testing gezogenen Erkenntnissen, weitgehend gelungen war, hatten wir die Möglichkeit mit Repräsentanten unserer tatsächlichen Zielgruppe (5. Klässler einer Realschule) einen weiteren Usertest durchführen zu können. Dabei erhielten wir weitere wichtige Erkenntnisse – sowohl was die Form als auch die visuelle Gestaltung anging.',
        'interface-section7-title': 'Finales Konzept',
        'interface-section7-text': 'Unser finales Konzept vereint eine spielerische Form mit Ergonomie und Funktionalität. Die Platzierung der Bauteile wurde so verändert, dass eine Zweiteilung der Funktionen – zum Einen die Steuerung des Roboters selbst, zum Anderen für die Interaktion mit dem Greifarm – erfolgt. Diese räumliche Aufteilung spiegelt sich auch in der visuellen Gestaltung wieder.',
        'interface-caption1': 'Steuerung des Roboters',
        'interface-caption2': 'Bewegung des Greifarms',
        
        // Contact Section
        'contact-title': 'Kontakt',
        'contact-copy': 'Schreib mir eine E-Mail — ich antworte normalerweise schnell.',
        'copy-email-btn': 'E-Mail kopieren',
        'copied': 'Kopiert!',
        
        // Video fallback
        'video-unsupported': 'Dein Browser unterstützt keine Videos.'
    }
};

let currentLang = 'EN';

function setLangButtonUI(lang) {
    if (!langToggleBtn) return;
    if (lang === 'EN') {
        langToggleBtn.innerHTML = '🇬🇧 EN';
    } else {
        langToggleBtn.innerHTML = '🇩🇪 DE';
    }
}

function applyLanguage(lang) {
    currentLang = lang;
    setLangButtonUI(lang);

    // Update nav center links (assumes two center links)
    const centerLinks = document.querySelectorAll('.nav-center .nav-link');
    if (centerLinks && centerLinks.length >= 2) {
        centerLinks[0].textContent = translations[lang].nav[0];
        centerLinks[1].textContent = translations[lang].nav[1];
    }

    // Update contact pill
    const contactBtn = document.querySelector('.nav-contact-btn');
    if (contactBtn) contactBtn.textContent = translations[lang].contact;

    // Update projects section title(s)
    const gridTitle = document.querySelector('.grid-section .section-title');
    if (gridTitle) gridTitle.textContent = translations[lang].projectsTitle;

    // Update all elements with data-translate-key attribute
    const translatableElements = document.querySelectorAll('[data-translate-key]');
    translatableElements.forEach(el => {
        const key = el.getAttribute('data-translate-key');
        if (translations[lang][key]) {
            // Check if it's an array (for lists)
            if (Array.isArray(translations[lang][key])) {
                // Handle list items
                const listItems = el.querySelectorAll('li');
                translations[lang][key].forEach((text, index) => {
                    if (listItems[index]) {
                        listItems[index].textContent = text;
                    }
                });
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });

    // Update contact section
    const contactTitle = document.querySelector('.contact-title');
    if (contactTitle) contactTitle.textContent = translations[lang]['contact-title'];
    
    const contactCopy = document.querySelector('.contact-copy');
    if (contactCopy) contactCopy.textContent = translations[lang]['contact-copy'];
    
    const copyBtn = document.getElementById('copyEmailBtn');
    if (copyBtn && !copyBtn.classList.contains('copied')) {
        copyBtn.textContent = translations[lang]['copy-email-btn'];
    }

    // Update video unsupported messages
    const videos = document.querySelectorAll('video source');
    videos.forEach(source => {
        const videoEl = source.parentElement;
        // This updates the fallback text in video tags
        const textNode = Array.from(videoEl.childNodes).find(node => node.nodeType === 3);
        if (textNode) {
            textNode.textContent = translations[lang]['video-unsupported'];
        }
    });

    // Rebuild Three.js hero text if possible
    if (typeof rebuildHeroText === 'function') {
        rebuildHeroText(lang);
    }
}

if (langToggleBtn) {
    setLangButtonUI(currentLang);
    langToggleBtn.addEventListener('click', () => {
        const next = currentLang === 'EN' ? 'DE' : 'EN';
        applyLanguage(next);
    });
}

// Apply initial language to update UI text
applyLanguage(currentLang);

// =====================================
// CONTACT SECTION (bottom) + COPY EMAIL
// =====================================
const contactBtn = document.querySelector('.nav-contact-btn');
const copyEmailBtn = document.getElementById('copyEmailBtn');
const contactEmailEl = document.getElementById('contactEmail');

if (contactBtn) {
    contactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById('contact');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // focus the copy button shortly after scroll
            setTimeout(() => {
                const btn = document.getElementById('copyEmailBtn');
                if (btn) btn.focus();
            }, 600);
        }
    });
}

if (copyEmailBtn && contactEmailEl) {
    copyEmailBtn.addEventListener('click', async () => {
        const email = contactEmailEl.textContent.trim();
        try {
            await navigator.clipboard.writeText(email);
            copyEmailBtn.classList.add('copied');
            copyEmailBtn.textContent = translations[currentLang]['copied'];
            setTimeout(() => {
                copyEmailBtn.classList.remove('copied');
                copyEmailBtn.textContent = translations[currentLang]['copy-email-btn'];
            }, 2000);
        } catch (err) {
            // fallback for older browsers
            const ta = document.createElement('textarea');
            ta.value = email;
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); }
            catch (e) {}
            document.body.removeChild(ta);
            copyEmailBtn.classList.add('copied');
            copyEmailBtn.textContent = translations[currentLang]['copied'];
            setTimeout(() => {
                copyEmailBtn.classList.remove('copied');
                copyEmailBtn.textContent = translations[currentLang]['copy-email-btn'];
            }, 2000);
        }
    });
}

// =====================================
// CONSOLE MESSAGE
// =====================================
console.log('%c🎨 Vibe Coding Website ', 'background: #FF3366; color: white; font-size: 20px; padding: 10px;');
console.log('%cExperimental Playground loaded! Viel Spaß beim Rumspielen 🚀', 'font-size: 14px; color: #FF6B35;');

// =====================================
// MOBILE DEVICE DETECTION & OPTIMIZATIONS
// =====================================
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const isSmallScreen = window.innerWidth < 768;

// Disable custom cursor on mobile/touch devices
if (isMobile || isTouchDevice || isSmallScreen) {
    document.body.style.cursor = 'auto';
    if (cursor) cursor.style.display = 'none';
    if (cursorFollower) cursorFollower.style.display = 'none';
    
    // Add mobile class to body for CSS targeting
    document.body.classList.add('mobile-device');
}

// Optimize Three.js rendering on mobile
if (isSmallScreen && typeof heroRenderer !== 'undefined') {
    // Lower pixel ratio for better performance
    heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
}

// Handle orientation changes
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
});

// Performance optimization: Reduce animations on low-end devices
if (isMobile || isSmallScreen) {
    // Disable auto-rotate on mobile to save battery
    if (typeof stopAutoRotate === 'function') {
        stopAutoRotate();
    }
}

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const PANELS = [
    {
        id: 'home',
        label: 'HOME',
        title: 'MD NAVEDUL ISLAM',
        subtitle: 'DISCOVER MY WORLD',
        description: 'Web Developer, Designer & Programmer — I turn ideas into functional, elegant digital experiences.',
        accent: '#5fd4ff'
    },
    {
        id: 'about',
        label: 'ABOUT',
        title: 'CREATIVE DEVELOPER',
        subtitle: 'FULL-STACK & AI',
        description: 'From sleek front-end designs to robust backend systems — blending creativity with code and smart automation.',
        accent: '#b44dff'
    },
    {
        id: 'projects',
        label: 'PROJECTS',
        title: 'MY PROJECTS',
        subtitle: 'RECENT WORK',
        description: 'E-commerce stores, AI agents, web apps, and more — explore the projects I have built and shipped.',
        accent: '#5fd4ff'
    },
    {
        id: 'resume',
        label: 'RESUME',
        title: 'EXPERIENCE',
        subtitle: 'MY JOURNEY',
        description: 'Computing Science student at TRU with real-world experience in retail, IT support, and software development.',
        accent: '#ff6ae3'
    },
    {
        id: 'services',
        label: 'SERVICES',
        title: 'WHAT I OFFER',
        subtitle: 'WEB · UI · AI',
        description: 'Web development, UI/UX design, responsive layouts, SEO, performance tuning, and ongoing maintenance.',
        accent: '#5fd4ff'
    }
];

let activeIndex = 0;
let targetRotation = 0;
let currentRotation = 0;
let isDragging = false;
let dragStartX = 0;
let dragRotation = 0;

const container = document.getElementById('three-canvas');
if (!container) {
    console.warn('Three.js container not found');
} else {
    initScene();
}

function initScene() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030510, 0.055);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.2, 7.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.42,
        0.35,
        0.72
    );
    composer.addPass(bloom);

    scene.add(new THREE.AmbientLight(0x1a2a4a, 0.6));
    const keyLight = new THREE.PointLight(0x4fc3ff, 2.5, 20);
    keyLight.position.set(-3, 2, 4);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0xff4fd8, 2, 18);
    rimLight.position.set(4, -1, 3);
    scene.add(rimLight);
    const fillLight = new THREE.PointLight(0x8866ff, 1.2, 15);
    fillLight.position.set(0, -3, 2);
    scene.add(fillLight);

    createParticles(scene);
    createCrystalSpine(scene);
    const panelGroup = createPanelCarousel(scene);

    bindUI();
    updatePanelUI(activeIndex);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
        bloom.resolution.set(window.innerWidth, window.innerHeight);
    });

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStartX = e.clientX;
        dragRotation = currentRotation;
    });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const delta = (e.clientX - dragStartX) * 0.005;
        panelGroup.rotation.y = dragRotation + delta;
    });

    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        dragStartX = e.touches[0].clientX;
        dragRotation = currentRotation;
    }, { passive: true });
    window.addEventListener('touchend', () => { isDragging = false; });
    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const delta = (e.touches[0].clientX - dragStartX) * 0.005;
        panelGroup.rotation.y = dragRotation + delta;
    }, { passive: true });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goToPanel(activeIndex - 1);
        if (e.key === 'ArrowRight') goToPanel(activeIndex + 1);
    });

    window.goToPanel = goToPanel;
    window.getActivePanel = () => PANELS[activeIndex];

    function goToPanel(index) {
        const len = PANELS.length;
        activeIndex = ((index % len) + len) % len;
        targetRotation = -activeIndex * (Math.PI * 2 / len);
        updatePanelUI(activeIndex);
        document.dispatchEvent(new CustomEvent('panelChange', { detail: PANELS[activeIndex] }));
    }

    function bindUI() {
        document.querySelectorAll('[data-panel-index]').forEach((el) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                goToPanel(parseInt(el.dataset.panelIndex, 10));
            });
        });

        document.querySelectorAll('[data-panel-id]').forEach((el) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                const id = el.dataset.panelId;
                const idx = PANELS.findIndex((p) => p.id === id);
                if (idx >= 0) goToPanel(idx);
            });
        });

        const prevBtn = document.getElementById('panelPrev');
        const nextBtn = document.getElementById('panelNext');
        if (prevBtn) prevBtn.addEventListener('click', () => goToPanel(activeIndex - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goToPanel(activeIndex + 1));
    }

    const clock = new THREE.Clock();
    const mouse = new THREE.Vector2();

    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        if (!isDragging) {
            currentRotation += (targetRotation - currentRotation) * 0.06;
            panelGroup.rotation.y = currentRotation;
        } else {
            currentRotation = panelGroup.rotation.y;
        }

        camera.position.x += (mouse.x * 0.35 - camera.position.x) * 0.03;
        camera.position.y += (mouse.y * 0.15 + 0.2 - camera.position.y) * 0.03;
        camera.lookAt(0, 0, 0);

        panelGroup.children.forEach((panel, i) => {
            if (panel.userData.glow) {
                panel.userData.glow.material.opacity = 0.14 + Math.sin(t * 1.5 + i) * 0.05;
            }
            if (panel.userData.mist) {
                panel.userData.mist.rotation.z = t * 0.08;
            }
        });

        scene.children.forEach((obj) => {
            if (obj.userData?.spin) {
                obj.rotation.y = t * 0.15;
            }
        });

        composer.render();
    }

    animate();
}

function createParticles(scene) {
    const count = 2800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorA = new THREE.Color(0x4fc3ff);
    const colorB = new THREE.Color(0xff4fd8);

    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 25 - 8;

        const mix = Math.random();
        const c = colorA.clone().lerp(colorB, mix);
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
        size: 0.028,
        vertexColors: true,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const points = new THREE.Points(geo, mat);
    points.userData.spin = true;
    scene.add(points);
}

function createCrystalSpine(scene) {
    const group = new THREE.Group();
    group.position.set(0, -0.5, -1.2);

    for (let i = 0; i < 12; i++) {
        const radius = 0.55 - i * 0.025;
        const geo = new THREE.TorusGeometry(radius, 0.012, 8, 64);
        const mat = new THREE.MeshPhysicalMaterial({
            color: 0xaaddff,
            transparent: true,
            opacity: 0.25 + (i % 3) * 0.08,
            roughness: 0.1,
            metalness: 0.6,
            transmission: 0.6,
            thickness: 0.5
        });
        const ring = new THREE.Mesh(geo, mat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = i * 0.12 - 0.6;
        group.add(ring);
    }

    const spineGeo = new THREE.CylinderGeometry(0.04, 0.06, 1.4, 8);
    const spineMat = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.4,
        transmission: 0.8,
        roughness: 0.05
    });
    const spine = new THREE.Mesh(spineGeo, spineMat);
    spine.position.y = 0;
    group.add(spine);

    scene.add(group);
}

function createPanelCarousel(scene) {
    const group = new THREE.Group();
    const radius = 3.6;
    const angleStep = (Math.PI * 2) / PANELS.length;

    PANELS.forEach((panel, i) => {
        const panelGroup = new THREE.Group();
        const angle = i * angleStep;
        panelGroup.position.set(Math.sin(angle) * radius, 0, Math.cos(angle) * radius);
        panelGroup.lookAt(0, 0, 0);

        const w = 2.8;
        const h = 3.6;
        const depth = 0.06;
        const corner = 0.18;

        const frameGeo = createRoundedBoxGeometry(w + 0.08, h + 0.08, depth, corner);
        const frameMat = new THREE.MeshPhysicalMaterial({
            color: 0x0a1428,
            transparent: true,
            opacity: 0.72,
            roughness: 0.15,
            metalness: 0.35,
            transmission: 0.25,
            thickness: 0.8,
            emissive: new THREE.Color(panel.accent),
            emissiveIntensity: 0.08
        });
        const frame = new THREE.Mesh(frameGeo, frameMat);
        panelGroup.add(frame);

        const glowGeo = createRoundedBoxGeometry(w + 0.2, h + 0.2, depth * 0.5, corner + 0.05);
        const glowMat = new THREE.MeshBasicMaterial({
            color: panel.accent,
            transparent: true,
            opacity: 0.18,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        glow.position.z = -0.05;
        panelGroup.add(glow);
        panelGroup.userData.glow = glow;

        const innerGeo = createRoundedBoxGeometry(w - 0.1, h - 0.1, depth * 0.5, corner * 0.8);
        const innerMat = new THREE.MeshBasicMaterial({
            color: 0x020610,
            transparent: true,
            opacity: 0.92
        });
        const inner = new THREE.Mesh(innerGeo, innerMat);
        inner.position.z = 0.02;
        panelGroup.add(inner);

        if (i === 0) {
            const mist = createMistPlane();
            mist.position.z = 0.05;
            panelGroup.add(mist);
            panelGroup.userData.mist = mist;
        }

        panelGroup.userData.panelId = panel.id;
        panelGroup.userData.panelIndex = i;
        group.add(panelGroup);
    });

    scene.add(group);
    return group;
}

function createMistPlane() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 240);
    grad.addColorStop(0, 'rgba(79, 195, 255, 0.35)');
    grad.addColorStop(0.5, 'rgba(100, 80, 255, 0.15)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    const tex = new THREE.CanvasTexture(canvas);
    const geo = new THREE.PlaneGeometry(2.4, 3.2);
    const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    return new THREE.Mesh(geo, mat);
}

function createRoundedBoxGeometry(width, height, depth, radius) {
    const shape = new THREE.Shape();
    const w = width / 2;
    const h = height / 2;
    const r = Math.min(radius, w, h);

    shape.moveTo(-w + r, -h);
    shape.lineTo(w - r, -h);
    shape.quadraticCurveTo(w, -h, w, -h + r);
    shape.lineTo(w, h - r);
    shape.quadraticCurveTo(w, h, w - r, h);
    shape.lineTo(-w + r, h);
    shape.quadraticCurveTo(-w, h, -w, h - r);
    shape.lineTo(-w, -h + r);
    shape.quadraticCurveTo(-w, -h, -w + r, -h);

    const geo = new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 2
    });
    geo.center();
    return geo;
}

function updatePanelUI(index) {
    const panel = PANELS[index];
    const card = document.querySelector('.panel-glass-card');
    const titleEl = document.getElementById('panelTitle');
    const subtitleEl = document.getElementById('panelSubtitle');
    const descEl = document.getElementById('panelDescription');
    const brandEl = document.getElementById('panelBrand');
    const counterEl = document.getElementById('panelCounter');

    const applyContent = () => {
        if (titleEl) titleEl.textContent = panel.title;
        if (subtitleEl) {
            subtitleEl.textContent = panel.subtitle;
            subtitleEl.style.color = panel.accent;
        }
        if (descEl) descEl.textContent = panel.description;
        if (brandEl) brandEl.textContent = panel.label;
        if (counterEl) counterEl.textContent = `${String(index + 1).padStart(2, '0')} / ${String(PANELS.length).padStart(2, '0')}`;
        if (card) {
            card.style.borderColor = `${panel.accent}55`;
            card.style.boxShadow = `0 24px 80px rgba(0,0,0,0.55), 0 0 60px ${panel.accent}18`;
        }
    };

    if (card) {
        card.classList.add('is-changing');
        setTimeout(() => {
            applyContent();
            card.classList.remove('is-changing');
        }, 150);
    } else {
        applyContent();
    }

    document.querySelectorAll('.scene-menu-link').forEach((link, i) => {
        link.classList.toggle('active', i === index);
    });

    const exploreBtn = document.getElementById('exploreBtn');
    if (exploreBtn) exploreBtn.setAttribute('href', `#${panel.id}`);
}

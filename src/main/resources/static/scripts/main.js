const storageKey = 'portfolio-theme';

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const projectsGrid = document.getElementById('projectsGrid');
const yearTarget = document.getElementById('currentYear');
const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contactStatus');
const heroCanvas = document.getElementById('heroCanvas');
const heroSection = document.querySelector('.hero');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const heroBackground = {
    renderer: null,
    scene: null,
    camera: null,
    meshes: [],
    animationId: null,
    resizeHandler: null,
    clock: null
};

const heroPalettes = {
    light: [0x60a5fa, 0x38bdf8, 0x818cf8, 0xf472b6],
    dark: [0x38bdf8, 0x7dd3fc, 0xc084fc, 0xf0abfc]
};

const apiBase = resolveApiBase();

function resolveApiBase() {
    const attributeBase = root.dataset.apiBase?.trim();
    if (attributeBase) {
        return attributeBase.replace(/\/$/, '');
    }

    const override = typeof window !== 'undefined' && typeof window.PORTFOLIO_API_BASE === 'string'
        ? window.PORTFOLIO_API_BASE.trim()
        : '';
    if (override) {
        return override.replace(/\/$/, '');
    }

    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        if (location.port && location.port !== '8080') {
            return `${location.protocol}//${location.hostname}:8080`;
        }
    }

    return '';
}

function buildApiUrl(path) {
    if (!apiBase) {
        return path;
    }
    return `${apiBase}${path}`;
}

function getHeroPalette() {
    const currentTheme = root.getAttribute('data-theme') || getStoredTheme();
    return heroPalettes[currentTheme === 'dark' ? 'dark' : 'light'];
}

function updateHeroPalette() {
    if (!heroBackground.meshes.length) {
        return;
    }
    const palette = getHeroPalette();
    heroBackground.meshes.forEach((mesh, index) => {
        if (mesh.material && mesh.material.color) {
            mesh.material.color.setHex(palette[index % palette.length]);
        }
    });
}

function teardownHeroBackground() {
    if (!heroBackground.renderer) {
        if (heroCanvas) {
            heroCanvas.classList.add('hero__canvas--hidden');
        }
        if (heroSection) {
            heroSection.classList.remove('hero--three-active');
        }
        return;
    }

    cancelAnimationFrame(heroBackground.animationId);
    heroBackground.meshes.forEach(mesh => {
        if (heroBackground.scene) {
            heroBackground.scene.remove(mesh);
        }
        if (mesh.geometry) {
            mesh.geometry.dispose();
        }
        if (mesh.material) {
            mesh.material.dispose();
        }
    });
    heroBackground.meshes = [];

    heroBackground.renderer.dispose();
    if (heroBackground.resizeHandler) {
        window.removeEventListener('resize', heroBackground.resizeHandler);
    }

    heroBackground.renderer = null;
    heroBackground.scene = null;
    heroBackground.camera = null;
    heroBackground.resizeHandler = null;
    heroBackground.clock = null;
    heroBackground.animationId = null;

    if (heroCanvas) {
        heroCanvas.classList.add('hero__canvas--hidden');
        heroCanvas.removeAttribute('data-initialized');
    }
    if (heroSection) {
        heroSection.classList.remove('hero--three-active');
    }
}

function initHeroBackground(force = false) {
    if (!heroCanvas || !heroSection) {
        return;
    }
    if (typeof window.THREE === 'undefined') {
        return;
    }
    if (prefersReducedMotion.matches) {
        teardownHeroBackground();
        return;
    }
    if (heroBackground.renderer && !force) {
        updateHeroPalette();
        return;
    }
    if (force && heroBackground.renderer) {
        teardownHeroBackground();
    }

    const {
        Scene,
        PerspectiveCamera,
        WebGLRenderer,
        AmbientLight,
        DirectionalLight,
        IcosahedronGeometry,
        MeshPhongMaterial,
        Mesh,
        Clock
    } = window.THREE;

    const computeSize = () => {
        const width = heroSection.clientWidth || window.innerWidth;
        const height = heroSection.clientHeight || window.innerHeight;
        return { width, height: Math.max(height, 1) };
    };

    const { width, height } = computeSize();

    heroBackground.scene = new Scene();
    heroBackground.scene.background = null;

    heroBackground.camera = new PerspectiveCamera(45, width / height, 0.1, 100);
    heroBackground.camera.position.set(0, 0, 6);

    heroBackground.renderer = new WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: true });
    heroBackground.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const resizeHandler = () => {
        const size = computeSize();
        heroBackground.camera.aspect = size.width / size.height;
        heroBackground.camera.updateProjectionMatrix();
        heroBackground.renderer.setSize(size.width, size.height, false);
    };
    heroBackground.resizeHandler = resizeHandler;
    resizeHandler();
    window.addEventListener('resize', resizeHandler);

    heroBackground.scene.add(new AmbientLight(0xffffff, 0.6));
    const directional = new DirectionalLight(0xffffff, 0.85);
    directional.position.set(4, 6, 6);
    heroBackground.scene.add(directional);

    const palette = getHeroPalette();
    heroBackground.meshes = [];
    for (let i = 0; i < 10; i += 1) {
        const geometry = new IcosahedronGeometry(0.55 + Math.random() * 0.35, 2);
        const material = new MeshPhongMaterial({
            color: palette[i % palette.length],
            transparent: true,
            opacity: 0.82,
            shininess: 60
        });
        const mesh = new Mesh(geometry, material);
        mesh.position.set((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4, -1.2 - Math.random() * 1.2);
        mesh.userData = {
            speed: 0.35 + Math.random() * 0.45,
            offset: Math.random() * Math.PI * 2,
            radius: 0.7 + Math.random() * 0.6
        };
        heroBackground.scene.add(mesh);
        heroBackground.meshes.push(mesh);
    }

    heroBackground.clock = new Clock();

    heroCanvas.classList.remove('hero__canvas--hidden');
    heroCanvas.dataset.initialized = 'true';
    heroSection.classList.add('hero--three-active');

    const animate = () => {
        if (!heroBackground.renderer) {
            return;
        }

        const elapsed = heroBackground.clock.getElapsedTime();
        heroBackground.meshes.forEach(mesh => {
            const { speed, offset, radius } = mesh.userData;
            mesh.rotation.x += 0.004 * speed;
            mesh.rotation.y += 0.003 * speed;
            mesh.position.y = Math.sin(elapsed * speed + offset) * radius;
            mesh.position.x = Math.cos(elapsed * speed * 0.6 + offset) * radius * 0.9;
        });

        heroBackground.renderer.render(heroBackground.scene, heroBackground.camera);
        heroBackground.animationId = requestAnimationFrame(animate);
    };

    animate();
}

function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(storageKey, theme);
}

function getStoredTheme() {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
        return saved;
    }
    return prefersDark.matches ? 'dark' : 'light';
}

function toggleTheme() {
    const current = root.getAttribute('data-theme') || getStoredTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    updateHeroPalette();
}

async function fetchProjects() {
    const response = await fetch(buildApiUrl('/api/projects'), {
        headers: {
            'Accept': 'application/json'
        },
        cache: 'no-cache'
    });
    if (!response.ok) {
        throw new Error('Project API request failed');
    }
    return response.json();
}

function renderProjects(projects) {
    if (!projectsGrid) {
        return;
    }

    projectsGrid.innerHTML = '';
    projects.forEach(project => {
        const card = document.createElement('article');
        card.className = 'project-card';

        const stars = project.stars ?? project.stargazers_count ?? 0;
        const url = project.htmlUrl ?? project.html_url ?? '#';

        card.innerHTML = `
            <div class="project-card__header">
                <h3 class="project-card__name">${project.name}</h3>
                <div class="project-card__meta">
                    ${project.language ? `<span>${project.language}</span>` : ''}
                    <span>★ ${stars}</span>
                </div>
            </div>
            <p class="project-card__description">${project.description ?? 'Open-source project from Mohamed El Messaadi.'}</p>
            <a class="project-card__link" href="${url}" target="_blank" rel="noopener" aria-label="View ${project.name} on GitHub">
                View on GitHub
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
            </a>
        `;

        projectsGrid.appendChild(card);
    });
}

function useFallbackProjects() {
    if (!projectsGrid) {
        return;
    }

    try {
        const fallback = JSON.parse(projectsGrid.dataset.fallback || '[]');
        if (fallback.length) {
            renderProjects(fallback);
        }
    } catch (error) {
        console.error('Failed to parse fallback project data', error);
    }
}

function observeSections() {
    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.section, .project-card').forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.section, .project-card').forEach(section => {
        observer.observe(section);
    });
}

function setContactStatus(message, tone = 'info') {
    if (!contactStatus) {
        return;
    }

    contactStatus.classList.remove('contact__status--error', 'contact__status--success', 'contact__status--hidden');

    if (!message) {
        contactStatus.textContent = '';
        contactStatus.classList.add('contact__status--hidden');
        return;
    }

    contactStatus.textContent = message;
    if (tone === 'error') {
        contactStatus.classList.add('contact__status--error');
    } else if (tone === 'success') {
        contactStatus.classList.add('contact__status--success');
    }
}

async function handleContactSubmit(event) {
    event.preventDefault();

    if (!contactForm) {
        return;
    }

    if (!contactForm.reportValidity()) {
        return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formData = new FormData(contactForm);
    const payload = {
        name: (formData.get('name') || '').toString().trim(),
        email: (formData.get('email') || '').toString().trim(),
        message: (formData.get('message') || '').toString().trim()
    };

    if (!payload.name || !payload.email || !payload.message) {
        setContactStatus('Please complete all required fields.', 'error');
        return;
    }

    setContactStatus('Sending your message…');
    if (submitButton) {
        submitButton.disabled = true;
    }

    try {
        const response = await fetch(buildApiUrl('/api/contact'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            let errorMessage = 'Something went wrong. Please try again later.';
            try {
                const errorBody = await response.json();
                if (errorBody?.errors) {
                    errorMessage = Object.values(errorBody.errors).join(' ');
                }
            } catch (parseError) {
                // keep default error message
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        const reference = data?.reference ? ` (#${data.reference})` : '';
        setContactStatus(`Thanks for reaching out! I'll be in touch soon${reference}.`, 'success');
        contactForm.reset();
    } catch (error) {
        console.error('Failed to send contact message', error);
        setContactStatus(error.message || 'Unable to send your message right now. Please try again later.', 'error');
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
        }
    }
}

function init() {
    applyTheme(getStoredTheme());

    if (yearTarget) {
        yearTarget.textContent = new Date().getFullYear();
    }

    document.body.classList.add('reveal-ready');

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    requestAnimationFrame(() => initHeroBackground());

    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
        contactForm.addEventListener('input', () => setContactStatus(''));
        setContactStatus('');
    }

    if (projectsGrid) {
        fetchProjects()
            .then(renderProjects)
            .catch(() => {
                useFallbackProjects();
            })
            .finally(() => {
                observeSections();
            });
    } else {
        observeSections();
    }
}

prefersDark.addEventListener('change', event => {
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
        applyTheme(event.matches ? 'dark' : 'light');
        updateHeroPalette();
    }
});

prefersReducedMotion.addEventListener('change', event => {
    if (event.matches) {
        teardownHeroBackground();
    } else {
        initHeroBackground(true);
    }
});

document.addEventListener('DOMContentLoaded', init);

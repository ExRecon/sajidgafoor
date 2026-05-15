// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
    initCustomCursor();
    initParticles();
    initNavbar();
    initScrollReveal();
    initActiveNavTracking();
    initCounters();
    initTimelineProgress();
    initProjectsScroll();
    initRecommendationsSlider();
    initMagneticButtons();
    initSmoothScroll();
    setCurrentYear();
});

// ===== LOADING SCREEN =====
function initLoadingScreen() {
    const loader = document.getElementById('loadingScreen');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.cursor = 'auto';
        }, 800);
    });
}

// ===== CUSTOM CURSOR =====
function initCustomCursor() {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;
    
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });
    
    function animateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
        requestAnimationFrame(animateRing);
    }
    animateRing();
    
    const hoverTargets = document.querySelectorAll('a, button, .magnetic-btn, .magnetic-btn-small, input, textarea, .project-card, .timeline-card, .expertise-card, .sector-card');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
}

// ===== PARTICLE BACKGROUND =====
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    
    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(201, 168, 76, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        // Draw connection lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(77, 208, 200, ${0.04 * (1 - dist/100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        animationId = requestAnimationFrame(animate);
    }
    animate();
}

// ===== NAVBAR SCROLL EFFECT & MOBILE TOGGLE =====
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });
    
    if (toggle) {
        toggle.addEventListener('click', () => {
            links.classList.toggle('active');
            const expanded = links.classList.contains('active');
            toggle.setAttribute('aria-expanded', expanded);
        });
    }
    
    // Close mobile nav on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// ===== SCROLL REVEAL (Intersection Observer) =====
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-element');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    
    reveals.forEach(el => observer.observe(el));
}

// ===== ACTIVE NAV LINK TRACKING =====
function initActiveNavTracking() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    });
}

// ===== ANIMATED COUNTERS =====
function initCounters() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                let count = 0;
                const increment = target / 40;
                const timer = setInterval(() => {
                    count += increment;
                    if (count >= target) {
                        el.textContent = target;
                        clearInterval(timer);
                    } else {
                        el.textContent = Math.floor(count);
                    }
                }, 25);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.6 });
    statNumbers.forEach(num => observer.observe(num));
}

// ===== TIMELINE PROGRESS =====
function initTimelineProgress() {
    const timeline = document.getElementById('timeline');
    const progress = document.getElementById('timelineProgress');
    if (!timeline || !progress) return;
    
    function updateProgress() {
        const timelineTop = timeline.getBoundingClientRect().top;
        const timelineHeight = timeline.offsetHeight;
        const windowHeight = window.innerHeight;
        let scrollFraction = (windowHeight - timelineTop) / (timelineHeight + windowHeight);
        scrollFraction = Math.min(1, Math.max(0, scrollFraction));
        progress.style.height = `${scrollFraction * 100}%`;
    }
    window.addEventListener('scroll', updateProgress);
    updateProgress();
}

// ===== PROJECTS HORIZONTAL SCROLL =====
function initProjectsScroll() {
    const wrapper = document.getElementById('projectsScroll');
    const track = document.getElementById('projectsTrack');
    const prevBtn = document.getElementById('projectsPrev');
    const nextBtn = document.getElementById('projectsNext');
    if (!wrapper || !track) return;
    
    const scrollAmount = 380;
    
    nextBtn?.addEventListener('click', () => {
        wrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
    prevBtn?.addEventListener('click', () => {
        wrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
}

// ===== RECOMMENDATIONS SLIDER =====
function initRecommendationsSlider() {
    const track = document.getElementById('recTrack');
    const dotsContainer = document.getElementById('recDots');
    if (!track || !dotsContainer) return;
    const cards = track.children;
    let index = 0;
    
    function updateSlider() {
        track.style.transform = `translateX(-${index * 100}%)`;
        document.querySelectorAll('.rec-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    for (let i = 0; i < cards.length; i++) {
        const dot = document.createElement('span');
        dot.className = 'rec-dot' + (i === 0 ? ' active' : '');
        dot.style.cssText = 'display:inline-block;width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.2);margin:0 6px;cursor:pointer;transition:all 0.3s;';
        dot.addEventListener('click', () => { index = i; updateSlider(); });
        dotsContainer.appendChild(dot);
    }
    
    setInterval(() => { index = (index + 1) % cards.length; updateSlider(); }, 5000);
}

// ===== MAGNETIC BUTTONS =====
function initMagneticButtons() {
    const magnets = document.querySelectorAll('.magnetic-btn, .magnetic-btn-small');
    magnets.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width/2;
            const y = e.clientY - rect.top - rect.height/2;
            btn.style.transform = `translate(${x*0.25}px, ${y*0.25}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0,0)';
        });
    });
}

// ===== SMOOTH SCROLL (already html smooth, but for any dynamic) =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ===== FOOTER YEAR =====
function setCurrentYear() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}
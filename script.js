document.addEventListener('DOMContentLoaded', () => {
    // === LOADING SCREEN ===
    const loadingScreen = document.getElementById('loadingScreen');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 800);
    });

    // === SCROLL PROGRESS INDICATOR ===
    const progressBar = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    });

    // === STICKY NAVBAR SCROLL EFFECT ===
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // === MOBILE MENU TOGGLE (placeholder functionality) ===
    const mobileBtn = document.getElementById('mobileMenuBtn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            // In a full implementation, toggle mobile menu visibility.
            alert('Mobile menu would open here.');
        });
    }

    // === ACTIVE NAV LINK TRACKING (Intersection Observer) ===
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60% 0px',
        threshold: 0
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    sections.forEach(section => observer.observe(section));

    // === SMOOTH SCROLL FOR ANCHOR LINKS (fallback for older browsers) ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // === COUNTER ANIMATION ===
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        let current = 0;
        const increment = target / 40;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, 20);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number[data-target]');
                counters.forEach(counter => {
                    if (!counter.classList.contains('counted')) {
                        animateCounter(counter);
                        counter.classList.add('counted');
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) counterObserver.observe(heroStats);

    // === REVEAL ANIMATIONS ON SCROLL ===
    const revealElements = document.querySelectorAll('.reveal-element');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));

    // === TIMELINE HOVER INTERACTION (expand details) ===
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.querySelector('.timeline-card').style.transform = 'scale(1.02)';
        });
        item.addEventListener('mouseleave', function() {
            this.querySelector('.timeline-card').style.transform = 'scale(1)';
        });
    });

    // === TESTIMONIALS SLIDER ===
    const slider = document.getElementById('testimonialsSlider');
    if (slider) {
        const cards = slider.querySelectorAll('.testimonial-card');
        const dotsContainer = document.getElementById('testimonialDots');
        let currentIndex = 0;
        
        // Create dots
        cards.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
        
        const dots = document.querySelectorAll('.dot');
        
        const goToSlide = (index) => {
            cards.forEach((card, i) => {
                card.style.transform = `translateX(-${index * 100}%)`;
            });
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            currentIndex = index;
        };
        
        // Auto slide every 5 seconds
        setInterval(() => {
            currentIndex = (currentIndex + 1) % cards.length;
            goToSlide(currentIndex);
        }, 5000);
    }

    // === MAGNETIC BUTTON EFFECT ===
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // === PARTICLE CANVAS BACKGROUND ===
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrame;
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        
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
                ctx.fillStyle = `rgba(201, 160, 80, ${this.opacity})`;
                ctx.fill();
            }
        }
        
        const initParticles = () => {
            particles = [];
            const count = Math.floor((canvas.width * canvas.height) / 12000);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        };
        
        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationFrame = requestAnimationFrame(animateParticles);
        };
        
        initParticles();
        animateParticles();
        
        window.addEventListener('resize', () => {
            cancelAnimationFrame(animationFrame);
            resizeCanvas();
            initParticles();
            animateParticles();
        });
    }

    // === CONTACT FORM HANDLING (demo) ===
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your inquiry. This is a demonstration form.');
            contactForm.reset();
        });
    }
});
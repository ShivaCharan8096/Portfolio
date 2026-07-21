/**
 * Erukulla Shiva Charan - Portfolio Scripting Engine
 * Modern ES6+ Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initMobileNavigation();
    initStickyHeader();
    initScrollSpy();
    initTypingAnimation();
    initScrollReveal();
    initBackToTop();
    initScrollProgress();
    initCardGlow();
    initHeroButtonInteractions();
});

/**
 * 1. Mobile Navigation & Toggle Behavior
 */
function initMobileNavigation() {
    const toggleButton = document.querySelector('.mobile-nav-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!toggleButton || !navLinksContainer) return;

    const toggleMenu = () => {
        const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
        toggleButton.setAttribute('aria-expanded', !isExpanded);
        navLinksContainer.classList.toggle('active');
        document.body.classList.toggle('overflow-hidden'); // Prevent background scrolling
    };

    const closeMenu = () => {
        toggleButton.setAttribute('aria-expanded', 'false');
        navLinksContainer.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
    };

    toggleButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close mobile menu after clicking a navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside of the navigation container
    document.addEventListener('click', (e) => {
        if (navLinksContainer.classList.contains('active') && 
            !navLinksContainer.contains(e.target) && 
            !toggleButton.contains(e.target)) {
            closeMenu();
        }
    });
}

/**
 * 2. Sticky Navbar Behavior
 */
function initStickyHeader() {
    const header = document.querySelector('.main-header');
    if (!header) return;

    const handleScroll = () => {
        if (window.scrollY > 40) {
            header.classList.add('header-scrolled');
            header.style.padding = '0.75rem 0';
            header.style.background = 'rgba(11, 15, 23, 0.85)';
            header.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.5)';
        } else {
            header.classList.remove('header-scrolled');
            header.style.padding = '';
            header.style.background = 'rgba(11, 15, 23, 0.7)';
            header.style.boxShadow = 'none';
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Trigger initially on page load
}

/**
 * 3. Active Navigation Highlighting While Scrolling (ScrollSpy)
 */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const scrollSpyOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the sweet spot of the viewport
        threshold: 0
    };

    const scrollSpyCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                        link.style.color = 'var(--primary)';
                    } else {
                        link.classList.remove('active');
                        link.style.color = '';
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(scrollSpyCallback, scrollSpyOptions);
    sections.forEach(section => observer.observe(section));
}

/**
 * 4. Typing Animation for Hero Subtitle
 */
function initTypingAnimation() {
    const subtitleContainer = document.querySelector('.hero-subtitle');
    if (!subtitleContainer) return;

    // Reset initial structural nodes while preserving design tokens
    subtitleContainer.innerHTML = 'Frontend Developer <span class="connector">&amp;</span> <span class="dynamic-text"></span>';
    
    const targetSpan = subtitleContainer.querySelector('.dynamic-text');
    const roles = ['Designer', 'CS Student', 'Problem Solver'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const type = () => {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            targetSpan.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Faster deletion
        } else {
            targetSpan.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // Normal typing speed
        }

        // Handle states
        if (!isDeleting && charIndex === currentRole.length) {
            typingSpeed = 2000; // Keep full text visible for 2 seconds
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Short pause before typing next role
        }

        setTimeout(type, typingSpeed);
    };

    // Inject typing cursor style programmatically
    const style = document.createElement('style');
    style.textContent = `
        .dynamic-text {
            color: var(--secondary);
            border-right: 2px solid var(--primary);
            padding-right: 3px;
            animation: blink 0.75s step-end infinite;
        }
        @keyframes blink {
            from, to { border-color: transparent }
            50% { border-color: var(--primary); }
        }
    `;
    document.head.appendChild(style);

    // Run animation
    setTimeout(type, 1000);
}

/**
 * 5. Scroll Reveal Animations Using Intersection Observer
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.glass-card, .section-header, .timeline-item, .about-content, .about-visual, .project-showcase-grid'
    );

    // Inject fallback reveal animation styles programmatically to avoid style.css structural dependency
    const style = document.createElement('style');
    style.textContent = `
        .reveal-hidden {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), 
                        transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .reveal-visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        element.classList.add('reveal-hidden');
        revealObserver.observe(element);
    });
}

/**
 * 6. Dynamic Back-To-Top Button
 */
function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    `;
    document.body.appendChild(backToTopBtn);

    // Style injection
    const style = document.createElement('style');
    style.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 46px;
            height: 46px;
            border-radius: 50%;
            background: var(--surface-glass);
            backdrop-filter: blur(8px);
            border: 1px solid var(--border-glass);
            color: var(--text-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 99;
            opacity: 0;
            visibility: hidden;
            transform: translateY(15px);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: var(--shadow-glass);
        }
        .back-to-top.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        .back-to-top:hover {
            border-color: var(--primary);
            color: var(--primary);
            box-shadow: var(--shadow-glow);
            transform: translateY(-5px);
        }
    `;
    document.head.appendChild(style);

    const checkScrollPosition = () => {
        if (window.scrollY > window.innerHeight) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    };

    window.addEventListener('scroll', checkScrollPosition, { passive: true });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * 7. Fallback Scroll Progress Indicator (Updates global CSS custom properties)
 */
function initScrollProgress() {
    const handleProgress = () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight === 0) return;
        
        const scrollPercentage = (window.scrollY / totalHeight) * 100;
        document.documentElement.style.setProperty('--scroll-percentage', `${scrollPercentage}%`);
    };

    window.addEventListener('scroll', handleProgress, { passive: true });
}

/**
 * 8. Card Hover Glow Coordinates Effect (Glow Tracking)
 */
function initCardGlow() {
    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // Mouse X coordinate relative to element
            const y = e.clientY - rect.top;  // Mouse Y coordinate relative to element
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Inject CSS for dynamic radial gradient glow mapping
    const style = document.createElement('style');
    style.textContent = `
        .glass-card {
            position: relative;
        }
        .glass-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: inherit;
            background: radial-gradient(
                400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
                rgba(6, 182, 212, 0.08),
                transparent 40%
            );
            z-index: 1;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.4s ease;
        }
        .glass-card:hover::before {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}

/**
 * 9. Hero Button Particle/Micro-interactions
 */
function initHeroButtonInteractions() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Ripple construction
            const circle = document.createElement('span');
            const diameter = Math.max(this.clientWidth, this.clientHeight);
            const radius = diameter / 2;

            const rect = this.getBoundingClientRect();
            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - rect.left - radius}px`;
            circle.style.top = `${e.clientY - rect.top - radius}px`;
            circle.classList.add('ripple');

            // Remove existing ripple if any
            const ripple = this.querySelector('.ripple');
            if (ripple) {
                ripple.remove();
            }

            this.appendChild(circle);
        });
    });

    // Ripple Styles
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        .ripple {
            position: absolute;
            background: rgba(255, 255, 255, 0.25);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}
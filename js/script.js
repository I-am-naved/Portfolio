// ===================================
// Smooth Scrolling
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Navbar Scroll Effect
// ===================================
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('mainNav');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active nav link
    updateActiveNavLink();
});

// ===================================
// Active Nav Link on Scroll
// ===================================
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ===================================
// Animate on Scroll
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.project-card, .service-card, .resume-card, .section-header, .stat-card');
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Add reveal class to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('reveal');
    });
    
    // Reveal animation observer
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        revealObserver.observe(section);
    });
    
    // Initialize skill progress bars
    document.querySelectorAll('.skill-progress-fill').forEach(fill => {
        fill.style.width = '0%'; // Start at 0%
    });
});

// ===================================
// Progress Bar Animation
// ===================================
const progressBars = document.querySelectorAll('.progress-bar');
const progressObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target;
            const width = progressBar.getAttribute('style')?.match(/\d+/)?.[0] || 0;
            progressBar.style.width = '0%';
            setTimeout(() => {
                progressBar.style.width = width + '%';
            }, 100);
            progressObserver.unobserve(progressBar);
        }
    });
}, { threshold: 0.5 });

progressBars.forEach(bar => {
    progressObserver.observe(bar);
});

// ===================================
// Parallax Effect for Hero Section (Desktop Only)
// ===================================
if (window.innerWidth > 768) {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image');
        if (heroImage && scrolled < 800) {
            heroImage.style.transform = `translateY(${scrolled * 0.2}px)`;
            heroImage.style.opacity = Math.max(0.3, 1 - (scrolled / 800));
        }
    });
}

// ===================================
// Mouse Move Parallax Effect (Desktop Only)
// ===================================
if (window.innerWidth > 768) {
    document.addEventListener('mousemove', function(e) {
        const cards = document.querySelectorAll('.project-card, .service-card');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Only apply if mouse is over the card
            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const moveX = (x - centerX) / 20;
                const moveY = (y - centerY) / 20;
                
                card.style.transform = `perspective(1000px) rotateY(${moveX}deg) rotateX(${-moveY}deg)`;
            }
        });
    });
    
    // Reset card transforms when mouse leaves
    document.addEventListener('mouseleave', function() {
        const cards = document.querySelectorAll('.project-card, .service-card');
        cards.forEach(card => {
            card.style.transform = '';
        });
    });
}


// ===================================
// Animated Counter for Stats
// ===================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            const target = parseInt(statNumber.getAttribute('data-target'));
            animateCounter(statNumber, target);
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
    statObserver.observe(card);
});

// ===================================
// Skill Progress Bar Animation
// ===================================
function animateSkillProgress(progressBar) {
    const percent = parseInt(progressBar.getAttribute('data-percent'));
    const progressFill = progressBar.querySelector('.skill-progress-fill');
    if (progressFill) {
        progressFill.style.width = '0%';
        setTimeout(() => {
            progressFill.style.width = percent + '%';
        }, 100);
    }
}

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkillProgress(entry.target);
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-progress-bar').forEach(progressBar => {
    skillObserver.observe(progressBar);
});

// ===================================
// Language Transition (English to French Loop) - Smooth Crossfade
// ===================================
let currentLanguage = 'en';
let isTransitioning = false;

function changeLanguage() {
    if (isTransitioning) return;
    
    isTransitioning = true;
    const textElements = document.querySelectorAll('.text-transition');
    
    // Toggle language
    currentLanguage = currentLanguage === 'en' ? 'fr' : 'en';
    
    textElements.forEach((element, index) => {
        const enText = element.getAttribute('data-en');
        const frText = element.getAttribute('data-fr');
        
        if (!enText || !frText) return;
        
        const content = element.querySelector('.text-transition-content') || element;
        const newText = currentLanguage === 'en' ? enText : frText;
        
        // Stagger animations slightly
        setTimeout(() => {
            // Fade out
            content.classList.add('fade-out');
            
            setTimeout(() => {
                // Change text
                content.textContent = newText;
                
                // Remove fade-out, add fade-in
                content.classList.remove('fade-out');
                content.classList.add('fade-in');
                
                // Remove fade-in after animation
                setTimeout(() => {
                    content.classList.remove('fade-in');
                    
                    if (index === textElements.length - 1) {
                        isTransitioning = false;
                    }
                }, 600);
            }, 300);
        }, index * 50);
    });
}

// Start language transition loop after page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize with English (default)
    const textElements = document.querySelectorAll('.text-transition');
    textElements.forEach(element => {
        const enText = element.getAttribute('data-en');
        if (enText) {
            // Wrap content in span if not already wrapped
            if (!element.querySelector('.text-transition-content')) {
                const content = document.createElement('span');
                content.className = 'text-transition-content';
                content.textContent = enText;
                element.innerHTML = '';
                element.appendChild(content);
            } else {
                element.querySelector('.text-transition-content').textContent = enText;
            }
        }
    });
    
    // Wait 3 seconds before starting the transition
    setTimeout(() => {
        // Change language every 4.5 seconds
        setInterval(changeLanguage, 4500);
    }, 3000);
});

// ===================================
// Mobile Menu Close on Link Click
// ===================================
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
const navbarCollapse = document.querySelector('.navbar-collapse');
const navbarToggler = document.querySelector('.navbar-toggler');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth < 992) {
            navbarCollapse.classList.remove('show');
            navbarToggler.classList.add('collapsed');
        }
    });
});

// ===================================
// Typing Effect (Optional - for hero title)
// ===================================
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Uncomment to enable typing effect on hero title
// window.addEventListener('load', function() {
//     const heroTitle = document.querySelector('.hero-title');
//     if (heroTitle) {
//         const originalText = heroTitle.textContent;
//         typeWriter(heroTitle, originalText, 50);
//     }
// });


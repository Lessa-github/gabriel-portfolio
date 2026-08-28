// ==========================================
// INTERACTIVE CYBER NETWORK BACKGROUND
// ==========================================
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const mouse = { x: null, y: null, radius: 350 };

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.5 + 0.5;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const numParticles = (width * height) / 8000;
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 160) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(6, 182, 212, ${0.25 - distance/800})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
        
        if (mouse.x != null) {
            const dx = particles[i].x - mouse.x;
            const dy = particles[i].y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(59, 130, 246, ${0.5 - distance/(mouse.radius*2)})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
                
                particles[i].x -= dx * 0.05;
                particles[i].y -= dy * 0.05;
            }
        }
    }
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ==========================================
// SIMPLE REVEAL ANIMATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.05, rootMargin: "0px 0px -20px 0px" });

    reveals.forEach(el => observer.observe(el));
});

// ==========================================
// NUMBER COUNTER ANIMATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const stats = document.querySelectorAll('.stat-number');
    let started = false;

    const startCounters = () => {
        if (started) return;
        started = true;
        stats.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const duration = 2000;
            const step = Math.max(1, Math.floor(target / (duration / 16)));
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    stat.innerText = current;
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.innerText = target;
                }
            };
            updateCounter();
        });
    };

    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const counterObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) startCounters();
        }, { threshold: 0.1 });
        counterObserver.observe(aboutSection);
    }
});



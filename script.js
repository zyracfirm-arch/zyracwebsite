// ==========================================================================
// 1. INITIALIZATION & FAILSAFE PRELOADER UNLOCK
// ==========================================================================
document.body.classList.add('locked');

// Linear interpolation helper for ultra-smooth 60fps physics
const lerp = (start, end, factor) => start + (end - start) * factor;

// Bulletproof Preloader Exit Function (Can only run once)
let preloaderDismissed = false;
function dismissPreloader() {
    if (preloaderDismissed) return;
    preloaderDismissed = true;

    // Trigger the liquid curtain raise effect in CSS
    document.body.classList.add('site-loaded');
    
    // Unlock the scrollbar so the user can navigate
    document.body.classList.remove('locked');
    
    // Remove the preloader from the DOM after CSS transition finishes
    setTimeout(() => {
        const preloader = document.getElementById('premium-preloader');
        if (preloader) {
            preloader.remove();
        }
    }, 1200);
}

// Normal unlock on window load (after 2.2s animation)
window.addEventListener('load', () => {
    setTimeout(dismissPreloader, 2200);
});

// FAILSAFE: Force unlock after 3.2 seconds even if a local image path is missing
setTimeout(dismissPreloader, 3200);


// ==========================================================================
// 2. CORE FUNCTIONALITY (Runs as soon as HTML DOM is ready)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    
    /* --- A. Intersection Observer for Scroll Animations --- */
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appear');
            observer.unobserve(entry.target); 
        });
    }, appearOptions);

    faders.forEach(fader => appearOnScroll.observe(fader));


    /* --- B. Smooth Scrolling (With Safe Navbar Offset) --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navbar = document.querySelector('.navbar');
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    /* --- C. Split-Pill Headline Rotator (Emhance-Style Hero) --- */
    const morphPill1 = document.getElementById('morph-pill-1') || document.getElementById('pill-word-1');
    const morphPill2 = document.getElementById('morph-pill-2') || document.getElementById('pill-word-2');

    if (morphPill1 && morphPill2) {
        const headlinePairs = [
            ["paisa vasool", "conversions"],
            ["zero doglapan", "architecture"],
            ["Diwali traffic", "survival"],
            ["sub-second", "load speed"],
            ["direct buyer", "onboarding"]
        ];
        let currentPair = 0;

        setInterval(() => {
            morphPill1.classList.add('pill-fade-out', 'switching-out');
            morphPill2.classList.add('pill-fade-out', 'switching-out');

            setTimeout(() => {
                currentPair = (currentPair + 1) % headlinePairs.length;
                morphPill1.textContent = headlinePairs[currentPair][0];
                morphPill2.textContent = headlinePairs[currentPair][1];

                morphPill1.classList.remove('pill-fade-out', 'switching-out');
                morphPill2.classList.remove('pill-fade-out', 'switching-out');
            }, 280);
        }, 2800);
    }


    /* --- D. Interactive Pixel Matrix Lens (If Silhouette Exists) --- */
    const scannerBox = document.getElementById('pixel-scanner-box');
    const pixelLens = document.getElementById('pixel-lens');

    if (scannerBox && pixelLens) {
        scannerBox.addEventListener('mousemove', (e) => {
            const rect = scannerBox.getBoundingClientRect();
            const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
            const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
            pixelLens.style.setProperty('--scan-x', `${xPercent.toFixed(1)}%`);
            pixelLens.style.setProperty('--scan-y', `${yPercent.toFixed(1)}%`);
        }, { passive: true });
    }


    /* --- E. Live Node Network Canvas (Hero Background) --- */
    const canvas = document.getElementById('hero-canvas');
    if (canvas && canvas.parentElement) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let isHeroVisible = true;
        const mouse = { x: -9999, y: -9999, radius: 110 };
        
        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = canvas.parentElement.offsetWidth || window.innerWidth;
            height = canvas.parentElement.offsetHeight || window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        
        window.addEventListener('resize', resize, { passive: true });
        resize();

        const heroSection = document.getElementById('home') || canvas.parentElement;
        heroSection.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        }, { passive: true });

        heroSection.addEventListener('mouseleave', () => {
            mouse.x = -9999;
            mouse.y = -9999;
        }, { passive: true });

        const canvasObserver = new IntersectionObserver((entries) => {
            isHeroVisible = entries[0].isIntersecting;
        }, { threshold: 0.01 });
        canvasObserver.observe(heroSection);

        class Node {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.45;
                this.vy = (Math.random() - 0.5) * 0.45;
                this.radius = Math.random() * 1.8 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius && dist > 0) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= (dx / dist) * force * 0.8;
                    this.y -= (dy / dist) * force * 0.8;
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(232, 93, 4, 0.42)';
                ctx.fill();
            }
        }

        for (let i = 0; i < 40; i++) {
            particles.push(new Node());
        }

        function animateCanvas() {
            if (isHeroVisible) {
                ctx.clearRect(0, 0, width, height);
                for (let i = 0; i < particles.length; i++) {
                    particles[i].update();
                    particles[i].draw();

                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const distSq = dx * dx + dy * dy;
                        if (distSq < 11000) {
                            const alpha = (1 - Math.sqrt(distSq) / 105) * 0.45;
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.strokeStyle = `rgba(232, 93, 4, ${alpha.toFixed(3)})`;
                            ctx.lineWidth = 0.6;
                            ctx.stroke();
                        }
                    }
                }
            }
            requestAnimationFrame(animateCanvas);
        }
        requestAnimationFrame(animateCanvas);
    }


    /* --- F. Smooth 3D Parallax Zone (Hero Showcase & Floating Pills) --- */
    const parallaxZone = document.getElementById('parallax-zone');
    if (parallaxZone) {
        const layers = parallaxZone.querySelectorAll('.parallax-layer');
        const stageVisual = document.getElementById('zyrac-stage-visual');
        let targetX = 0, targetY = 0;
        let currentX = 0, currentY = 0;

        parallaxZone.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 992) return;
            const rect = parallaxZone.getBoundingClientRect();
            targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        }, { passive: true });

        parallaxZone.addEventListener('mouseleave', () => {
            targetX = 0;
            targetY = 0;
        }, { passive: true });

        function updateParallax() {
            if (window.innerWidth > 992) {
                currentX = lerp(currentX, targetX, 0.08);
                currentY = lerp(currentY, targetY, 0.08);

                layers.forEach(layer => {
                    const speed = parseFloat(layer.getAttribute('data-speed')) || 2;
                    const moveX = currentX * speed * 4.5;
                    const moveY = currentY * speed * 4.5;
                    layer.style.transform = `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0)`;
                });

                if (stageVisual) {
                    const rotX = currentY * -4;
                    const rotY = currentX * 5;
                    stageVisual.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
                }
            }
            requestAnimationFrame(updateParallax);
        }
        requestAnimationFrame(updateParallax);
    }


    /* --- G. Smooth Ease-Out Counters --- */
    function countUp(elementId, targetNumber, duration, onComplete) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        let startTime = null;
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

        setTimeout(() => {
            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                const easedVal = Math.floor(easeOutCubic(progress) * targetNumber);
                
                element.innerText = easedVal.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    element.innerText = targetNumber.toLocaleString();
                    if (typeof onComplete === 'function') onComplete(element, targetNumber);
                }
            }
            requestAnimationFrame(step);
        }, 450);
    }

    countUp('counter-deployments', 214, 2000); 
    countUp('counter-requests', 8420, 2400, (el, baseValue) => {
        setInterval(() => {
            const jitter = Math.floor((Math.random() - 0.48) * 35);
            const liveVal = Math.max(8200, Math.min(8850, baseValue + jitter));
            el.innerText = liveVal.toLocaleString();
        }, 1200);
    });


    /* --- H. Live Telemetry Graph (Runs Safely Only If SVG Graph Exists) --- */
    const graphLine = document.getElementById('live-graph-line');
    const graphFill = document.getElementById('live-graph-fill');
    const graphDot = document.getElementById('live-graph-dot');
    
    if (graphLine && graphFill) {
        const maxPoints = 25;
        const stepX = 100 / (maxPoints - 1);
        let currentPoints = Array(maxPoints).fill(28);
        let targetPoints = Array(maxPoints).fill(28);
        let latestTargetY = 24;

        function updateLiveGraphTarget() {
            const marketTick = (Math.random() - 0.44) * 7.5;
            latestTargetY = Math.max(5, Math.min(36, latestTargetY - marketTick));
            targetPoints.shift();
            targetPoints.push(latestTargetY);
        }

        function renderSmoothGraph() {
            let pointsString = "";
            let fillString = "0,40 ";

            for (let i = 0; i < maxPoints; i++) {
                currentPoints[i] = lerp(currentPoints[i], targetPoints[i], 0.14);
                const x = (i * stepX).toFixed(2);
                const y = currentPoints[i].toFixed(2);
                pointsString += `${x},${y} `;
                fillString += `${x},${y} `;
            }

            fillString += "100,40";
            graphLine.setAttribute('points', pointsString.trim());
            graphFill.setAttribute('points', fillString.trim());

            if (graphDot) {
                graphDot.setAttribute('cy', currentPoints[maxPoints - 1].toFixed(2));
            }
            requestAnimationFrame(renderSmoothGraph);
        }

        setInterval(updateLiveGraphTarget, 350);
        requestAnimationFrame(renderSmoothGraph);
    }


    /* --- I. Magnetic Spotlight Cards (Reviews Section) --- */
    const spotlightGrid = document.getElementById('spotlight-grid');
    if (spotlightGrid) {
        const cards = spotlightGrid.querySelectorAll('.spotlight-card');
        let rafPending = false;
        let lastEvent = null;

        spotlightGrid.addEventListener('mousemove', (e) => {
            lastEvent = e;
            if (!rafPending) {
                rafPending = true;
                requestAnimationFrame(() => {
                    for (const card of cards) {
                        const rect = card.getBoundingClientRect();
                        card.style.setProperty('--mouse-x', `${lastEvent.clientX - rect.left}px`);
                        card.style.setProperty('--mouse-y', `${lastEvent.clientY - rect.top}px`);
                    }
                    rafPending = false;
                });
            }
        }, { passive: true });
    }

});
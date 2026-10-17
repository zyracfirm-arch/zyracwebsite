// ==========================================================================
// 1. INITIALIZATION (Runs immediately)
// ==========================================================================
// Lock the screen from scrolling while the preloader is active
document.body.classList.add('locked');


// ==========================================================================
// 2. CORE FUNCTIONALITY (Runs when the HTML structure is ready)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    
    /* --- Intersection Observer for Scroll Animations --- */
    const faders = document.querySelectorAll('.fade-in');
    
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px" // Triggers slightly before the element hits the bottom
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); 
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });
    
    /* --- Smooth Scrolling (Fixed for Glass Navbar) --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* --- LIVE NODE NETWORK CANVAS (Hero Background) --- */
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        
        function resize() {
            width = canvas.parentElement.offsetWidth;
            height = canvas.parentElement.offsetHeight;
            canvas.width = width;
            canvas.height = height;
        }
        
        window.addEventListener('resize', resize);
        resize();

        class Node {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5; // Very slow, ambient movement
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(232, 93, 4, 0.4)'; // Brand orange, translucent
                ctx.fill();
            }
        }

        // Initialize nodes
        for (let i = 0; i < 40; i++) {
            particles.push(new Node());
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Draw connecting energy lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(232, 93, 4, ${1 - dist/100})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }

    /* --- JS-DRIVEN DASHBOARD COUNTERS (Right Side) --- */
    // ==========================================================================
    // 2. JS-DRIVEN DASHBOARD COUNTERS & LIVE SHARE MARKET GRAPH
    // ==========================================================================
    
    // --- Counters ---
    function countUp(elementId, targetNumber, duration) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        let start = 0;
        const increment = targetNumber / (duration / 16);
        
        setTimeout(() => {
            const timer = setInterval(() => {
                start += increment;
                if (start >= targetNumber) {
                    clearInterval(timer);
                    element.innerText = targetNumber.toLocaleString(); 
                } else {
                    element.innerText = Math.floor(start).toLocaleString();
                }
            }, 16);
        }, 500);
    }

    // New Development Firm Metrics
    countUp('counter-deployments', 214, 2000); 
    countUp('counter-requests', 8420, 2500); // Massive req/sec metric   

    // --- Live Angular Stock Market Graph ---
    const graphLine = document.getElementById('live-graph-line');
    const graphFill = document.getElementById('live-graph-fill');
    const graphDot = document.getElementById('live-graph-dot'); // The playhead tracker
    
    if (graphLine && graphFill) {
        let dataPoints = [];
        const maxPoints = 25; 
        let currentValue = 30; 
        
        // Populate initially
        for (let i = 0; i < maxPoints; i++) {
            dataPoints.push(40);
        }

        function updateLiveGraph() {
            // Random Walk Algorithm for exact market ticks
            const marketTick = (Math.random() - 0.4) * 6; 
            currentValue = Math.max(2, Math.min(38, currentValue - marketTick)); 

            dataPoints.shift(); 
            dataPoints.push(currentValue); 

            let pointsString = "";
            let fillString = "0,40 "; 

            const stepX = 100 / (maxPoints - 1); 
            
            dataPoints.forEach((val, index) => {
                const x = (index * stepX).toFixed(1);
                const y = val.toFixed(1);
                pointsString += `${x},${y} `;
                fillString += `${x},${y} `;
            });

            fillString += "100,40"; 

            // Update SVG elements
            graphLine.setAttribute('points', pointsString.trim());
            graphFill.setAttribute('points', fillString.trim());
            
            // Lock the glowing tracker dot to the very last coordinate generated
            if (graphDot) {
                graphDot.setAttribute('cy', currentValue.toFixed(1));
            }
        }

        // Trigger every 350ms for that high-speed data stream look
        setInterval(updateLiveGraph, 350);
    }
    
});


// ==========================================================================
// 3. PRELOADER EXIT (Runs when all images, fonts, and CSS are fully loaded)
// ==========================================================================
window.addEventListener('load', function() {
    
    // Give the drawing animations a guaranteed 2.5 seconds to play out
    setTimeout(function() {
        
        // Trigger the liquid curtain raise effect in CSS
        document.body.classList.add('site-loaded');
        
        // Unlock the scrollbar so the user can navigate
        document.body.classList.remove('locked');
        
        // Remove the preloader from the DOM to free up memory
        setTimeout(function() {
            const preloader = document.getElementById('premium-preloader');
            if (preloader) {
                preloader.remove();
            }
        }, 1200); // Waits for the CSS transform to finish

    }, 2500); 
    



    /* --- JS-DRIVEN MAGNETIC SPOTLIGHT CARDS (Reviews Section) --- */
    const spotlightGrid = document.getElementById('spotlight-grid');
    
    if (spotlightGrid) {
        // We track mouse movement over the entire grid
        spotlightGrid.addEventListener('mousemove', (e) => {
            const cards = document.querySelectorAll('.spotlight-card');
            
            // Loop through each card and calculate where the mouse is relative to it
            for (const card of cards) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Inject the exact X and Y coordinates into CSS variables
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            }
        });
    }
});
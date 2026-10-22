// ==========================================================================
// 1. INITIALIZATION & FAILSAFE PRELOADER UNLOCK
// ==========================================================================
document.body.classList.add('locked');

const lerp = (start, end, factor) => start + (end - start) * factor;

let preloaderDismissed = false;
function dismissPreloader() {
    if (preloaderDismissed) return;
    preloaderDismissed = true;

    document.body.classList.add('site-loaded');
    document.body.classList.remove('locked');
    
    setTimeout(() => {
        const preloader = document.getElementById('premium-preloader');
        if (preloader) preloader.remove();
    }, 1150);
}

// Animate Percentage (0% -> 100%) & Rotate Fresh Hinglish Meme Lines
(function initMemePreloader() {
    const statusText = document.getElementById('preloader-status-text');
    const percentNum = document.getElementById('preloader-percent-num');
    const barFill = document.getElementById('preloader-bar-fill');

    const memeLines = [
        "Ruko zara... Sabar karo...",
        "Deleting ₹500 WordPress templates...",
        "Skipping any excuses...",
        "Paisa Vasool experience ready!"
    ];

    let startTime = null;
    const totalDuration = 1950; // Smooth 1.95s build-up
    let lastStage = 0;

    function tickPreloader(timestamp) {
        if (preloaderDismissed) return;
        if (!startTime) startTime = timestamp;

        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / totalDuration, 1);
        // Smooth ease-out curve
        const eased = 1 - Math.pow(1 - progress, 2.6);
        const pct = Math.floor(eased * 100);

        if (percentNum) percentNum.textContent = `${pct}%`;
        if (barFill) barFill.style.width = `${pct}%`;

        // Switch meme text smoothly at 28%, 58%, and 86%
        const stage = pct > 86 ? 3 : pct > 58 ? 2 : pct > 28 ? 1 : 0;
        if (stage !== lastStage && statusText) {
            lastStage = stage;
            statusText.classList.add('text-swap');
            setTimeout(() => {
                statusText.textContent = memeLines[stage];
                statusText.classList.remove('text-swap');
            }, 140);
        }

        if (progress < 1) {
            requestAnimationFrame(tickPreloader);
        } else {
            setTimeout(dismissPreloader, 250);
        }
    }

    requestAnimationFrame(tickPreloader);
})();

// Failsafe: Force unlock after 2.8 seconds no matter what
setTimeout(dismissPreloader, 2800);


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

/* --- C. SMOOTH WIDTH-MORPHING SPLIT PILLS + COMIC BUBBLE SYNC --- */
    const morphPill1 = document.getElementById('morph-pill-1');
    const morphPill2 = document.getElementById('morph-pill-2');
    const diagnosticNodes = document.querySelectorAll('.emhance-floating-node');

    if (morphPill1 && morphPill2) {
        const textSpan1 = morphPill1.querySelector('.pill-inner-text') || morphPill1;
        const textSpan2 = morphPill2.querySelector('.pill-inner-text') || morphPill2;

        const headlinePairs = [
            ["paisa vasool", "websites"],
            ["zero doglapan", "web apps"],
            ["Diwali traffic", "stores"],
            ["sub-second", "mobile apps"]
        ];
        let currentPair = 0;

        function setSmoothPillWidth(pillEl, textEl, newText) {
            const currentWidth = pillEl.offsetWidth;
            pillEl.style.width = `${currentWidth}px`;
            textEl.textContent = newText;

            pillEl.style.width = 'auto';
            const targetWidth = pillEl.offsetWidth;

            pillEl.style.width = `${currentWidth}px`;
            void pillEl.offsetWidth;
            pillEl.style.width = `${targetWidth}px`;
        }

        window.addEventListener('resize', () => {
            morphPill1.style.width = 'auto';
            morphPill2.style.width = 'auto';
        }, { passive: true });

        setInterval(() => {
            morphPill1.classList.add('is-changing');
            morphPill2.classList.add('is-changing');

            setTimeout(() => {
                currentPair = (currentPair + 1) % headlinePairs.length;
                setSmoothPillWidth(morphPill1, textSpan1, headlinePairs[currentPair][0]);
                setSmoothPillWidth(morphPill2, textSpan2, headlinePairs[currentPair][1]);

                morphPill1.classList.remove('is-changing');
                morphPill2.classList.remove('is-changing');

                // Highlight the matching comic speech bubble around the robot
                if (diagnosticNodes.length > 0) {
                    diagnosticNodes.forEach(n => n.classList.remove('active-node'));
                    const activeNode = diagnosticNodes[currentPair % diagnosticNodes.length];
                    if (activeNode) activeNode.classList.add('active-node');
                }
            }, 230);
        }, 2800);
    }


    /* --- D. REALISTIC AI ROBOT: MOUSE-TRACKING EYES, CTA EXCITED SQUINT & BLINK --- */
    const aiBotStage = document.getElementById('zyrac-ai-bot');
    const botHead = document.getElementById('bot-head');
    const botEyesGroup = document.getElementById('bot-eyes-group');
    const botEyeLeft = document.getElementById('bot-eye-left');
    const botEyeRight = document.getElementById('bot-eye-right');
    const buildCtaBtn = document.getElementById('hero-build-cta') || document.querySelector('.emhance-solid-cta');

    if (aiBotStage && botHead && botEyesGroup && botEyeLeft && botEyeRight) {
        const leftPupil = botEyeLeft.querySelector('.eye-pupil');
        const rightPupil = botEyeRight.querySelector('.eye-pupil');

        let lookTargetX = 0, lookTargetY = 0;
        let lookCurrentX = 0, lookCurrentY = 0;
        let lastInteractionTime = Date.now();

        // 1. Trigger Excited Happy Eyes + Laser Scan when hovering "Start your build" CTA
        if (buildCtaBtn) {
            buildCtaBtn.addEventListener('mouseenter', () => {
                aiBotStage.classList.add('cta-excited');
            });
            buildCtaBtn.addEventListener('mouseleave', () => {
                aiBotStage.classList.remove('cta-excited');
            });
        }

        // 2. Track mouse anywhere on the screen
        window.addEventListener('mousemove', (e) => {
            lastInteractionTime = Date.now();
            const headRect = botHead.getBoundingClientRect();
            const headCenterX = headRect.left + headRect.width / 2;
            const headCenterY = headRect.top + headRect.height / 2;

            const dx = (e.clientX - headCenterX) / (window.innerWidth * 0.45);
            const dy = (e.clientY - headCenterY) / (window.innerHeight * 0.45);

            lookTargetX = Math.max(-1, Math.min(1, dx));
            lookTargetY = Math.max(-1, Math.min(1, dy));
        }, { passive: true });

        // 3. Track touch on mobile screens
        window.addEventListener('touchmove', (e) => {
            if (!e.touches || !e.touches[0]) return;
            lastInteractionTime = Date.now();
            const touch = e.touches[0];
            const headRect = botHead.getBoundingClientRect();
            const headCenterX = headRect.left + headRect.width / 2;
            const headCenterY = headRect.top + headRect.height / 2;

            const dx = (touch.clientX - headCenterX) / (window.innerWidth * 0.45);
            const dy = (touch.clientY - headCenterY) / (window.innerHeight * 0.45);

            lookTargetX = Math.max(-1, Math.min(1, dx));
            lookTargetY = Math.max(-1, Math.min(1, dy));
        }, { passive: true });

        // 4. 60FPS Smooth Gaze & 3D Head Rotation Loop
        function animateRobotGaze() {
            if (Date.now() - lastInteractionTime > 3000) {
                const t = Date.now() * 0.0016;
                lookTargetX = Math.sin(t) * 0.65;
                lookTargetY = Math.cos(t * 0.75) * 0.25;
            }

            lookCurrentX = lerp(lookCurrentX, lookTargetX, 0.12);
            lookCurrentY = lerp(lookCurrentY, lookTargetY, 0.12);

            const eyeMoveX = lookCurrentX * 18;
            const eyeMoveY = lookCurrentY * 10;
            botEyesGroup.style.transform = `translate3d(${eyeMoveX.toFixed(2)}px, ${eyeMoveY.toFixed(2)}px, 0)`;

            const pupilX = lookCurrentX * 6;
            const pupilY = lookCurrentY * 4;
            if (leftPupil && rightPupil) {
                leftPupil.style.transform = `translate3d(${pupilX.toFixed(2)}px, ${pupilY.toFixed(2)}px, 0)`;
                rightPupil.style.transform = `translate3d(${pupilX.toFixed(2)}px, ${pupilY.toFixed(2)}px, 0)`;
            }

            const headRotateY = lookCurrentX * 14;
            const headRotateX = lookCurrentY * -10;
            const headTiltZ = lookCurrentX * 3;
            botHead.style.transform = `rotateX(${headRotateX.toFixed(2)}deg) rotateY(${headRotateY.toFixed(2)}deg) rotateZ(${headTiltZ.toFixed(2)}deg)`;

            requestAnimationFrame(animateRobotGaze);
        }
        requestAnimationFrame(animateRobotGaze);

        // 5. Natural Blinking Every 2.5 to 5 Seconds
        function triggerNaturalBlink() {
            if (!aiBotStage.classList.contains('cta-excited')) {
                botEyeLeft.classList.add('is-blinking');
                botEyeRight.classList.add('is-blinking');

                setTimeout(() => {
                    botEyeLeft.classList.remove('is-blinking');
                    botEyeRight.classList.remove('is-blinking');
                }, 140);
            }
            setTimeout(triggerNaturalBlink, 2400 + Math.random() * 2600);
        }
        setTimeout(triggerNaturalBlink, 2000);
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
            } else {
                // Keep mobile & tablet comic bubbles locked in their exact CSS positions
                layers.forEach(layer => {
                    layer.style.transform = '';
                });
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
        /* --- Split-Pill Headline Rotator + 3D Laptop Tilt --- */
    const morphPill1 = document.getElementById('morph-pill-1');
    const morphPill2 = document.getElementById('morph-pill-2');

    if (morphPill1 && morphPill2) {
       const headlinePairs = [
            ["fast", "speed"],
            ["zero", "bloat"],
            ["pure", "code"],
            ["real", " ROI"],
            ["best", " SaaS"]
        ];
        let currentPair = 0;

        setInterval(() => {
            morphPill1.classList.add('pill-fade-out');
            morphPill2.classList.add('pill-fade-out');

            setTimeout(() => {
                currentPair = (currentPair + 1) % headlinePairs.length;
                morphPill1.textContent = headlinePairs[currentPair][0];
                morphPill2.textContent = headlinePairs[currentPair][1];

                morphPill1.classList.remove('pill-fade-out');
                morphPill2.classList.remove('pill-fade-out');
            }, 280);
        }, 2800);
    }
    }
    
/* --- J. Interactive 3D "ZYRAC" Footer Wordmark + Smooth 60FPS Spotlight --- */
    const wordmarkStage = document.getElementById('interactive-wordmark');
    if (wordmarkStage) {
        const chars = wordmarkStage.querySelectorAll('.monolith-char');
        let isUserHoveringStage = false;
        let autoWaveIndex = 2; // Starts on 'R'
        let spotTargetX = wordmarkStage.offsetWidth / 2;
        let spotTargetY = wordmarkStage.offsetHeight / 2;
        let spotCurrentX = spotTargetX;
        let spotCurrentY = spotTargetY;

        wordmarkStage.addEventListener('mousemove', (e) => {
            isUserHoveringStage = true;
            const rect = wordmarkStage.getBoundingClientRect();
            spotTargetX = e.clientX - rect.left;
            spotTargetY = e.clientY - rect.top;
        }, { passive: true });

        wordmarkStage.addEventListener('mouseleave', () => {
            isUserHoveringStage = false;
        }, { passive: true });

        // Smooth 60fps interpolated spotlight tracking
        function animateWordmarkSpotlight() {
            spotCurrentX = lerp(spotCurrentX, spotTargetX, 0.12);
            spotCurrentY = lerp(spotCurrentY, spotTargetY, 0.12);
            wordmarkStage.style.setProperty('--wm-x', `${spotCurrentX.toFixed(1)}px`);
            wordmarkStage.style.setProperty('--wm-y', `${spotCurrentY.toFixed(1)}px`);
            requestAnimationFrame(animateWordmarkSpotlight);
        }
        requestAnimationFrame(animateWordmarkSpotlight);

        // Highlight individual letter on hover or mobile tap
        chars.forEach((charEl, idx) => {
            charEl.addEventListener('mouseenter', () => {
                chars.forEach(c => c.classList.remove('active-pulse'));
                charEl.classList.add('active-pulse');
                autoWaveIndex = idx;
            });
            charEl.addEventListener('touchstart', () => {
                isUserHoveringStage = true;
                chars.forEach(c => c.classList.remove('active-pulse'));
                charEl.classList.add('active-pulse');
                autoWaveIndex = idx;
            }, { passive: true });
        });

        // Automatic Wave Cycle every 2.2 seconds when user isn't hovering
        setInterval(() => {
            if (!isUserHoveringStage && chars.length > 0) {
                chars.forEach(c => c.classList.remove('active-pulse'));
                autoWaveIndex = (autoWaveIndex + 1) % chars.length;
                chars[autoWaveIndex].classList.add('active-pulse');
            }
        }, 2200);
    }

    /* --- K. Live Ahmedabad HQ Studio Clock --- */
    const ahmClock = document.getElementById('ahm-live-time');
    if (ahmClock) {
        function updateAhmTime() {
            const now = new Date();
            ahmClock.textContent = `${now.toLocaleTimeString('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            })} IST`;
        }
        updateAhmTime();
        setInterval(updateAhmTime, 1000);
    }
    /* --- L. 60FPS Physics-Driven Roaming ZYRAC-Bot + Navbar Controls --- */
    const headerShell = document.getElementById('site-header');
    const roamingBot = document.getElementById('zyrac-roaming-bot');
    const closeOfferBotBtn = document.getElementById('close-offer-bot');
    const roamingBotCopy = document.getElementById('roaming-bot-copy');
    const roamingBotKicker = document.getElementById('roaming-bot-kicker');
    const miniBotHead = document.getElementById('mini-bot-head');
    const miniBotEyes = document.getElementById('mini-bot-eyes');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenuList = document.getElementById('nav-menu-list');
    const navHoverPill = document.getElementById('nav-hover-pill');
    const navItemLinks = document.querySelectorAll('.nav-item-link');

    // 1. Sliding Apple Glass Pill Indicator on Desktop Navbar
    if (navHoverPill && navItemLinks.length > 0) {
        navItemLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                if (window.innerWidth <= 768) return;
                const dockRect = link.closest('.nav-pill-dock').getBoundingClientRect();
                const linkRect = link.getBoundingClientRect();
                const offsetLeft = linkRect.left - dockRect.left;

                navHoverPill.style.width = `${linkRect.width}px`;
                navHoverPill.style.transform = `translate3d(${offsetLeft}px, 0, 0)`;
                navHoverPill.style.opacity = '1';
            });
        });

        const pillDock = document.querySelector('.nav-pill-dock');
        if (pillDock) {
            pillDock.addEventListener('mouseleave', () => {
                navHoverPill.style.opacity = '0';
            });
        }
    }

    // 2. Navbar Subtle Shadow on Scroll
    window.addEventListener('scroll', () => {
        if (headerShell) {
            headerShell.classList.toggle('is-scrolled', window.scrollY > 40);
        }
    }, { passive: true });

    // 3. 60FPS Glitch-Free Autonomous Flight Engine for ZYRAC-Bot
    if (roamingBot) {
        let isHoveringBot = false;
        let isFlying = false;
        let currentSpotIdx = 0;
        let currentMsgIdx = 0;

        // Updated "New Offer Available Soon" Hinglish Announcements
        const upcomingOfferAnnouncements = [
            {
                kicker: "ZYRAC BOT // LIVE PATROL",
                text: "Ruko zara! A massive <strong>New Offer is Available Soon</strong>. Follow <strong>@zyrac__</strong> so you don't miss the drop!"
            },
            {
                kicker: "SECRET DROP BREWING",
                text: "Kuch bada aane wala hai! <strong>New Offer Available Soon</strong> for founders on <strong>@zyrac__</strong>!"
            },
            {
                kicker: "PAISA VASOOL ALERT",
                text: "Zero templates, 100% custom code—and our <strong>New Offer is Available Soon</strong>! Stay locked on <strong>@zyrac__</strong>."
            },
            {
                kicker: "INSIDER UPDATE",
                text: "Wait for it boss! <strong>New Offer Available Soon</strong>. Follow <strong>@zyrac__</strong> on Instagram for early access!"
            }
        ];

        // Calculate Safe Robot Coordinates (Robot body is 68px wide, Bubble opens inward!)
        function getRobotWaypoints() {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const isMobile = vw <= 768;

            const botW = isMobile ? 58 : 68;
            const botH = isMobile ? 74 : 82;
            const pad = isMobile ? 14 : 26;

            const leftX = pad;
            const rightX = Math.max(pad, vw - botW - pad);

            if (isMobile) {
                return [
                    { x: rightX, y: vh - botH - 18, side: 'side-right' },
                    { x: leftX,  y: vh - botH - 18, side: 'side-left'  },
                    { x: rightX, y: 84,             side: 'side-right' },
                    { x: leftX,  y: 84,             side: 'side-left'  }
                ];
            } else {
                return [
                    { x: rightX, y: vh - botH - 28, side: 'side-right' },
                    { x: leftX,  y: vh * 0.56,      side: 'side-left'  },
                    { x: rightX, y: 96,             side: 'side-right' },
                    { x: leftX,  y: vh - botH - 28, side: 'side-left'  },
                    { x: rightX, y: vh * 0.46,      side: 'side-right' },
                    { x: leftX,  y: 96,             side: 'side-left'  }
                ];
            }
        }

        let waypoints = getRobotWaypoints();
        let botPos = { x: waypoints[0].x, y: waypoints[0].y };

        function applyBotTransform(x, y, tiltDeg) {
            roamingBot.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${tiltDeg.toFixed(2)}deg)`;
        }

        // Initial placement at Bottom-Right
        applyBotTransform(botPos.x, botPos.y, 0);

        window.addEventListener('resize', () => {
            waypoints = getRobotWaypoints();
            if (!isFlying) {
                const pt = waypoints[currentSpotIdx % waypoints.length];
                botPos.x = pt.x;
                botPos.y = pt.y;
                roamingBot.classList.remove('side-left', 'side-right');
                roamingBot.classList.add(pt.side);
                applyBotTransform(botPos.x, botPos.y, 0);
            }
        }, { passive: true });

        // Pause flight when user hovers or touches the bot
        roamingBot.addEventListener('mouseenter', () => { isHoveringBot = true; });
        roamingBot.addEventListener('mouseleave', () => { isHoveringBot = false; });
        roamingBot.addEventListener('touchstart', () => { isHoveringBot = true; }, { passive: true });
        roamingBot.addEventListener('touchend', () => {
            setTimeout(() => { isHoveringBot = false; }, 3000);
        }, { passive: true });

        // Smooth Ease-In-Out Cubic function
        const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        function launchSmoothFlight() {
            if (isHoveringBot || isFlying) return;
            isFlying = true;

            waypoints = getRobotWaypoints();
            let nextIdx = Math.floor(Math.random() * waypoints.length);
            if (nextIdx === currentSpotIdx) {
                nextIdx = (nextIdx + 1) % waypoints.length;
            }
            const targetPt = waypoints[nextIdx];
            currentSpotIdx = nextIdx;

            // Step 1: Smoothly retract speech bubble & flare jet thrusters BEFORE moving
            roamingBot.classList.add('is-flying');

            setTimeout(() => {
                const startX = botPos.x;
                const startY = botPos.y;
                const deltaX = targetPt.x - startX;
                const deltaY = targetPt.y - startY;
                const flightDuration = 1850; // Silky 1.85s flight
                let startTime = null;

                // Switch bubble side while bubble is hidden so zero jump occurs!
                roamingBot.classList.remove('side-left', 'side-right');
                roamingBot.classList.add(targetPt.side);

                function stepFlight(timestamp) {
                    if (!startTime) startTime = timestamp;
                    const elapsed = timestamp - startTime;
                    const progress = Math.min(elapsed / flightDuration, 1);
                    const eased = easeInOutCubic(progress);

                    // Parabolic arc lift (-45px at mid-flight so it flies in a graceful curve!)
                    const arcLift = Math.sin(progress * Math.PI) * -45;

                    botPos.x = startX + deltaX * eased;
                    botPos.y = startY + deltaY * eased + arcLift;

                    // Smooth aerodynamic banking angle (peaks at mid-flight, returns to 0deg on landing)
                    const maxBank = deltaX < 0 ? -14 : 14;
                    const currentTilt = Math.sin(progress * Math.PI) * maxBank;

                    applyBotTransform(botPos.x, botPos.y, currentTilt);

                    if (progress < 1) {
                        requestAnimationFrame(stepFlight);
                    } else {
                        // Step 3: Landed! Level out & pop open the new message
                        botPos.x = targetPt.x;
                        botPos.y = targetPt.y;
                        applyBotTransform(botPos.x, botPos.y, 0);

                        currentMsgIdx = (currentMsgIdx + 1) % upcomingOfferAnnouncements.length;
                        if (roamingBotKicker && roamingBotCopy) {
                            roamingBotKicker.textContent = upcomingOfferAnnouncements[currentMsgIdx].kicker;
                            roamingBotCopy.innerHTML = upcomingOfferAnnouncements[currentMsgIdx].text;
                        }

                        roamingBot.classList.remove('is-flying', 'bubble-minimized');
                        isFlying = false;
                    }
                }

                requestAnimationFrame(stepFlight);
            }, 320); // Waits 320ms for bubble to retract first
        }

        // Fly to a new random spot every 8.5 seconds
        setInterval(launchSmoothFlight, 8500);

        // Clicking '×' minimizes bubble; clicking the robot avatar toggles bubble back open
        if (closeOfferBotBtn) {
            closeOfferBotBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                roamingBot.classList.add('bubble-minimized');
            });
        }
    }

    // 4. Real-Time Cursor Tracking for the Roaming Bot's Glowing Eyes
    if (miniBotHead && miniBotEyes) {
        window.addEventListener('mousemove', (e) => {
            const rect = miniBotHead.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / 280));
            const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / 280));

            miniBotEyes.style.transform = `translate3d(${(dx * 5).toFixed(1)}px, ${(dy * 3.5).toFixed(1)}px, 0)`;
            miniBotHead.style.transform = `rotateY(${(dx * 14).toFixed(1)}deg) rotateX(${(dy * -10).toFixed(1)}deg)`;
        }, { passive: true });
    }

    // 5. Mobile Hamburger Drawer Toggle
    if (mobileMenuBtn && navMenuList) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = navMenuList.classList.toggle('nav-open');
            mobileMenuBtn.classList.toggle('active', isOpen);
            mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        });

        navMenuList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenuList.classList.remove('nav-open');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* --- M. Portfolio Horizontal Slider Prev/Next SVG Buttons --- */
    const vaultScrollContainer = document.getElementById('vault-scroll-container');
    const vaultPrevBtn = document.getElementById('vault-prev-btn');
    const vaultNextBtn = document.getElementById('vault-next-btn');

    if (vaultScrollContainer && vaultPrevBtn && vaultNextBtn) {
        const getScrollStep = () => {
            const card = vaultScrollContainer.querySelector('.vault-card');
            return card ? card.offsetWidth + 32 : 380;
        };

        vaultPrevBtn.addEventListener('click', () => {
            vaultScrollContainer.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
        });

        vaultNextBtn.addEventListener('click', () => {
            vaultScrollContainer.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
        });
    }

    const web3Form = document.getElementById('zyrac-web3-form');
    const auditCard = document.getElementById('zyrac-audit-card');
    const painPills = document.querySelectorAll('.z-pain-pill');
    const hiddenPainInput = document.getElementById('z_bottleneck');
    const barFill = document.getElementById('zform-bar-fill');
    const meterText = document.getElementById('zform-meter-text');
    const feedbackBox = document.getElementById('z-form-feedback');
    const resetBtn = document.getElementById('z-reset-btn');

    if (!web3Form) return;

    const bizInput = document.getElementById('z_business');
    const webInput = document.getElementById('z_website');
    const contactInput = document.getElementById('z_contact');

    // 1. 1-Tap Meme Pain-Point Pill Selection
    painPills.forEach(pill => {
        pill.addEventListener('click', () => {
            painPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            if (hiddenPainInput) {
                hiddenPainInput.value = pill.getAttribute('data-pain');
            }
            const validPain = document.getElementById('valid-pain');
            if (validPain) validPain.classList.add('show-valid');
            updateLiveMeter();
        });
    });

    // 2. Live Progress Bar & Green "Done" Badges
    function updateLiveMeter() {
        let score = 25; // Pain point is pre-selected
        const hasBiz = bizInput && bizInput.value.trim().length > 1;
        const hasWeb = webInput && webInput.value.trim().length > 2;
        const hasContact = contactInput && contactInput.value.trim().length > 4;

        if (hasBiz) score += 35;
        if (hasContact) score += 40;

        const toggleBadge = (id, state) => {
            const el = document.getElementById(id);
            if (el) el.classList.toggle('show-valid', Boolean(state));
        };

        toggleBadge('valid-biz', hasBiz);
        toggleBadge('valid-web', hasWeb);
        toggleBadge('valid-contact', hasContact);

        if (barFill) barFill.style.width = `${score}%`;
        if (meterText) {
            meterText.textContent = score === 100 ? '100% Ready — Bhejo!' : `${score}% Complete`;
        }
    }

    [bizInput, webInput, contactInput].forEach(inp => {
        if (inp) inp.addEventListener('input', updateLiveMeter);
    });

    // 3. Submit Directly to Web3Forms -> Instant Gmail Notification
    web3Form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (feedbackBox) {
            feedbackBox.className = 'z-form-feedback';
            feedbackBox.textContent = '';
        }

        if (!bizInput.value.trim() || !contactInput.value.trim()) {
            if (feedbackBox) {
                feedbackBox.className = 'z-form-feedback is-error';
                feedbackBox.textContent = 'Boss, Business Naam aur Email/WhatsApp zaroori hai!';
            }
            return;
        }

        const submitBtn = document.getElementById('z-submit-btn');
        const btnLabel = submitBtn ? submitBtn.querySelector('.z-btn-label') : null;
        if (submitBtn) submitBtn.disabled = true;
        if (btnLabel) btnLabel.textContent = 'Sending to Faiz...';

        const formData = new FormData(web3Form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            });

            const result = await response.json();

            if (response.status === 200 && result.success) {
                if (auditCard) auditCard.classList.add('is-sent');
                web3Form.reset();
                updateLiveMeter();
            } else {
                if (feedbackBox) {
                    feedbackBox.className = 'z-form-feedback is-error';
                    feedbackBox.textContent = result.message || 'Make sure your Web3Forms Access Key is added!';
                }
            }
        } catch (error) {
            if (feedbackBox) {
                feedbackBox.className = 'z-form-feedback is-error';
                feedbackBox.textContent = 'Network glitch! Niche green WhatsApp button dabao, seedha baat karte hain.';
            }
        } finally {
            if (submitBtn) submitBtn.disabled = false;
            if (btnLabel) btnLabel.textContent = 'Bhejo Meri Audit Request';
        }
    });

    if (resetBtn && auditCard) {
        resetBtn.addEventListener('click', () => {
            auditCard.classList.remove('is-sent');
        });
    }
});
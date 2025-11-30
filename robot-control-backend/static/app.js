class RobotControlInterface {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.startAnimations();
    }

    init() {
        // Initialize canvases
        this.mapCanvas = document.getElementById('mapCanvas');
        this.mapCtx = this.mapCanvas.getContext('2d');
        this.speedCanvas = document.getElementById('speedGauge');
        this.speedCtx = this.speedCanvas.getContext('2d');
        this.radarCanvas = document.getElementById('radarCanvas');
        this.radarCtx = this.radarCanvas.getContext('2d');

        // Robot state
        this.robotState = {
            speed: 14,
            position: { x: 400, y: 200 },
            direction: 0,
            path: [],
            waypoints: [
                { x: 300, y: 150 },
                { x: 500, y: 180 },
                { x: 450, y: 280 },
                { x: 350, y: 250 }
            ],
            radarTargets: [
                { x: 80, y: 60, distance: 45 },
                { x: 120, y: 90, distance: 65 },
                { x: 60, y: 120, distance: 38 }
            ]
        };

        // Timer state
        this.timerState = {
            hours: 1,
            minutes: 59,
            seconds: 59,
            isRunning: false
        };

        // Resize canvases
        this.resizeCanvases();
        
        // Draw initial state
        this.drawMap();
        this.drawSpeedGauge();
        this.drawRadar();
    }

    resizeCanvases() {
        // Map canvas
        const mapContainer = this.mapCanvas.parentElement;
        this.mapCanvas.width = mapContainer.clientWidth;
        this.mapCanvas.height = mapContainer.clientHeight;

        // Speed and radar canvases
        this.speedCanvas.width = 200;
        this.speedCanvas.height = 200;
        this.radarCanvas.width = 200;
        this.radarCanvas.height = 200;
    }

    drawMap() {
        const ctx = this.mapCtx;
        const width = this.mapCanvas.width;
        const height = this.mapCanvas.height;

        // Clear canvas
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(0, 0, width, height);

        // Draw room layout (pixelated style)
        this.drawRoomLayout(ctx, width, height);
        
        // Draw robot path
        this.drawRobotPath(ctx);
        
        // Draw waypoints
        this.drawWaypoints(ctx);
        
        // Draw robot
        this.drawRobot(ctx);
    }

    drawRoomLayout(ctx, width, height) {
        ctx.fillStyle = '#1a1a1a';
        
        // Draw walls and obstacles (pixelated style)
        const blockSize = 8;
        const walls = [
            // Outer walls
            { x: 0, y: 0, w: width, h: blockSize * 3 },
            { x: 0, y: height - blockSize * 3, w: width, h: blockSize * 3 },
            { x: 0, y: 0, w: blockSize * 3, h: height },
            { x: width - blockSize * 3, y: 0, w: blockSize * 3, h: height },
            
            // Inner obstacles
            { x: 100, y: 50, w: blockSize * 8, h: blockSize * 6 },
            { x: 200, y: 150, w: blockSize * 6, h: blockSize * 8 },
            { x: 350, y: 80, w: blockSize * 10, h: blockSize * 4 },
            { x: 500, y: 200, w: blockSize * 6, h: blockSize * 6 },
            { x: 150, y: 280, w: blockSize * 12, h: blockSize * 4 },
        ];

        walls.forEach(wall => {
            ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
        });

        // Add pixelated texture
        ctx.fillStyle = '#333';
        for (let x = 0; x < width; x += blockSize) {
            for (let y = 0; y < height; y += blockSize) {
                if (Math.random() > 0.95) {
                    ctx.fillRect(x, y, blockSize, blockSize);
                }
            }
        }
    }

    drawRobotPath(ctx) {
        if (this.robotState.path.length < 2) return;

        ctx.strokeStyle = '#27ae60';
        ctx.lineWidth = 3;
        ctx.setLineDash([]);
        
        ctx.beginPath();
        ctx.moveTo(this.robotState.path[0].x, this.robotState.path[0].y);
        
        for (let i = 1; i < this.robotState.path.length; i++) {
            ctx.lineTo(this.robotState.path[i].x, this.robotState.path[i].y);
        }
        
        ctx.stroke();

        // Draw future path in red
        ctx.strokeStyle = '#e74c3c';
        ctx.setLineDash([5, 5]);
        
        ctx.beginPath();
        ctx.moveTo(this.robotState.position.x, this.robotState.position.y);
        
        this.robotState.waypoints.forEach(waypoint => {
            ctx.lineTo(waypoint.x, waypoint.y);
        });
        
        ctx.stroke();
        ctx.setLineDash([]);
    }

    drawWaypoints(ctx) {
        this.robotState.waypoints.forEach(waypoint => {
            // Outer circle
            ctx.strokeStyle = '#e74c3c';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(waypoint.x, waypoint.y, 15, 0, Math.PI * 2);
            ctx.stroke();
            
            // Inner circle
            ctx.strokeStyle = '#e74c3c';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(waypoint.x, waypoint.y, 8, 0, Math.PI * 2);
            ctx.stroke();
        });
    }

    drawRobot(ctx) {
        const { x, y } = this.robotState.position;
        
        // Robot body
        ctx.fillStyle = '#333';
        ctx.fillRect(x - 8, y - 8, 16, 16);
        
        // Robot center
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(x - 3, y - 3, 6, 6);
        
        // Direction indicator
        const dirX = x + Math.cos(this.robotState.direction) * 12;
        const dirY = y + Math.sin(this.robotState.direction) * 12;
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(dirX, dirY);
        ctx.stroke();
    }

    drawSpeedGauge() {
        const ctx = this.speedCtx;
        const centerX = 100;
        const centerY = 100;
        const radius = 80;
        
        // Clear canvas
        ctx.clearRect(0, 0, 200, 200);
        
        // Draw gauge background
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI * 0.75, Math.PI * 2.25);
        ctx.stroke();
        
        // Draw speed arc
        const maxSpeed = 40;
        const speedAngle = (this.robotState.speed / maxSpeed) * (Math.PI * 1.5);
        const startAngle = Math.PI * 0.75;
        
        // Speed gradient
        const gradient = ctx.createLinearGradient(0, 0, 200, 0);
        gradient.addColorStop(0, '#27ae60');
        gradient.addColorStop(0.5, '#f39c12');
        gradient.addColorStop(1, '#e74c3c');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + speedAngle);
        ctx.stroke();
        
        // Draw speed text
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.robotState.speed.toString(), centerX, centerY + 5);
        
        ctx.font = '14px Arial';
        ctx.fillText('KM/h', centerX, centerY + 25);
        
        // Draw speed markers
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        
        for (let i = 0; i <= 8; i++) {
            const angle = Math.PI * 0.75 + (i / 8) * Math.PI * 1.5;
            const value = (i / 8) * maxSpeed;
            
            const x1 = centerX + Math.cos(angle) * (radius - 15);
            const y1 = centerY + Math.sin(angle) * (radius - 15);
            const x2 = centerX + Math.cos(angle) * (radius - 25);
            const y2 = centerY + Math.sin(angle) * (radius - 25);
            
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            
            // Draw numbers
            const textX = centerX + Math.cos(angle) * (radius - 35);
            const textY = centerY + Math.sin(angle) * (radius - 35);
            ctx.fillText(Math.round(value).toString(), textX, textY);
        }
    }

    drawRadar() {
        const ctx = this.radarCtx;
        const centerX = 100;
        const centerY = 100;
        const radius = 80;
        
        // Clear canvas
        ctx.clearRect(0, 0, 200, 200);
        
        // Draw radar background
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        
        // Concentric circles
        for (let r = 20; r <= radius; r += 20) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Cross lines
        ctx.beginPath();
        ctx.moveTo(centerX - radius, centerY);
        ctx.lineTo(centerX + radius, centerY);
        ctx.moveTo(centerX, centerY - radius);
        ctx.lineTo(centerX, centerY + radius);
        ctx.stroke();
        
        // Draw radar sweep
        const sweepAngle = (Date.now() / 1000) % (Math.PI * 2);
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, 'rgba(231, 76, 60, 0.3)');
        gradient.addColorStop(1, 'rgba(231, 76, 60, 0)');
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(sweepAngle);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, 0, Math.PI / 3);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        
        // Draw targets
        this.robotState.radarTargets.forEach(target => {
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath();
            ctx.arc(target.x, target.y, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Target pulse
            const pulseRadius = 4 + Math.sin(Date.now() / 200) * 2;
            ctx.strokeStyle = '#e74c3c';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(target.x, target.y, pulseRadius, 0, Math.PI * 2);
            ctx.stroke();
        });
    }

    setupEventListeners() {
        // Navigation items
        document.querySelectorAll('.nav-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // Control buttons
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.style.background = '#e74c3c';
                setTimeout(() => {
                    btn.style.background = '#333';
                }, 200);
            });
        });

        // Main control buttons
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startMission();
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetMission();
        });

        // Timeline buttons
        document.querySelectorAll('.timeline-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('start')) {
                    this.startTimer();
                } else {
                    this.stopTimer();
                }
            });
        });

        // Joystick interaction
        this.setupJoystick();

        // Window resize
        window.addEventListener('resize', () => {
            this.resizeCanvases();
            this.drawMap();
        });

        // Dropdown changes
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.addEventListener('change', (e) => {
                console.log('Dropdown changed:', e.target.value);
            });
        });
    }

    setupJoystick() {
        const joystick = document.getElementById('joystick');
        const handle = joystick.querySelector('.joystick-handle');
        let isDragging = false;
        let startPos = { x: 0, y: 0 };

        joystick.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = joystick.getBoundingClientRect();
            startPos.x = e.clientX - rect.left - rect.width / 2;
            startPos.y = e.clientY - rect.top - rect.height / 2;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const rect = joystick.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const maxDistance = centerX - 20;

            let x = e.clientX - rect.left - centerX;
            let y = e.clientY - rect.top - centerY;

            const distance = Math.sqrt(x * x + y * y);
            if (distance > maxDistance) {
                x = (x / distance) * maxDistance;
                y = (y / distance) * maxDistance;
            }

            handle.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
            
            // Update robot direction based on joystick
            this.robotState.direction = Math.atan2(y, x);
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                handle.style.transform = 'translate(-50%, -50%)';
            }
        });
    }

    startMission() {
        console.log('Mission started');
        this.timerState.isRunning = true;
        this.updateRobotPath();
    }

    resetMission() {
        console.log('Mission reset');
        this.timerState = { hours: 1, minutes: 59, seconds: 59, isRunning: false };
        this.robotState.path = [];
        this.robotState.position = { x: 400, y: 200 };
        this.updateTimer();
        this.drawMap();
    }

    startTimer() {
        this.timerState.isRunning = true;
    }

    stopTimer() {
        this.timerState.isRunning = false;
    }

    updateTimer() {
        if (!this.timerState.isRunning) return;

        this.timerState.seconds--;
        if (this.timerState.seconds < 0) {
            this.timerState.seconds = 59;
            this.timerState.minutes--;
            if (this.timerState.minutes < 0) {
                this.timerState.minutes = 59;
                this.timerState.hours--;
                if (this.timerState.hours < 0) {
                    this.timerState.hours = 0;
                    this.timerState.minutes = 0;
                    this.timerState.seconds = 0;
                    this.timerState.isRunning = false;
                }
            }
        }

        document.getElementById('hours').textContent = this.timerState.hours;
        document.getElementById('minutes').textContent = this.timerState.minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = this.timerState.seconds.toString().padStart(2, '0');
    }

    updateRobotPath() {
        // Simulate robot movement
        if (this.robotState.waypoints.length > 0) {
            const target = this.robotState.waypoints[0];
            const dx = target.x - this.robotState.position.x;
            const dy = target.y - this.robotState.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 5) {
                const moveX = (dx / distance) * 2;
                const moveY = (dy / distance) * 2;
                
                this.robotState.position.x += moveX;
                this.robotState.position.y += moveY;
                this.robotState.path.push({ ...this.robotState.position });
                
                // Update direction
                this.robotState.direction = Math.atan2(dy, dx);
            } else {
                // Reached waypoint, remove it
                this.robotState.waypoints.shift();
            }
        }
    }

    startAnimations() {
        // Main animation loop
        const animate = () => {
            this.updateTimer();
            this.updateRobotPath();
            this.drawMap();
            this.drawSpeedGauge();
            this.drawRadar();
            
            // Simulate speed variation
//             this.robotState.speed = 14 + Math.sin(Date.now() / 2000) * 3;
            
            requestAnimationFrame(animate);
        };

        animate();

        // Timer update every second
        setInterval(() => {
            this.updateTimer();
        }, 1000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RobotControlInterface();
});

// Control panel butonları için
setupControlButtons() {
    // AUTO button
    document.querySelector('[title="AUTO"]')?.addEventListener('click', async () => {
        try {
            const response = await fetch('http://localhost:8000/api/robot/control/mode', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({mode: 'AUTO'})
            });
            console.log('Mode set to AUTO');
        } catch (error) {
            console.error('Mode change error:', error);
        }
    });

    // Speed control
    const speedControls = document.querySelectorAll('.speed-btn');
    speedControls.forEach(btn => {
        btn.addEventListener('click', async () => {
            const speed = parseFloat(btn.dataset.speed);
            await this.setSpeed(speed);
        });
    });
}

async setSpeed(speed) {
    try {
        const response = await fetch(`http://localhost:8000/api/robot/control/speed?speed=${speed}`, {
            method: 'POST'
        });
        const data = await response.json();
        console.log('Speed set:', data);
    } catch (error) {
        console.error('Speed control error:', error);
    }
}

// Navigation butonları
setupNavigation() {
    document.querySelectorAll('.nav-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            console.log(`Navigation item ${index} clicked`);
            // Aktif nav güncelle
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

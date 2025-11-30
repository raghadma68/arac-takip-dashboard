const CONFIG = {
    // Robot settings
    robot: {
        maxSpeed: 40, // km/h
        minSpeed: 0,
        defaultSpeed: 14,
        acceleration: 0.5,
        deceleration: 1.0,
        turnRadius: 2.5, // meters
        batteryWarningLevel: 20, // percentage
        heatWarningLevel: 80, // percentage
        dimensions: {
            width: 16, // pixels
            height: 16 // pixels
        }
    },

    // Mission settings
    mission: {
        defaultLocation: "Dumlupınar Üniversitesi, Kütahya, Türkiye",
        defaultMissionType: "MISSION",
        defaultControlMode: "AUTO",
        maxMissionTime: 7200, // seconds (2 hours)
        waypointTolerance: 5, // pixels
        pathUpdateInterval: 100, // milliseconds
        missionTypes: [
            "MISSION",
            "PATROL",
            "DELIVERY",
            "SURVEILLANCE",
            "CLEANING"
        ],
        controlModes: [
            "AUTO",
            "MANUAL",
            "SEMI-AUTO",
            "REMOTE"
        ]
    },

    // UI settings
    ui: {
        theme: {
            primary: "#e74c3c",
            secondary: "#27ae60",
            warning: "#f39c12",
            danger: "#e74c3c",
            background: "#000000",
            sidebar: "#1a1a1a",
            surface: "#333333",
            text: "#ffffff",
            textSecondary: "#999999"
        },
        animations: {
            enabled: true,
            duration: 300, // milliseconds
            radarSweepSpeed: 2000, // milliseconds per rotation
            pulseInterval: 200, // milliseconds
            progressUpdateInterval: 1000 // milliseconds
        },
        canvas: {
            mapRefreshRate: 60, // fps
            gaugeRefreshRate: 30, // fps
            radarRefreshRate: 24 // fps
        }
    },

    // Map settings
    map: {
        gridSize: 8, // pixels
        pixelatedStyle: true,
        showGrid: false,
        pathColor: "#27ae60",
        plannedPathColor: "#e74c3c",
        waypointColor: "#e74c3c",
        robotColor: "#333333",
        robotCenterColor: "#e74c3c",
        wallColor: "#1a1a1a",
        floorColor: "#2a2a2a",
        obstacleOpacity: 0.8
    },

    // Radar settings
    radar: {
        range: 100, // meters
        resolution: 1, // degrees
        sweepSpeed: 60, // degrees per second
        targetColors: {
            unknown: "#e74c3c",
            friendly: "#27ae60",
            neutral: "#f39c12",
            hostile: "#e74c3c"
        },
        maxTargets: 10,
        targetTimeout: 5000 // milliseconds
    },

    // Speed gauge settings
    speedGauge: {
        minAngle: 135, // degrees
        maxAngle: 405, // degrees
        majorTicks: 8,
        minorTicks: 4,
        colors: {
            low: "#27ae60",
            medium: "#f39c12",
            high: "#e74c3c"
        },
        thresholds: {
            medium: 20, // km/h
            high: 30 // km/h
        }
    },

    // Connection settings
    connection: {
        wsUrl: "ws://localhost:8000/ws",

        apiBaseUrl: "http://localhost:8000/api",
        reconnectInterval: 5000, // milliseconds
        heartbeatInterval: 30000, // milliseconds
        timeout: 10000, // milliseconds
        maxRetries: 3
    },

    // Sensor settings
    sensors: {
        gps: {
            accuracy: 1, // meters
            updateRate: 10 // Hz
        },
        lidar: {
            range: 30, // meters
            resolution: 0.25, // degrees
            accuracy: 0.03 // meters
        },
        camera: {
            resolution: "1920x1080",
            fps: 30,
            format: "h264"
        },
        imu: {
            updateRate: 100, // Hz
            gyroRange: 2000, // degrees/second
            accelRange: 16 // g
        }
    },

    // Battery settings
    battery: {
        capacity: 10000, // mAh
        voltage: 24, // V
        chargingCurrent: 5, // A
        dischargingCurrent: 10, // A
        lowBatteryThreshold: 20, // percentage
        criticalBatteryThreshold: 10, // percentage
        estimatedRuntime: 480 // minutes
    },

    // Heat management
    thermal: {
        operatingRange: {
            min: -10, // Celsius
            max: 60 // Celsius
        },
        warningThreshold: 50, // Celsius
        criticalThreshold: 70, // Celsius
        coolingFanThreshold: 40 // Celsius
    },

    // Control settings
    controls: {
        joystick: {
            deadzone: 0.1, // percentage
            sensitivity: 1.0,
            returnToCenter: true,
            returnSpeed: 0.1
        },
        buttons: {
            doubleClickDelay: 300, // milliseconds
            longPressDelay: 1000, // milliseconds
            hapticFeedback: true
        }
    },

    // Audio settings
    audio: {
        enabled: true,
        volume: 0.5,
        sounds: {
            button: "click.wav",
            warning: "warning.wav",
            error: "error.wav",
            success: "success.wav",
            notification: "notification.wav"
        }
    },

    // Logging settings
    logging: {
        level: "info", // debug, info, warn, error
        maxLogSize: 10, // MB
        retention: 7, // days
        remoteLogging: false,
        categories: {
            robot: true,
            ui: true,
            connection: true,
            sensors: true,
            mission: true
        }
    },

    // Development settings
    development: {
        debugMode: false,
        showFPS: false,
        enableConsoleLogging: true,
        mockData: false,
        simulationMode: true
    },

    // Default waypoints for testing
    defaultWaypoints: [
        { x: 300, y: 150, id: "wp1", type: "navigation" },
        { x: 500, y: 180, id: "wp2", type: "checkpoint" },
        { x: 450, y: 280, id: "wp3", type: "navigation" },
        { x: 350, y: 250, id: "wp4", type: "destination" }
    ],

    // Default radar targets for simulation
    defaultRadarTargets: [
        { 
            x: 80, 
            y: 60, 
            distance: 45, 
            bearing: 75, 
            type: "unknown",
            velocity: { x: 0, y: 0 },
            timestamp: Date.now()
        },
        { 
            x: 120, 
            y: 90, 
            distance: 65, 
            bearing: 120, 
            type: "friendly",
            velocity: { x: -1, y: 0 },
            timestamp: Date.now()
        },
        { 
            x: 60, 
            y: 120, 
            distance: 38, 
            bearing: 45, 
            type: "neutral",
            velocity: { x: 0, y: 1 },
            timestamp: Date.now()
        }
    ],

    // Room layout configuration
    roomLayout: {
        walls: [
            { x: 0, y: 0, w: "100%", h: 24, type: "outer" },
            { x: 0, y: "100%-24", w: "100%", h: 24, type: "outer" },
            { x: 0, y: 0, w: 24, h: "100%", type: "outer" },
            { x: "100%-24", y: 0, w: 24, h: "100%", type: "outer" }
        ],
        obstacles: [
            { x: 100, y: 50, w: 64, h: 48, type: "furniture" },
            { x: 200, y: 150, w: 48, h: 64, type: "furniture" },
            { x: 350, y: 80, w: 80, h: 32, type: "furniture" },
            { x: 500, y: 200, w: 48, h: 48, type: "furniture" },
            { x: 150, y: 280, w: 96, h: 32, type: "furniture" }
        ],
        doors: [
            { x: 200, y: 0, w: 32, h: 8, open: true },
            { x: 600, y: 0, w: 32, h: 8, open: false }
        ]
    },

    // API endpoints
    api: {
        baseUrl: "http://localhost:8000/api",
        endpoints: {
            status: "/robot/status",
            mission: "/mission",
            waypoints: "/waypoints",
            sensors: "/sensors",
            logs: "/logs",
            config: "/config"
        },
        timeout: 5000, // milliseconds
        retries: 3
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}

// Configuration validation
function validateConfig() {
    const errors = [];
    
    // Validate required properties
    if (!CONFIG.robot || typeof CONFIG.robot.maxSpeed !== 'number') {
        errors.push('Invalid robot.maxSpeed configuration');
    }
    
    if (!CONFIG.ui || !CONFIG.ui.theme || typeof CONFIG.ui.theme.primary !== 'string') {
        errors.push('Invalid UI theme configuration');
    }
    
    if (!CONFIG.mission || !Array.isArray(CONFIG.mission.missionTypes)) {
        errors.push('Invalid mission configuration');
    }
    
    // Log validation errors
    if (errors.length > 0) {
        console.error('Configuration validation errors:', errors);
        return false;
    }
    
    console.log('Configuration validated successfully');
    return true;
}

// Initialize configuration
document.addEventListener('DOMContentLoaded', () => {
    validateConfig();
    
    // Apply theme to CSS variables
    if (CONFIG.ui.theme) {
        const root = document.documentElement;
        Object.entries(CONFIG.ui.theme).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });
    }
    
    // Set development mode
    if (CONFIG.development.debugMode) {
        console.log('Debug mode enabled');
        window.DEBUG = true;
    }
});

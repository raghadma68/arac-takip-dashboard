# 🚗 Arac Takip Dashboard

A web-based dashboard for monitoring and controlling a robot/vehicle.  
This project combines a **React** frontend with a **Python backend** to provide real-time control, status visualization, and an easy-to-use interface.

---

## 🌟 Features

- 🔹 Interactive web dashboard built with React  
- 🔹 Robot/vehicle control panel (via backend API)  
- 🔹 Live status & basic telemetry view  
- 🔹 Simple, clean UI for controlling and monitoring  
- 🔹 Easy to extend with new features (maps, logs, etc.)

---

## 🏗 Project Structure

```bash
arac-takip-dashboard/
├─ public/                  # Static assets (HTML, icons, manifest, etc.)
├─ src/                     # React frontend source code
│  ├─ App.js                # Main dashboard component
│  ├─ App.css               # Styling for the dashboard
│  ├─ index.js              # React entry point
│  └─ ...                   # Other React components & utilities
├─ robot-control-backend/   # Python backend for robot control
│  ├─ static/               # Static files (HTML, JS, CSS) for backend UI
│  └─ schemas/              # Python schemas / models
├─ package.json             # Frontend dependencies and scripts
├─ craco.config.js          # CRA configuration override (if used)
└─ README.md                # You are here 🚀
🛠 Tech Stack

Frontend:

React

JavaScript

HTML, CSS

Backend:

Python (robot-control-backend)

Tools:

Git & GitHub

VS Code


🚀 Getting Started
1️⃣ Clone the repository
git clone https://github.com/raghadma68/arac-takip-dashboard.git
cd arac-takip-dashboard

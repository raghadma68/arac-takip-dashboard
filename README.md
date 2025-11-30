# 🚗 Arac Takip Dashboard
A web-based dashboard for monitoring and controlling a robot/vehicle.  
This project includes a React frontend and a Python backend, providing real-time control, sensor data display, and a clean user-friendly interface.

---

## 🌟 Features
- Interactive React dashboard UI  
- Real-time robot/vehicle control panel  
- Live sensor & telemetry display  
- Minimal and responsive interface  
- Simple backend API for hardware communication  
- Easy to extend (maps, logs, streaming, etc.)

---

## 🏗 Project Structure
arac-takip-dashboard/
- public/  
- src/  
  - App.js  
  - App.css  
  - index.js  
- robot-control-backend/  
  - static/  
  - schemas/  
  - main.py (if used)  
- package.json  
- craco.config.js  
- README.md  

---

# 🚀 Getting Started

## 1️⃣ Clone the Repository
git clone https://github.com/raghadma68/arac-takip-dashboard.git  
cd arac-takip-dashboard  

---

# 🖥️ Frontend (React) Setup

## 2️⃣ Install Dependencies
npm install

## 3️⃣ Run the Dashboard
npm start  
Dashboard URL: http://localhost:3000

---

# 🐍 Backend (Python) Setup

Folder path: robot-control-backend/

## 1️⃣ Navigate to backend
cd robot-control-backend

## 2️⃣ Create virtual environment
python -m venv venv

### Activate (Windows)
venv\Scripts\activate

### Activate (Mac/Linux)
source venv/bin/activate

## 3️⃣ Install backend dependencies
pip install -r requirements.txt  
أو  
pip install flask

## 4️⃣ Run backend
python main.py  
Backend URL: http://localhost:5000

---

# 🔗 Connecting Frontend & Backend
Make sure API URLs inside React match your backend URL.  
Example: http://localhost:5000/api/command

---

## 📚 Future Improvements
- Add real-time map tracking  
- Add joystick controller  
- Add camera streaming  
- Add WebSocket communication  
- Add logs & error notifications  
- Improve UI/UX  

---

## 👩‍💻 Author
**Ragad Mansour**  
Software Engineering Student  
Interested in web development, robotics, Arduino, and building real-world systems.

---

⭐ If you like the project, give it a star on GitHub! ⭐

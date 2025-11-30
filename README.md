# 🚗 Arac Takip Dashboard

A web-based dashboard for monitoring and controlling a robot/vehicle.  
It includes a **React frontend** and a **Python backend**, providing real-time control, sensor visualization, and a clean user interface.

---

## 🌟 Features
• Interactive React dashboard  
• Real-time robot/vehicle control  
• Live sensor & telemetry display  
• Modern and responsive UI  
• Simple backend API for communication  
• Easy to extend (maps, logs, camera, WebSocket, etc.)

---

## 🏗 Project Structure
arac-takip-dashboard  
• public/ (static files)  
• src/ (React source code)  
  - App.js  
  - App.css  
  - index.js  
• robot-control-backend/ (Python backend)  
  - static/  
  - schemas/  
  - main.py  
• package.json  
• craco.config.js  
• README.md  

---

# 🚀 Frontend Setup (React)

### 1. Clone the repository  
git clone https://github.com/raghadma68/arac-takip-dashboard.git  
cd arac-takip-dashboard

### 2. Install dependencies  
npm install

### 3. Start the React app  
npm start  
Dashboard runs at: http://localhost:3000

---

# 🐍 Backend Setup (Python)

### 1. Go to backend folder  
cd robot-control-backend

### 2. Create virtual environment  
python -m venv venv

### 3. Activate the environment  
Windows: venv\Scripts\activate  
Mac/Linux: source venv/bin/activate

### 4. Install backend requirements  
pip install -r requirements.txt  
or install manually (example): pip install flask

### 5. Run the backend  
python main.py  
Backend runs at: http://localhost:5000

---

# 🔗 Connecting Frontend & Backend
Make sure the API URLs inside React match your backend URL.  
Example: http://localhost:5000/api/command

---

## 📚 Future Improvements
• Real-time map tracking  
• Joystick controller  
• Camera streaming  
• WebSocket live data  
• Logs & notifications  
• Improved UI/UX  

---

## 👩‍💻 Author
**Ragad Mansour**  
Software Engineering Student  
Interested in web development, robotics, and Arduino projects.

---

⭐ If you like this project, give it a star on GitHub! ⭐

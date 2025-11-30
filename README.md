rac Takip Dashboard

A web-based dashboard for monitoring and controlling a robot/vehicle.
This project includes a React frontend and a Python backend.

Features

Dashboard UI built with React

Robot/vehicle control

Live sensor data

Clean and simple structure

Project Structure

arac-takip-dashboard
• public/
• src/
• robot-control-backend/
• package.json
• craco.config.js
• README.md

🚀 Frontend Setup
1. Clone the project
git clone https://github.com/raghadma68/arac-takip-dashboard.git
cd arac-takip-dashboard

2. Install dependencies
npm install

3. Start the React app
npm start


Dashboard runs at:
http://localhost:3000

🐍 Backend Setup
1. Go to backend folder
cd robot-control-backend

2. Create virtual environment
python -m venv venv

3. Activate it

Windows:

venv\Scripts\activate


Mac/Linux:

source venv/bin/activate

4. Install backend packages
pip install -r requirements.txt


or

pip install flask

5. Run backend
python main.py


Backend runs at:
http://localhost:5000

Connecting Frontend & Backend

Make sure your frontend uses the correct API URL:
http://localhost:5000/api/command

Author

Ragad Mansour
Software Engineering Student

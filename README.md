# 🚗 Arac Takip Dashboard

Web tabanlı bir robot/araç izleme ve kontrol paneli.  
React tabanlı bir arayüz ve Python tabanlı bir backend ile gerçek zamanlı kontrol, durum görüntüleme ve temiz bir kullanıcı deneyimi sunar.

---

## 🌟 Özellikler
- React ile hazırlanmış etkileşimli kontrol paneli  
- Gerçek zamanlı robot/araç kontrolü  
- Sensör verilerinin canlı görüntülenmesi  
- Modern ve duyarlı (responsive) arayüz  
- Genişletilebilir yapı (harita, log, kamera yayını vb.)

---

## 🏗 Proje Yapısı
arac-takip-dashboard  
• public/ (statik dosyalar)  
• src/ (React kaynak kodu)  
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

# 🚀 Başlangıç (Frontend)

### 1. Depoyu klonla
git clone https://github.com/raghadma68/arac-takip-dashboard.git  
cd arac-takip-dashboard

### 2. Bağımlılıkları yükle
npm install

### 3. Uygulamayı başlat
npm start  
Uygulama adresi: http://localhost:3000

---

# 🐍 Backend (Python)

### 1. Backend klasörüne geç
cd robot-control-backend

### 2. Sanal ortam oluştur
python -m venv venv

### 3. Sanal ortamı aktif et  
Windows: venv\Scripts\activate  
Mac/Linux: source venv/bin/activate

### 4. Gerekli paketleri yükle
pip install -r requirements.txt  
ya da  
pip install flask

### 5. Backend’i çalıştır
python main.py  
Backend adresi: http://localhost:5000

---

# 🔗 Frontend & Backend Bağlantısı
React içinde kullanılan API linkleri backend adresi ile uyumlu olmalıdır.  
Örnek: http://localhost:5000/api/command

---

## 📚 Gelecek Geliştirmeler
- Canlı harita takibi  
- Joystick kontrolü  
- Kamera yayını  
- WebSocket ile gerçek zamanlı veri  
- Log ve bildirim sistemi  
- Geliştirilmiş arayüz tasarımı  

---

## 👩‍💻 Geliştirici
**Ragad Mansour**  
Software Engineering Student  
Web geliştirme, robotik ve Arduino ile ilgileniyor.

---

⭐ Proje hoşuna gittiyse bir yıldız bırakmayı unutma! ⭐

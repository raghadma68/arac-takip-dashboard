import React, { useState, useEffect } from 'react';
import { Battery, Clock, QrCode, Wifi, WifiOff, RefreshCw } from 'lucide-react';

const VehicleDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  const [sensorData, setSensorData] = useState({
    temperature: 36.5,
    signal: 85,
    distance: 2.34,
    power: 95,
    vibration: 0.12,
    cpu: 45,
    memory: 78,
    disk: 65
  });
  const [robotStatus, setRobotStatus] = useState('stopped');
  const [commandOutput, setCommandOutput] = useState([]);
  const [isExecutingCommand, setIsExecutingCommand] = useState(false);
  const [showChargeLimitInput, setShowChargeLimitInput] = useState(false);
  const [tempChargeLimit, setTempChargeLimit] = useState(20);

  // API Base URL
  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sensör verilerini simüle et
  useEffect(() => {
    const sensorTimer = setInterval(() => {
      setSensorData(prev => ({
        temperature: Math.max(30, Math.min(45, prev.temperature + (Math.random() - 0.5) * 2)),
        signal: Math.max(20, Math.min(100, prev.signal + (Math.random() - 0.5) * 10)),
        distance: Math.max(0.5, Math.min(10, prev.distance + (Math.random() - 0.5) * 1)),
        power: Math.max(60, Math.min(120, prev.power + (Math.random() - 0.5) * 8)),
        vibration: Math.max(0.05, Math.min(0.5, prev.vibration + (Math.random() - 0.5) * 0.1)),
        cpu: Math.max(20, Math.min(80, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(50, Math.min(95, prev.memory + (Math.random() - 0.5) * 5)),
        disk: Math.max(40, Math.min(90, prev.disk + (Math.random() - 0.5) * 3))
      }));
    }, 2000);
    
    return () => clearInterval(sensorTimer);
  }, []);

  // Robot kontrol fonksiyonları
  const addToOutput = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString('tr-TR');
    const newEntry = {
      id: Date.now(),
      timestamp,
      message,
      type
    };
    setCommandOutput(prev => [newEntry, ...prev.slice(0, 19)]);
  };

  const startRobot = async () => {
    try {
      setIsExecutingCommand(true);
      setRobotStatus('starting');
      addToOutput('Robot başlatılıyor...', 'info');

      const response = await fetch(`${API_BASE}/robot/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setRobotStatus('running');
        addToOutput('Robot başarıyla başlatıldı', 'success');
        addToOutput(`${data.message || 'Sistem aktif'}`, 'info');
        
        if (vehicleData) {
          setVehicleData(prev => ({ ...prev, status: 'active' }));
        }
      } else {
        throw new Error(data.error || 'Başlatma başarısız');
      }
    } catch (err) {
      setRobotStatus('stopped');
      addToOutput(`Hata: ${err.message}`, 'error');
      console.error('Robot start error:', err);
    } finally {
      setIsExecutingCommand(false);
    }
  };

  const stopRobot = async () => {
    try {
      setIsExecutingCommand(true);
      setRobotStatus('stopping');
      addToOutput('Robot durduruluyor...', 'warning');

      const response = await fetch(`${API_BASE}/robot/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setRobotStatus('stopped');
        addToOutput('Robot başarıyla durduruldu', 'success');
        addToOutput(`${data.message || 'Sistem güvenli durumda'}`, 'info');
        
        if (vehicleData) {
          setVehicleData(prev => ({ ...prev, status: 'idle' }));
        }
      } else {
        throw new Error(data.error || 'Durdurma başarısız');
      }
    } catch (err) {
      addToOutput(`Hata: ${err.message}`, 'error');
      console.error('Robot stop error:', err);
    } finally {
      setIsExecutingCommand(false);
    }
  };

  const emergencyStop = async () => {
    try {
      setIsExecutingCommand(true);
      addToOutput('ACİL DURDURMA AKTİF!', 'error');

      const response = await fetch(`${API_BASE}/robot/emergency-stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      setRobotStatus('stopped');
      addToOutput('Acil durdurma tamamlandı', 'error');
      addToOutput(`${data.message || 'Sistem güvenlik moduna alındı'}`, 'warning');
      
      if (vehicleData) {
        setVehicleData(prev => ({ ...prev, status: 'maintenance' }));
      }
    } catch (err) {
      addToOutput(`Acil durdurma hatası: ${err.message}`, 'error');
    } finally {
      setIsExecutingCommand(false);
    }
  };

  const clearOutput = () => {
    setCommandOutput([]);
    addToOutput('Output temizlendi', 'info');
  };

  // API'den veri çekme
  const fetchVehicleData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE}/vehicle`);
      const data = await response.json();
      
      if (data.success) {
        setVehicleData(data.data);
        setConnected(true);
      } else {
        setError('Veri alınamadı');
        setConnected(false);
      }
    } catch (err) {
      setError(`API Hatası: ${err.message}`);
      setConnected(false);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicleData();
    const interval = setInterval(fetchVehicleData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Şarj limiti güncelleme
  const updateChargeLimit = async (newLimit) => {
    try {
      const response = await fetch(`${API_BASE}/vehicle/charge-limit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ minChargeLimit: newLimit })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setVehicleData(prev => ({ ...prev, minChargeLimit: newLimit }));
        setShowChargeLimitInput(false);
        addToOutput(`Şarj limiti %${newLimit} olarak güncellendi`, 'success');
      } else {
        addToOutput('Şarj limiti güncellenirken hata oluştu', 'error');
      }
    } catch (err) {
      addToOutput(`Şarj limiti hatası: ${err.message}`, 'error');
    }
  };

  // Çalışma saatini 1 saat olarak ayarla
  const formatWorkingHours = (hours) => {
    const adjustedHours = 1.0; // 1 saat çalışma
    const totalHours = Math.floor(adjustedHours);
    const minutes = Math.floor((adjustedHours % 1) * 60);
    return `${totalHours}s ${minutes}dk`;
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f1419 0%, #1c2128 50%, #22272e 100%)',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    header: {
      marginBottom: '32px',
      color: 'white'
    },
    title: {
      fontSize: '32px',
      fontWeight: '600',
      marginBottom: '8px',
      margin: 0,
      color: '#f0f6fc',
      letterSpacing: '-0.025em'
    },
    subtitle: {
      color: '#8b949e',
      marginBottom: '12px',
      fontSize: '16px',
      fontWeight: '400'
    },
    timestamp: {
      color: '#656d76',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontWeight: '400'
    },
    connectionStatus: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px',
      marginTop: '4px'
    },
    refreshButton: {
      background: 'rgba(33, 38, 45, 0.8)',
      border: '1px solid #30363d',
      borderRadius: '8px',
      padding: '10px 16px',
      color: '#f0f6fc',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s cubic-bezier(0.3, 0, 0.5, 1)',
      backdropFilter: 'blur(12px)'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    },
    card: {
      background: 'linear-gradient(145deg, rgba(33, 38, 45, 0.95) 0%, rgba(22, 27, 34, 0.95) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid rgba(48, 54, 61, 0.5)',
      color: '#f0f6fc',
      boxShadow: '0 8px 32px rgba(1, 4, 9, 0.12), 0 1px 2px rgba(1, 4, 9, 0.24)',
      transition: 'all 0.2s cubic-bezier(0.3, 0, 0.5, 1)'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px'
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: '600',
      margin: 0,
      color: '#f0f6fc',
      letterSpacing: '-0.01em'
    },
    statusBadge: {
      fontSize: '12px',
      padding: '6px 12px',
      borderRadius: '16px',
      background: 'rgba(46, 160, 67, 0.15)',
      border: '1px solid rgba(46, 160, 67, 0.3)',
      color: '#3fb950',
      fontWeight: '500'
    },
    infoBox: {
      marginBottom: '20px',
      padding: '16px',
      background: 'rgba(48, 54, 61, 0.3)',
      borderRadius: '8px',
      border: '1px solid rgba(48, 54, 61, 0.5)'
    },
    infoHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '12px'
    },
    infoTitle: {
      marginLeft: '10px',
      fontWeight: '500',
      color: '#e6edf3',
      fontSize: '14px'
    },
    qrCode: {
      fontSize: '16px',
      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
      color: '#79c0ff',
      fontWeight: '500'
    },
    vehicleId: {
      fontSize: '12px',
      color: '#8b949e',
      marginTop: '6px',
      fontWeight: '400'
    },
    batteryContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px'
    },
    batteryPercentage: {
      fontSize: '28px',
      fontWeight: '600',
      letterSpacing: '-0.02em'
    },
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: 'rgba(48, 54, 61, 0.8)',
      borderRadius: '4px',
      marginBottom: '8px',
      overflow: 'hidden',
      border: '1px solid rgba(48, 54, 61, 0.6)'
    },
    progressFill: {
      height: '100%',
      borderRadius: '4px',
      transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    progressLabels: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      color: '#8b949e',
      fontWeight: '400'
    },
    workingHours: {
      fontSize: '28px',
      fontWeight: '600',
      color: '#58a6ff',
      letterSpacing: '-0.02em'
    },
    monthlyHours: {
      fontSize: '12px',
      color: '#8b949e',
      marginTop: '6px',
      fontWeight: '400'
    },
    loadingSpinner: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      fontSize: '16px',
      color: '#8b949e'
    },
    errorMessage: {
      background: 'rgba(248, 81, 73, 0.1)',
      border: '1px solid rgba(248, 81, 73, 0.3)',
      borderRadius: '8px',
      padding: '16px',
      margin: '16px 0',
      color: '#f85149',
      textAlign: 'center',
      fontWeight: '500'
    }
  };

  const getBatteryColor = (percentage) => {
    if (percentage > 50) return '#3fb950';
    if (percentage > 25) return '#d29922';
    return '#f85149';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "active": return '#3fb950';
      case "charging": return '#58a6ff';
      case "maintenance": return '#d29922';
      case "idle": return '#8b949e';
      default: return '#8b949e';
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingSpinner}>
          <RefreshCw size={24} color="#ff9999" style={{marginRight: '8px'}} />
          Veriler yükleniyor...
        </div>
      </div>
    );
  }

  if (error && !vehicleData) {
    return (
      <div style={styles.container}>
        <div style={styles.errorMessage}>
          <h3>Bağlantı Hatası</h3>
          <p>{error}</p>
          <button style={styles.refreshButton} onClick={fetchVehicleData}>
            <RefreshCw size={16} color="#ff9999" />
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!vehicleData) {
    return (
      <div style={styles.container}>
        <div style={styles.errorMessage}>
          Veri bulunamadı
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Araç Takip Sistemi</h1>
            <p style={styles.subtitle}>Gerçek zamanlı araç durumu ve performans analizi</p>
            <div style={styles.timestamp}>
              time: {currentTime.toLocaleString('tr-TR')}
              <div style={styles.connectionStatus}>
                {connected ? (
                  <>
                    <Wifi size={12} color="#3fb950" />
                    <span style={{color: '#3fb950'}}>Bağlı</span>
                  </>
                ) : (
                  <>
                    <WifiOff size={12} color="#f85149" />
                    <span style={{color: '#f85149'}}>Bağlantı Yok</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* Ana Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '24px',
          marginBottom: '32px'
        }}>
          
          {/* Robot Analiz Kartı */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={{...styles.cardTitle, display: 'flex', alignItems: 'center'}}>
                Robot Analiz Merkezi
              </h2>
              <div style={{fontSize: '14px', color: '#ff9999'}}>
                Gerçek Zamanlı Sistem Durumu
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              
              {/* Facility Floor Plan */}
              <div style={{
                background: 'rgba(48, 54, 61, 0.3)',
                borderRadius: '8px',
                border: '1px solid rgba(48, 54, 61, 0.5)',
                padding: '16px'
              }}>
                <h3 style={{color: '#e6edf3', marginBottom: '16px', fontSize: '16px', fontWeight: '500'}}>Tesis Haritası</h3>
                
                {/* Floor Plan Layout */}
                <div style={{
                  width: '100%',
                  height: '220px',
                  position: 'relative',
                  background: '#f6f8fa',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  border: '1px solid #d0d7de'
                }}>
                  <svg width="280" height="200" viewBox="0 0 280 200">
                    {/* Main Facility Outline */}
                    <rect x="10" y="10" width="260" height="180" 
                          fill="#ffffff" stroke="#656d76" strokeWidth="2"/>
                    
                    {/* Storage Bays - Left Side */}
                    <rect x="10" y="20" width="20" height="25" fill="#ffffff" stroke="#656d76" strokeWidth="1.5"/>
                    <rect x="10" y="55" width="20" height="25" fill="#ffffff" stroke="#656d76" strokeWidth="1.5"/>
                    <rect x="10" y="90" width="20" height="25" fill="#ffffff" stroke="#656d76" strokeWidth="1.5"/>
                    <rect x="10" y="125" width="20" height="25" fill="#ffffff" stroke="#656d76" strokeWidth="1.5"/>
                    <rect x="10" y="160" width="20" height="20" fill="#ffffff" stroke="#656d76" strokeWidth="1.5"/>
                    
                    {/* Storage Bays - Right Side */}
                    <rect x="250" y="20" width="20" height="25" fill="#ffffff" stroke="#656d76" strokeWidth="1.5"/>
                    <rect x="250" y="55" width="20" height="25" fill="#ffffff" stroke="#656d76" strokeWidth="1.5"/>
                    <rect x="250" y="90" width="20" height="25" fill="#ffffff" stroke="#656d76" strokeWidth="1.5"/>
                    <rect x="250" y="125" width="20" height="25" fill="#ffffff" stroke="#656d76" strokeWidth="1.5"/>
                    <rect x="250" y="160" width="20" height="20" fill="#ffffff" stroke="#656d76" strokeWidth="1.5"/>
                    
                    {/* Corner Storage Units */}
                    <rect x="10" y="10" width="25" height="20" fill="#ffffff" stroke="#656d76" strokeWidth="1.5"/>
                    <rect x="245" y="10" width="25" height="20" fill="#ffffff" stroke="#656d76" strokeWidth="1.5"/>
                    
                    {/* Robot Current Position */}
                    <circle cx="140" cy="60" r="8" fill="none" stroke="#58a6ff" strokeWidth="2">
                      <animate attributeName="r" values="8;11;8" dur="2s" repeatCount="indefinite"/>
                      <animate attributeName="stroke-opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="140" cy="60" r="4" fill="#58a6ff"/>
                    
                    {/* Target/Waypoint Position */}
                    <circle cx="140" cy="140" r="8" fill="none" stroke="#3fb950" strokeWidth="2">
                      <animate attributeName="r" values="8;11;8" dur="3s" repeatCount="indefinite"/>
                      <animate attributeName="stroke-opacity" values="1;0.4;1" dur="3s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="140" cy="140" r="4" fill="#3fb950"/>
                    
                    {/* Movement Path */}
                    <line x1="140" y1="60" x2="140" y2="140" 
                          stroke="#8b949e" strokeWidth="2" strokeDasharray="4,4" opacity="0.6">
                      <animate attributeName="stroke-dashoffset" values="0;-16" dur="2s" repeatCount="indefinite"/>
                    </line>
                    
                    {/* Zone Labels */}
                    <text x="50" y="25" fill="#656d76" fontSize="9" textAnchor="middle" fontWeight="500">DEPO A</text>
                    <text x="230" y="25" fill="#656d76" fontSize="9" textAnchor="middle" fontWeight="500">DEPO B</text>
                    <text x="140" y="25" fill="#24292f" fontSize="11" textAnchor="middle" fontWeight="600">ANA ÇALIŞMA ALANI</text>
                    
                    {/* Position Labels */}
                    <text x="155" y="55" fill="#58a6ff" fontSize="8" fontWeight="600">ROBOT</text>
                    <text x="155" y="145" fill="#3fb950" fontSize="8" fontWeight="600">HEDEF</text>
                  </svg>
                </div>
                
                {/* Location Status */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  fontSize: '12px'
                }}>
                  <div style={{
                    padding: '10px',
                    background: 'rgba(88, 166, 255, 0.1)',
                    borderRadius: '6px',
                    textAlign: 'center',
                    border: '1px solid rgba(88, 166, 255, 0.2)'
                  }}>
                    <div style={{color: '#8b949e', marginBottom: '4px', fontSize: '11px'}}>Mevcut Konum</div>
                    <div style={{color: '#58a6ff', fontWeight: '600', fontSize: '13px'}}>
                      X: 140, Y: 60
                    </div>
                    <div style={{color: '#656d76', fontSize: '10px', marginTop: '2px'}}>Ana Çalışma Alanı</div>
                  </div>
                  <div style={{
                    padding: '10px',
                    background: 'rgba(63, 185, 80, 0.1)',
                    borderRadius: '6px',
                    textAlign: 'center',
                    border: '1px solid rgba(63, 185, 80, 0.2)'
                  }}>
                    <div style={{color: '#8b949e', marginBottom: '4px', fontSize: '11px'}}>Hedef Konum</div>
                    <div style={{color: '#3fb950', fontWeight: '600', fontSize: '13px'}}>
                      X: 140, Y: 140
                    </div>
                    <div style={{color: '#656d76', fontSize: '10px', marginTop: '2px'}}>Görev Noktası</div>
                  </div>
                </div>
                
                {/* Navigation Info */}
                <div style={{
                  marginTop: '14px',
                  padding: '10px',
                  background: 'rgba(33, 38, 45, 0.4)',
                  borderRadius: '6px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '8px',
                  fontSize: '11px',
                  textAlign: 'center',
                  border: '1px solid rgba(48, 54, 61, 0.5)'
                }}>
                  <div>
                    <div style={{color: '#8b949e', marginBottom: '2px'}}>Mesafe</div>
                    <div style={{color: '#e6edf3', fontWeight: '500'}}>80m</div>
                  </div>
                  <div>
                    <div style={{color: '#8b949e', marginBottom: '2px'}}>Yön</div>
                    <div style={{color: '#e6edf3', fontWeight: '500'}}>Güney</div>
                  </div>
                  <div>
                    <div style={{color: '#8b949e', marginBottom: '2px'}}>ETA</div>
                    <div style={{color: '#e6edf3', fontWeight: '500'}}>2dk</div>
                  </div>
                </div>
              </div>

              {/* Robot Kontrol Paneli */}
              <div style={{
                background: 'rgba(48, 54, 61, 0.3)',
                borderRadius: '8px',
                border: '1px solid rgba(48, 54, 61, 0.5)',
                padding: '16px'
              }}>
                <h3 style={{color: '#e6edf3', marginBottom: '16px', fontSize: '16px', fontWeight: '500'}}>Robot Kontrolü</h3>
                
                {/* Durum Göstergesi */}
                <div style={{
                  padding: '12px',
                  background: 'rgba(33, 38, 45, 0.6)',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  textAlign: 'center',
                  border: '1px solid rgba(48, 54, 61, 0.5)'
                }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: robotStatus === 'running' ? '#3fb950' : 
                           robotStatus === 'starting' ? '#d29922' :
                           robotStatus === 'stopping' ? '#d29922' : '#8b949e',
                    marginBottom: '4px'
                  }}>
                    {robotStatus === 'running' ? 'ÇALIŞIYOR' :
                     robotStatus === 'starting' ? 'BAŞLATIYOR' :
                     robotStatus === 'stopping' ? 'DURDURUYOR' : 'DURDURULDU'}
                  </div>
                  <div style={{fontSize: '11px', color: '#656d76', fontWeight: '400'}}>
                    time: {currentTime.toLocaleTimeString('tr-TR')}
                  </div>
                </div>

                {/* Kontrol Butonları */}
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px'}}>
                  <button
                    onClick={startRobot}
                    disabled={isExecutingCommand || robotStatus === 'running'}
                    style={{
                      padding: '12px 8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(63, 185, 80, 0.4)',
                      background: robotStatus === 'running' || isExecutingCommand ? 
                        'rgba(48, 54, 61, 0.5)' : 'rgba(63, 185, 80, 0.15)',
                      color: robotStatus === 'running' || isExecutingCommand ? '#656d76' : '#3fb950',
                      cursor: robotStatus === 'running' || isExecutingCommand ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      transition: 'all 0.2s cubic-bezier(0.3, 0, 0.5, 1)',
                      opacity: robotStatus === 'running' || isExecutingCommand ? 0.6 : 1
                    }}
                  >
                    {isExecutingCommand && robotStatus === 'starting' ? '⏳' : '🚀'} START
                  </button>

                  <button
                    onClick={stopRobot}
                    disabled={isExecutingCommand || robotStatus === 'stopped'}
                    style={{
                      padding: '12px 8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(248, 81, 73, 0.4)',
                      background: robotStatus === 'stopped' || isExecutingCommand ? 
                        'rgba(48, 54, 61, 0.5)' : 'rgba(248, 81, 73, 0.15)',
                      color: robotStatus === 'stopped' || isExecutingCommand ? '#656d76' : '#f85149',
                      cursor: robotStatus === 'stopped' || isExecutingCommand ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      transition: 'all 0.2s cubic-bezier(0.3, 0, 0.5, 1)',
                      opacity: robotStatus === 'stopped' || isExecutingCommand ? 0.6 : 1
                    }}
                  >
                    {isExecutingCommand && robotStatus === 'stopping' ? '⏳' : '🛑'} STOP
                  </button>
                </div>

                {/* Acil Durdur Butonu */}
                <button
                  onClick={emergencyStop}
                  disabled={isExecutingCommand}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(248, 81, 73, 0.6)',
                    background: 'rgba(248, 81, 73, 0.2)',
                    color: '#f85149',
                    cursor: isExecutingCommand ? 'not-allowed' : 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginBottom: '16px',
                    transition: 'all 0.2s cubic-bezier(0.3, 0, 0.5, 1)',
                    opacity: isExecutingCommand ? 0.6 : 1
                  }}
                >
                  ACİL DURDUR
                </button>

                {/* Sensör Okumaları */}
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '11px'}}>
                  <div style={{
                    padding: '8px',
                    background: 'rgba(33, 38, 45, 0.4)',
                    borderRadius: '4px',
                    textAlign: 'center',
                    border: '1px solid rgba(48, 54, 61, 0.3)'
                  }}>
                    <span style={{color: '#8b949e', display: 'block', marginBottom: '2px'}}>Sıcaklık</span>
                    <div style={{color: '#e6edf3', fontWeight: '500'}}>
                      {sensorData.temperature.toFixed(1)}°C
                    </div>
                  </div>
                  <div style={{
                    padding: '8px',
                    background: 'rgba(33, 38, 45, 0.4)',
                    borderRadius: '4px',
                    textAlign: 'center',
                    border: '1px solid rgba(48, 54, 61, 0.3)'
                  }}>
                    <span style={{color: '#8b949e', display: 'block', marginBottom: '2px'}}>Sinyal</span>
                    <div style={{color: '#e6edf3', fontWeight: '500'}}>
                      {Math.floor(sensorData.signal)}%
                    </div>
                  </div>
                  <div style={{
                    padding: '8px',
                    background: 'rgba(33, 38, 45, 0.4)',
                    borderRadius: '4px',
                    textAlign: 'center',
                    border: '1px solid rgba(48, 54, 61, 0.3)'
                  }}>
                    <span style={{color: '#8b949e', display: 'block', marginBottom: '2px'}}>Mesafe</span>
                    <div style={{color: '#e6edf3', fontWeight: '500'}}>
                      {sensorData.distance.toFixed(2)}m
                    </div>
                  </div>
                  <div style={{
                    padding: '8px',
                    background: 'rgba(33, 38, 45, 0.4)',
                    borderRadius: '4px',
                    textAlign: 'center',
                    border: '1px solid rgba(48, 54, 61, 0.3)'
                  }}>
                    <span style={{color: '#8b949e', display: 'block', marginBottom: '2px'}}>Güç</span>
                    <div style={{color: '#e6edf3', fontWeight: '500'}}>
                      {Math.floor(sensorData.power)}W
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Komut Output Paneli */}
            <div style={{
              marginTop: '24px',
              background: 'rgba(48, 54, 61, 0.3)',
              borderRadius: '8px',
              border: '1px solid rgba(48, 54, 61, 0.5)',
              padding: '16px'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                <h3 style={{color: '#e6edf3', margin: 0, fontSize: '16px', fontWeight: '500'}}>Sistem Logları</h3>
                <button
                  onClick={clearOutput}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(139, 148, 158, 0.3)',
                    background: 'rgba(33, 38, 45, 0.6)',
                    color: '#8b949e',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: '500',
                    transition: 'all 0.2s cubic-bezier(0.3, 0, 0.5, 1)'
                  }}
                >
                  Temizle
                </button>
              </div>

              <div style={{
                height: '200px',
                overflowY: 'auto',
                background: 'rgba(13, 17, 23, 0.8)',
                borderRadius: '6px',
                padding: '12px',
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
                fontSize: '11px',
                border: '1px solid rgba(48, 54, 61, 0.6)',
                lineHeight: '1.4'
              }}>
                {commandOutput.length === 0 ? (
                  <div style={{color: '#656d76', textAlign: 'center', fontStyle: 'italic', paddingTop: '60px'}}>
                    Henüz sistem logu yok...
                  </div>
                ) : (
                  commandOutput.map((entry) => (
                    <div
                      key={entry.id}
                      style={{
                        padding: '4px 0',
                        borderBottom: '1px solid rgba(48, 54, 61, 0.3)',
                        color: entry.type === 'success' ? '#3fb950' :
                               entry.type === 'error' ? '#f85149' :
                               entry.type === 'warning' ? '#d29922' : '#e6edf3'
                      }}
                    >
                      <span style={{color: '#656d76'}}>[{entry.timestamp}]</span> {entry.message}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* İkinci Grid - Araç Bilgileri */}
        <div style={styles.grid}>
          
          {/* Araç Durumu Kartı */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Araç Durumu</h2>
              <div style={{...styles.statusBadge, color: getStatusColor(vehicleData.status)}}>
                {vehicleData.status === 'active' ? 'Aktif' : 
                 vehicleData.status === 'charging' ? 'Şarjda' :
                 vehicleData.status === 'maintenance' ? 'Bakımda' : 'Beklemede'}
              </div>
            </div>
            
            {/* QR Kod */}
            <div style={styles.infoBox}>
              <div style={styles.infoHeader}>
                <QrCode color="#88ccff" size={24} />
                <span style={styles.infoTitle}>QR Kod Bilgisi</span>
              </div>
              <div style={styles.qrCode}>{vehicleData.qrCode}</div>
              <div style={styles.vehicleId}>Araç ID: {vehicleData.id}</div>
            </div>

            {/* Şarj Durumu */}
            <div style={styles.infoBox}>
              <div style={styles.batteryContainer}>
                <div style={styles.infoHeader}>
                  <Battery color={getBatteryColor(vehicleData.batteryPercentage)} size={24} />
                  <span style={styles.infoTitle}>Şarj Durumu</span>
                </div>
                <span style={{...styles.batteryPercentage, color: getBatteryColor(vehicleData.batteryPercentage)}}>
                  %{vehicleData.batteryPercentage}
                </span>
              </div>
              
              <div style={styles.progressBar}>
                <div 
                  style={{
                    ...styles.progressFill,
                    width: `${vehicleData.batteryPercentage}%`,
                    backgroundColor: getBatteryColor(vehicleData.batteryPercentage)
                  }}
                ></div>
              </div>
              
              <div style={styles.progressLabels}>
                <span>Min: %{vehicleData.minChargeLimit}</span>
                <span>Max: %100</span>
              </div>

              {/* Şarj Limit Ayarı */}
              <div style={{marginTop: '12px'}}>
                {!showChargeLimitInput ? (
                  <button
                    onClick={() => {
                      setTempChargeLimit(vehicleData.minChargeLimit);
                      setShowChargeLimitInput(true);
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid rgba(139, 148, 158, 0.3)',
                      background: 'rgba(33, 38, 45, 0.6)',
                      color: '#8b949e',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: '500',
                      transition: 'all 0.2s cubic-bezier(0.3, 0, 0.5, 1)',
                      width: '100%'
                    }}
                  >
                    ⚙️ Şarj Limiti Ayarla
                  </button>
                ) : (
                  <div style={{
                    padding: '8px',
                    background: 'rgba(33, 38, 45, 0.4)',
                    borderRadius: '6px',
                    border: '1px solid rgba(48, 54, 61, 0.3)'
                  }}>
                    <div style={{marginBottom: '8px', fontSize: '11px', color: '#8b949e'}}>
                      Minimum Şarj Limiti (%)
                    </div>
                    <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        value={tempChargeLimit}
                        onChange={(e) => setTempChargeLimit(parseInt(e.target.value))}
                        style={{
                          flex: 1,
                          height: '4px',
                          borderRadius: '2px',
                          background: 'rgba(48, 54, 61, 0.8)',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      />
                      <span style={{
                        fontSize: '12px',
                        color: '#e6edf3',
                        fontWeight: '500',
                        minWidth: '30px'
                      }}>
                        %{tempChargeLimit}
                      </span>
                    </div>
                    <div style={{display: 'flex', gap: '6px', marginTop: '8px'}}>
                      <button
                        onClick={() => updateChargeLimit(tempChargeLimit)}
                        style={{
                          flex: 1,
                          padding: '6px',
                          borderRadius: '4px',
                          border: '1px solid rgba(63, 185, 80, 0.4)',
                          background: 'rgba(63, 185, 80, 0.15)',
                          color: '#3fb950',
                          cursor: 'pointer',
                          fontSize: '10px',
                          fontWeight: '500'
                        }}
                      >
                        Kaydet
                      </button>
                      <button
                        onClick={() => setShowChargeLimitInput(false)}
                        style={{
                          flex: 1,
                          padding: '6px',
                          borderRadius: '4px',
                          border: '1px solid rgba(139, 148, 158, 0.3)',
                          background: 'rgba(33, 38, 45, 0.6)',
                          color: '#8b949e',
                          cursor: 'pointer',
                          fontSize: '10px',
                          fontWeight: '500'
                        }}
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Çalışma Süresi */}
            <div style={styles.infoBox}>
              <div style={styles.infoHeader}>
                <Clock color="#bb88ff" size={24} />
                <span style={styles.infoTitle}>Toplam Çalışma Süresi</span>
              </div>
              <div style={styles.workingHours}>
                {formatWorkingHours(vehicleData.totalWorkingHours)}
              </div>
              <div style={styles.monthlyHours}>
                Bugünkü operasyon süresi
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDashboard;
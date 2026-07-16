import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Cihaz kütüphanesindeki iconKey'lere uygun endüstriyel konfigürasyon
const DEVICE_CONFIG = {
  // --- Sürekli (Continuous) Değer Üreten Cihazlar ---
  ahu: { main: 'verim', unit: '%', min: 60, max: 100 },
  hru: { main: 'verim', unit: '%', min: 60, max: 100 },
  heat_exchanger: { main: 'verim', unit: '%', min: 60, max: 100 },
  collector: { main: 'verim', unit: '%', min: 60, max: 100 },
  
  fan: { main: 'devir', unit: 'rpm', min: 800, max: 1600 },
  motor: { main: 'devir', unit: 'rpm', min: 800, max: 1600 },
  
  pump: { main: 'debi', unit: 'L/min', min: 10, max: 50 },
  
  filter: { main: 'farkBasinc', unit: 'Pa', min: 10, max: 200 },
  dp_inst: { main: 'farkBasinc', unit: 'Pa', min: 10, max: 200 },
  
  thermo_inst: { main: 'sicaklik', unit: '°C', min: 15, max: 85 },
  thermometer: { main: 'sicaklik', unit: '°C', min: 15, max: 85 },
  
  press_inst: { main: 'basinc', unit: 'bar', min: 1, max: 10 },
  plenum: { main: 'basinc', unit: 'bar', min: 1, max: 10 },
  
  flow_inst: { main: 'debi', unit: 'L/min', min: 10, max: 250 },
  rh_inst: { main: 'nem', unit: '%', min: 20, max: 80 },
  
  sun: { main: 'isinim', unit: 'W/m²', min: 100, max: 1000 },
  pyr: { main: 'isinim', unit: 'W/m²', min: 100, max: 1000 },
  wind: { main: 'hiz', unit: 'm/s', min: 0, max: 30 },
  
  ups: { main: 'sarjDurumu', unit: '%', min: 20, max: 100 },
  meter: { main: 'anlikGuc', unit: 'kW', min: 0, max: 500 },

  // --- Oransal Vana ve Damperler ---
  damper: { main: 'aciklikOrani', unit: '%', min: 0, max: 100 },
  valve_control: { main: 'aciklikOrani', unit: '%', min: 0, max: 100 },

  // --- Dijital (Aç-Kapa) Cihazlar ---
  louver: { isDigital: true, states: ['Açık', 'Kapalı'] },
  valve_manual: { isDigital: true, states: ['Açık', 'Kapalı'] },
  valve_safety: { isDigital: true, states: ['Açık', 'Kapalı'] },
  valve_check: { isDigital: true, states: ['Açık', 'Kapalı'] },
  switch_inst: { isDigital: true, states: ['Normal', 'Alarm'] }
};

// Bilinmeyen veya tipi belirsiz cihazlar için varsayılan fallback konfigürasyonu
const FALLBACK_CONFIG = { main: 'deger', unit: '', min: 0, max: 100 };

export const useDummySocket = (nodes = [], autoRefresh = true) => {
  const [liveData, setLiveData] = useState({});
  const [alarms, setAlarms] = useState([]);
  
  // Alarmların sürekli tetiklenmesini önlemek için önceki durumları tuttuğumuz referans
  const prevStatusRef = useRef({});

  // 1. Initial State Kurulumu
  useEffect(() => {
    if (!nodes || nodes.length === 0) return;

    const initialData = {};
    nodes.forEach(node => {
      const type = node.data?.iconKey || node.type;
      const config = DEVICE_CONFIG[type] || FALLBACK_CONFIG;

      if (config.isDigital) {
        initialData[node.id] = {
          value: config.states[0],
          unit: '',
          status: 'normal',
          details: { state: config.states[0] }
        };
      } else {
        // Continuous cihazlar için başlangıç değeri (min ve max'ın ortasına yakın)
        const range = config.max - config.min;
        const startValue = config.min + (range * 0.5) + (Math.random() * range * 0.2);
        
        initialData[node.id] = {
          value: parseFloat(startValue.toFixed(1)),
          unit: config.unit,
          status: 'normal',
          details: { [config.main]: parseFloat(startValue.toFixed(1)) }
        };
      }
      
      prevStatusRef.current[node.id] = 'normal';
    });

    setLiveData(initialData);
  }, [nodes]); // Sadece nodes listesi değiştiğinde sıfırla

  // 2. Canlı Veri Simülasyon Döngüsü (Random Walk & Alarm Logic)
  useEffect(() => {
    if (!autoRefresh || nodes.length === 0) return;

    const interval = setInterval(() => {
      setLiveData(prevData => {
        const newData = { ...prevData };
        const newAlarms = [];

        nodes.forEach(node => {
          const type = node.data?.iconKey || node.type;
          const config = DEVICE_CONFIG[type] || FALLBACK_CONFIG;
          const currentData = prevData[node.id];

          if (!currentData) return;

          let newValue;
          let newStatus = 'normal';

          if (config.isDigital) {
            // Dijital cihaz mantığı: %5 ihtimalle durum değiştir
            if (Math.random() < 0.05) {
              newValue = currentData.value === config.states[0] ? config.states[1] : config.states[0];
            } else {
              newValue = currentData.value;
            }
            
            // Eğer ikinci duruma ('Kapalı' veya 'Alarm') geçerse warning yapalım
            newStatus = newValue === config.states[1] ? 'warning' : 'normal';
            
            newData[node.id] = {
              value: newValue,
              unit: '',
              status: newStatus,
              details: { state: newValue }
            };

          } else {
            // Sürekli cihaz mantığı (Random Walk)
            const range = config.max - config.min;
            const currentVal = parseFloat(currentData.value);
            
            // ±%5 maksimum değişim oranı
            const maxChange = range * 0.05;
            let step = (Math.random() * maxChange * 2) - maxChange;

            // Merkeze doğru itme (Bounce back) - Sınırları çok aşmamasını sağlar
            if (currentVal > config.max - (range * 0.1)) {
              step -= maxChange * 0.5; // Geri çek
            } else if (currentVal < config.min + (range * 0.1)) {
              step += maxChange * 0.5; // Yukarı it
            }

            let calculatedValue = currentVal + step;
            
            // Mantıksal zorunlu sınırlar (Örn: RPM negatif olamaz)
            if (calculatedValue < 0 && config.min >= 0) calculatedValue = 0;

            newValue = parseFloat(calculatedValue.toFixed(1));

            // Durum (Status) Hesaplama: Top/Bottom %10 -> Warning, Sınır Dışı -> Alarm
            if (newValue >= config.max || newValue <= config.min) {
              newStatus = 'alarm';
            } else if (newValue >= config.max - (range * 0.1) || newValue <= config.min + (range * 0.1)) {
              newStatus = 'warning';
            } else {
              newStatus = 'normal';
            }

            newData[node.id] = {
              value: newValue,
              unit: config.unit,
              status: newStatus,
              details: { [config.main]: newValue }
            };
          }

          // Akıllı Alarm Üretimi (Debounce/Throttle mantığı)
          const prevStatus = prevStatusRef.current[node.id];
          
          if (newStatus !== 'normal' && newStatus !== prevStatus) {
            const label = node.data?.label || node.id;
            const paramName = config.isDigital ? 'Durum' : config.main;
            
            newAlarms.push({
              id: uuidv4(),
              nodeId: node.id,
              deviceName: label,
              message: `${label} - ${paramName} kritik seviyeye ulaştı: ${newValue} ${config.unit || ''}`.trim(),
              severity: newStatus === 'alarm' ? 'error' : 'warning',
              timestamp: new Date().toISOString(),
              isResolved: false
            });
          }
          
          // Önceki durumu güncelle
          prevStatusRef.current[node.id] = newStatus;
        });

        // Yeni alarmları mevcut alarmlara ekle ve sadece son 20 tanesini tut
        if (newAlarms.length > 0) {
          setAlarms(prev => [...newAlarms, ...prev].slice(0, 20));
        }

        return newData;
      });
    }, 1500); // Gerçekçi bir canlı yayın hissi için 1.5 saniyede bir

    return () => clearInterval(interval);
  }, [nodes, autoRefresh]);

  return { liveData, alarms };
};

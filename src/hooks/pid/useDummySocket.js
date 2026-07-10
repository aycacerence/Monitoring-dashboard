import { useState, useEffect } from 'react';

const LIMIT_TABLE = {
  pump: { 
    basinc: { min: 1, max: 6, warningMargin: 0.5 }, 
    debi: { min: 8, max: 15, warningMargin: 1 } 
  },
  tank: { 
    seviye: { min: 10, max: 95, warningMargin: 5 } 
  },
  heat_exchanger: { 
    sicaklik: { min: 20, max: 85, warningMargin: 5 } 
  },
  valve: { 
    aciklikYuzdesi: { min: 0, max: 100, warningMargin: 0 } 
  },
  motor: { 
    rpm: { min: 800, max: 1600, warningMargin: 100 } 
  }
};

export default function useDummySocket(nodes, enabled) {
  const [liveData, setLiveData] = useState({});
  const [alarms, setAlarms] = useState([]);

  useEffect(() => {
    if (!enabled || !nodes || nodes.length === 0) return;

    const intervalId = setInterval(() => {
      setLiveData((prevData) => {
        const newData = { ...prevData };
        const newAlarms = [];

        nodes.forEach((node) => {
          // React Flow'da cihaz tipi genelde node.type veya node.data.type içinde tutulur
          const type = node.type || node.data?.type;
          const limits = LIMIT_TABLE[type];

          if (limits) {
            if (!newData[node.id]) {
              newData[node.id] = {};
            }

            Object.keys(limits).forEach((paramKey) => {
              const { min, max, warningMargin } = limits[paramKey];
              
              // Önceki değer yoksa başlangıç için min ile max'ın ortasını al
              const prevNodeData = prevData[node.id];
              const prevValue = prevNodeData && prevNodeData[paramKey] 
                ? prevNodeData[paramKey].value 
                : (min + max) / 2;

              // Mevcut değer etrafında ±%5 oranında rastgele değişim
              const changePercent = (Math.random() * 0.1) - 0.05; // -0.05 ile +0.05 arası
              let newValue = prevValue + (prevValue * changePercent);

              // Değerlerin tamamen ulaşılamaz noktalara kaymasını engellemek için 
              // sınırların çok dışına çıkarsa geri merkeze doğru itebiliriz
              if (newValue > max * 1.1) newValue = max;
              if (newValue < min * 0.9) newValue = min;

              // Virgülden sonra 2 hane
              newValue = Number(newValue.toFixed(2));

              let status = 'normal';
              let message = '';

              // Durum hesaplaması
              if (newValue > max || newValue < min) {
                status = 'alarm';
                message = `${paramKey.toUpperCase()} limiti aşıldı! (${newValue})`;
              } else if (
                newValue >= (max - warningMargin) || 
                newValue <= (min + warningMargin)
              ) {
                status = 'warning';
                message = `${paramKey.toUpperCase()} kritik seviyeye yaklaştı. (${newValue})`;
              }

              newData[node.id][paramKey] = {
                value: newValue,
                status
              };

              // Eğer alarm veya warning durumu varsa listeye ekle
              if (status === 'alarm' || status === 'warning') {
                newAlarms.push({
                  id: `${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                  nodeId: node.id,
                  deviceLabel: node.data?.label || type,
                  message,
                  timestamp: new Date().toISOString(),
                  severity: status
                });
              }
            });
          }
        });

        // Yeni oluşan alarmlar varsa eski listeyle birleştir (max 20 kayıt tutulacak şekilde)
        if (newAlarms.length > 0) {
          setAlarms((prevAlarms) => {
            const combined = [...newAlarms, ...prevAlarms];
            return combined.slice(0, 20); // En son 20 kaydı tut
          });
        }

        return newData;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [nodes, enabled]);

  return { liveData, alarms };
}

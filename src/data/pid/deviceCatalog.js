export const deviceCategories = [
  {
    category: 'GÜNEŞ',
    items: [
      { type: 'device', label: 'SUN', code: 'SUN', iconKey: 'sun', defaultData: { durum: 'Aktif', isinim: 850, sicaklik: 45 } },
      { type: 'device', label: 'AHU', code: 'AHU', iconKey: 'ahu', defaultData: { durum: 'Çalışıyor', fanHizi: 1200, setSicaklik: 22 } }
    ]
  },
  {
    category: 'KOLEKTÖRLER',
    items: [
      { type: 'device', label: 'SW-COL', code: 'SW-COL', iconKey: 'collector', defaultData: { durum: 'Aktif', verim: 78, akiskanSicakligi: 65 } },
      { type: 'device', label: 'PLN', code: 'PLN', iconKey: 'plenum', defaultData: { basinc: 1.2, birim: 'Pa' } }
    ]
  },
  {
    category: 'EKİPMANLAR',
    items: [
      { type: 'device', label: 'PUMP', code: 'PUMP', iconKey: 'pump', defaultData: { durum: 'Kapalı', debi: 0, guc: 0 } },
      { type: 'device', label: 'VALVE', code: 'VALVE', iconKey: 'valve_control', defaultData: { durum: 'Kapalı', aciklikOrani: 0 } },
      { type: 'device', label: 'TANK', code: 'TANK', iconKey: 'process', defaultData: { seviye: 45, sicaklik: 55, kapasite: 1000 } },
      { type: 'device', label: 'HEAT-EXCHANGER', code: 'HEAT-EXCHANGER', iconKey: 'heat_exchanger', defaultData: { girisSicakligi: 70, cikisSicakligi: 40, verim: 92 } },
      { type: 'device', label: 'MOTOR', code: 'MOTOR', iconKey: 'motor', defaultData: { durum: 'Çalışıyor', devir: 1450, akim: 12.5 } },
      { type: 'device', label: 'METER', code: 'METER', iconKey: 'meter', defaultData: { toplamTuketim: 12500, anlikGuc: 3.5 } }
    ]
  },
  {
    category: 'ENTEGRASYON NOKTALARI',
    items: [
      { type: 'device', label: 'GRID', code: 'GRID', iconKey: 'panel', defaultData: { durum: 'Bağlı', gerilim: 380, frekans: 50 } },
      { type: 'device', label: 'INVERTER', code: 'INVERTER', iconKey: 'vfd', defaultData: { durum: 'Aktif', girisGucu: 5.2, cikisGucu: 4.8 } },
      { type: 'device', label: 'BATTERY', code: 'BATTERY', iconKey: 'ups', defaultData: { sarjDurumu: 85, voltaj: 48, kapasite: 200 } }
    ]
  },
  {
    category: 'SENSÖRLER',
    items: [
      { type: 'device', label: 'T_OUT', code: 'T_OUT', iconKey: 'thermo_inst', defaultData: { sicaklik: 25.4, birim: '°C' } },
      { type: 'device', label: 'P_OUT', code: 'P_OUT', iconKey: 'press_inst', defaultData: { basinc: 3.2, birim: 'bar' } },
      { type: 'device', label: 'F_OUT', code: 'F_OUT', iconKey: 'flow_inst', defaultData: { debi: 12.5, birim: 'L/min' } },
      { type: 'device', label: 'S_LVL', code: 'S_LVL', iconKey: 'switch_inst', defaultData: { seviye: 65, birim: '%' } },
      { type: 'device', label: 'RH_OUT', code: 'RH_OUT', iconKey: 'rh_inst', defaultData: { nem: 45, birim: '%' } },
      { type: 'device', label: 'DP_INST', code: 'DP_INST', iconKey: 'dp_inst', defaultData: { farkBasinc: 0.45, birim: 'bar' } }
    ]
  },
  {
    category: 'DİĞER',
    items: [
      { type: 'device', label: 'PLC', code: 'PLC', iconKey: 'plc', defaultData: { durum: 'Run', cpuKullanimi: 12 } },
      { type: 'device', label: 'HMI', code: 'HMI', iconKey: 'hmi', defaultData: { durum: 'Aktif', parlaklik: 80 } },
      { type: 'device', label: '?', code: '?', iconKey: 'generic', defaultData: { durum: 'Bilinmiyor' } },
      { type: 'device', label: 'VFD', code: 'VFD', iconKey: 'vfd', defaultData: { durum: 'Hazır', frekans: 50, akim: 0 } }
    ]
  }
];

export const deviceCategories = [
  {
    category: 'HVAC & EKİPMANLAR',
    items: [
      { type: 'device', label: 'ahu', code: 'AHU', iconKey: 'ahu', defaultData: { durum: 'Çalışıyor', fanHizi: 1200, setSicaklik: 22 } },
      { type: 'device', label: 'hru', code: 'HRU', iconKey: 'hru', defaultData: { durum: 'Çalışıyor', verim: 85 } },
      { type: 'device', label: 'fan', code: 'FAN', iconKey: 'fan', defaultData: { durum: 'Aktif', devir: 1450 } },
      { type: 'device', label: 'coil', code: 'COIL', iconKey: 'coil', defaultData: { durum: 'Aktif', kapasite: 50 } },
      { type: 'device', label: 'heat_exchanger', code: 'HEAT_EXCHANGER', iconKey: 'heat_exchanger', defaultData: { durum: 'Aktif', verim: 92 } },
      { type: 'device', label: 'pump', code: 'PUMP', iconKey: 'pump', defaultData: { durum: 'Kapalı', debi: 0, guc: 0 } },
      { type: 'device', label: 'filter', code: 'FILTER', iconKey: 'filter', defaultData: { durum: 'Temiz', farkBasinc: 50 } },
      { type: 'device', label: 'louver', code: 'LOUVER', iconKey: 'louver', defaultData: { durum: 'Açık' } },
      { type: 'device', label: 'plenum', code: 'PLENUM', iconKey: 'plenum', defaultData: { basinc: 1.2 } }
    ]
  },
  {
    category: 'VANA & DAMPER',
    items: [
      { type: 'device', label: 'damper', code: 'DAMPER', iconKey: 'damper', defaultData: { durum: 'Açık', aciklikOrani: 100 } },
      { type: 'device', label: 'damper_fire', code: 'FIRE_DAMPER', iconKey: 'damper_fire', defaultData: { durum: 'Normal' } },
      { type: 'device', label: 'valve_control', code: 'VALVE_CTRL', iconKey: 'valve_control', defaultData: { durum: 'Aktif', aciklikOrani: 50 } },
      { type: 'device', label: 'valve_manual', code: 'VALVE_MAN', iconKey: 'valve_manual', defaultData: { durum: 'Açık' } },
      { type: 'device', label: 'valve_safety', code: 'VALVE_SAFETY', iconKey: 'valve_safety', defaultData: { durum: 'Kapalı' } },
      { type: 'device', label: 'valve_check', code: 'VALVE_CHECK', iconKey: 'valve_check', defaultData: { durum: 'Aktif' } }
    ]
  },
  {
    category: 'SENSÖRLER',
    items: [
      { type: 'device', label: 'thermo_inst', code: 'T_INST', iconKey: 'thermo_inst', defaultData: { sicaklik: 25.4 } },
      { type: 'device', label: 'thermometer', code: 'THERMO', iconKey: 'thermometer', defaultData: { sicaklik: 25.4 } },
      { type: 'device', label: 'press_inst', code: 'P_INST', iconKey: 'press_inst', defaultData: { basinc: 3.2 } },
      { type: 'device', label: 'dp_inst', code: 'DP_INST', iconKey: 'dp_inst', defaultData: { farkBasinc: 0.45 } },
      { type: 'device', label: 'flow_inst', code: 'F_INST', iconKey: 'flow_inst', defaultData: { debi: 12.5 } },
      { type: 'device', label: 'rh_inst', code: 'RH_INST', iconKey: 'rh_inst', defaultData: { nem: 45 } },
      { type: 'device', label: 'switch_inst', code: 'S_INST', iconKey: 'switch_inst', defaultData: { durum: 'Açık' } },
      { type: 'device', label: 'gauge', code: 'GAUGE', iconKey: 'gauge', defaultData: { deger: 0 } },
      { type: 'device', label: 'meter', code: 'METER', iconKey: 'meter', defaultData: { toplamTuketim: 12500, anlikGuc: 3.5 } }
    ]
  },
  {
    category: 'GÜNEŞ & ÇEVRE',
    items: [
      { type: 'device', label: 'sun', code: 'SUN', iconKey: 'sun', defaultData: { isinim: 850 } },
      { type: 'device', label: 'pyr', code: 'PYR', iconKey: 'pyr', defaultData: { isinim: 850 } },
      { type: 'device', label: 'wind', code: 'WIND', iconKey: 'wind', defaultData: { hiz: 12 } },
      { type: 'device', label: 'collector', code: 'COLLECTOR', iconKey: 'collector', defaultData: { verim: 78, akiskanSicakligi: 65 } }
    ]
  },
  {
    category: 'ELEKTRİK & KONTROL',
    items: [
      { type: 'device', label: 'plc', code: 'PLC', iconKey: 'plc', defaultData: { durum: 'Run', cpuKullanimi: 12 } },
      { type: 'device', label: 'hmi', code: 'HMI', iconKey: 'hmi', defaultData: { durum: 'Aktif', parlaklik: 80 } },
      { type: 'device', label: 'controller', code: 'CONTROLLER', iconKey: 'controller', defaultData: { durum: 'Aktif', setDegeri: 22 } },
      { type: 'device', label: 'panel', code: 'PANEL', iconKey: 'panel', defaultData: { durum: 'Aktif', gerilim: 380 } },
      { type: 'device', label: 'vfd', code: 'VFD', iconKey: 'vfd', defaultData: { durum: 'Hazır', frekans: 50 } },
      { type: 'device', label: 'motor', code: 'MOTOR', iconKey: 'motor', defaultData: { durum: 'Çalışıyor', devir: 1450 } },
      { type: 'device', label: 'ups', code: 'UPS', iconKey: 'ups', defaultData: { sarjDurumu: 85, voltaj: 48 } },
      { type: 'device', label: 'interlock', code: 'INTERLOCK', iconKey: 'interlock', defaultData: { durum: 'Kilitli' } },
      { type: 'device', label: 'estop', code: 'ESTOP', iconKey: 'estop', defaultData: { durum: 'Normal' } }
    ]
  },
  {
    category: 'DİĞER',
    items: [
      { type: 'device', label: 'process', code: 'PROCESS', iconKey: 'process', defaultData: { durum: 'Aktif' } },
      { type: 'device', label: 'flow', code: 'FLOW', iconKey: 'flow', defaultData: { durum: 'Aktif' } },
      { type: 'device', label: 'alarm', code: 'ALARM', iconKey: 'alarm', defaultData: { durum: 'Normal' } },
      { type: 'device', label: 'work_order', code: 'WORK_ORDER', iconKey: 'work_order', defaultData: { durum: 'Açık' } },
      { type: 'device', label: 'generic', code: 'GENERIC', iconKey: 'generic', defaultData: { durum: 'Bilinmiyor' } }
    ]
  }
];

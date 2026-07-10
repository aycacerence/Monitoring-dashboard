export const deviceCategories = [
  {
    category: 'GÜNEŞ',
    items: [
      { type: 'sun', label: 'Güneş Paneli', iconKey: 'sun', defaultData: { durum: 'Aktif', isinim: 850, sicaklik: 45 } },
      { type: 'ahu', label: 'Klima Santrali', iconKey: 'ahu', defaultData: { durum: 'Çalışıyor', fanHizi: 1200, setSicaklik: 22 } }
    ]
  },
  {
    category: 'KOLEKTÖRLER',
    items: [
      { type: 'sw_col', label: 'Güneş Kolektörü', iconKey: 'sw_col', defaultData: { durum: 'Aktif', verim: 78, akiskanSicakligi: 65 } },
      { type: 'pln', label: 'Plenum', iconKey: 'pln', defaultData: { basinc: 1.2, birim: 'Pa' } }
    ]
  },
  {
    category: 'EKİPMANLAR',
    items: [
      { type: 'pump', label: 'Pompa', iconKey: 'pump', defaultData: { durum: 'Kapalı', debi: 0, guc: 0 } },
      { type: 'valve', label: 'Vana', iconKey: 'valve', defaultData: { durum: 'Kapalı', aciklikOrani: 0 } },
      { type: 'tank', label: 'Depolama Tankı', iconKey: 'tank', defaultData: { seviye: 45, sicaklik: 55, kapasite: 1000 } },
      { type: 'heat_exchanger', label: 'Eşanjör', iconKey: 'heat_exchanger', defaultData: { girisSicakligi: 70, cikisSicakligi: 40, verim: 92 } },
      { type: 'motor', label: 'Motor', iconKey: 'motor', defaultData: { durum: 'Çalışıyor', devir: 1450, akim: 12.5 } },
      { type: 'meter', label: 'Sayaç', iconKey: 'meter', defaultData: { toplamTuketim: 12500, anlikGuc: 3.5 } }
    ]
  },
  {
    category: 'ENTEGRASYON',
    items: [
      { type: 'grid', label: 'Şebeke', iconKey: 'grid', defaultData: { durum: 'Bağlı', gerilim: 380, frekans: 50 } },
      { type: 'inverter', label: 'İnverter', iconKey: 'inverter', defaultData: { durum: 'Aktif', girisGucu: 5.2, cikisGucu: 4.8 } },
      { type: 'battery', label: 'Batarya', iconKey: 'battery', defaultData: { sarjDurumu: 85, voltaj: 48, kapasite: 200 } }
    ]
  },
  {
    category: 'SENSÖRLER',
    items: [
      { type: 't_out', label: 'Sıcaklık Sensörü', iconKey: 't_out', defaultData: { sicaklik: 25.4, birim: '°C' } },
      { type: 'p_out', label: 'Basınç Sensörü', iconKey: 'p_out', defaultData: { basinc: 3.2, birim: 'bar' } },
      { type: 'f_out', label: 'Debi Sensörü', iconKey: 'f_out', defaultData: { debi: 12.5, birim: 'L/min' } },
      { type: 's_lvl', label: 'Seviye Sensörü', iconKey: 's_lvl', defaultData: { seviye: 65, birim: '%' } },
      { type: 'rh_out', label: 'Nem Sensörü', iconKey: 'rh_out', defaultData: { nem: 45, birim: '%' } },
      { type: 'dp_inst', label: 'Fark Basınç', iconKey: 'dp_inst', defaultData: { farkBasinc: 0.45, birim: 'bar' } }
    ]
  },
  {
    category: 'DİĞER',
    items: [
      { type: 'plc', label: 'PLC Ünitesi', iconKey: 'plc', defaultData: { durum: 'Run', cpuKullanimi: 12 } },
      { type: 'hmi', label: 'HMI Ekranı', iconKey: 'hmi', defaultData: { durum: 'Aktif', parlaklik: 80 } },
      { type: 'panel', label: 'Kontrol Paneli', iconKey: 'panel', defaultData: { durum: 'Normal', icSicaklik: 28 } },
      { type: 'vfd', label: 'Sürücü', iconKey: 'vfd', defaultData: { durum: 'Hazır', frekans: 50, akim: 0 } },
      { type: 'alarm', label: 'Alarm', iconKey: 'alarm', defaultData: { durum: 'Sessiz', sonAlarm: 'Yok' } }
    ]
  }
];

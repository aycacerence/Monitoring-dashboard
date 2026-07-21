import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { usePID } from '../../../context/pid/PIDContext';
import { iconMap } from '../../../data/pid/iconMap';
import { useTranslation } from 'react-i18next';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`device-tabpanel-${index}`}
      aria-labelledby={`device-tab-${index}`}
      {...other}
      style={{ height: '100%', overflowY: 'auto' }}
      className="bg-slate-50 dark:bg-slate-900"
    >
      {value === index && <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>{children}</Box>}
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.2, borderBottom: '1px solid', borderColor: 'divider' }}>
    <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0, mr: 2, fontSize: '0.8rem' }}>
      {label}
    </Typography>
    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500, textAlign: 'right', fontSize: '0.8rem' }}>
      {value || '-'}
    </Typography>
  </Box>
);

const DeviceDetailPanel = ({ liveData = {} }) => {
  const { t } = useTranslation();
  const { selectedNode, setSelectedNode } = usePID();
  const [tabIndex, setTabIndex] = useState(1);

  useEffect(() => {
    if (selectedNode) {
      setTabIndex(1);
    }
  }, [selectedNode]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleClose = () => {
    setSelectedNode(null);
  };

  if (!selectedNode) return null;

  const nodeData = selectedNode.data || {};
  const staticData = nodeData.defaultData || {};

  // Anlık veriyi selectedNode'dan değil, hook'tan gelen canlı 'liveData' objesinden okuyoruz
  const latestLiveData = liveData[selectedNode.id] || {};
  
  // Eğer liveData'dan güncel değer gelmiyorsa node'daki son bilinen duruma dön, o da yoksa normal say
  const status = latestLiveData.status || nodeData.durum?.toLowerCase() || 'normal';
  const liveValue = latestLiveData.value ?? '--';
  const liveUnit = latestLiveData.unit || '';

  const statusConfig = {
    aktif: { text: 'Aktif', colorClass: 'text-green-600 dark:text-green-400', bgClass: 'bg-green-500' },
    pasif: { text: 'Pasif', colorClass: 'text-red-600 dark:text-red-400', bgClass: 'bg-red-500' },
    bakımda: { text: 'Bakımda', colorClass: 'text-orange-600 dark:text-orange-400', bgClass: 'bg-orange-500' },
    alarm: { text: 'Alarm', colorClass: 'text-red-600 dark:text-red-400', bgClass: 'bg-red-500' },
    warning: { text: 'Uyarı', colorClass: 'text-orange-600 dark:text-orange-400', bgClass: 'bg-orange-400' },
    normal: { text: 'Normal', colorClass: 'text-green-600 dark:text-green-400', bgClass: 'bg-green-500' },
  };
  const currentStatus = statusConfig[status] || statusConfig.normal;

  const unitMap = {
    debi: 'm³/h', basinc: 'bar', farkBasinc: 'bar',
    guc: 'kW', girisGucu: 'kW', cikisGucu: 'kW', nominalGuc: 'kW',
    verim: '%', akim: 'A', gerilim: 'V', voltaj: 'V', frekans: 'Hz',
    sicaklik: '°C', girisSicakligi: '°C', cikisSicakligi: '°C',
    akiskanSicakligi: '°C', setSicaklik: '°C', isinim: 'W/m²',
    fanHizi: 'RPM', devir: 'RPM', kapasite: 'L',
    seviye: '%', sarjDurumu: '%', aciklikOrani: '%', nem: '%',
    toplamTuketim: 'kWh', anlikGuc: 'kW', cpuKullanimi: '%', parlaklik: '%'
  };

  const getUnit = (key, deviceCode) => {
    if (key === 'kapasite' && deviceCode === 'BATTERY') return 'Ah';
    return staticData?.birim || unitMap[key] || '';
  };

  return (
    <Drawer
      anchor="right"
      variant="persistent"
      open={Boolean(selectedNode)}
      sx={{
        width: selectedNode ? 340 : 0,
        flexShrink: 0,
        zIndex: 1200,
        transition: 'width 0.3s ease',
        '& .MuiDrawer-paper': { 
          width: 340, 
          boxSizing: 'border-box',
          position: 'absolute',
          height: '100%',
          right: 0,
          borderLeft: '1px solid',
          borderColor: 'divider',
          boxShadow: '-4px 0 15px rgba(0,0,0,0.05)'
        }
      }}
    >
      <Box sx={{ p: 2.5, pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
          Cihaz Detayı
        </Typography>
        <IconButton onClick={handleClose} size="small" sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'action.hover' } }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ px: 2.5, display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        <Box sx={{ width: 56, height: 56, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'background.default', border: '1px solid', borderColor: 'divider', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          {iconMap[nodeData.iconKey] && (
            <img src={iconMap[nodeData.iconKey]} alt="device-icon" className="w-8 h-8 object-contain opacity-80" />
          )}
        </Box>
        
        <Box display="flex" flexDirection="column" justifyContent="center">
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
            {t(`pidBuilder.devices.${nodeData.label}`, { defaultValue: nodeData.label })}
          </Typography>
          {nodeData.code && String(nodeData.code).toLowerCase() !== String(nodeData.label).toLowerCase() && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5, fontWeight: 500 }}>
              {nodeData.code}
            </Typography>
          )}
          <Box display="flex" alignItems="center" gap={1} mt={0.5}>
            <div className={`w-2 h-2 rounded-full ${currentStatus.bgClass} ${status === 'alarm' ? 'animate-pulse' : ''}`} />
            <Typography variant="caption" sx={{ fontWeight: 600 }} className={currentStatus.colorClass}>
              {currentStatus.text}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 40 }}
        TabIndicatorProps={{ style: { height: 3, borderRadius: '3px 3px 0 0' } }}
      >
        <Tab label="Genel" sx={{ textTransform: 'none', fontWeight: 600, minHeight: 40 }} />
        <Tab label="Canlı Veri" sx={{ textTransform: 'none', fontWeight: 600, minHeight: 40 }} />
      </Tabs>

      {/* Genel Sekmesi */}
      <TabPanel value={tabIndex} index={0}>
        <Box className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 p-4 shadow-sm">
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: 'text.primary', fontSize: '0.85rem' }}>
            Genel Bilgiler
          </Typography>
          <InfoRow label="Cihaz Adı" value={nodeData.label || nodeData.code} />
          <InfoRow label="Cihaz Tipi" value={nodeData.type || selectedNode.type?.toUpperCase()} />
          <InfoRow label="Açıklama" value={nodeData.aciklama || '-'} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0, mr: 2, fontSize: '0.8rem' }}>
              Durum
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <div className={`w-2 h-2 rounded-full ${currentStatus.bgClass}`} />
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }} className={currentStatus.colorClass}>
                {currentStatus.text}
              </Typography>
            </Box>
          </Box>
        </Box>

        {Object.keys(staticData).length > 0 && (
          <Box className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 p-4 shadow-sm">
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: 'text.primary', fontSize: '0.85rem' }}>
              Teknik Detaylar
            </Typography>
            {Object.entries(staticData).map(([key, val]) => {
              if (key === 'birim' || key === 'durum') return null;
              
              const fallbackLabel = key.charAt(0).toUpperCase() + key.slice(1);
              const label = t(`pidBuilder.techKeys.${key}`, { defaultValue: fallbackLabel });
              const unit = getUnit(key, nodeData.code);
              
              return (
                <InfoRow 
                  key={key} 
                  label={label} 
                  value={`${val} ${unit}`.trim()} 
                />
              );
            })}
          </Box>
        )}

        <Box className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 p-4 shadow-sm">
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: 'text.primary', fontSize: '0.85rem' }}>
            Çalışma Bilgileri
          </Typography>
          <InfoRow label="Çalışma Süresi" value={nodeData.calismaSuresi ? `${nodeData.calismaSuresi} Saat` : '-'} />
          <InfoRow label="Son Bakım Tarihi" value={nodeData.sonBakimTarihi || '-'} />
        </Box>
      </TabPanel>

      {/* Canlı Veri Sekmesi */}
      <TabPanel value={tabIndex} index={1}>
        <Box className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 p-6 mt-2 flex flex-col items-center justify-center relative overflow-hidden min-h-[240px] shadow-sm">
          
          {/* Arka plan parlaklığı */}
          <div className={`absolute inset-0 opacity-[0.04] dark:opacity-[0.06] ${
            status === 'alarm' ? 'bg-red-500' :
            status === 'warning' ? 'bg-orange-500' :
            'bg-green-500'
          }`} />

          <Typography variant="overline" sx={{ color: 'text.secondary', mb: 1.5, letterSpacing: 1.5, fontWeight: 700, zIndex: 1 }}>
            Anlık Değer
          </Typography>
          
          <Box display="flex" alignItems="baseline" gap={1} mb={4} sx={{ zIndex: 1 }}>
            <Typography variant="h1" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em', fontSize: '3.5rem', lineHeight: 1 }}>
              {liveValue}
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {liveUnit}
            </Typography>
          </Box>

          <Box sx={{ zIndex: 1 }} className={`px-5 py-2 rounded-full flex items-center gap-2.5 transition-all ${
            status === 'alarm' ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-500/20' :
            status === 'warning' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-100 dark:border-orange-500/20' :
            'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-500/20'
          }`}>
            <div className={`w-2.5 h-2.5 rounded-full ${currentStatus.bgClass} ${status === 'alarm' ? 'animate-pulse' : ''}`} />
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {currentStatus.text}
            </Typography>
          </Box>
        </Box>
      </TabPanel>
    </Drawer>
  );
};

export default DeviceDetailPanel;

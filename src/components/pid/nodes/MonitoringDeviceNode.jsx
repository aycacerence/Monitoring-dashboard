import React from 'react';
import { Handle, Position } from 'reactflow';
import { Box, Typography, Paper } from '@mui/material';
import { iconMap } from '../../../data/pid/iconMap';
import { useTranslation } from 'react-i18next';
import { DEVICE_CONFIG } from '../../../hooks/useDummySocket';

const MonitoringDeviceNode = ({ id, data, selected }) => {
  const { t } = useTranslation();

  const currentStatus = data.status?.toLowerCase() || 'normal';

  const statusConfig = {
    alarm: { text: t('pidBuilder.status.alarm', 'Alarm'), colorClass: 'text-red-600 dark:text-red-400', bgClass: 'bg-red-500', borderClass: 'border-red-500' },
    warning: { text: t('pidBuilder.status.warning', 'Uyarı'), colorClass: 'text-orange-600 dark:text-orange-400', bgClass: 'bg-orange-400', borderClass: 'border-orange-400' },
    normal: { text: t('pidBuilder.status.normal', 'Normal'), colorClass: 'text-green-600 dark:text-green-400', bgClass: 'bg-green-500', borderClass: 'border-green-500' },
    pasif: { text: t('pidBuilder.status.pasif', 'Pasif'), colorClass: 'text-red-600 dark:text-red-400', bgClass: 'bg-red-500', borderClass: 'border-red-500' },
    'bakımda': { text: t('pidBuilder.status.bakımda', 'Bakımda'), colorClass: 'text-orange-600 dark:text-orange-400', bgClass: 'bg-orange-500', borderClass: 'border-orange-500' },
  };

  const activeStatus = statusConfig[currentStatus] || statusConfig.normal;

  // Cihaz tipine göre başlığı belirle (Debi, Basınç vb.)
  const type = data.iconKey || data.type || 'generic';
  const config = DEVICE_CONFIG[type] || { main: 'deger', unit: '' };
  const paramKey = config.isDigital ? 'durum' : config.main;
  
  const paramLabel = config.isDigital 
    ? t('pidBuilder.propertyPanel.status.title', 'DURUM')
    : t(`pidBuilder.techKeys.${paramKey}`, paramKey.toUpperCase());

  return (
    <Box 
      className="bg-white dark:bg-slate-800 rounded-lg"
      sx={{ 
        width: 100, 
        height: 85, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: 1,
        position: 'relative'
      }}
    >
      {/* 
        React Flow'un fitView hesaplamasında bu node'un bounding box'ını yukarı doğru 
        genişletmek için görünmez bir blok ekliyoruz. Böylece absolute badge'ler 
        hesaplamaya dahil olur ve ekranın üstünden kesilmez.
      */}
      {(data.liveValue !== undefined && data.liveValue !== null && data.liveValue !== '') && (
        <div style={{ width: '100%', height: '90px', marginTop: '-90px', pointerEvents: 'none' }} />
      )}

      {/* CANLI VERİ BADGE KUTUSU (Oklu Callout) */}
      {(data.liveValue !== undefined && data.liveValue !== null && data.liveValue !== '') && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'none' // Tıklamayı engellememesi için
          }}
        >
          {/* Badge Kartı */}
          <Paper
            elevation={4}
            className={`px-2 py-1 rounded-md border-[1.5px] flex flex-col w-[85px] shadow-sm bg-white dark:bg-slate-800 ${activeStatus.borderClass}`}
          >
            {/* BAŞLIK (Örn: Debi, Sıcaklık) */}
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: '0.55rem', 
                color: 'text.secondary', 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                mb: 0.5, 
                borderBottom: '1px solid', 
                borderColor: 'divider', 
                pb: 0.25, 
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {paramLabel}
            </Typography>

            {/* DEĞER + BİRİM */}
            <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', lineHeight: 1, color: 'text.primary' }}>
                {data.liveValue}
              </Typography>
              {data.unit && (
                <Typography sx={{ fontSize: '0.55rem', fontWeight: 600, color: 'text.secondary' }}>
                  {data.unit}
                </Typography>
              )}
            </Box>

            {/* DURUM BİLGİSİ (Normal, Alarm vs.) */}
            <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
              <div className={`w-1.5 h-1.5 rounded-full ${activeStatus.bgClass} ${currentStatus === 'alarm' ? 'animate-pulse' : ''}`} />
              <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.5rem', textTransform: 'uppercase' }} className={activeStatus.colorClass}>
                {activeStatus.text}
              </Typography>
            </Box>
          </Paper>

          {/* Kesik Çizgi */}
          <div className="h-6 border-l-[2.5px] border-dashed border-slate-400 dark:border-slate-500" />
          
          {/* Cihaza Değen Nokta */}
          <div className="w-2.5 h-2.5 rounded-full bg-slate-500 dark:bg-slate-400" style={{ marginTop: '-2px' }} />
        </Box>
      )}

      {/* --- CİHAZIN KENDİSİ (Sadece Görsel) --- */}
      {/* Edge'lerin (boruların) çizilebilmesi için Handle'lar zorunludur. Görünmez yapıldı. */}
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ opacity: 0, pointerEvents: 'none', left: -20 }} 
      />
      
      <img src={iconMap[data.iconKey]} alt={data.label || 'icon'} className="w-10 h-10 object-contain" />
      
      <Typography 
        variant="caption" 
        sx={{ 
          textAlign: 'center', 
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: '0.75rem',
          lineHeight: 1.2,
          fontWeight: 'medium',
          textTransform: 'uppercase',
          px: 1
        }}
        className="text-gray-700 dark:text-slate-200"
      >
        {t(`pidBuilder.devices.${data.label}`, { defaultValue: data.label || data.code })}
      </Typography>

      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ opacity: 0, pointerEvents: 'none', right: -20 }} 
      />
    </Box>
  );
};

export default MonitoringDeviceNode;

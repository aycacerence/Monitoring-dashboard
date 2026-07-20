import React from 'react';
import { Handle, Position } from 'reactflow';
import { Box, Typography, Paper } from '@mui/material';
import { iconMap } from '../../../data/pid/iconMap';
import { useTranslation } from 'react-i18next';

const MonitoringDeviceNode = ({ id, data, selected }) => {
  const { t } = useTranslation();

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
            className={`px-3 py-1.5 rounded-lg border-2 flex flex-col items-center justify-center min-w-[85px] shadow-lg ${
              data.status === 'alarm' ? 'border-red-500 bg-white dark:bg-slate-800' :
              data.status === 'warning' ? 'border-orange-400 bg-white dark:bg-slate-800' :
              'border-green-500 bg-white dark:bg-slate-800'
            }`}
          >
            {/* Durum (Status) */}
            <Box display="flex" alignItems="center" gap={0.75} mb={0.5}>
              <div className={`w-2 h-2 rounded-full ${
                data.status === 'alarm' ? 'bg-red-500 animate-pulse' :
                data.status === 'warning' ? 'bg-orange-400' :
                'bg-green-500'
              }`} />
              <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.65rem', letterSpacing: '0.02em', textTransform: 'uppercase' }} className={
                data.status === 'alarm' ? 'text-red-600 dark:text-red-400' :
                data.status === 'warning' ? 'text-orange-600 dark:text-orange-400' :
                'text-green-600 dark:text-green-400'
              }>
                {data.status === 'alarm' ? t('pidBuilder.status.alarm', 'Alarm') : 
                 data.status === 'warning' ? t('pidBuilder.status.warning', 'Uyarı') : 
                 t('pidBuilder.status.normal', 'Normal')}
              </Typography>
            </Box>
            
            {/* Değer (Live Value) */}
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.15rem', lineHeight: 1 }} className="text-slate-800 dark:text-slate-100 flex items-baseline gap-1">
              {data.liveValue} <span className="text-slate-500 text-[0.70rem] font-medium">{data.unit || ''}</span>
            </Typography>
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

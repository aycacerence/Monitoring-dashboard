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

  const type = data.iconKey || data.type || 'generic';
  const config = DEVICE_CONFIG[type] || { main: 'deger', unit: '' };
  const paramKey = config.isDigital ? 'durum' : config.main;
  
  const paramLabel = config.isDigital 
    ? t('pidBuilder.propertyPanel.status.title', 'DURUM')
    : t(`pidBuilder.techKeys.${paramKey}`, paramKey.toUpperCase());

  const hasSecondary = data.secondaryValue !== undefined && data.secondaryValue !== null;
  const paramLabel1 = config.paramLabel1 || paramLabel;
  const paramLabel2 = config.paramLabel2 || 'Değer';

  return (
    <Box 
      className="bg-white dark:bg-slate-800 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-2 border-slate-200 dark:border-slate-700"
      sx={{ 
        width: 150, 
        height: 'auto', 
        p: 1.5,
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-2px)' }
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0, pointerEvents: 'none', left: -10, top: '50%' }} />
      
      {/* Başlık ve Durum */}
      <Box sx={{ mb: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: 'text.primary', lineHeight: 1.2 }}>
          {t(`pidBuilder.devices.${data.label}`, { defaultValue: data.label || data.code })}
        </Typography>
        {data.code && String(data.code).toLowerCase() !== String(data.label).toLowerCase() && (
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.65rem' }}>
            {data.code}
          </Typography>
        )}
        <Box display="flex" alignItems="center" gap={0.75} mt={0.5}>
          <div className={`w-2 h-2 rounded-full ${activeStatus.bgClass} ${currentStatus === 'alarm' ? 'animate-pulse' : ''}`} />
          <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.65rem', textTransform: 'capitalize' }} className={activeStatus.colorClass}>
            {activeStatus.text}
          </Typography>
        </Box>
      </Box>

      {/* İkon */}
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 1.5 }}>
        <img src={iconMap[data.iconKey]} alt={data.label || 'icon'} className="h-16 object-contain drop-shadow-md" />
      </Box>

      {/* Değer Alanı */}
      {(data.liveValue !== undefined && data.liveValue !== null && data.liveValue !== '') && (
        <Box sx={{ display: 'flex', borderTop: '1px solid', borderColor: 'divider', pt: 1.5, mt: 'auto' }}>
          
          {hasSecondary ? (
            <>
              {/* Sol Değer */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', pr: 1, borderRight: '1px solid', borderColor: 'divider' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', fontWeight: 600 }}>
                  {paramLabel1}
                </Typography>
                <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: 'text.primary', mt: 0.2, display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                  {data.liveValue} <span className="text-slate-500 text-[0.6rem] font-bold">{data.unit || ''}</span>
                </Typography>
              </Box>
              {/* Sağ Değer */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', pl: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', fontWeight: 600 }}>
                  {paramLabel2}
                </Typography>
                <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: 'text.primary', mt: 0.2, display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                  {data.secondaryValue} <span className="text-slate-500 text-[0.6rem] font-bold">{data.secondaryUnit || ''}</span>
                </Typography>
              </Box>
            </>
          ) : (
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', fontWeight: 600 }}>
                {paramLabel}
              </Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: 'text.primary', mt: 0.2, display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                {data.liveValue} <span className="text-slate-500 text-[0.6rem] font-bold">{data.unit || ''}</span>
              </Typography>
            </Box>
          )}
        </Box>
      )}

      <Handle type="source" position={Position.Right} style={{ opacity: 0, pointerEvents: 'none', right: -10, top: '50%' }} />
    </Box>
  );
};

export default MonitoringDeviceNode;

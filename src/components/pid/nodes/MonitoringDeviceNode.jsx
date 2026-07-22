import React from 'react';
import { Handle, Position } from 'reactflow';
import { Box, Typography, Paper } from '@mui/material';
import { Eye } from 'lucide-react';
import { iconMap } from '../../../data/pid/iconMap';
import { useTranslation } from 'react-i18next';
import { DEVICE_CONFIG } from '../../../hooks/useDummySocket';
import { usePID } from '../../../context/pid/PIDContext';

const MonitoringDeviceNode = ({ id, data }) => {
  const { t } = useTranslation();
  const { selectedNode } = usePID();

  const selected = selectedNode?.id === id;

  const currentStatus = data.status?.toLowerCase() || 'normal';

  const statusConfig = {
    alarm: { text: t('pidBuilder.propertyPanel.status.alarm', 'Alarm'), colorClass: 'text-red-600 dark:text-red-400', bgClass: 'bg-red-500', borderClass: 'border-red-500' },
    warning: { text: t('pidBuilder.propertyPanel.status.warning', 'Uyarı'), colorClass: 'text-orange-600 dark:text-orange-400', bgClass: 'bg-orange-400', borderClass: 'border-orange-400' },
    normal: { text: t('pidBuilder.propertyPanel.status.normal', 'Normal'), colorClass: 'text-green-600 dark:text-green-400', bgClass: 'bg-green-500', borderClass: 'border-green-500' },
    pasif: { text: t('pidBuilder.propertyPanel.status.pasif', 'Pasif'), colorClass: 'text-red-600 dark:text-red-400', bgClass: 'bg-red-500', borderClass: 'border-red-500' },
    'bakımda': { text: t('pidBuilder.propertyPanel.status.bakımda', 'Bakımda'), colorClass: 'text-orange-600 dark:text-orange-400', bgClass: 'bg-orange-500', borderClass: 'border-orange-500' },
  };

  const activeStatus = statusConfig[currentStatus] || statusConfig.normal;

  const type = data.iconKey || data.type || 'generic';
  const config = DEVICE_CONFIG[type] || { main: 'deger', unit: '' };
  const paramKey = config.isDigital ? 'durum' : config.main;
  
  const paramLabel = config.isDigital 
    ? t('pidBuilder.propertyPanel.status.title', 'DURUM')
    : t(`pidBuilder.techKeys.${paramKey}`, paramKey.toUpperCase());

  const hasSecondary = data.secondaryValue !== undefined && data.secondaryValue !== null;
  const paramLabel1 = config.paramLabel1 ? t(`pidBuilder.techKeys.${config.paramLabel1}`, config.paramLabel1) : paramLabel;
  const paramLabel2 = config.paramLabel2 ? t(`pidBuilder.techKeys.${config.paramLabel2}`, config.paramLabel2) : t('pidBuilder.techKeys.deger', 'Değer');

  const displayLiveValue = typeof data.liveValue === 'string' 
    ? t(`pidBuilder.propertyPanel.status.${data.liveValue}`, data.liveValue) 
    : data.liveValue;

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Seçili Durum Bildirici (Açık ve Net Badge) */}
      {selected && (
        <Box 
          sx={{
            position: 'absolute',
            top: -14,
            right: -10,
            bgcolor: 'primary.main',
            color: 'white',
            px: 1.5,
            py: 0.5,
            borderRadius: '12px',
            fontSize: '0.65rem',
            fontWeight: 800,
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            border: '2px solid white',
            letterSpacing: '0.5px'
          }}
          className="dark:border-slate-800"
        >
          <Eye size={12} strokeWidth={3} /> {t('pidMonitoring.watching', 'DETAY')}
        </Box>
      )}

      {/* Arka Plan Pulse (Glow) Efekti */}
      {currentStatus === 'alarm' && (
        <div className="absolute -inset-1.5 rounded-2xl bg-red-500 opacity-40 animate-pulse" style={{ animationDuration: '1.5s' }} />
      )}
      {currentStatus === 'warning' && (
        <div className="absolute -inset-1.5 rounded-2xl bg-orange-500 opacity-40 animate-pulse" style={{ animationDuration: '2s' }} />
      )}

      {/* Ana Kart Kısımı */}
      <Box 
        className={`bg-white dark:bg-slate-800 rounded-xl border-2 relative transition-all duration-200 ${
          selected ? 'scale-[1.03] z-50 shadow-2xl' : 'shadow-md z-10'
        } ${
          currentStatus === 'alarm' ? 'border-red-500' :
          currentStatus === 'warning' ? 'border-orange-400' :
          'border-slate-200 dark:border-slate-700'
        }`}
        sx={{ 
          width: 150, 
          height: 'auto', 
          p: 1.5,
          display: 'flex', 
          flexDirection: 'column', 
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
                    {displayLiveValue} <span className="text-slate-500 text-[0.6rem] font-bold">{data.unit || ''}</span>
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
                  {displayLiveValue} <span className="text-slate-500 text-[0.6rem] font-bold">{data.unit || ''}</span>
                </Typography>
              </Box>
            )}
          </Box>
        )}

        <Handle type="source" position={Position.Right} style={{ opacity: 0, pointerEvents: 'none', right: -10, top: '50%' }} />
      </Box>
    </Box>
  );
};

export default MonitoringDeviceNode;

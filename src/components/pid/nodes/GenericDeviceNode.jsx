import React from 'react';
import { Handle, Position, useReactFlow, getConnectedEdges } from 'reactflow';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { iconMap } from '../../../data/pid/iconMap';
import { useTranslation } from 'react-i18next';
import { DEVICE_CONFIG } from '../../../hooks/useDummySocket';

const GenericDeviceNode = ({ id, data, selected }) => {
  const { t } = useTranslation();
  const { setNodes, setEdges, getNode, getEdges } = useReactFlow();

  const handleDelete = (e) => {
    e.stopPropagation();
    
    setNodes((nds) => nds.filter((n) => n.id !== id));
    
    const node = getNode(id);
    const edges = getEdges();
    if (node) {
      const connectedEdges = getConnectedEdges([node], edges);
      setEdges((eds) => eds.filter((edge) => !connectedEdges.find((c) => c.id === edge.id)));
    }
  };

  const type = data.iconKey || data.type || 'generic';
  const config = DEVICE_CONFIG[type] || { main: 'deger', unit: '' };
  const paramKey = config.isDigital ? 'durum' : config.main;
  
  const paramLabel = config.isDigital 
    ? t('pidBuilder.propertyPanel.status.title', 'DURUM')
    : t(`pidBuilder.techKeys.${paramKey}`, paramKey.toUpperCase());

  const hasSecondary = !!config.secondary;
  const paramLabel1 = config.paramLabel1 ? t(`pidBuilder.techKeys.${config.paramLabel1}`, config.paramLabel1) : paramLabel;
  const paramLabel2 = config.paramLabel2 ? t(`pidBuilder.techKeys.${config.paramLabel2}`, config.paramLabel2) : t('pidBuilder.techKeys.deger', 'Değer');
  
  // Placeholder değerler
  const placeholderValue = config.isDigital ? '---' : '0.0';
  const placeholderSecondary = '0.0';

  return (
    <Box 
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-2 ${selected ? 'border-blue-500' : 'border-slate-200 dark:border-slate-700'}`}
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
      {selected && (
        <IconButton
          size="small"
          onClick={handleDelete}
          sx={{
            position: 'absolute',
            top: -10,
            right: -10,
            bgcolor: 'error.main',
            color: 'white',
            width: 24,
            height: 24,
            '&:hover': {
              bgcolor: 'error.dark',
            },
            zIndex: 10,
          }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      )}

      {/* Target Handle */}
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ 
          top: '50%', 
          transform: 'translateY(-50%)',
          width: 40,
          height: 40,
          left: -20,
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'crosshair',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5
        }}
      >
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', pointerEvents: 'none' }} />
      </Handle>
      
      {/* Başlık */}
      <Box sx={{ mb: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: 'text.primary', lineHeight: 1.2 }}>
          {t(`pidBuilder.devices.${data.label}`, { defaultValue: data.label || data.code })}
        </Typography>
        {data.code && String(data.code).toLowerCase() !== String(data.label).toLowerCase() && (
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>
            {data.code}
          </Typography>
        )}
      </Box>

      {/* İkon */}
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <img src={iconMap[data.iconKey]} alt={data.label || 'icon'} className="h-20 object-contain drop-shadow-md" />
      </Box>

      {/* Değer Alanı (Yer tutucu) */}
      <Box sx={{ display: 'flex', borderTop: '1px solid', borderColor: 'divider', pt: 1.5, mt: 'auto', opacity: 0.35 }}>
        {hasSecondary ? (
          <>
            {/* Sol Değer */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', pr: 1, borderRight: '1px solid', borderColor: 'divider' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6rem', fontWeight: 600 }}>
                {paramLabel1}
              </Typography>
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: 'text.primary', mt: 0.2, display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                {placeholderValue} <span className="text-slate-500 text-[0.55rem] font-bold">{config.unit || ''}</span>
              </Typography>
            </Box>
            {/* Sağ Değer */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', pl: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6rem', fontWeight: 600 }}>
                {paramLabel2}
              </Typography>
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: 'text.primary', mt: 0.2, display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                {placeholderSecondary} <span className="text-slate-500 text-[0.55rem] font-bold">{config.secondaryUnit || ''}</span>
              </Typography>
            </Box>
          </>
        ) : (
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6rem', fontWeight: 600 }}>
              {paramLabel}
            </Typography>
            <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: 'text.primary', mt: 0.2, display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
              {placeholderValue} <span className="text-slate-500 text-[0.55rem] font-bold">{config.unit || ''}</span>
            </Typography>
          </Box>
        )}
      </Box>

      {/* Source Handle */}
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ 
          top: '50%', 
          transform: 'translateY(-50%)',
          width: 40,
          height: 40,
          right: -20,
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'crosshair',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5
        }}
      >
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', pointerEvents: 'none' }} />
      </Handle>
    </Box>
  );
};

export default GenericDeviceNode;

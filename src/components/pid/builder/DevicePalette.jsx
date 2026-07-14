import React from 'react';
import { deviceCategories } from '../../../data/pid/deviceCatalog';
import { iconMap } from '../../../data/pid/iconMap';
import { usePID } from '../../../context/pid/PIDContext';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';

const getCategoryTranslation = (category, t) => {
  const map = {
    'HVAC & EKİPMANLAR': t('pidBuilder.categories.hvac'),
    'VANA & DAMPER': t('pidBuilder.categories.valves'),
    'SENSÖRLER': t('pidBuilder.categories.sensors'),
    'GÜNEŞ & ÇEVRE': t('pidBuilder.categories.environment'),
    'ELEKTRİK & KONTROL': t('pidBuilder.categories.electrical'),
    'DİĞER': t('pidBuilder.categories.other')
  };
  return map[category] || category;
};

const DevicePalette = () => {
  const { t } = useTranslation();
  const { activeFlowType, setActiveFlowType, selectedEdge, updateEdgeData } = usePID();

  const flows = [
    { type: 'duct_mixed', label: 'duct_mixed', color: '#3b82f6' },
    { type: 'duct_hot', label: 'duct_hot', color: '#f97316' },
    { type: 'duct_cold', label: 'duct_cold', color: '#ef4444' },
    { type: 'duct_exhaust', label: 'duct_exhaust', color: '#64748b' }
  ];
  return (
    <Box 
      sx={{ 
        width: 256, 
        height: '100%', 
        flexShrink: 0, 
        overflowY: 'auto', 
        borderRight: 1, 
        borderColor: 'divider', 
        bgcolor: 'background.paper', 
        display: 'flex', 
        flexDirection: 'column', 
        pb: 3 
      }}
    >
      {deviceCategories.map((category, index) => (
        <Box key={index}>
          <Typography 
            variant="overline" 
            sx={{ 
              fontSize: '11px', 
              fontWeight: 'bold', 
              color: 'text.secondary', 
              px: 2, 
              mt: 2.5, 
              mb: 1.5, 
              display: 'block', 
              lineHeight: 1 
            }}
          >
            {getCategoryTranslation(category.category, t)}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5, px: 2 }}>
            {category.items.map((device, devIndex) => (
              <Box
                key={devIndex}
                draggable="true"
                onDragStart={(e) => e.dataTransfer.setData('application/reactflow', JSON.stringify(device))}
                sx={{
                  cursor: 'grab',
                  bgcolor: 'background.default',
                  p: 1,
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 1,
                  borderColor: 'divider',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: 1
                  }
                }}
              >
                <img
                  src={iconMap[device.iconKey]}
                  alt={device.label}
                  className="w-8 h-8 object-contain mb-2 pointer-events-none"
                />
                <Typography 
                  sx={{ 
                    fontSize: '10px', 
                    textAlign: 'center', 
                    color: 'text.primary', 
                    fontWeight: 500, 
                    lineHeight: 1.2, 
                    textTransform: 'uppercase' 
                  }}
                >
                  {t(`pidBuilder.devices.${device.label}`, { defaultValue: device.label })}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
      
      {/* Boru ve Akış Kategorisi */}
      <Box sx={{ mt: 1, mb: 3 }}>
        <Typography 
          variant="overline" 
          sx={{ 
            fontSize: '11px', 
            fontWeight: 'bold', 
            color: 'text.secondary', 
            px: 2, 
            mt: 2.5, 
            mb: 1.5, 
            display: 'block', 
            lineHeight: 1 
          }}
        >
          {t('pidBuilder.palette.pipesAndFlows')}
        </Typography>
        <Box 
          sx={{ 
            mx: 1, 
            border: 1, 
            borderColor: 'divider', 
            borderRadius: 2, 
            p: 1, 
            bgcolor: 'background.default', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 1, 
            boxShadow: 1 
          }}
        >
          {flows.map((f) => (
            <Box 
              key={f.type}
              onClick={() => {
                setActiveFlowType(f.type);
                if (selectedEdge) {
                  updateEdgeData(selectedEdge.id, { flowType: f.type });
                }
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer',
                p: 1,
                borderRadius: 1,
                transition: 'all 0.2s',
                bgcolor: activeFlowType === f.type ? 'action.selected' : 'transparent',
                border: 1,
                borderColor: activeFlowType === f.type ? 'primary.main' : 'transparent',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flexShrink: 0, 
                  width: 48, 
                  height: 32, 
                  bgcolor: 'background.paper', 
                  borderRadius: 1, 
                  border: 1, 
                  borderColor: 'divider' 
                }}
              >
                <img src={iconMap[f.type]} alt={f.label} className="w-10 h-6 object-contain pointer-events-none" />
              </Box>
              <Typography sx={{ fontSize: '10px', fontWeight: 'bold', color: 'text.secondary', lineHeight: 1, textTransform: 'uppercase' }}>
                {t(`pidBuilder.flows.${f.label}`, { defaultValue: f.label })}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default DevicePalette;

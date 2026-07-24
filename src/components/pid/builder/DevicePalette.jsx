import React, { useState, useRef } from 'react';
import { deviceCategories } from '../../../data/pid/deviceCatalog';
import { iconMap } from '../../../data/pid/iconMap';
import { usePID } from '../../../context/pid/PIDContext';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { useReactFlow, useOnSelectionChange } from 'reactflow';
import toast from 'react-hot-toast';

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
  const { activeFlowType, setActiveFlowType, selectedEdge, updateEdgeData, addNode } = usePID();
  const { screenToFlowPosition, project, getNodes, setEdges, setCenter, getZoom } = useReactFlow();

  const [isEdgeSelected, setIsEdgeSelected] = useState(false);
  const pipesSectionRef = useRef(null);

  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      const edgeSelected = edges.length === 1 && nodes.length === 0;
      if (edgeSelected && !isEdgeSelected) {
        setTimeout(() => {
          pipesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
      setIsEdgeSelected(edgeSelected);
    },
  });

  const handleDeviceClick = (device) => {
    let position;
    if (screenToFlowPosition) {
       const flowEl = document.querySelector('.react-flow');
       if (flowEl) {
         const rect = flowEl.getBoundingClientRect();
         position = screenToFlowPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
       } else {
         position = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
       }
    } else if (project) {
       position = project({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    } else {
       position = { x: 100, y: 100 };
    }
    
    let hasCollision = true;
    let attempts = 0;
    while(hasCollision && attempts < 20) {
      hasCollision = false;
      for (const node of getNodes()) {
         if (Math.abs(node.position.x - position.x) < 50 && Math.abs(node.position.y - position.y) < 50) {
            position.x += 40;
            position.y += 40;
            hasCollision = true;
            break;
         }
      }
      attempts++;
    }
    
    addNode(device, position);
    setCenter(position.x, position.y, { zoom: getZoom(), duration: 800 });
    toast.success(`${t(`pidBuilder.devices.${device.label}`, { defaultValue: device.label })} eklendi!`);
  };

  const flows = [
    { type: 'duct_mixed', label: 'duct_mixed', color: '#3b82f6' },
    { type: 'duct_hot', label: 'duct_hot', color: '#f97316' },
    { type: 'duct_cold', label: 'duct_cold', color: '#ef4444' },
    { type: 'duct_exhaust', label: 'duct_exhaust', color: '#64748b' }
  ];
  return (
    <Box 
      sx={{ 
        width: '100%',
        height: '100%', 
        flexShrink: 0, 
        overflowY: 'auto',
        overflowX: 'hidden',
        bgcolor: 'background.paper', 
        display: 'flex', 
        flexDirection: 'column', 
        pb: 3,
        userSelect: 'none'
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
                onClick={() => handleDeviceClick(device)}
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
                    textTransform: 'uppercase',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: '100%',
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
          ref={pipesSectionRef}
          sx={{ 
            mx: 1, 
            border: 1, 
            borderColor: isEdgeSelected ? 'primary.main' : 'divider', 
            borderRadius: 2, 
            p: 1, 
            bgcolor: 'background.default', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 1, 
            boxShadow: isEdgeSelected ? '0 0 10px rgba(59, 130, 246, 0.5)' : 1,
            transition: 'all 0.3s ease',
            animation: isEdgeSelected ? 'pulseHighlight 2s infinite' : 'none',
            '@keyframes pulseHighlight': {
              '0%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.4)' },
              '70%': { boxShadow: '0 0 0 8px rgba(59, 130, 246, 0)' },
              '100%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)' }
            }
          }}
        >
          {flows.map((f) => (
            <Box 
              key={f.type}
              onClick={() => {
                setActiveFlowType(f.type);
                if (isEdgeSelected) {
                  setEdges((eds) => eds.map(e => e.selected ? { ...e, data: { ...e.data, flowType: f.type } } : e));
                } else if (selectedEdge) {
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
              <Typography sx={{ 
                fontSize: '10px', 
                fontWeight: 'bold', 
                color: 'text.secondary', 
                lineHeight: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
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

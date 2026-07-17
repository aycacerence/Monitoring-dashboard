import React from 'react';
import { Handle, Position, useReactFlow, getConnectedEdges } from 'reactflow';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { iconMap } from '../../../data/pid/iconMap';
import { useTranslation } from 'react-i18next';

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

  return (
    <Box 
      className={selected ? 'ring-2 ring-blue-500 rounded-lg bg-white dark:bg-slate-800' : 'bg-white dark:bg-slate-800'}
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
          justifyContent: 'center'
        }}
      >
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', pointerEvents: 'none' }} />
      </Handle>
      
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
          justifyContent: 'center'
        }}
      >
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', pointerEvents: 'none' }} />
      </Handle>
    </Box>
  );
};

export default GenericDeviceNode;

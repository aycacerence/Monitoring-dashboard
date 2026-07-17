import React from 'react';
import { Handle, Position } from 'reactflow';
import { Box, Typography } from '@mui/material';
import { iconMap } from '../../../data/pid/iconMap';
import { useTranslation } from 'react-i18next';

const GenericDeviceNode = ({ data, selected }) => {
  const { t } = useTranslation();

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
      <Handle type="target" position={Position.Left} style={{ top: '50%', transform: 'translateY(-50%)' }} />
      
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
      
      <Handle type="source" position={Position.Right} style={{ top: '50%', transform: 'translateY(-50%)' }} />
    </Box>
  );
};

export default GenericDeviceNode;

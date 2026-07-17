import React from 'react';
import { Handle, Position } from 'reactflow';
import { Paper, Typography, Box } from '@mui/material';
import { iconMap } from '../../../data/pid/iconMap';
import { useTranslation } from 'react-i18next';

const MonitoringDeviceNode = ({ data, selected }) => {
  const { t } = useTranslation();

  const getStatusClasses = (status) => {
    switch (status) {
      case 'alarm':
        return 'border-red-500 bg-red-50 dark:bg-red-900/30 animate-pulse';
      case 'warning':
        return 'border-orange-400 bg-orange-50 dark:bg-orange-900/30';
      case 'normal':
        return 'border-green-500 bg-green-50 dark:bg-green-900/30';
      default:
        return 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800';
    }
  };

  return (
    <Paper
      elevation={selected ? 4 : 1}
      className={`rounded-lg border-2 transition-colors duration-500 ${getStatusClasses(data.status)}`}
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
      
      <img src={iconMap[data.iconKey]} alt={data.label || 'icon'} className="w-8 h-8" />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', px: 1 }}>
        <Typography 
          variant="caption" 
          sx={{ 
            fontWeight: 'bold', 
            textTransform: 'uppercase',
            lineHeight: 1
          }}
          className="dark:text-slate-200"
        >
          {data.code}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            textAlign: 'center', 
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: '0.70rem',
            lineHeight: 1.2,
            textTransform: 'uppercase'
          }}
          className="text-gray-500 dark:text-slate-400"
        >
          {t(`pidBuilder.devices.${data.label}`, { defaultValue: data.label })}
        </Typography>
      </Box>
      
      <Typography 
        variant="caption"
        className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border dark:border-slate-600 dark:text-slate-300"
        sx={{ fontSize: '0.65rem', lineHeight: 1 }}
      >
        {data.liveValue !== undefined && data.liveValue !== null && data.liveValue !== '' ? data.liveValue : '--'} {data.unit || ''}
      </Typography>
      
      <Handle type="source" position={Position.Right} style={{ top: '50%', transform: 'translateY(-50%)' }} />
    </Paper>
  );
};

export default MonitoringDeviceNode;

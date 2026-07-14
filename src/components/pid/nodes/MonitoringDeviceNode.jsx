import React from 'react';
import { Handle, Position } from 'reactflow';
import { Paper } from '@mui/material';
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
      className={`p-2 rounded-lg border-2 flex flex-col items-center w-20 transition-colors duration-500 ${getStatusClasses(data.status)}`}
    >
      <Handle type="target" position={Position.Left} />
      
      <img src={iconMap[data.iconKey]} alt={data.label || 'icon'} className="w-8 h-8" />
      
      <span className="text-xs font-semibold uppercase dark:text-slate-200">{data.code}</span>
      <span className="text-[10px] text-gray-500 dark:text-slate-400 uppercase">
        {t(`pidBuilder.devices.${data.label}`, { defaultValue: data.label })}
      </span>
      
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border dark:border-slate-600 mt-1 dark:text-slate-300">
        {data.liveValue !== undefined && data.liveValue !== null && data.liveValue !== '' ? data.liveValue : '--'} {data.unit || ''}
      </span>
      
      <Handle type="source" position={Position.Right} />
    </Paper>
  );
};

export default MonitoringDeviceNode;

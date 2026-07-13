import React from 'react';
import { Handle, Position } from 'reactflow';
import { Paper } from '@mui/material';
import iconMap from '../../../data/pid/iconMap';

const GenericDeviceNode = ({ data, selected }) => {
  return (
    <Paper
      elevation={selected ? 4 : 1}
      className={`p-2 rounded-lg border-2 flex flex-col items-center w-20 ${
        selected ? 'border-blue-500' : 'border-gray-300'
      }`}
    >
      <Handle type="target" position={Position.Left} />
      
      <img src={iconMap[data.iconKey]} alt={data.label || 'icon'} className="w-8 h-8" />
      
      <span className="text-xs font-semibold">{data.code}</span>
      <span className="text-[10px] text-gray-500">{data.label}</span>
      
      <Handle type="source" position={Position.Right} />
    </Paper>
  );
};

export default GenericDeviceNode;

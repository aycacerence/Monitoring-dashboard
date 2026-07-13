import React from 'react';
import { Handle, Position } from 'reactflow';
import { iconMap } from '../../../data/pid/iconMap';

const GenericDeviceNode = ({ data, selected }) => {
  return (
    <div className="relative flex flex-col items-center justify-center">
      <Handle type="target" position={Position.Left} />
      
      <div className={selected ? 'ring-2 ring-blue-500 rounded-lg' : ''}>
        <img src={iconMap[data.iconKey]} alt={data.label || 'icon'} className="w-10 h-10 object-contain" />
      </div>
      
      <span className="text-[10px] text-gray-700 font-medium text-center mt-1">
        {data.label || data.code}
      </span>
      
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default GenericDeviceNode;

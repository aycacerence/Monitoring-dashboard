import React from 'react';
import { Handle, Position } from 'reactflow';
import { iconMap } from '../../../data/pid/iconMap';
import { useTranslation } from 'react-i18next';

const GenericDeviceNode = ({ data, selected }) => {
  const { t } = useTranslation();

  return (
    <div className="relative flex flex-col items-center justify-center">
      <Handle type="target" position={Position.Left} />
      
      <div className={selected ? 'ring-2 ring-blue-500 rounded-lg' : ''}>
        <img src={iconMap[data.iconKey]} alt={data.label || 'icon'} className="w-10 h-10 object-contain" />
      </div>
      
      <span className="text-[10px] text-gray-700 dark:text-slate-200 font-medium text-center mt-1 uppercase">
        {t(`pidBuilder.devices.${data.label}`, { defaultValue: data.label || data.code })}
      </span>
      
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default GenericDeviceNode;

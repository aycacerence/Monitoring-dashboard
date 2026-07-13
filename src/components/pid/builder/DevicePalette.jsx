import React from 'react';
import { deviceCategories } from '../../../data/pid/deviceCatalog';
import iconMap from '../../../data/pid/iconMap';

const DevicePalette = () => {
  return (
    <div className="w-64 h-full flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-white flex flex-col pb-6">
      {deviceCategories.map((category, index) => (
        <div key={index}>
          <h3 className="text-[11px] font-bold text-gray-700 tracking-wider uppercase px-4 mt-5 mb-3">
            {category.category}
          </h3>
          <div className="grid grid-cols-2 gap-3 px-4">
            {category.items.map((device, devIndex) => (
              <div
                key={devIndex}
                draggable="true"
                onDragStart={(e) => e.dataTransfer.setData('application/reactflow', JSON.stringify(device))}
                className="cursor-grab bg-white p-2 rounded-lg flex flex-col items-center justify-center border border-gray-200 hover:border-blue-500 hover:shadow-sm transition-all"
              >
                <img
                  src={iconMap[device.iconKey]}
                  alt={device.label}
                  className="w-8 h-8 object-contain mb-2 pointer-events-none"
                />
                <span className="text-[10px] text-center text-gray-800 font-medium leading-tight">
                  {device.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DevicePalette;

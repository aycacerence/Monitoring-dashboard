import React from 'react';
import { deviceCategories } from '../../../data/pid/deviceCatalog';
import { iconMap } from '../../../data/pid/iconMap';
import { usePID } from '../../../context/pid/PIDContext';
import { useTranslation } from 'react-i18next';

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
    <div className="w-64 h-full flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-white flex flex-col pb-6">
      {deviceCategories.map((category, index) => (
        <div key={index}>
          <h3 className="text-[11px] font-bold text-gray-700 tracking-wider uppercase px-4 mt-5 mb-3">
            {getCategoryTranslation(category.category, t)}
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
                <span className="text-[10px] text-center text-gray-800 font-medium leading-tight uppercase">
                  {t(`pidBuilder.devices.${device.label}`, { defaultValue: device.label })}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {/* Boru ve Akış Kategorisi */}
      <div className="mt-2 mb-6">
        <h3 className="text-[11px] font-bold text-gray-700 tracking-wider uppercase px-4 mt-5 mb-3">
          {t('pidBuilder.palette.pipesAndFlows')}
        </h3>
        <div className="mx-2 border border-gray-200 rounded-lg p-2 bg-white flex flex-col gap-2 shadow-sm">
          {flows.map((f) => (
            <div 
              key={f.type}
              onClick={() => {
                setActiveFlowType(f.type);
                if (selectedEdge) {
                  updateEdgeData(selectedEdge.id, { flowType: f.type });
                }
              }}
              className={`flex items-center space-x-3 cursor-pointer p-2 rounded transition-colors ${activeFlowType === f.type ? 'bg-blue-50 ring-1 ring-blue-400' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center justify-center flex-shrink-0 w-12 h-8 bg-gray-50 rounded border border-gray-100">
                <img src={iconMap[f.type]} alt={f.label} className="w-10 h-6 object-contain pointer-events-none" />
              </div>
              <span className="text-[10px] font-bold text-gray-700 leading-none uppercase">{t(`pidBuilder.flows.${f.label}`, { defaultValue: f.label })}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DevicePalette;

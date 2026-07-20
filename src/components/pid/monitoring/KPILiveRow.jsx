import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import * as LucideIcons from 'lucide-react';
import { getKpiById } from '../../../config/kpiDashboardConfig';

const KPILiveCard = ({ kpiId, liveData }) => {
  const kpi = getKpiById(kpiId);
  const data = liveData?.[kpiId];
  const [flash, setFlash] = useState(false);
  const prevValue = useRef(data?.value);

  useEffect(() => {
    if (data?.value !== undefined && data?.value !== prevValue.current) {
      setFlash(true);
      prevValue.current = data?.value;
      const timer = setTimeout(() => setFlash(false), 300);
      return () => clearTimeout(timer);
    }
  }, [data?.value]);

  if (!kpi || !data) return null;

  const IconComponent = LucideIcons[kpi.icon] || LucideIcons.Activity;

  const isAlarm = data.status === 'alarm';
  const isWarning = data.status === 'warning';

  // Duruma göre kenarlık ve metin renkleri
  let borderColor = 'border-slate-200 dark:border-slate-800';
  if (isAlarm) borderColor = 'border-red-500';
  else if (isWarning) borderColor = 'border-orange-400';

  let textColor = 'text-slate-800 dark:text-slate-100';
  if (isAlarm) textColor = 'text-red-600 dark:text-red-400';
  else if (isWarning) textColor = 'text-orange-500 dark:text-orange-400';

  // Güncelleme anındaki parlama (flash) arka plan rengi
  let flashBg = 'rgba(16, 185, 129, 0.15)'; // Normal için yeşil parlama
  if (isAlarm) flashBg = 'rgba(239, 68, 68, 0.2)'; // Alarm için kırmızı parlama
  else if (isWarning) flashBg = 'rgba(249, 115, 22, 0.2)'; // Uyarı için turuncu parlama

  return (
    <Box 
      className={`relative p-4 rounded-xl border bg-white dark:bg-slate-900 shadow-sm transition-colors duration-300 ${borderColor}`}
      style={{
        backgroundColor: flash ? flashBg : undefined,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <Typography 
          variant="caption" 
          className="font-semibold text-slate-500 dark:text-slate-400 line-clamp-1 mr-2" 
          title={kpi.labelTR}
        >
          {kpi.labelTR}
        </Typography>
        <Box sx={{ color: kpi.iconColor || 'primary.main', display: 'flex', opacity: 0.9 }}>
          <IconComponent size={18} />
        </Box>
      </div>
      <div className="flex items-baseline gap-1 mt-1">
        <Typography variant="h5" className={`font-bold ${textColor}`}>
          {data.value}
        </Typography>
        <Typography variant="caption" className="text-slate-400 font-medium">
          {data.unit || kpi.unit}
        </Typography>
      </div>
    </Box>
  );
};

const KPILiveRow = ({ kpiIds, liveData }) => {
  if (!kpiIds || kpiIds.length === 0) return null;

  return (
    <Box 
      sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '12px', 
        p: 2 
      }}
    >
      {kpiIds.map(id => (
        <KPILiveCard key={id} kpiId={id} liveData={liveData} />
      ))}
    </Box>
  );
};

export default KPILiveRow;

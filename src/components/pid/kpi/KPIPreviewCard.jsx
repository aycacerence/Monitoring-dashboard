import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Chip } from '@mui/material';
import {
  Flame, Fan, BatteryCharging, PiggyBank, Thermometer,
  Sun, SunDim, Wind, Waves, ThermometerSun, Gauge,
  Droplets, BellRing, Power, Activity, ActivitySquare,
  SlidersHorizontal, CheckCircle, ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react';

// Dinamik ikon eşleştirmesi için harita
const iconMap = {
  Flame, Fan, BatteryCharging, PiggyBank, Thermometer,
  Sun, SunDim, Wind, Waves, ThermometerSun, Gauge,
  Droplets, BellRing, Power, Activity, ActivitySquare,
  SlidersHorizontal
};

// Mini grafik bileşeni (Dış kütüphane gerektirmeyen SVG)
const Sparkline = ({ data, colorClass }) => {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1; // 0'a bölmeyi önlemek için
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 40;
    const y = 16 - ((val - min) / range) * 16;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="40" height="16" viewBox="0 -2 40 20" className={colorClass} fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline 
        points={points} 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
};

Sparkline.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number),
  colorClass: PropTypes.string
};

const KPIPreviewCard = memo(({ kpi, selected, onToggle, size = "default", isRecommended = false }) => {
  const IconComponent = iconMap[kpi.icon] || Activity;
  
  const isUp = kpi.trend.direction === 'up';
  const isDown = kpi.trend.direction === 'down';
  
  let trendColor = 'text-slate-400 dark:text-slate-500';
  let TrendIcon = Minus;
  
  if (isUp) {
    trendColor = 'text-emerald-500';
    TrendIcon = ArrowUpRight;
  } else if (isDown) {
    trendColor = 'text-rose-500';
    TrendIcon = ArrowDownRight;
  }

  // İstenen 180-200px genişlik ve 110-120px yükseklik için boyut class'ları
  const sizeClasses = size === 'compact' 
    ? 'w-[160px] h-[100px] p-2' 
    : 'w-[190px] h-[115px] p-3';

  return (
    <div
      role="checkbox"
      aria-checked={selected}
      tabIndex={0}
      onClick={() => onToggle(kpi.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle(kpi.id);
        }
      }}
      className={`
        relative flex flex-col justify-between cursor-pointer rounded-xl bg-white dark:bg-slate-800
        transition-all duration-150 ease-in-out select-none flex-shrink-0
        outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600 focus-visible:outline-offset-2
        ${sizeClasses}
        ${selected 
          ? 'border-2 border-brand-600 shadow-md opacity-100' 
          : 'border border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-85 shadow-sm'
        }
      `}
    >
      {/* Seçili (Selected) Check İkonu */}
      {selected && (
        <div className="absolute -top-2 -right-2 bg-white dark:bg-slate-800 rounded-full shadow-sm z-10">
          <CheckCircle className="w-5 h-5 text-brand-600 bg-white dark:bg-slate-800 rounded-full" />
        </div>
      )}

      {/* Önerilen Chip İkonu */}
      {isRecommended && !selected && (
        <Chip 
          label="Önerilen" 
          size="small" 
          color="info" 
          variant="outlined"
          sx={{ position: 'absolute', top: -10, left: -10, zIndex: 10, pointerEvents: 'none', bgcolor: 'background.paper', fontSize: '0.65rem', height: '20px' }}
        />
      )}

      {/* Üst Satır: İkon ve Başlık */}
      <div className="flex items-center justify-between w-full">
        <div className={`p-1.5 rounded-lg ${selected ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
          <IconComponent className="w-4 h-4" />
        </div>
        <span 
          className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate ml-2 text-right"
          title={kpi.labelTR}
        >
          {kpi.labelTR}
        </span>
      </div>

      {/* Orta Satır: Değer ve Birim */}
      <div className="flex items-baseline mt-2">
        <span className="text-xl font-bold text-slate-900 dark:text-white truncate">
          {kpi.mockValue}
        </span>
        <span className="ml-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          {kpi.unit}
        </span>
      </div>

      {/* Alt Satır: Trend ve Mini Grafik (Sparkline) */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <div className={`flex items-center text-xs font-medium ${trendColor}`}>
          <TrendIcon className="w-3.5 h-3.5 mr-0.5" />
          <span>{kpi.trend.value}%</span>
        </div>
        <Sparkline data={kpi.sparklineData} colorClass={trendColor} />
      </div>
    </div>
  );
});

KPIPreviewCard.displayName = 'KPIPreviewCard';

KPIPreviewCard.propTypes = {
  kpi: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['default', 'compact']),
  isRecommended: PropTypes.bool
};

export default KPIPreviewCard;

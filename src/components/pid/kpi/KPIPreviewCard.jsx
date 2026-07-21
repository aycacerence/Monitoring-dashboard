import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  Flame, Fan, BatteryCharging, PiggyBank, Leaf, Thermometer,
  Sun, SunDim, Wind, Waves, ThermometerSun, Gauge,
  Droplets, BellRing, Power, Activity, ActivitySquare,
  SlidersHorizontal, CheckCircle, ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react';
import LinearProgress from '@mui/material/LinearProgress';

// Dinamik ikon eşleştirmesi için harita
const iconMap = {
  Flame, Fan, BatteryCharging, PiggyBank, Leaf, Thermometer,
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
  const { t, i18n } = useTranslation();
  const IconComponent = iconMap[kpi.icon] || Activity;
  const currentLabel = i18n.language === 'en' ? kpi.labelEN : kpi.labelTR;
  
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

  // Responsive genişlik ve uyumlu yükseklik için boyut class'ları
  const sizeClasses = size === 'compact' 
    ? 'w-full min-w-[140px] h-[100px] p-2.5' 
    : 'w-full min-w-[150px] h-[120px] p-3';

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
        relative flex flex-col justify-between cursor-pointer rounded-xl
        transition-all duration-150 ease-in-out select-none flex-shrink-0
        outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2
        ${sizeClasses}
        ${selected 
          ? 'border-2 border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-md ring-2 ring-blue-100 dark:ring-blue-800/30' 
          : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 hover:shadow-md shadow-sm'
        }
      `}
    >
      {/* Seçili (Selected) Check İkonu */}
      {selected && (
        <div className="absolute -top-2 -right-2 bg-white dark:bg-slate-800 rounded-full shadow-sm z-10">
          <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 rounded-full" />
        </div>
      )}

      {/* Önerilen Chip İkonu */}
      {isRecommended && (
        <Chip 
          label={t('pidBuilder.saveModal.recommended', 'Önerilen')} 
          size="small" 
          color="primary" 
          variant="filled"
          sx={{ 
            position: 'absolute', 
            top: -12, 
            left: 12, 
            zIndex: 10, 
            pointerEvents: 'none', 
            fontSize: '0.65rem', 
            height: '20px',
            boxShadow: 1
          }}
        />
      )}

      {/* Üst Satır: İkon ve Başlık */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center justify-center">
          <IconComponent 
            className="w-[22px] h-[22px]" 
            style={{ color: kpi.iconColor || '#94a3b8' }} 
            strokeWidth={2} 
          />
        </div>
        <span 
          className="font-medium text-[0.8rem] leading-tight text-slate-700 dark:text-slate-300 line-clamp-2 ml-2 flex-1 text-right"
          title={currentLabel}
        >
          {currentLabel}
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

      {/* Alt Satır: Trend ve Mini Grafik (Sparkline) / Progress */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <div className={`flex items-center text-xs font-medium ${kpi.displayFormat === 'basic' ? `px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700/50 ${trendColor}` : trendColor}`}>
          <TrendIcon className="w-3.5 h-3.5 mr-0.5" />
          <span>{kpi.trend.value}{kpi.displayFormat !== 'basic' && '%'}</span>
        </div>
        
        {(!kpi.displayFormat || kpi.displayFormat === 'sparkline') && (
          <Sparkline data={kpi.sparklineData} colorClass={trendColor} />
        )}
        
        {kpi.displayFormat === 'progress' && (
          <div className="w-16">
            <LinearProgress 
              variant="determinate" 
              value={Number(kpi.mockValue) || 50} 
              sx={{ 
                height: 4, 
                borderRadius: 2,
                backgroundColor: 'rgba(148, 163, 184, 0.2)',
                '& .MuiLinearProgress-bar': { backgroundColor: kpi.iconColor || '#3B82F6' }
              }} 
            />
          </div>
        )}
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

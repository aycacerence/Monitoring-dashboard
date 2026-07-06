import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ReactECharts from 'echarts-for-react';
import { Box } from '@mui/material';
import Card from '../../common/Card';
import TrendIndicator from '../../common/TrendIndicator';
import { getIconComponent } from '../../../utils/iconMap';
import { useAppSelector } from '../../../app/hooks';
import { selectIsEditMode } from '../../../features/ui/uiSlice';

function KpiCard({
  title,
  value,
  unit,
  changePercentage,
  changeDirection,
  changeLabel,
  icon,
  sparklineData,
  color,
}) {
  const isEditMode = useAppSelector(selectIsEditMode);
  const IconComponent = getIconComponent(icon);
  const sparklineRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const container = sparklineRef.current;
    if (!container || isEditMode) return undefined;

    const resizeChart = () => {
      chartRef.current?.getEchartsInstance?.()?.resize();
    };
    const observer = new ResizeObserver(resizeChart);
    observer.observe(container);
    requestAnimationFrame(resizeChart);

    return () => observer.disconnect();
  }, [isEditMode]);

  const chartOptions = {
    grid: {
      top: 5,
      bottom: 5,
      left: 0,
      right: 0,
    },
    xAxis: {
      type: 'category',
      show: false,
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    series: [
      {
        data: sparklineData,
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          color: color,
          width: 2,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: `${color}40` }, // %25 opacity
              { offset: 1, color: `${color}00` }, // %0 opacity
            ],
          },
        },
      },
    ],
    tooltip: {
      show: false,
    },
    animation: true,
    animationDuration: 1200,
    animationEasing: 'cubicOut',
    animationDelay: (idx) => idx * 50,
  };

  return (
    <Card hoverable className="flex h-auto flex-col justify-between lg:h-full p-3 lg:p-2.5">
      <div className="mb-2 flex items-start justify-between lg:mb-0.5">
        <div className="flex-1 min-w-0 pr-1.5">
          <p 
            className="mb-0.5 text-xs font-medium text-slate-900 dark:text-white lg:text-[11px] leading-tight line-clamp-2" 
            style={{ wordBreak: 'break-word' }}
          >
            {title}
          </p>
          {isEditMode ? (
            <div className="mt-2 lg:mt-1">
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 lg:text-[10px] leading-tight line-clamp-2">
                Düzenleme modunda önizleme devre dışı
              </span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1 flex-wrap">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white lg:text-lg xl:text-xl truncate">{value}</h3>
              {unit && <span className="text-xs font-medium text-slate-500 dark:text-slate-400 lg:text-[10px] xl:text-xs">{unit}</span>}
            </div>
          )}
        </div>
        <Box
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg lg:h-7 lg:w-7 xl:h-9 xl:w-9"
          sx={{ backgroundColor: `${color}15`, color: color }}
        >
          <IconComponent sx={{ fontSize: { xs: 18, lg: 16, xl: 20 } }} />
        </Box>
      </div>
      
      {!isEditMode && (
        <>
          <div ref={sparklineRef} className="my-2 min-h-[40px] flex-1 lg:my-0.5 lg:min-h-[20px] xl:min-h-[28px]">
            {sparklineData && sparklineData.length > 0 && (
              <ReactECharts
                ref={chartRef}
                option={chartOptions}
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'svg' }}
              />
            )}
          </div>

          <div className="mt-2 lg:mt-0.5">
            <TrendIndicator
              percentage={changePercentage}
              direction={changeDirection}
              label={changeLabel}
            />
          </div>
        </>
      )}
    </Card>
  );
}

KpiCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  unit: PropTypes.string,
  changePercentage: PropTypes.number,
  changeDirection: PropTypes.oneOf(['up', 'down', 'neutral']),
  changeLabel: PropTypes.string,
  icon: PropTypes.string,
  sparklineData: PropTypes.arrayOf(PropTypes.number),
  color: PropTypes.string,
};

export default KpiCard;

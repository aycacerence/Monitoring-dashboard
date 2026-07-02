import PropTypes from 'prop-types';
import ReactECharts from 'echarts-for-react';
import { Box } from '@mui/material';
import Card from '../../common/Card';
import TrendIndicator from '../../common/TrendIndicator';
import { getIconComponent } from '../../../utils/iconMap';

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
  const IconComponent = getIconComponent(icon);

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
  };

  return (
    <Card hoverable className="group flex h-auto flex-col justify-between lg:h-full lg:p-3">
      <div className="mb-2 flex items-start justify-between lg:mb-1">
        <div className="flex-1">
          <p className="mb-1 text-sm font-medium text-slate-900 dark:text-white lg:text-xs">{title}</p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white lg:text-xl xl:text-2xl">{value}</h3>
            {unit && <span className="text-sm font-medium text-slate-500 dark:text-slate-400 lg:text-xs xl:text-sm">{unit}</span>}
          </div>
        </div>
        <Box
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 ease-in-out group-hover:scale-110 lg:h-8 lg:w-8 xl:h-10 xl:w-10"
          sx={{ backgroundColor: `${color}15`, color: color }}
        >
          <IconComponent fontSize="small" />
        </Box>
      </div>
      
      <div className="my-2 min-h-[40px] flex-1 lg:my-1 lg:min-h-[28px] xl:min-h-[36px]">
        {sparklineData && sparklineData.length > 0 && (
          <ReactECharts
            option={chartOptions}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'svg' }}
          />
        )}
      </div>

      <div className="mt-2 lg:mt-1">
        <TrendIndicator
          percentage={changePercentage}
          direction={changeDirection}
          label={changeLabel}
        />
      </div>
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

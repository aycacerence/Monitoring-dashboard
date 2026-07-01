import PropTypes from 'prop-types';
import ReactECharts from 'echarts-for-react';
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
    <Card hoverable className="flex flex-col justify-between h-full">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">{title}</p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
            {unit && <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{unit}</span>}
          </div>
        </div>
        <div
          className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0"
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          <IconComponent fontSize="small" />
        </div>
      </div>
      
      <div className="flex-1 min-h-[40px] my-2">
        {sparklineData && sparklineData.length > 0 && (
          <ReactECharts
            option={chartOptions}
            style={{ height: '40px', width: '100%' }}
            opts={{ renderer: 'svg' }}
          />
        )}
      </div>

      <div className="mt-2">
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

import { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '@mui/material/styles';
import { getCommonChartOptions } from '../../../utils/charts';

function PieChartWidget({ data, height = '300px' }) {
  const theme = useTheme();
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  const option = useMemo(() => {
    if (!data || data.length === 0) return {};

    const commonOptions = getCommonChartOptions(theme.palette.mode, theme.palette);
    const itemBorderColor = theme.palette.background.paper;

    const chartData = data.map((item) => ({
      name: item.status,
      value: item.count,
      itemStyle: { color: item.color },
    }));

    return {
      tooltip: commonOptions.tooltip,
      series: [
        {
          name: 'Cihaz Durumu',
          type: 'pie',
          radius: ['62%', '78%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderColor: itemBorderColor,
            borderWidth: 2,
          },
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          data: chartData,
        },
      ],
    };
  }, [data, theme.palette.mode]);

  useEffect(() => {
    const container = containerRef.current;
    const chart = chartRef.current?.getEchartsInstance?.();
    if (!container || !chart) return undefined;

    const resizeChart = () => chart.resize();
    const observer = new ResizeObserver(resizeChart);
    observer.observe(container);
    requestAnimationFrame(resizeChart);

    return () => observer.disconnect();
  }, [option]);

  return (
    <div ref={containerRef} className="relative h-full min-h-[120px] w-full" style={{ height }}>
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'svg' }}
        notMerge
        lazyUpdate
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="rounded-full bg-white/80 px-2 py-1 text-center leading-none shadow-sm ring-1 ring-slate-100 dark:bg-slate-900/80 dark:ring-slate-800">
          <div className="text-xl font-bold leading-5 text-slate-900 dark:text-white">
            {data.reduce((acc, item) => acc + item.count, 0)}
          </div>
          <div className="mt-0.5 text-[10px] font-medium leading-3 text-slate-500 dark:text-slate-400">
            Toplam
          </div>
        </div>
      </div>
    </div>
  );
}

PieChartWidget.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default PieChartWidget;

import { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '@mui/material/styles';
import { getCommonChartOptions } from '../../../utils/charts';

function BarChartWidget({ data, height = '300px' }) {
  const theme = useTheme();
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  const option = useMemo(() => {
    if (!data || data.length === 0) return {};

    const base = getCommonChartOptions(theme.palette.mode, theme.palette);
    const times    = data.map((item) => item.time);
    const incoming = data.map((item) => item.incoming);
    const outgoing = data.map((item) => item.outgoing);

    return {
      ...base,
      legend: {
        data: ['Gelen', 'Giden'],
        top: 0,
        right: 0,
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: {
          color: theme.palette.text.secondary,
          fontSize: 12,
        },
      },
      grid: {
        top: '15%',
        bottom: '10%',
        left: '2%',
        right: '2%',
        containLabel: true,
      },
      xAxis: { ...base.xAxis, data: times },
      series: [
        {
          name: 'Gelen',
          type: 'bar',
          data: incoming,
          itemStyle: { color: '#6366f1', borderRadius: [4, 4, 0, 0] },
          barMaxWidth: 16,
        },
        {
          name: 'Giden',
          type: 'bar',
          data: outgoing,
          itemStyle: { color: '#10b981', borderRadius: [4, 4, 0, 0] },
          barMaxWidth: 16,
        },
      ],
    };
  }, [data, theme.palette.mode]); // eslint-disable-line react-hooks/exhaustive-deps

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
    <div ref={containerRef} className="flex-1 min-h-0 relative w-full mt-2" style={{ height }}>
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, height: '100%', width: '100%' }}
        opts={{ renderer: 'svg' }}
        notMerge
        lazyUpdate
      />
    </div>
  );
}

BarChartWidget.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.string.isRequired,
      incoming: PropTypes.number.isRequired,
      outgoing: PropTypes.number.isRequired,
    })
  ).isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default BarChartWidget;

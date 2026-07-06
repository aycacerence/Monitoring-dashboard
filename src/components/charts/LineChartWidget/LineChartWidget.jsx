import { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '@mui/material/styles';
import { getCommonChartOptions } from '../../../utils/charts';
import { useAppSelector } from '../../../app/hooks';
import { selectIsEditMode } from '../../../features/ui/uiSlice';
import WidgetPlaceholder from '../../common/WidgetPlaceholder/WidgetPlaceholder';

function LineChartWidget({ data, seriesName, color, height = '300px' }) {
  const theme = useTheme();
  const isEditMode = useAppSelector(selectIsEditMode);
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  const option = useMemo(() => {
    if (!data || data.length === 0) return {};

    const base = getCommonChartOptions(theme.palette.mode, theme.palette);
    const times  = data.map((item) => item.time);
    const values = data.map((item) => item.value);

    return {
      ...base,
      grid: {
        top: '15%',
        bottom: '10%',
        left: '2%',
        right: '2%',
        containLabel: true,
      },
      yAxis: {
        ...base.yAxis,
        min: 0,
        max: 100,
        axisLabel: { ...base.yAxis.axisLabel, formatter: '{value}%' },
      },
      xAxis: { ...base.xAxis, data: times },
      series: [
        {
          name: seriesName,
          data: values,
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: { color, width: 3 },
          areaStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: `${color}60` },
                { offset: 1, color: `${color}00` },
              ],
            },
          },
        },
      ],
    };
  }, [data, seriesName, color, theme.palette.mode]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isEditMode) return undefined;

    const container = containerRef.current;
    const chart = chartRef.current?.getEchartsInstance?.();
    if (!container || !chart) return undefined;

    const resizeChart = () => chart.resize();
    const observer = new ResizeObserver(resizeChart);
    observer.observe(container);
    requestAnimationFrame(resizeChart);

    return () => observer.disconnect();
  }, [isEditMode, option]);

  if (isEditMode) return <WidgetPlaceholder widgetId="cpuChart" />;

  return (
    <div ref={containerRef} className="flex-1 min-h-[160px] relative w-full mt-2 lg:min-h-0" style={{ height }}>
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

LineChartWidget.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ),
  seriesName: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default LineChartWidget;

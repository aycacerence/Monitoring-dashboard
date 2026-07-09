import { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '@mui/material/styles';
import { getCommonChartOptions } from '../../../utils/charts';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../app/hooks';
import { selectIsEditMode } from '../../../features/ui/uiSlice';

function BarChartWidget({ data, height = '300px' }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isEditMode = useAppSelector(selectIsEditMode);
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
        data: [t('charts.incoming', 'Gelen'), t('charts.outgoing', 'Giden')],
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
          name: t('charts.incoming', 'Gelen'),
          type: 'bar',
          data: incoming,
          itemStyle: { color: '#6366f1', borderRadius: [4, 4, 0, 0] },
          barMaxWidth: 16,
        },
        {
          name: t('charts.outgoing', 'Giden'),
          type: 'bar',
          data: outgoing,
          itemStyle: { color: '#10b981', borderRadius: [4, 4, 0, 0] },
          barMaxWidth: 16,
        },
      ],
    };
  }, [data, theme.palette.mode, t]); // eslint-disable-line react-hooks/exhaustive-deps

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

  return (
    <div ref={containerRef} className="flex-1 min-h-[160px] relative w-full mt-2 lg:min-h-0" style={{ height, pointerEvents: isEditMode ? 'none' : 'auto' }}>
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
  ),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default BarChartWidget;

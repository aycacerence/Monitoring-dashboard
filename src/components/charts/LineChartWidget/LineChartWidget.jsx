import { useMemo } from 'react';
import PropTypes from 'prop-types';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '@mui/material/styles';
import { getCommonChartOptions } from '../../../utils/charts';

function LineChartWidget({ data, seriesName, color, height = '300px' }) {
  const theme = useTheme();

  const option = useMemo(() => {
    if (!data || data.length === 0) return {};

    const base = getCommonChartOptions(theme.palette.mode, theme.palette);
    const times  = data.map((item) => item.time);
    const values = data.map((item) => item.value);

    return {
      ...base,
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

  return (
    <div style={{ height, width: '100%' }}>
      <ReactECharts
        option={option}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'svg' }}
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
  ).isRequired,
  seriesName: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default LineChartWidget;

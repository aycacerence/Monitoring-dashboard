import { useMemo } from 'react';
import PropTypes from 'prop-types';
import ReactECharts from 'echarts-for-react';
import { commonChartOptions } from '../../../utils/charts';

function BarChartWidget({ data, height = '300px' }) {
  const option = useMemo(() => {
    if (!data || data.length === 0) return {};

    const times = data.map((item) => item.time);
    const incoming = data.map((item) => item.incoming);
    const outgoing = data.map((item) => item.outgoing);

    return {
      ...commonChartOptions,
      legend: {
        data: ['Gelen', 'Giden'],
        top: 0,
        right: 0,
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: {
          color: '#64748b', // slate-500
          fontSize: 12,
        },
      },
      grid: {
        ...commonChartOptions.grid,
        top: 30, // Make room for legend
      },
      xAxis: {
        ...commonChartOptions.xAxis,
        data: times,
      },
      series: [
        {
          name: 'Gelen',
          type: 'bar',
          data: incoming,
          itemStyle: {
            color: '#3b82f6', // blue-500
            borderRadius: [4, 4, 0, 0],
          },
          barMaxWidth: 16,
        },
        {
          name: 'Giden',
          type: 'bar',
          data: outgoing,
          itemStyle: {
            color: '#10b981', // emerald-500
            borderRadius: [4, 4, 0, 0],
          },
          barMaxWidth: 16,
        },
      ],
    };
  }, [data]);

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

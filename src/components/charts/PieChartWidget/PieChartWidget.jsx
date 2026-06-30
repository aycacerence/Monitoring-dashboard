import { useMemo } from 'react';
import PropTypes from 'prop-types';
import ReactECharts from 'echarts-for-react';

function PieChartWidget({ data, height = '300px' }) {
  const option = useMemo(() => {
    if (!data || data.length === 0) return {};

    const chartData = data.map((item) => ({
      name: item.status,
      value: item.count,
      itemStyle: { color: item.color },
    }));

    const total = data.reduce((acc, item) => acc + item.count, 0);

    return {
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        textStyle: { color: '#0f172a', fontSize: 12 },
        padding: [8, 12],
        extraCssText: 'box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border-radius: 6px;',
      },
      title: {
        text: total.toString(),
        subtext: 'Toplam',
        left: 'center',
        top: 'center',
        textStyle: {
          fontSize: 24,
          fontWeight: 'bold',
          color: '#0f172a', // slate-900
        },
        subtextStyle: {
          fontSize: 12,
          color: '#64748b', // slate-500
        },
      },
      series: [
        {
          name: 'Cihaz Durumu',
          type: 'pie',
          radius: ['60%', '80%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#fff',
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

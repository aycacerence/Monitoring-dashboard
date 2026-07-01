import { useMemo } from 'react';
import PropTypes from 'prop-types';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '@mui/material/styles';
import { getCommonChartOptions } from '../../../utils/charts';

function PieChartWidget({ data, height = '300px' }) {
  const theme = useTheme();

  const option = useMemo(() => {
    if (!data || data.length === 0) return {};

    const commonOptions = getCommonChartOptions(theme.palette.mode, theme.palette);
    const tooltipBg = theme.palette.background.paper;
    const borderColor = theme.palette.divider;
    const textColor = theme.palette.text.primary;
    const subtextColor = theme.palette.text.secondary;
    const itemBorderColor = theme.palette.background.paper;

    const chartData = data.map((item) => ({
      name: item.status,
      value: item.count,
      itemStyle: { color: item.color },
    }));

    const total = data.reduce((acc, item) => acc + item.count, 0);

    return {
      tooltip: commonOptions.tooltip,
      title: {
        text: total.toString(),
        subtext: 'Toplam',
        left: 'center',
        top: 'center',
        textStyle: {
          fontSize: 24,
          fontWeight: 'bold',
          color: textColor,
        },
        subtextStyle: {
          fontSize: 12,
          color: subtextColor,
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

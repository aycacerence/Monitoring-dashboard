export const commonChartOptions = {
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#e2e8f0', // slate-200
    borderWidth: 1,
    textStyle: {
      color: '#0f172a', // slate-900
      fontSize: 12,
    },
    padding: [8, 12],
    extraCssText: 'box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); border-radius: 6px;',
  },
  grid: {
    top: 40,
    right: 20,
    bottom: 20,
    left: 40,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    axisLine: {
      lineStyle: {
        color: '#e2e8f0', // slate-200
      },
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: '#64748b', // slate-500
      margin: 12,
      fontSize: 11,
    },
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        color: '#f1f5f9', // slate-100
        type: 'dashed',
      },
    },
    axisLabel: {
      color: '#64748b', // slate-500
      fontSize: 11,
    },
  },
};

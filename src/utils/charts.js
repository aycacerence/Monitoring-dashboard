/**
 * Tema renklerine duyarlı ECharts ortak seçenekleri üretir.
 * @param {'light'|'dark'} mode
 * @param {object} palette  MUI theme.palette
 */
export const getCommonChartOptions = (mode, palette) => {
  const isDark = mode === 'dark';
  const tooltipBg   = palette.background.paper;
  const borderColor = palette.divider;
  const textColor   = palette.text.primary;
  const axisColor   = palette.divider;
  const labelColor  = palette.text.secondary;
  const gridLine    = palette.divider;

  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: tooltipBg,
      borderColor,
      borderWidth: 1,
      textStyle: { color: textColor, fontSize: 12 },
      padding: [8, 12],
      extraCssText:
        'box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.2); border-radius: 6px;',
    },
    grid: {
      top: 40, right: 20, bottom: 20, left: 40,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      axisLine: { lineStyle: { color: axisColor } },
      axisTick: { show: false },
      axisLabel: { color: labelColor, margin: 12, fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: gridLine, type: 'dashed' } },
      axisLabel: { color: labelColor, fontSize: 11 },
    },
  };
};

// Geriye dönük uyumluluk için statik export (mevcut bağımlılıklar kırılmasın)
export const commonChartOptions = getCommonChartOptions('light', {
  divider: '#e2e8f0',
  text: { primary: '#0f172a', secondary: '#64748b' },
  background: { paper: '#ffffff' },
});

/**
 * Tema renklerine duyarlı ECharts ortak seçenekleri üretir.
 * @param {'light'|'dark'} mode
 * @param {object} palette  MUI theme.palette
 */
export const getCommonChartOptions = (mode, palette) => {
  const isDark = mode === 'dark';
  const tooltipBg   = isDark ? 'rgba(26,29,39,0.97)' : 'rgba(255,255,255,0.97)';
  const borderColor = isDark ? palette.divider : '#e2e8f0';
  const textColor   = isDark ? palette.text.primary : '#0f172a';
  const axisColor   = isDark ? '#2d3348' : '#e2e8f0';
  const labelColor  = isDark ? palette.text.secondary : '#64748b';
  const gridLine    = isDark ? '#1e2235' : '#f1f5f9';

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
});

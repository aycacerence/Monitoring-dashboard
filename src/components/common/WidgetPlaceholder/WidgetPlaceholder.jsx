import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

const WIDGET_STYLES = {
  kpiGrid: { color: '#6366f1', label: 'KPI Kartları', icon: '▦' },
  cpuChart: { color: '#3b82f6', label: 'CPU Kullanımı', icon: '📈' },
  networkChart: { color: '#06b6d4', label: 'Ağ Trafiği', icon: '📊' },
  deviceStatusChart: { color: '#8b5cf6', label: 'Cihaz Durumları', icon: '🍩' },
  alertsCard: { color: '#ef4444', label: 'Son Alarmlar', icon: '🔔' },
  systemSummary: { color: '#10b981', label: 'Sistem Özeti', icon: '📋' },
  devicesTable: { color: '#f59e0b', label: 'Cihaz Yönetimi', icon: '🖥️' },
  resourceUsage: { color: '#a42350', label: 'Kaynak Kullanımı', icon: '⚡' },
};

export default function WidgetPlaceholder({ widgetId }) {
  const style = WIDGET_STYLES[widgetId] ?? { color: '#94a3b8', label: widgetId, icon: '▦' };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
        bgcolor: `${style.color}08`,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: style.color, fontWeight: 700, display: 'block' }}>
          {style.label}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: 10 }}>
          Düzenleme modunda önizleme devre dışı
        </Typography>
      </Box>
    </Box>
  );
}

WidgetPlaceholder.propTypes = {
  widgetId: PropTypes.string.isRequired,
};

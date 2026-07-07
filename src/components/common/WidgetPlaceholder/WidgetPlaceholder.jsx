import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function WidgetPlaceholder({ widgetId }) {
  const { t } = useTranslation();

  const WIDGET_STYLES = {
    'kpi-total-devices': { color: '#6366f1', label: t('kpi.totalDevices', 'Toplam Cihaz'), icon: '▦' },
    'kpi-online-devices': { color: '#6366f1', label: t('kpi.onlineDevices', 'Çevrimiçi Cihaz'), icon: '▦' },
    'kpi-active-alarms': { color: '#6366f1', label: t('kpi.activeAlarms', 'Aktif Alarm'), icon: '▦' },
    'kpi-average-cpu': { color: '#6366f1', label: t('kpi.cpuUsage', 'CPU Kullanımı'), icon: '▦' },
    'kpi-average-memory': { color: '#6366f1', label: t('kpi.memoryUsage', 'Bellek Kullanımı'), icon: '▦' },
    'kpi-average-disk': { color: '#6366f1', label: t('kpi.diskUsage', 'Disk Kullanımı'), icon: '▦' },
    cpuChart: { color: '#3b82f6', label: t('sidebar.widgets.cpuChart', 'CPU Kullanımı (Grafik)'), icon: '📈' },
    networkChart: { color: '#06b6d4', label: t('sidebar.widgets.networkChart', 'Ağ Trafiği'), icon: '📊' },
    deviceStatusChart: { color: '#8b5cf6', label: t('sidebar.widgets.deviceStatusChart', 'Cihaz Durumları'), icon: '🍩' },
    alertsCard: { color: '#ef4444', label: t('sidebar.widgets.alertsCard', 'Son Alarmlar'), icon: '🔔' },
    systemSummary: { color: '#10b981', label: t('sidebar.widgets.systemSummary', 'Sistem Özeti'), icon: '📋' },
    devicesTable: { color: '#f59e0b', label: t('sidebar.widgets.devicesTable', 'Cihaz Yönetimi'), icon: '🖥️' },
    resourceUsage: { color: '#a42350', label: t('sidebar.widgets.resourceUsage', 'Kaynak Kullanımı'), icon: '⚡' },
  };

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
          {t('sidebar.editModePreviewDisabled', 'Düzenleme modunda önizleme devre dışı')}
        </Typography>
      </Box>
    </Box>
  );
}

WidgetPlaceholder.propTypes = {
  widgetId: PropTypes.string.isRequired,
};

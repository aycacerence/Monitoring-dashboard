import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  KpiPreview, LineChartPreview, BarChartPreview, PieChartPreview,
  AlertsPreview, SystemSummaryPreview, DevicesPreview, ResourceUsagePreview,
} from '../WidgetPreview';

const PREVIEWS = {
  'kpi-total-devices': KpiPreview,
  'kpi-online-devices': KpiPreview,
  'kpi-active-alarms': KpiPreview,
  'kpi-average-cpu': KpiPreview,
  'kpi-average-memory': KpiPreview,
  'kpi-average-disk': KpiPreview,
  cpuChart: LineChartPreview,
  networkChart: BarChartPreview,
  deviceStatusChart: PieChartPreview,
  alertsCard: AlertsPreview,
  systemSummary: SystemSummaryPreview,
  devicesTable: DevicesPreview,
  resourceUsage: ResourceUsagePreview,
};

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
  const PreviewComponent = PREVIEWS[widgetId];

  return (
    <Box
      data-testid="widget-placeholder"
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        pointerEvents: 'none', // Sürüklerken etkileşimi engelle
        opacity: 0.85,
        boxShadow: 1,
      }}
    >
      {/* Başlık kısmı - mock preview'larda başlık sildiğimiz için buraya ekliyoruz */}
      <Box sx={{ 
        px: 2, py: 1, 
        borderBottom: '1px dashed', borderColor: 'divider', 
        bgcolor: 'action.hover',
        display: 'flex', alignItems: 'center'
      }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary' }}>
          {style.label}
        </Typography>
      </Box>

      {/* İçerik (Preview) alanı */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {PreviewComponent ? (
          <PreviewComponent widgetId={widgetId} />
        ) : (
          <Box sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              {t('sidebar.editModePreviewDisabled', 'Önizleme bulunamadı')}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

WidgetPlaceholder.propTypes = {
  widgetId: PropTypes.string.isRequired,
};

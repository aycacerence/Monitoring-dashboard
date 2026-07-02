import { Drawer, Box, Typography, Divider, Switch, FormControlLabel, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectVisibility, toggleWidget, resetVisibility, WIDGET_IDS } from '../../../features/widgetVisibility/widgetVisibilitySlice';
import { selectRole } from '../../../features/auth/authSlice';
import Button from '@mui/material/Button';

function WidgetSidebar({ open, onClose }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const dispatch = useAppDispatch();
  const visibility = useAppSelector(selectVisibility);
  const role = useAppSelector(selectRole);

  const widgets = [
    { id: WIDGET_IDS.KPI_GRID, label: t('sidebar.widgets.kpiGrid', 'KPI Kartları') },
    { id: WIDGET_IDS.CPU_CHART, label: t('sidebar.widgets.cpuChart', 'CPU Kullanımı') },
    { id: WIDGET_IDS.NETWORK_CHART, label: t('sidebar.widgets.networkChart', 'Ağ Trafiği') },
    { id: WIDGET_IDS.DEVICE_STATUS_CHART, label: t('sidebar.widgets.deviceStatusChart', 'Cihaz Durumları') },
    { id: WIDGET_IDS.ALERTS_CARD, label: t('sidebar.widgets.alertsCard', 'Son Alarmlar') },
    { id: WIDGET_IDS.SYSTEM_SUMMARY, label: t('sidebar.widgets.systemSummary', 'Sistem Özeti') },
    // Only add DEVICES_TABLE if admin
    ...(role === 'admin' ? [{ id: WIDGET_IDS.DEVICES_TABLE, label: t('sidebar.widgets.devicesTable', 'Cihaz Yönetimi') }] : []),
    { id: WIDGET_IDS.RESOURCE_USAGE, label: t('sidebar.widgets.resourceUsage', 'Kaynak Kullanımı') },
  ];

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: open ? 280 : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          position: 'static',
          height: '100%',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {t('sidebar.title', 'Widget Yönetimi')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('sidebar.subtitle', 'Paneli kişiselleştirin')}
        </Typography>

        <Button 
          variant="outlined" 
          size="small" 
          onClick={() => dispatch(resetVisibility())}
          sx={{ mb: 2 }}
        >
          {t('sidebar.reset', 'Sıfırla')}
        </Button>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {widgets.map((widget) => (
            <FormControlLabel
              key={widget.id}
              control={
                <Switch
                  checked={!!visibility[widget.id]}
                  onChange={() => dispatch(toggleWidget(widget.id))}
                  color="primary"
                />
              }
              label={widget.label}
              sx={{ width: '100%', mb: 1 }}
            />
          ))}
        </Box>
      </Box>
    </Drawer>
  );
}

export default WidgetSidebar;

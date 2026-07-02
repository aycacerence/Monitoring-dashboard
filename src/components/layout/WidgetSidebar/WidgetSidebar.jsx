import { Drawer, Box, Typography, Divider, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectVisibility, hideAllWidgets, WIDGET_IDS } from '../../../features/widgetVisibility/widgetVisibilitySlice';
import { selectRole } from '../../../features/auth/authSlice';
import Button from '@mui/material/Button';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MemoryIcon from '@mui/icons-material/Memory';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import PieChartIcon from '@mui/icons-material/PieChart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SummarizeIcon from '@mui/icons-material/Summarize';
import DevicesIcon from '@mui/icons-material/Devices';
import SpeedIcon from '@mui/icons-material/Speed';

function WidgetSidebar({ open, onClose }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const dispatch = useAppDispatch();
  const visibility = useAppSelector(selectVisibility);
  const role = useAppSelector(selectRole);

  const widgets = [
    { id: WIDGET_IDS.KPI_GRID, label: t('sidebar.widgets.kpiGrid', 'KPI Kartları'), Icon: DashboardIcon },
    { id: WIDGET_IDS.CPU_CHART, label: t('sidebar.widgets.cpuChart', 'CPU Kullanımı'), Icon: MemoryIcon },
    { id: WIDGET_IDS.NETWORK_CHART, label: t('sidebar.widgets.networkChart', 'Ağ Trafiği'), Icon: NetworkCheckIcon },
    { id: WIDGET_IDS.DEVICE_STATUS_CHART, label: t('sidebar.widgets.deviceStatusChart', 'Cihaz Durumları'), Icon: PieChartIcon },
    { id: WIDGET_IDS.ALERTS_CARD, label: t('sidebar.widgets.alertsCard', 'Son Alarmlar'), Icon: NotificationsIcon },
    { id: WIDGET_IDS.SYSTEM_SUMMARY, label: t('sidebar.widgets.systemSummary', 'Sistem Özeti'), Icon: SummarizeIcon },
    // Only add DEVICES_TABLE if admin
    ...(role === 'admin' ? [{ id: WIDGET_IDS.DEVICES_TABLE, label: t('sidebar.widgets.devicesTable', 'Cihaz Yönetimi'), Icon: DevicesIcon }] : []),
    { id: WIDGET_IDS.RESOURCE_USAGE, label: t('sidebar.widgets.resourceUsage', 'Kaynak Kullanımı'), Icon: SpeedIcon },
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
          color="error"
          onClick={() => dispatch(hideAllWidgets())}
          sx={{ mb: 2 }}
        >
          {t('sidebar.clearBoard', 'Panoyu Temizle')}
        </Button>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', pr: 0.5 }}>
          {widgets.map(({ id, label, Icon }) => (
              <Box
                key={id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = 'copy';
                  e.dataTransfer.setData('text/plain', id); // RGL'nin drop anında bu veriyi okuyabilmesi için zorunludur
                  window.dispatchEvent(new CustomEvent('rgl:dragstart', { detail: { widgetId: id } }));
                }}
                sx={{
                  display: 'flex',
                  minHeight: 82,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 1,
                  mb: 2,
                  borderRadius: 2,
                  border: '1px dashed',
                  borderColor: 'divider',
                  bgcolor: 'action.hover',
                  color: 'primary.main',
                  cursor: 'grab',
                  userSelect: 'none',
                  opacity: visibility[id] ? 0.62 : 1,
                  transition: 'background-color 160ms ease, border-color 160ms ease, transform 160ms ease, opacity 160ms ease',
                  '&:hover': {
                    bgcolor: 'background.paper',
                    borderColor: 'primary.main',
                    transform: 'translateY(-1px)',
                  },
                  '&:active': {
                    cursor: 'grabbing',
                  },
                }}
              >
                <Icon sx={{ fontSize: 22 }} />
                <Typography variant="caption" color="text.primary" sx={{ fontWeight: 500, textAlign: 'center' }}>
                  {label}
                </Typography>
              </Box>
          ))}
        </Box>
      </Box>
    </Drawer>
  );
}

export default WidgetSidebar;

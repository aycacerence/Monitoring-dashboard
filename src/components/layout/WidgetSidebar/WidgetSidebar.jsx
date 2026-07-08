import { Drawer, Box, Typography, Divider, useMediaQuery, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectVisibility, hideAllWidgets, setWidgetVisibility, resetVisibility, commitVisibility, revertVisibility, WIDGET_IDS, ORIGINAL_POSITIONS } from '../../../features/widgetVisibility/widgetVisibilitySlice';
import { setIsDirty } from '../../../features/ui/uiSlice';
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
import { useState } from 'react';
import {
  KpiPreview, LineChartPreview, BarChartPreview, PieChartPreview,
  AlertsPreview, SystemSummaryPreview, DevicesPreview, ResourceUsagePreview,
} from '../../common/WidgetPreview';

const WIDGET_PREVIEWS = {
  [WIDGET_IDS.KPI_TOTAL_DEVICES]:   KpiPreview,
  [WIDGET_IDS.KPI_ONLINE_DEVICES]:  KpiPreview,
  [WIDGET_IDS.KPI_ACTIVE_ALARMS]:   KpiPreview,
  [WIDGET_IDS.KPI_AVERAGE_CPU]:     KpiPreview,
  [WIDGET_IDS.KPI_AVERAGE_MEMORY]:  KpiPreview,
  [WIDGET_IDS.KPI_AVERAGE_DISK]:    KpiPreview,
  [WIDGET_IDS.CPU_CHART]:           LineChartPreview,
  [WIDGET_IDS.NETWORK_CHART]:       BarChartPreview,
  [WIDGET_IDS.DEVICE_STATUS_CHART]: PieChartPreview,
  [WIDGET_IDS.ALERTS_CARD]:         AlertsPreview,
  [WIDGET_IDS.SYSTEM_SUMMARY]:      SystemSummaryPreview,
  [WIDGET_IDS.DEVICES_TABLE]:       DevicesPreview,
  [WIDGET_IDS.RESOURCE_USAGE]:      ResourceUsagePreview,
};

function WidgetSidebar({ open, onClose }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const useToggleControls = useMediaQuery(theme.breakpoints.down('lg'));
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  
  const dispatch = useAppDispatch();
  const visibility = useAppSelector(selectVisibility);
  const role = useAppSelector(selectRole);
  const isDirty = useAppSelector((state) => state.ui.isDirty);

  const handleDefaultView = () => {
    dispatch(resetVisibility());
    window.dispatchEvent(new Event('dashboard:preview-default'));
    dispatch(setIsDirty(true));
  };

  const handleConfirmSave = () => {
    window.dispatchEvent(new Event('save-layout'));
    dispatch(commitVisibility({ role }));
    setSaveConfirmOpen(false);
  };

  const widgets = [
    { id: WIDGET_IDS.KPI_TOTAL_DEVICES, label: t('kpi.totalDevices', 'Toplam Cihaz'), Icon: DashboardIcon },
    { id: WIDGET_IDS.KPI_ONLINE_DEVICES, label: t('kpi.onlineDevices', 'Çevrimiçi Cihaz'), Icon: DashboardIcon },
    { id: WIDGET_IDS.KPI_ACTIVE_ALARMS, label: t('kpi.activeAlarms', 'Aktif Alarm'), Icon: DashboardIcon },
    { id: WIDGET_IDS.KPI_AVERAGE_CPU, label: t('kpi.averageCpu', 'CPU Kullanımı'), Icon: DashboardIcon },
    { id: WIDGET_IDS.KPI_AVERAGE_MEMORY, label: t('kpi.averageMemory', 'Bellek Kullanımı'), Icon: DashboardIcon },
    { id: WIDGET_IDS.KPI_AVERAGE_DISK, label: t('kpi.averageDisk', 'Disk Kullanımı'), Icon: DashboardIcon },
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

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => {
              dispatch(hideAllWidgets({ role }));
              dispatch(setIsDirty(true));
            }}
            sx={{
              color: 'primary.main',
              borderColor: 'primary.light',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
              },
            }}
          >
            {t('sidebar.clearBoard', 'Panoyu Temizle')}
          </Button>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={handleDefaultView}
            sx={{
              color: 'primary.main',
              borderColor: 'primary.light',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
              },
            }}
          >
            {t('sidebar.defaultView', 'Varsayılan')}
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', pr: 0.5 }}>
          {widgets.map(({ id, label, Icon }) => {
            const isAlreadyVisible = visibility[id] === true;

            if (useToggleControls) {
              return (
                <Box
                  key={id}
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    minHeight: 58,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1.5,
                    mb: 1.5,
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: isAlreadyVisible ? 'primary.light' : 'divider',
                    bgcolor: isAlreadyVisible ? 'primary.main' : 'action.hover',
                    color: isAlreadyVisible ? 'primary.contrastText' : 'text.primary',
                    opacity: isAlreadyVisible ? 0.68 : 1,
                  }}
                >
                  <Box sx={{ display: 'flex', minWidth: 0, alignItems: 'center', gap: 1.25 }}>
                    <Icon sx={{ fontSize: 20, color: isAlreadyVisible ? 'inherit' : 'primary.main' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                      {label}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    variant={isAlreadyVisible ? 'contained' : 'outlined'}
                    color={isAlreadyVisible ? 'inherit' : 'primary'}
                    disabled={isAlreadyVisible}
                    onClick={() => {
                      dispatch(setWidgetVisibility({ id, visible: true, role }));
                      dispatch(setIsDirty(true));
                    }}
                    sx={{
                      minWidth: 70,
                      bgcolor: isAlreadyVisible ? 'background.paper' : undefined,
                      color: isAlreadyVisible ? 'primary.main' : undefined,
                      '&:hover': {
                        bgcolor: isAlreadyVisible ? 'background.paper' : undefined,
                      },
                    }}
                  >
                    {isAlreadyVisible ? t('sidebar.onBoard', 'Panoda') : t('sidebar.show', 'Aç')}
                  </Button>
                  {isAlreadyVisible && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'success.main',
                        boxShadow: '0 0 0 2px white',
                      }}
                    />
                  )}
                </Box>
              );
            }

            const PreviewComponent = WIDGET_PREVIEWS[id];

            return (
              <Box
                key={id}
                draggable={!isAlreadyVisible}
                onDragStart={isAlreadyVisible
                  ? undefined
                  : (e) => {
                      e.dataTransfer.effectAllowed = 'copy';
                      e.dataTransfer.setData('text/plain', id); // RGL'nin drop anında bu veriyi okuyabilmesi için zorunludur
                      window.dispatchEvent(new CustomEvent('rgl:dragstart', {
                        detail: {
                          widgetId: id,
                          w: ORIGINAL_POSITIONS[id]?.w ?? 4,
                          h: ORIGINAL_POSITIONS[id]?.h ?? 4,
                        },
                      }));
                    }}
                onDragEnd={() => window.dispatchEvent(new Event('rgl:dragend'))}
                sx={{
                  height: 120,
                  mb: 2,
                  borderRadius: 1.5,
                  border: '1px solid',
                  borderColor: isAlreadyVisible ? 'divider' : 'primary.main',
                  overflow: 'hidden',
                  cursor: isAlreadyVisible ? 'not-allowed' : 'grab',
                  opacity: isAlreadyVisible ? 0.4 : 1,
                  pointerEvents: isAlreadyVisible ? 'none' : 'auto',
                  transition: 'all 0.15s ease',
                  bgcolor: 'background.paper',
                  position: 'relative',
                  userSelect: 'none',
                  '&:hover': isAlreadyVisible ? {} : {
                    borderColor: 'primary.dark',
                    boxShadow: 2,
                    transform: 'translateY(-1px)',
                  },
                  '&:active': {
                    cursor: 'grabbing',
                  },
                }}
              >
                {/* Widget başlığı — üstte küçük etiket */}
                <Box sx={{
                  px: 1, py: 0.4,
                  bgcolor: 'action.hover',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <Typography sx={{ fontSize: 9, fontWeight: 600, color: 'text.secondary' }}>
                    {label}
                  </Typography>
                  {isAlreadyVisible && (
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main' }} />
                  )}
                </Box>

                {/* Preview alanı */}
                <Box sx={{ height: 'calc(100% - 26px)', overflow: 'hidden' }}>
                  {PreviewComponent && <PreviewComponent widgetId={id} />}
                </Box>
              </Box>
            );
          })}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            disabled={!isDirty}
            onClick={() => {
              dispatch(revertVisibility());
              window.dispatchEvent(new Event('cancel-layout'));
            }}
          >
            {t('sidebar.cancel', 'İptal')}
          </Button>
          <Button
            variant="contained"
            size="small"
            disabled={!isDirty}
            onClick={() => setSaveConfirmOpen(true)}
          >
            {t('sidebar.save', 'Kaydet')}
          </Button>
        </Box>
      </Box>

      <Dialog
        open={saveConfirmOpen}
        onClose={() => setSaveConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t('sidebar.saveConfirmTitle', 'Kaydet')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('sidebar.saveConfirmMessage', 'Değişiklikleri kaydetmek istediğinize emin misiniz?')}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setSaveConfirmOpen(false)}>
            {t('sidebar.cancel', 'İptal')}
          </Button>
          <Button variant="contained" onClick={handleConfirmSave}>
            {t('sidebar.confirm', 'Onayla')}
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
}

export default WidgetSidebar;

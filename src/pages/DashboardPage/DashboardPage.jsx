import { useEffect, useMemo, useState, useRef } from 'react';
import { Skeleton } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchKpis } from '../../features/dashboard/kpiSlice'; 
import { fetchCharts } from '../../features/dashboard/chartsSlice';
import { fetchAlerts } from '../../features/dashboard/alertsSlice';
import { fetchSystemSummary } from '../../features/dashboard/systemSummarySlice';
import { fetchResourceUsage } from '../../features/dashboard/resourceUsageSlice';
import { fetchDevices } from '../../features/dashboard/devicesSlice';
import KpiGrid from '../../components/kpi/KpiGrid/KpiGrid';
import ResourceUsageList from '../../components/alerts/ResourceUsageList/ResourceUsageList';
import DevicesSection from '../../components/devices/DevicesSection/DevicesSection';
import PageContainer from '../../components/layout/PageContainer/index.js';
import SplashScreen from '../../components/common/SplashScreen/SplashScreen';
import DraggableGrid from '../../components/dashboard/DraggableGrid/DraggableGrid';
import ChartCard from '../../components/charts/ChartCard/ChartCard';
import LineChartWidget from '../../components/charts/LineChartWidget/LineChartWidget';
import BarChartWidget from '../../components/charts/BarChartWidget/BarChartWidget';
import PieChartWidget from '../../components/charts/PieChartWidget/PieChartWidget';
import PieLegendList from '../../components/charts/PieChartWidget/PieLegendList';
import AlertsCard from '../../components/alerts/AlertsCard/AlertsCard';
import AlertItem from '../../components/alerts/AlertItem/AlertItem';
import SystemSummaryCard from '../../components/alerts/SystemSummaryCard/SystemSummaryCard';
import ErrorState from '../../components/common/ErrorState/ErrorState';
import { formatDateTime } from '../../utils/formatDateTime';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import { WIDGET_IDS } from '../../features/widgetVisibility/widgetVisibilitySlice';

function DashboardPage({ isEditMode: isEditModeProp }) {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.role);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());
  const [timeRange, setTimeRange] = useState('24h');

  const { setHeaderProps, isEditMode: outletEditMode } = useOutletContext();
  const isEditMode = isEditModeProp ?? outletEditMode;

  // Redux status selectors
  const chartsData = useAppSelector((state) => state.charts.data);
  const alertsData = useAppSelector((state) => state.alerts.data);
  const summaryData = useAppSelector((state) => state.systemSummary.data);
  const kpiStatus = useAppSelector((state) => state.kpi.status);
  const chartsStatus = useAppSelector((state) => state.charts.status);
  const alertsStatus = useAppSelector((state) => state.alerts.status);
  const summaryStatus = useAppSelector((state) => state.systemSummary.status);
  const resourceStatus = useAppSelector((state) => state.resourceUsage.status);
  const devicesStatus = useAppSelector((state) => state.devices.status);
  const chartsError = useAppSelector((state) => state.charts.error);
  const alertsError = useAppSelector((state) => state.alerts.error);
  const summaryError = useAppSelector((state) => state.systemSummary.error);

  const allStatuses = [kpiStatus, chartsStatus, alertsStatus, summaryStatus, resourceStatus, devicesStatus];
  const isLoading = allStatuses.some((s) => s === 'loading' || s === 'idle');

  const isInitialLoad = useRef(true);
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const isVisible = !isEditMode && isInitialLoad.current && (!minTimePassed || isLoading);

  useEffect(() => {
    if (!isVisible) {
      isInitialLoad.current = false;
    }
  }, [isVisible]);

  // Merkezi veri yükleme fonksiyonu
  const loadAllData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        dispatch(fetchKpis()),
        dispatch(fetchCharts()),
        dispatch(fetchAlerts()),
        dispatch(fetchSystemSummary()),
        dispatch(fetchResourceUsage()),
        dispatch(fetchDevices())
      ]);
      setLastUpdated(new Date().toISOString());
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Sayfa açıldığında tüm veriler eşzamanlı yüklenir (flickering önlenir)
    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (setHeaderProps) {
      setHeaderProps({
        title: "Monitoring Dashboard",
        lastUpdated: formatDateTime(lastUpdated, i18n.language),
        timeRange,
        onTimeRangeChange: setTimeRange,
        onRefresh: loadAllData,
        isRefreshing
      });
    }
  }, [lastUpdated, timeRange, isRefreshing, i18n.language, setHeaderProps]);

  const chartSkeleton = (title) => (
    <ChartCard title={title} subtitle={t('Yükleniyor...', 'Yükleniyor...')}>
      <Skeleton variant="rectangular" className="h-full min-h-[120px] w-full rounded" />
    </ChartCard>
  );

  const chartError = () => (
    <ErrorState message={chartsError || "Grafik verileri yüklenirken bir hata oluştu."} onRetry={() => dispatch(fetchCharts())} />
  );

  const dashboardWidgets = useMemo(() => {
    const unresolvedAlerts = alertsData.filter(alert => !alert.isResolved);
    const visibleAlerts = alertsData.slice(0, 4);
    const summaryItems = summaryData ? [
      { label: t('Kesintisiz Çalışma'), value: summaryData.uptime },
      { label: t('Toplam Trafik'), value: summaryData.totalTraffic },
      { label: t('Kritik Olaylar'), value: summaryData.criticalEvents, sublabel: t('Son 24 saat') },
      { label: t('Başarılı İşlemler'), value: summaryData.successfulOperations, sublabel: t('Saatlik ortalama') },
    ] : [
      { label: t('Kesintisiz Çalışma'), value: '—' },
      { label: t('Toplam Trafik'), value: '—' },
      { label: t('Kritik Olaylar'), value: '—', sublabel: t('Son 24 saat') },
      { label: t('Başarılı İşlemler'), value: '—', sublabel: t('Saatlik ortalama') },
    ];
    const showChartLoadingState = !isEditMode && (chartsStatus === 'loading' || chartsStatus === 'idle');
    const showChartErrorState = !isEditMode && chartsStatus === 'failed';
    const showAlertsLoadingState = !isEditMode && (alertsStatus === 'loading' || alertsStatus === 'idle');
    const showAlertsErrorState = !isEditMode && alertsStatus === 'failed';
    const showSummaryLoadingState = !isEditMode && (summaryStatus === 'loading' || summaryStatus === 'idle');
    const showSummaryErrorState = !isEditMode && summaryStatus === 'failed';

    return [
      {
        id: WIDGET_IDS.KPI_GRID,
        title: t('sidebar.widgets.kpiGrid', 'KPI Kartları'),
        children: <KpiGrid />,
      },
      {
        id: WIDGET_IDS.CPU_CHART,
        title: t('sidebar.widgets.cpuChart', 'CPU Kullanımı'),
        children: showChartErrorState ? chartError() : showChartLoadingState ? chartSkeleton(t('charts.cpuUsageTitle')) : (
          <ChartCard title={t('charts.cpuUsageTitle')} subtitle={t('charts.cpuUsageSubtitle')} infoText={t('charts.cpuUsageInfo')}>
            <LineChartWidget data={chartsData.cpuUsage || []} seriesName={t('charts.cpuUsageSeries', 'CPU Kullanımı')} color="#8b5cf6" height="100%" />
          </ChartCard>
        ),
      },
      {
        id: WIDGET_IDS.NETWORK_CHART,
        title: t('sidebar.widgets.networkChart', 'Ağ Trafiği'),
        children: showChartErrorState ? chartError() : showChartLoadingState ? chartSkeleton(t('charts.networkTrafficTitle')) : (
          <ChartCard title={t('charts.networkTrafficTitle')} subtitle={t('charts.networkTrafficSubtitle')} infoText={t('charts.networkTrafficInfo')}>
            <BarChartWidget data={chartsData.networkTraffic || []} height="100%" />
          </ChartCard>
        ),
      },
      {
        id: WIDGET_IDS.DEVICE_STATUS_CHART,
        title: t('sidebar.widgets.deviceStatusChart', 'Cihaz Durumları'),
        children: showChartErrorState ? chartError() : showChartLoadingState ? chartSkeleton(t('charts.deviceStatusTitle')) : (
          <ChartCard title={t('charts.deviceStatusTitle')} subtitle={t('charts.deviceStatusSubtitle')}>
            <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-5 sm:min-h-[220px] sm:flex-row lg:min-h-0">
              <div className="flex shrink-0 justify-center sm:w-36">
                <div className="h-36 w-36 sm:h-32 sm:w-32">
                  <PieChartWidget data={chartsData.deviceStatusDistribution || []} height="100%" />
                </div>
              </div>
              <div className="w-full min-w-0 flex-1 border-t border-slate-100 pt-4 dark:border-slate-800 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                <PieLegendList data={chartsData.deviceStatusDistribution || []} />
              </div>
            </div>
          </ChartCard>
        ),
      },
      {
        id: WIDGET_IDS.ALERTS_CARD,
        title: t('sidebar.widgets.alertsCard', 'Son Alarmlar'),
        children: showAlertsErrorState ? (
          <ErrorState message={alertsError || "Alarm verileri yüklenirken hata oluştu."} onRetry={() => dispatch(fetchAlerts())} />
        ) : showAlertsLoadingState ? (
          <Skeleton variant="rectangular" className="h-full min-h-[120px] w-full rounded-lg" />
        ) : (
          <AlertsCard count={unresolvedAlerts.length}>
            {visibleAlerts.length > 0 ? visibleAlerts.map((alert) => (
              <AlertItem
                key={alert.id}
                deviceName={alert.deviceName}
                message={alert.message}
                severity={alert.severity}
                timestamp={alert.timestamp}
              />
            )) : <span className="text-sm text-slate-400">—</span>}
          </AlertsCard>
        ),
      },
      {
        id: WIDGET_IDS.SYSTEM_SUMMARY,
        title: t('sidebar.widgets.systemSummary', 'Sistem Özeti'),
        children: showSummaryErrorState ? (
          <ErrorState message={summaryError || "Sistem özeti yüklenirken hata oluştu."} onRetry={() => dispatch(fetchSystemSummary())} />
        ) : showSummaryLoadingState ? (
          <Skeleton variant="rectangular" className="h-full min-h-[120px] w-full rounded-lg" />
        ) : (
          <SystemSummaryCard items={summaryItems} />
        ),
      },
      {
        id: WIDGET_IDS.DEVICES_TABLE,
        title: t('sidebar.widgets.devicesTable', 'Cihaz Yönetimi'),
        children: <DevicesSection />,
      },
      {
        id: WIDGET_IDS.RESOURCE_USAGE,
        title: t('sidebar.widgets.resourceUsage', 'Kaynak Kullanımı'),
        children: <ResourceUsageList />,
      },
    ];
  }, [alertsData, alertsError, alertsStatus, chartsData, chartsError, chartsStatus, dispatch, isEditMode, summaryData, summaryError, summaryStatus, t]);

  return (
    <>
      <SplashScreen isVisible={isVisible} />

      <PageContainer key={role} className="flex h-full min-h-0 flex-col overflow-y-auto p-4 lg:overflow-hidden">
        <DraggableGrid widgets={dashboardWidgets} />
      </PageContainer>
    </>
  );
}

export default DashboardPage;

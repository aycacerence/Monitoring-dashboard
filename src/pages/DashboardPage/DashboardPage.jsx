import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchKpis } from '../../features/dashboard/kpiSlice'; 
import { fetchCharts } from '../../features/dashboard/chartsSlice';
import { fetchAlerts } from '../../features/dashboard/alertsSlice';
import { fetchSystemSummary } from '../../features/dashboard/systemSummarySlice';
import { fetchResourceUsage } from '../../features/dashboard/resourceUsageSlice';
import { fetchDevices } from '../../features/dashboard/devicesSlice';
import KpiGrid from '../../components/kpi/KpiGrid/KpiGrid';
import ChartsSection from '../../components/charts/ChartsSection/ChartsSection';

import AlertsSection from '../../components/alerts/AlertsSection/AlertsSection';
import ResourceUsageList from '../../components/alerts/ResourceUsageList/ResourceUsageList';
import DevicesSection from '../../components/devices/DevicesSection/DevicesSection';
import Header from '../../components/layout/Header/index.js';
import PageContainer from '../../components/layout/PageContainer/index.js';
import SplashScreen from '../../components/common/SplashScreen/SplashScreen';
import { formatDateTime } from '../../utils/formatDateTime';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import { selectVisibility, WIDGET_IDS } from '../../features/widgetVisibility/widgetVisibilitySlice';
import { selectRole } from '../../features/auth/authSlice';

function DashboardPage() {
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());
  const [timeRange, setTimeRange] = useState('24h');

  const { setHeaderProps } = useOutletContext();
  const visibility = useAppSelector(selectVisibility);
  const role = useAppSelector(selectRole);

  // Redux status selectors
  const kpiStatus = useAppSelector((state) => state.kpi.status);
  const chartsStatus = useAppSelector((state) => state.charts.status);
  const alertsStatus = useAppSelector((state) => state.alerts.status);
  const summaryStatus = useAppSelector((state) => state.systemSummary.status);
  const resourceStatus = useAppSelector((state) => state.resourceUsage.status);
  const devicesStatus = useAppSelector((state) => state.devices.status);

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

  const isVisible = isInitialLoad.current && (!minTimePassed || isLoading);

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

  const isKpiVisible = visibility[WIDGET_IDS.KPI_GRID];
  const isChartsVisible = visibility[WIDGET_IDS.CPU_CHART] || visibility[WIDGET_IDS.NETWORK_CHART] || visibility[WIDGET_IDS.DEVICE_STATUS_CHART];
  const isAlertsVisible = visibility[WIDGET_IDS.ALERTS_CARD] || visibility[WIDGET_IDS.SYSTEM_SUMMARY];
  const isDevicesVisible = visibility[WIDGET_IDS.DEVICES_TABLE] || visibility[WIDGET_IDS.RESOURCE_USAGE];

  const gridRows = [
    isKpiVisible ? 'max-content' : '',
    isChartsVisible ? `minmax(0,${isKpiVisible ? '1.2fr' : '1.8fr'})` : '',
    isAlertsVisible ? 'minmax(0,1fr)' : '',
    isDevicesVisible ? 'minmax(0,1.5fr)' : ''
  ].filter(Boolean).join(' ');

  return (
    <>
      <SplashScreen isVisible={isVisible} />

      <PageContainer className="min-h-screen overflow-y-auto p-4 lg:h-full lg:min-h-0 lg:overflow-hidden">
        <div
          className="flex min-h-0 flex-col gap-4 lg:grid lg:h-full lg:grid-cols-12 lg:overflow-hidden"
          style={{ gridTemplateRows: gridRows || '1fr' }}
        >
          {/* KPI Section */}
          {isKpiVisible && (
            <section className="lg:col-span-12 lg:min-h-0 lg:overflow-hidden">
              <KpiGrid />
            </section>
          )}

          {/* Charts Section */}
          {isChartsVisible && (
            <section className="lg:col-span-12 lg:min-h-0 lg:overflow-hidden">
              <ChartsSection />
            </section>
          )}

          {/* Alerts and System Summary Section */}
          {isAlertsVisible && (
            <section className="lg:col-span-12 lg:min-h-0 lg:overflow-hidden">
              <AlertsSection />
            </section>
          )}

          {/* Devices and Resource Usage Grid */}
          {isDevicesVisible && (
            <section className="lg:col-span-12 lg:min-h-0 lg:overflow-hidden">
              <div className="flex flex-col gap-4 lg:grid lg:h-full lg:min-h-0 lg:grid-cols-12 lg:overflow-hidden">
                {/* Cihaz Tablosu (3/4 alan) */}
                {visibility[WIDGET_IDS.DEVICES_TABLE] && (
                  <div className={`min-w-0 ${visibility[WIDGET_IDS.RESOURCE_USAGE] ? 'lg:col-span-8' : 'lg:col-span-12'} lg:overflow-hidden`}>
                    <DevicesSection />
                  </div>
                )}
                
                {/* Kaynak Kullanımı (1/4 alan) */}
                {visibility[WIDGET_IDS.RESOURCE_USAGE] && (
                  <div className={`min-w-0 ${visibility[WIDGET_IDS.DEVICES_TABLE] ? 'lg:col-span-4' : 'lg:col-span-12'} lg:overflow-hidden`}>
                    <ResourceUsageList />
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </PageContainer>
    </>
  );
}

export default DashboardPage;

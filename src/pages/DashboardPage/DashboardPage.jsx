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

function DashboardPage() {
  const dispatch = useAppDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());
  const [timeRange, setTimeRange] = useState('24h');

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

  return (
    <>
      <SplashScreen isVisible={isVisible} />
      
      <Header
        title="Monitoring Dashboard"
        lastUpdated={formatDateTime(lastUpdated)}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        onRefresh={loadAllData}
        isRefreshing={isRefreshing}
      />

      <PageContainer>
        <div className="space-y-6">
          {/* KPI Section */}
          <section>
            <KpiGrid />
          </section>

          {/* Charts Section */}
          <section>
            <ChartsSection />
          </section>

          {/* Alerts and System Summary Section */}
          <section>
            <AlertsSection />
          </section>

          {/* Devices and Resource Usage Grid */}
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Cihaz Tablosu (3/4 alan) - overflow-hidden ile taşma engellendi */}
              <div className="lg:col-span-3 min-w-0 overflow-hidden">
                <DevicesSection />
              </div>
              
              {/* Kaynak Kullanımı (1/4 alan) */}
              <div className="lg:col-span-1">
                <ResourceUsageList />
              </div>
            </div>
          </section>
        </div>
      </PageContainer>
    </>
  );
}

export default DashboardPage;
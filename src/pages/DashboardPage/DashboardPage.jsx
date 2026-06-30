import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchKpis } from '../../features/dashboard/kpiSlice'; 
import { fetchCharts } from '../../features/dashboard/chartsSlice';
import { fetchAlerts } from '../../features/dashboard/alertsSlice';
import { fetchSystemSummary } from '../../features/dashboard/systemSummarySlice';
import { fetchResourceUsage } from '../../features/dashboard/resourceUsageSlice';
import KpiGrid from '../../components/kpi/KpiGrid/KpiGrid';
import ChartsSection from '../../components/charts/ChartsSection/ChartsSection';
import AlertsSection from '../../components/alerts/AlertsSection/AlertsSection';
import ResourceUsageList from '../../components/alerts/ResourceUsageList/ResourceUsageList';

function DashboardPage() {
  const dispatch = useAppDispatch();
  
  // DashboardPage serves as the "orchestrator" for the dashboard.
  // It handles dispatching actions to fetch all data on mount.
  useEffect(() => {
    dispatch(fetchKpis());
    dispatch(fetchCharts());
    dispatch(fetchAlerts());
    dispatch(fetchSystemSummary());
    dispatch(fetchResourceUsage());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* KPI Section */}
      <section>
        <KpiGrid />
      </section>

      {/* Resource Usage Section */}
      <section>
        <ResourceUsageList />
      </section>

      {/* Charts Section */}
      <section>
        <ChartsSection />
      </section>

      {/* Alerts and System Summary Section */}
      <section>
        <AlertsSection />
      </section>

      {/* TODO: Add Devices Section */}
    </div>
  );
}

export default DashboardPage;
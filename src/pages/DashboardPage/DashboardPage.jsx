import { useEffect } from 'react';
import { useAppDispatch } from '../../app/hooks';
// thunk ismini kpiSlice'taki export ile eşleştirdik (fetchKpis)
import { fetchKpis } from '../../features/dashboard/kpiSlice'; 
import { fetchCharts } from '../../features/dashboard/chartsSlice';
import KpiGrid from '../../components/kpi/KpiGrid/KpiGrid';
import ChartsSection from '../../components/charts/ChartsSection/ChartsSection';

function DashboardPage() {
  const dispatch = useAppDispatch();
  
  // DashboardPage serves as the "orchestrator" for the dashboard.
  // It handles dispatching actions to fetch all data on mount.
  useEffect(() => {
    // Burada fetchKpis thunk'ını çağırıyoruz
    dispatch(fetchKpis());
    dispatch(fetchCharts());
    
    // TODO: Dispatch other thunks (fetchSystemSummaryData, fetchChartsData, etc.) here
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* KPI Section */}
      <section>
        <KpiGrid />
      </section>

      {/* TODO: Add other sections (Alerts, Devices) */}
      <section>
        <ChartsSection />
      </section>
    </div>
  );
}

export default DashboardPage;
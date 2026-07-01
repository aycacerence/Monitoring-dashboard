import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import KpiCard from '../KpiCard/KpiCard';
import KpiCardSkeleton from '../KpiCardSkeleton/KpiCardSkeleton';
import ErrorState from '../../common/ErrorState/ErrorState';
import { fetchKpis } from '../../../features/dashboard/kpiSlice';

function KpiGrid() {
  const dispatch = useAppDispatch();
  const { data: kpiData, status, error } = useAppSelector((state) => state.kpi);

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:h-full lg:grid-cols-12">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="lg:col-span-2 lg:min-h-0">
            <KpiCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (status === 'failed') {
    return <ErrorState message={error || "KPI verileri yüklenirken bir hata oluştu."} onRetry={() => dispatch(fetchKpis())} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 transition-opacity duration-500 ease-in opacity-100 md:grid-cols-2 lg:h-full lg:grid-cols-12">
      {kpiData.map((kpi) => (
        <div key={kpi.id} className="lg:col-span-2 lg:min-h-0">
          <KpiCard
            title={kpi.title}
            value={kpi.value}
            unit={kpi.unit}
            changePercentage={kpi.changePercentage}
            changeDirection={kpi.changeDirection}
            changeLabel={kpi.changeLabel}
            icon={kpi.icon}
            sparklineData={kpi.sparklineData}
            color={kpi.color}
          />
        </div>
      ))}
    </div>
  );
}

export default KpiGrid;

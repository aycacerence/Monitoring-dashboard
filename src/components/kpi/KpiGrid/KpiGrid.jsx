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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, index) => (
          <KpiCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (status === 'failed') {
    return <ErrorState message={error || "KPI verileri yüklenirken bir hata oluştu."} onRetry={() => dispatch(fetchKpis())} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 transition-opacity duration-500 ease-in opacity-100">
      {kpiData.map((kpi) => (
        <KpiCard
          key={kpi.id}
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
      ))}
    </div>
  );
}

export default KpiGrid;

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import KpiCard from '../KpiCard/KpiCard';
import KpiCardSkeleton from '../KpiCardSkeleton/KpiCardSkeleton';
import ErrorState from '../../common/ErrorState/ErrorState';
import { fetchKpis } from '../../../features/dashboard/kpiSlice';
import { selectIsEditMode } from '../../../features/ui/uiSlice';

const editModeKpis = [
  { id: 'placeholder-1', title: 'CPU', value: '—', unit: '%', changePercentage: 0, changeDirection: 'neutral', changeLabel: '—', icon: 'cpu', sparklineData: [], color: '#8b5cf6' },
  { id: 'placeholder-2', title: 'Bellek', value: '—', unit: '%', changePercentage: 0, changeDirection: 'neutral', changeLabel: '—', icon: 'memory', sparklineData: [], color: '#06b6d4' },
  { id: 'placeholder-3', title: 'Disk', value: '—', unit: '%', changePercentage: 0, changeDirection: 'neutral', changeLabel: '—', icon: 'storage', sparklineData: [], color: '#f59e0b' },
  { id: 'placeholder-4', title: 'Ağ', value: '—', unit: '', changePercentage: 0, changeDirection: 'neutral', changeLabel: '—', icon: 'network', sparklineData: [], color: '#10b981' },
  { id: 'placeholder-5', title: 'Uyarı', value: '—', unit: '', changePercentage: 0, changeDirection: 'neutral', changeLabel: '—', icon: 'warning', sparklineData: [], color: '#ef4444' },
  { id: 'placeholder-6', title: 'Çalışma', value: '—', unit: '', changePercentage: 0, changeDirection: 'neutral', changeLabel: '—', icon: 'activity', sparklineData: [], color: '#6366f1' },
];

function KpiGrid() {
  const dispatch = useAppDispatch();
  const { data: kpiData, status, error } = useAppSelector((state) => state.kpi);
  const isEditMode = useAppSelector(selectIsEditMode);
  const showLoadingState = !isEditMode && (status === 'loading' || status === 'idle');
  const showErrorState = !isEditMode && status === 'failed';
  const items = isEditMode && kpiData.length === 0 ? editModeKpis : kpiData;

  if (showLoadingState) {
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

  if (showErrorState) {
    return <ErrorState message={error || "KPI verileri yüklenirken bir hata oluştu."} onRetry={() => dispatch(fetchKpis())} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 transition-opacity duration-500 ease-in opacity-100 md:grid-cols-2 lg:h-full lg:grid-cols-12">
      {items.map((kpi) => (
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

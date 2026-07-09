import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Skeleton } from '@mui/material';
import ResourceUsageCard from '../ResourceUsageCard/ResourceUsageCard';
import ErrorState from '../../common/ErrorState/ErrorState';
import { fetchResourceUsage } from '../../../features/dashboard/resourceUsageSlice';
import { selectIsEditMode } from '../../../features/ui/uiSlice';

const editModeResourceUsage = [
  { id: 'cpu', label: 'CPU', percentage: 0, changePercentage: 0, changeDirection: 'neutral', icon: 'cpu' },
  { id: 'memory', label: 'Bellek', percentage: 0, changePercentage: 0, changeDirection: 'neutral', icon: 'memory' },
  { id: 'storage', label: 'Disk', percentage: 0, changePercentage: 0, changeDirection: 'neutral', icon: 'storage' },
];

function ResourceUsageList() {
  const dispatch = useAppDispatch();
  const { data, status, error } = useAppSelector((state) => state.resourceUsage);
  const isEditMode = useAppSelector(selectIsEditMode);

  const showLoadingState = !isEditMode && (status === 'loading' || status === 'idle');
  const showErrorState = !isEditMode && status === 'failed';
  const items = isEditMode && data.length === 0 ? editModeResourceUsage : data;

  if (showLoadingState) {
    return (
      <div className="grid gap-4 lg:h-full lg:min-h-0 lg:grid-rows-3">
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} variant="rectangular" className="min-h-[96px] w-full rounded-lg lg:h-full lg:min-h-0" />
        ))}
      </div>
    );
  }

  if (showErrorState) {
    return <ErrorState message={error || "Kaynak verileri yüklenirken bir hata oluştu."} onRetry={() => dispatch(fetchResourceUsage())} />;
  }

  return (
    <div style={{ pointerEvents: isEditMode ? 'none' : 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="grid min-h-max gap-4 transition-opacity duration-500 ease-in opacity-100 lg:h-full lg:min-h-0 lg:grid-rows-3 lg:overflow-hidden flex-1">
      {items.map((item) => (
        <ResourceUsageCard
          key={item.id}
          label={item.label}
          percentage={item.percentage}
          changePercentage={item.changePercentage}
          changeDirection={item.changeDirection}
          icon={item.icon}
        />
      ))}
      </div>
    </div>
  );
}

export default ResourceUsageList;

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Skeleton } from '@mui/material';
import ResourceUsageCard from '../ResourceUsageCard/ResourceUsageCard';
import ErrorState from '../../common/ErrorState/ErrorState';
import { fetchResourceUsage } from '../../../features/dashboard/resourceUsageSlice';

function ResourceUsageList() {
  const dispatch = useAppDispatch();
  const { data, status, error } = useAppSelector((state) => state.resourceUsage);

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="grid gap-4 lg:h-full lg:min-h-0 lg:grid-rows-3">
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} variant="rectangular" className="min-h-[96px] w-full rounded-lg lg:h-full lg:min-h-0" />
        ))}
      </div>
    );
  }

  if (status === 'failed') {
    return <ErrorState message={error || "Kaynak verileri yüklenirken bir hata oluştu."} onRetry={() => dispatch(fetchResourceUsage())} />;
  }

  return (
    <div className="grid min-h-max gap-4 transition-opacity duration-500 ease-in opacity-100 lg:h-full lg:min-h-0 lg:grid-rows-3 lg:overflow-hidden">
      {data.map((item) => (
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
  );
}

export default ResourceUsageList;

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
      <div className="flex flex-col gap-6 h-full">
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} variant="rectangular" className="w-full h-[120px] rounded-lg" />
        ))}
      </div>
    );
  }

  if (status === 'failed') {
    return <ErrorState message={error || "Kaynak verileri yüklenirken bir hata oluştu."} onRetry={() => dispatch(fetchResourceUsage())} />;
  }

  return (
    <div className="flex flex-col gap-6 h-full transition-opacity duration-500 ease-in opacity-100">
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

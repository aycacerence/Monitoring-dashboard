import { useAppSelector } from '../../../app/hooks';
import { Skeleton } from '@mui/material';
import ResourceUsageCard from '../ResourceUsageCard/ResourceUsageCard';

function ResourceUsageList() {
  const { data, status } = useAppSelector((state) => state.resourceUsage);

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} variant="rectangular" height={120} className="w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

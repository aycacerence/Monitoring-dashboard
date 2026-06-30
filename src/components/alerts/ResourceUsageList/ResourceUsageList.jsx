import { useAppSelector } from '../../../app/hooks';
import { Skeleton } from '@mui/material';
import ResourceUsageCard from '../ResourceUsageCard/ResourceUsageCard';

function ResourceUsageList() {
  const { data, status } = useAppSelector((state) => state.resourceUsage);

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex flex-col gap-6 h-full">
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} variant="rectangular" className="w-full h-[120px] rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full">
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

import { Skeleton } from '@mui/material';
import Card from '../../common/Card';

function KpiCardSkeleton() {
  return (
    <Card className="flex flex-col justify-between h-full">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <Skeleton variant="text" width="60%" height={20} className="mb-1" />
          <div className="flex items-baseline gap-1">
            <Skeleton variant="text" width="40%" height={32} />
          </div>
        </div>
        <Skeleton variant="rounded" width={40} height={40} className="shrink-0" />
      </div>
      
      <div className="flex-1 my-2">
        <Skeleton variant="rectangular" width="100%" height={40} className="rounded" />
      </div>

      <div className="mt-2">
        <Skeleton variant="text" width="70%" height={20} />
      </div>
    </Card>
  );
}

export default KpiCardSkeleton;

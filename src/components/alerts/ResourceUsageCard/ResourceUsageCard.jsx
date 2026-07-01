import PropTypes from 'prop-types';
import Card from '../../common/Card';
import ProgressBar from '../../common/ProgressBar';
import TrendIndicator from '../../common/TrendIndicator';
import { getIconComponent } from '../../../utils/iconMap';

function ResourceUsageCard({ label, percentage, changePercentage, changeDirection, icon }) {
  const IconComponent = getIconComponent(icon);
  
  // Renk mantığı: %80 üzeri kırmızı, %60 üzeri turuncu, gerisi mavi
  let progressColor = '#c026d3'; // brand-500
  if (percentage >= 80) progressColor = '#ef4444'; // red-500
  else if (percentage >= 60) progressColor = '#f59e0b'; // amber-500

  return (
    <Card hoverable className="h-auto lg:h-full" noPadding>
      <div className="flex h-auto flex-col justify-center p-3 lg:h-full">
        <div className="flex justify-between items-start mb-2">
          <div className="flex min-w-0 items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
              <IconComponent fontSize="small" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">{label}</h3>
              <div className="mt-1">
                <TrendIndicator 
                  percentage={changePercentage} 
                  direction={changeDirection} 
                  label="önceki aya göre" 
                />
              </div>
            </div>
          </div>
          <div className="shrink-0 pl-3 text-xl font-bold leading-none text-slate-900 dark:text-white">
            {percentage}%
          </div>
        </div>
        
        <div className="w-full mt-auto">
          <ProgressBar value={percentage} color={progressColor} showPercentage={false} />
        </div>
      </div>
    </Card>
  );
}

ResourceUsageCard.propTypes = {
  label: PropTypes.string.isRequired,
  percentage: PropTypes.number.isRequired,
  changePercentage: PropTypes.number.isRequired,
  changeDirection: PropTypes.oneOf(['up', 'down', 'neutral']).isRequired,
  icon: PropTypes.string.isRequired,
};

export default ResourceUsageCard;

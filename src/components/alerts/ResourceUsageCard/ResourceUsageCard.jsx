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
      <div className="flex flex-col justify-between w-full h-full px-3 py-2">
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex min-w-0 items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
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
          <div className="shrink-0 pl-2 text-lg font-bold leading-none text-slate-900 dark:text-white">
            {percentage}%
          </div>
        </div>
        
        <div className="w-full mt-1 shrink-0">
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

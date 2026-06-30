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
    <Card hoverable className="h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
          <IconComponent fontSize="small" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-900">{label}</h3>
          <div className="mt-1">
            <TrendIndicator 
              percentage={changePercentage} 
              direction={changeDirection} 
              label="önceki aya göre" 
            />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900">
          {percentage}%
        </div>
      </div>
      
      <ProgressBar value={percentage} color={progressColor} />
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

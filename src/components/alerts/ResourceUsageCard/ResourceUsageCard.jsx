import PropTypes from 'prop-types';
import Card from '../../common/Card';
import ProgressBar from '../../common/ProgressBar';
import TrendIndicator from '../../common/TrendIndicator';
import { getIconComponent } from '../../../utils/iconMap';
import { useTranslation } from 'react-i18next';

function ResourceUsageCard({ label, percentage, changePercentage, changeDirection, icon }) {
  const { t } = useTranslation();
  const IconComponent = getIconComponent(icon);
  
  // Renk mantığı: %80 üzeri kırmızı, %60 üzeri turuncu, gerisi mavi
  let progressColor = '#c026d3'; // brand-500
  if (percentage >= 80) progressColor = '#ef4444'; // red-500
  else if (percentage >= 60) progressColor = '#f59e0b'; // amber-500

  return (
    <Card hoverable className="h-auto lg:h-full" noPadding>
      <div className="flex min-h-[96px] w-full flex-col justify-between px-3 py-3 sm:px-4 lg:h-full lg:min-h-0 lg:px-3 lg:py-2">
        <div className="flex w-full items-start justify-between gap-2 lg:items-center">
          <div className="flex min-w-0 items-start gap-2.5 lg:items-center lg:gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 lg:h-7 lg:w-7">
              <IconComponent sx={{ fontSize: { xs: 20, lg: 16 } }} />
            </div>
            <div className="min-w-0 flex flex-col lg:flex-row lg:items-center lg:gap-2">
              <h3 className="break-words text-sm font-semibold leading-snug text-slate-900 dark:text-white lg:text-xs lg:truncate">{label}</h3>
              <div className="mt-1 max-w-full overflow-hidden lg:mt-0 lg:scale-[0.85] lg:origin-left">
                <TrendIndicator 
                  percentage={changePercentage} 
                  direction={changeDirection} 
                  label={t('önceki aya göre', 'önceki aya göre')} 
                />
              </div>
            </div>
          </div>
          <div className="shrink-0 text-right text-lg font-bold leading-none text-slate-900 dark:text-white sm:text-xl lg:text-base">
            {percentage}%
          </div>
        </div>
        
        <div className="mt-3 w-full shrink-0 lg:mt-1">
          <ProgressBar value={percentage} color={progressColor} showPercentage={false} height={6} />
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

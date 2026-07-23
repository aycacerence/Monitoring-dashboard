import PropTypes from 'prop-types';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import RemoveIcon from '@mui/icons-material/Remove';

/**
 * KPI degisim oranini yon ikonu, yuzde degeri ve aciklama etiketiyle gosterir.
 *
 * @param {object} props
 * @param {number} props.percentage Degisim yuzdesi.
 * @param {'up'|'down'|'neutral'} props.direction Degisim yonu.
 * @param {string} [props.label] Degisimin baglamini aciklayan metin.
 * @returns {JSX.Element}
 */
function TrendIndicator({ percentage, direction, label }) {
  const isUp = direction === 'up';
  const isNeutral = direction === 'neutral';
  const Icon = isNeutral ? RemoveIcon : isUp ? ArrowUpwardIcon : ArrowDownwardIcon;
  const colorClass = isNeutral ? 'text-slate-400' : isUp ? 'text-emerald-600' : 'text-red-600';

  return (
    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs lg:text-[10px] xl:text-xs">
      <span className={`inline-flex items-center gap-0.5 font-semibold shrink-0 ${colorClass}`}>
        <Icon sx={{ fontSize: 14 }} />
        {percentage}%
      </span>
      {label && <span className="text-slate-500 dark:text-slate-400 leading-tight line-clamp-1">{label}</span>}
    </div>
  );
}

TrendIndicator.propTypes = {
  percentage: PropTypes.number.isRequired,
  direction: PropTypes.oneOf(['up', 'down', 'neutral']).isRequired,
  label: PropTypes.string,
};

export default TrendIndicator;

import PropTypes from 'prop-types';
import { LinearProgress } from '@mui/material';

/**
 * Kaynak kullanim yuzdelerini etiket ve opsiyonel yuzde degeriyle gosterir.
 *
 * @param {object} props
 * @param {number} props.value 0-100 arasi ilerleme degeri.
 * @param {string} [props.label] Ilerleme cubugunun solunda gosterilecek metin.
 * @param {string} [props.color] Cubuk rengi.
 * @param {boolean} [props.showPercentage] Yuzde metninin gosterilip gosterilmeyecegi.
 * @returns {JSX.Element}
 */
function ProgressBar({ value, label, color = '#2563eb', showPercentage = true }) {
  const normalizedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="mb-2 flex items-center justify-between gap-3 text-xs text-slate-600">
          {label && <span className="font-medium">{label}</span>}
          {showPercentage && <span className="font-semibold text-slate-900">{normalizedValue}%</span>}
        </div>
      )}
      <LinearProgress
        variant="determinate"
        value={normalizedValue}
        sx={{
          height: 8,
          borderRadius: 999,
          backgroundColor: '#e2e8f0',
          '& .MuiLinearProgress-bar': {
            borderRadius: 999,
            backgroundColor: color,
          },
        }}
      />
    </div>
  );
}

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  label: PropTypes.string,
  color: PropTypes.string,
  showPercentage: PropTypes.bool,
};

export default ProgressBar;

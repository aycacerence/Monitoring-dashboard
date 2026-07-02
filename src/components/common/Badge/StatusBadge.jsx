import PropTypes from 'prop-types';
import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { defaultStatusColor, statusColors } from '../../../utils/statusColors.js';

/**
 * Cihaz veya sistem durumunu renkli, kucuk bir rozet olarak gosterir.
 *
 * @param {object} props
 * @param {'online'|'warning'|'offline'} props.status Durum anahtari.
 * @param {string} [props.label] Varsayilan durum etiketi yerine gosterilecek metin.
 * @returns {JSX.Element}
 */
function StatusBadge({ status, label }) {
  const { t } = useTranslation();
  const color = statusColors[status] ?? defaultStatusColor;

  const translatedLabel = label ? label : t(color.label, color.label);

  return (
    <Chip
      size="small"
      label={
        <span className="inline-flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${color.dotClass}`} />
          {translatedLabel}
        </span>
      }
      className={`${color.bgClass} ${color.textClass} ${color.borderClass} border font-medium`}
    />
  );
}

StatusBadge.propTypes = {
  status: PropTypes.oneOf(['online', 'warning', 'offline']).isRequired,
  label: PropTypes.string,
};

export default StatusBadge;

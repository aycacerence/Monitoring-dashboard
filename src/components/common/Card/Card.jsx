import PropTypes from 'prop-types';
import { Paper } from '@mui/material';

/**
 * Dashboard icindeki tekrar kullanilabilir kart yuzeyidir.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children Kart icerigi.
 * @param {string} [props.className] Kart kapsayicisina eklenecek ek Tailwind class'lari.
 * @param {string} [props.title] Kart basligi.
 * @param {React.ReactNode} [props.action] Baslik satirinin saginda gosterilecek aksiyon alani.
 * @param {boolean} [props.noPadding] Icerik padding'ini kaldirir ve tasmalari gizler.
 * @returns {JSX.Element}
 */
function Card({ children, className = '', title, action, noPadding = false }) {
  const paddingClass = noPadding ? 'overflow-hidden' : 'p-5';

  return (
    <Paper
      elevation={0}
      className={`rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-lg ${paddingClass} ${className}`}
    >
      {(title || action) && (
        <div className={`flex items-center justify-between gap-3 ${noPadding ? 'px-5 pt-5' : 'mb-4'}`}>
          {title && <h2 className="text-sm font-semibold text-slate-900">{title}</h2>}
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={noPadding && title ? 'pt-4' : ''}>{children}</div>
    </Paper>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  title: PropTypes.string,
  action: PropTypes.node,
  noPadding: PropTypes.bool,
};

export default Card;

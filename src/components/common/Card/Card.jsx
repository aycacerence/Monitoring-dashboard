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
function Card({ children, className = '', title, action, noPadding = false, hoverable = false }) {
  const paddingClass = noPadding ? 'overflow-hidden' : 'p-5';
  const hoverClass = hoverable 
    ? 'transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-[#a42350]/25 dark:hover:shadow-[#a42350]/20' 
    : 'transition-all duration-500 ease-out hover:shadow-sm';

  return (
    <Paper
      elevation={0}
      className={`flex h-auto flex-col overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm lg:h-full ${hoverClass} ${paddingClass} ${className}`}
    >
      {(title || action) && (
        <div className={`flex items-center justify-between gap-3 ${noPadding ? 'px-5 pt-5' : 'mb-4'}`}>
          {title && <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h2>}
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={`flex flex-1 min-h-0 flex-col ${noPadding && title ? 'pt-4' : ''}`}>{children}</div>
    </Paper>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  title: PropTypes.string,
  action: PropTypes.node,
  noPadding: PropTypes.bool,
  hoverable: PropTypes.bool,
};

export default Card;

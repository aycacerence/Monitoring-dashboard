import PropTypes from 'prop-types';
import InboxIcon from '@mui/icons-material/Inbox';

/**
 * Veri bulunamadiginda kullanilan sade bos durum gosterimidir.
 *
 * @param {object} props
 * @param {string} props.message Kullaniciya gosterilecek bos durum mesaji.
 * @param {React.ReactNode} [props.icon] Varsayilan ikon yerine gosterilecek ikon.
 * @returns {JSX.Element}
 */
function EmptyState({ message, icon }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a1d27] px-4 py-8 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-400 shadow-sm">
        {icon ?? <InboxIcon fontSize="small" />}
      </div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{message}</p>
    </div>
  );
}

EmptyState.propTypes = {
  message: PropTypes.string.isRequired,
  icon: PropTypes.node,
};

export default EmptyState;

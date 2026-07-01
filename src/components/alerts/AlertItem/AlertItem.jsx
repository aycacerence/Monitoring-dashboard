import PropTypes from 'prop-types';
import { formatRelativeTime } from '../../../utils/formatRelativeTime';

const severityConfig = {
  critical: { color: 'bg-red-500', text: 'text-red-700' },
  warning: { color: 'bg-amber-500', text: 'text-amber-700' },
  info: { color: 'bg-brand-500', text: 'text-brand-700' },
};

function AlertItem({ deviceName, message, severity, timestamp }) {
  const config = severityConfig[severity] || severityConfig.info;

  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors px-2 -mx-2 rounded">
      <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${config.color}`} />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">
            {deviceName}
          </span>
          <span className="text-xs font-medium text-slate-500 shrink-0">
            {formatRelativeTime(timestamp)}
          </span>
        </div>
        
        <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2" title={message}>
          {message}
        </p>
      </div>
    </div>
  );
}

AlertItem.propTypes = {
  deviceName: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  severity: PropTypes.oneOf(['critical', 'warning', 'info']).isRequired,
  timestamp: PropTypes.string.isRequired,
};

export default AlertItem;

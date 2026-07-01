import PropTypes from 'prop-types';
import Card from '../../common/Card';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function AlertsCard({ count, children }) {
  return (
    <Card hoverable className="flex flex-col h-full" noPadding>
      <div className="flex items-center justify-between px-5 pt-5 mb-2">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Son Alarmlar</h2>
        <div className="flex items-center justify-center bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50 font-bold text-sm h-7 px-3 rounded-full border border-transparent">
          {count} Yeni
        </div>
      </div>
      
      <div className="flex-1 px-5 overflow-y-auto max-h-[400px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-50 [&::-webkit-scrollbar-track]:dark:bg-[#1a1d27] [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:dark:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full">
        {children}
      </div>

      <div className="px-5 py-3 border-t border-slate-100 mt-2">
        <a 
          href="#alerts" 
          className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 focus:ring-2 focus:ring-brand-500 focus:outline-none rounded transition-colors w-max"
          aria-label="Tüm alarmları görüntüle"
        >
          Tüm alarmları görüntüle
          <ArrowForwardIcon sx={{ fontSize: 16 }} />
        </a>
      </div>
    </Card>
  );
}

AlertsCard.propTypes = {
  count: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};

export default AlertsCard;

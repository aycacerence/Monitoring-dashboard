import PropTypes from 'prop-types';
import Card from '../../common/Card';

function SystemSummaryCard({ items }) {
  return (
    <Card hoverable className="h-auto overflow-hidden lg:h-full" noPadding>
      <div className="shrink-0 px-4 pt-4 mb-3">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Sistem Özeti</h2>
      </div>
      <div className="flex flex-col gap-3 px-4 pb-4 sm:grid sm:grid-cols-2 lg:flex lg:h-full lg:flex-1 lg:min-h-0 lg:flex-row lg:items-stretch lg:gap-4">
        {items.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col justify-center min-h-[80px] min-w-0 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <span className="truncate text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              {item.label}
            </span>
            <span className="truncate text-lg font-bold leading-tight text-slate-900 dark:text-white">
              {item.value}
            </span>
            {item.sublabel && (
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {item.sublabel}
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

SystemSummaryCard.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      sublabel: PropTypes.string,
    })
  ).isRequired,
};

export default SystemSummaryCard;

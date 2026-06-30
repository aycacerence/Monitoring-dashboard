import PropTypes from 'prop-types';
import Card from '../../common/Card';

function SystemSummaryCard({ items }) {
  return (
    <Card hoverable title="Sistem Özeti" className="h-full">
      <div className="grid grid-cols-2 gap-4 h-full content-start mt-2">
        {items.map((item, index) => (
          <div key={index} className="bg-slate-50 rounded-lg p-4 flex flex-col justify-center">
            <span className="text-sm font-medium text-slate-500 mb-1">
              {item.label}
            </span>
            <span className="text-2xl font-bold text-slate-900">
              {item.value}
            </span>
            {item.sublabel && (
              <span className="text-xs text-slate-500 mt-1">
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

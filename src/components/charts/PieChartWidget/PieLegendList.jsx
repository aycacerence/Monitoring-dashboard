import PropTypes from 'prop-types';

function PieLegendList({ data }) {
  const total = data.reduce((acc, item) => acc + item.count, 0);

  return (
    <div className="flex flex-col gap-3 justify-center">
      {data.map((item) => {
        const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
        
        return (
          <div key={item.status} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span 
                className="w-3 h-3 rounded-full shrink-0" 
                style={{ backgroundColor: item.color }} 
              />
              <span className="text-sm font-medium text-slate-700">{item.status}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-900">{item.count}</span>
              <span className="text-xs font-medium text-slate-500 w-8 text-right">{percentage}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

PieLegendList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default PieLegendList;

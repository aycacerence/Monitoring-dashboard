import PropTypes from 'prop-types';

function PieLegendList({ data }) {
  const total = data.reduce((acc, item) => acc + item.count, 0);

  return (
    <div className="flex min-w-0 flex-col gap-3">
      {data.map((item) => {
        const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
        
        return (
          <div key={item.status} className="flex min-w-0 items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="min-w-0 truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                {item.status}
              </span>
            </div>
            <div className="grid shrink-0 grid-cols-[2.5rem_2.75rem] items-baseline gap-3 text-right">
              <span className="text-sm font-bold tabular-nums text-slate-900 dark:text-white">
                {item.count}
              </span>
              <span className="text-xs font-medium tabular-nums text-slate-500 dark:text-slate-400">
                {percentage}%
              </span>
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

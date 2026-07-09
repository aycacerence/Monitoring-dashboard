import PropTypes from 'prop-types';
import Card from '../../common/Card';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Tooltip } from '@mui/material';

function ChartCard({ title, subtitle, action, children, infoText }) {
  return (
    <Card hoverable className="flex h-full flex-col overflow-hidden" noPadding>
      <div className="flex shrink-0 items-center justify-between gap-3 px-4 pt-4 mb-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-sm font-semibold text-slate-900 dark:text-white">{title}</h2>
            {infoText && (
              <Tooltip title={infoText} placement="top">
                <InfoOutlinedIcon className="text-slate-400 hover:text-slate-600 cursor-help" sx={{ fontSize: 18 }} />
              </Tooltip>
            )}
          </div>
          {subtitle && <p className="truncate text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="flex-1 min-h-[240px] overflow-hidden px-4 pb-4 sm:min-h-[260px] lg:min-h-0">
        {children}
      </div>
    </Card>
  );
}

ChartCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  action: PropTypes.node,
  children: PropTypes.node.isRequired,
  infoText: PropTypes.string,
};

export default ChartCard;

import PropTypes from 'prop-types';
import Card from '../../common/Card';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Tooltip } from '@mui/material';

function ChartCard({ title, subtitle, action, children, infoText }) {
  return (
    <Card hoverable className="flex flex-col h-full" noPadding>
      <div className="flex items-center justify-between px-5 pt-5 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            {infoText && (
              <Tooltip title={infoText} placement="top">
                <InfoOutlinedIcon className="text-slate-400 hover:text-slate-600 cursor-help" sx={{ fontSize: 18 }} />
              </Tooltip>
            )}
          </div>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="flex-1 px-5 pb-5">
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

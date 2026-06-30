import PropTypes from 'prop-types';
import StatusBadge from '../../common/Badge/StatusBadge';
import ProgressBar from '../../common/ProgressBar/ProgressBar';
import { formatRelativeTime } from '../../../utils/formatRelativeTime';

function DeviceTableRow({ device }) {
  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
      <td className="py-3 px-4 text-sm font-semibold text-slate-900 sticky left-0 bg-white/95 backdrop-blur z-10 group-hover:bg-slate-50">
        {device.name}
      </td>
      <td className="py-3 px-4 text-sm text-slate-600 whitespace-nowrap">
        {device.ipAddress}
      </td>
      <td className="py-3 px-4 text-sm text-slate-600 whitespace-nowrap">
        {device.type}
      </td>
      <td className="py-3 px-4 whitespace-nowrap">
        <StatusBadge status={device.status} />
      </td>
      <td className="py-3 px-4 min-w-[120px]">
        {device.cpuUsage !== null ? (
          <ProgressBar value={device.cpuUsage} color="#8b5cf6" className="h-1.5" />
        ) : (
          <span className="text-sm text-slate-400">-</span>
        )}
      </td>
      <td className="py-3 px-4 min-w-[120px]">
        {device.memoryUsage !== null ? (
          <ProgressBar value={device.memoryUsage} color="#f59e0b" className="h-1.5" />
        ) : (
          <span className="text-sm text-slate-400">-</span>
        )}
      </td>
      <td className="py-3 px-4 min-w-[120px]">
        {device.diskUsage !== null ? (
          <ProgressBar value={device.diskUsage} color="#3b82f6" className="h-1.5" />
        ) : (
          <span className="text-sm text-slate-400">-</span>
        )}
      </td>
      <td className="py-3 px-4 text-sm text-slate-500 whitespace-nowrap">
        {formatRelativeTime(device.lastUpdated)}
      </td>
    </tr>
  );
}

DeviceTableRow.propTypes = {
  device: PropTypes.shape({
    name: PropTypes.string.isRequired,
    ipAddress: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    cpuUsage: PropTypes.number,
    memoryUsage: PropTypes.number,
    diskUsage: PropTypes.number,
    lastUpdated: PropTypes.string.isRequired,
  }).isRequired,
};

export default DeviceTableRow;

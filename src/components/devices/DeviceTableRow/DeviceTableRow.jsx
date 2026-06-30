import PropTypes from 'prop-types';
import { TableRow, TableCell } from '@mui/material';
import StatusBadge from '../../common/Badge/StatusBadge';
import ProgressBar from '../../common/ProgressBar/ProgressBar';
import { formatRelativeTime } from '../../../utils/formatRelativeTime';

function DeviceTableRow({ device }) {
  return (
    <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell
        component="th"
        scope="row"
        className="sticky left-0 z-10 bg-white"
        sx={{ fontWeight: 600, color: 'text.primary', borderBottomColor: '#f1f5f9', whiteSpace: 'nowrap' }}
      >
        {device.name}
      </TableCell>
      <TableCell sx={{ color: 'text.secondary', borderBottomColor: '#f1f5f9', whiteSpace: 'nowrap' }}>
        {device.ipAddress}
      </TableCell>
      <TableCell sx={{ color: 'text.secondary', borderBottomColor: '#f1f5f9', whiteSpace: 'nowrap' }}>
        {device.type}
      </TableCell>
      <TableCell sx={{ borderBottomColor: '#f1f5f9', whiteSpace: 'nowrap' }}>
        <StatusBadge status={device.status} />
      </TableCell>
      <TableCell sx={{ minWidth: 120, borderBottomColor: '#f1f5f9' }}>
        {device.cpuUsage !== null ? (
          <ProgressBar value={device.cpuUsage} color="#8b5cf6" className="h-1.5" />
        ) : (
          <span className="text-sm text-slate-400">-</span>
        )}
      </TableCell>
      <TableCell sx={{ minWidth: 120, borderBottomColor: '#f1f5f9' }}>
        {device.memoryUsage !== null ? (
          <ProgressBar value={device.memoryUsage} color="#f59e0b" className="h-1.5" />
        ) : (
          <span className="text-sm text-slate-400">-</span>
        )}
      </TableCell>
      <TableCell sx={{ minWidth: 120, borderBottomColor: '#f1f5f9' }}>
        {device.diskUsage !== null ? (
          <ProgressBar value={device.diskUsage} color="#3b82f6" className="h-1.5" />
        ) : (
          <span className="text-sm text-slate-400">-</span>
        )}
      </TableCell>
      <TableCell sx={{ color: 'text.secondary', borderBottomColor: '#f1f5f9', whiteSpace: 'nowrap' }}>
        {formatRelativeTime(device.lastUpdated)}
      </TableCell>
    </TableRow>
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

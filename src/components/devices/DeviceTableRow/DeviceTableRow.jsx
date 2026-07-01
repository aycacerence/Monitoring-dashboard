import PropTypes from 'prop-types';
import { TableRow, TableCell } from '@mui/material';
import StatusBadge from '../../common/Badge/StatusBadge';
import ProgressBar from '../../common/ProgressBar/ProgressBar';
import { formatRelativeTime } from '../../../utils/formatRelativeTime';

// Ortak body hücre padding — DeviceTable thSx ile senkronize
const tdBase = { borderBottomColor: '#f1f5f9', padding: '10px 16px' };

function DeviceTableRow({ device }) {
  return (
    <TableRow hover className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200" sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>

      {/* Cihaz Adı — sticky, her zaman görünür */}
      <TableCell
        component="th"
        scope="row"
        className="sticky left-0 z-10 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
        sx={{ ...tdBase, fontWeight: 600, whiteSpace: 'nowrap' }}
      >
        {device.name}
      </TableCell>

      {/* IP Adresi — her zaman görünür */}
      <TableCell className="text-inherit" sx={{ ...tdBase, whiteSpace: 'nowrap' }}>
        {device.ipAddress}
      </TableCell>

      {/* Tür — sadece lg+ */}
      <TableCell
        className="hidden lg:table-cell text-inherit"
        sx={{ ...tdBase, whiteSpace: 'nowrap' }}
      >
        {device.type}
      </TableCell>

      {/* Durum — her zaman görünür */}
      <TableCell sx={{ ...tdBase, whiteSpace: 'nowrap' }}>
        <StatusBadge status={device.status} />
      </TableCell>

      {/* CPU — her zaman görünür */}
      <TableCell sx={{ ...tdBase, minWidth: 120 }}>
        {device.cpuUsage !== null ? (
          <ProgressBar value={device.cpuUsage} color="#8b5cf6" className="h-1.5" />
        ) : (
          <span className="text-sm text-slate-400">-</span>
        )}
      </TableCell>

      {/* Bellek — her zaman görünür */}
      <TableCell sx={{ ...tdBase, minWidth: 120 }}>
        {device.memoryUsage !== null ? (
          <ProgressBar value={device.memoryUsage} color="#f59e0b" className="h-1.5" />
        ) : (
          <span className="text-sm text-slate-400">-</span>
        )}
      </TableCell>

      {/* Disk — sadece lg+, sol kenarlık ile ayrılmış */}
      <TableCell
        className="hidden lg:table-cell"
        sx={{
          ...tdBase,
          minWidth: 130,
          paddingLeft: '20px',
          borderLeft: '1px solid #f1f5f9',
        }}
      >
        {device.diskUsage !== null ? (
          <ProgressBar value={device.diskUsage} color="#c026d3" className="h-1.5" />
        ) : (
          <span className="text-sm text-slate-400">-</span>
        )}
      </TableCell>

      {/* Son Güncelleme — sadece lg+ */}
      <TableCell
        className="hidden lg:table-cell text-inherit"
        sx={{ ...tdBase, whiteSpace: 'nowrap' }}
      >
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

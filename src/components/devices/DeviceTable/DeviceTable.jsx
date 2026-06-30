import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton } from '@mui/material';
import DeviceTableRow from '../DeviceTableRow/DeviceTableRow';
import EmptyState from '../../common/EmptyState';
import SearchOffIcon from '@mui/icons-material/SearchOff';

const headCells = [
  { id: 'name', label: 'Cihaz Adı', minWidth: 120 },
  { id: 'ip', label: 'IP Adresi', minWidth: 120 },
  { id: 'type', label: 'Tür', minWidth: 100 },
  { id: 'status', label: 'Durum', minWidth: 100 },
  { id: 'cpu', label: 'CPU', minWidth: 120 },
  { id: 'mem', label: 'Bellek', minWidth: 120 },
  { id: 'disk', label: 'Disk', minWidth: 120 },
  { id: 'updated', label: 'Son Güncelleme', minWidth: 140 },
];

function DeviceTable({ devices, isLoading, searchTerm }) {
  if (isLoading) {
    return (
      <TableContainer className="overflow-x-auto w-full">
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell 
                  key={headCell.id}
                  sx={{ minWidth: headCell.minWidth, borderBottomColor: '#e2e8f0' }}
                >
                  <Skeleton variant="text" width="60%" />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {headCells.map((headCell, j) => (
                  <TableCell key={j} sx={{ borderBottomColor: '#f1f5f9' }}>
                    <Skeleton variant="text" width={j === 0 ? "80%" : "60%"} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (devices.length === 0) {
    const message = searchTerm 
      ? `"${searchTerm}" aramasına uygun cihaz bulunamadı.` 
      : "Sistemde kayıtlı cihaz bulunmuyor.";
    
    return (
      <div className="p-8">
        <EmptyState message={message} icon={<SearchOffIcon fontSize="small" />} />
      </div>
    );
  }

  return (
    <TableContainer className="overflow-x-auto w-full">
      <Table sx={{ minWidth: 800 }}>
        <TableHead className="bg-slate-50">
          <TableRow>
            <TableCell 
              className="sticky left-0 z-10 bg-slate-50"
              sx={{ 
                minWidth: 120, 
                fontWeight: 600, 
                color: 'text.secondary', 
                borderBottomColor: '#e2e8f0',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: '0.05em'
              }}
            >
              Cihaz Adı
            </TableCell>
            {headCells.slice(1).map((headCell) => (
              <TableCell 
                key={headCell.id}
                sx={{ 
                  minWidth: headCell.minWidth, 
                  fontWeight: 600, 
                  color: 'text.secondary', 
                  borderBottomColor: '#e2e8f0',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em'
                }}
              >
                {headCell.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {devices.map((device) => (
            <DeviceTableRow key={device.id} device={device} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

DeviceTable.propTypes = {
  devices: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  searchTerm: PropTypes.string,
};

export default DeviceTable;

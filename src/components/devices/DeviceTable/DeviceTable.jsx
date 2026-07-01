import PropTypes from 'prop-types';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Skeleton,
} from '@mui/material';
import DeviceTableRow from '../DeviceTableRow/DeviceTableRow';
import EmptyState from '../../common/EmptyState';
import SearchOffIcon from '@mui/icons-material/SearchOff';

/**
 * headCells — responsive görünürlük bayrakları:
 *  hideOnMd  : true  → sadece lg+ ekranlarda göster  (hidden lg:table-cell)
 *  hideOnSm  : false → her zaman görünür
 */
const headCells = [
  { id: 'ip',      label: 'IP Adresi',      minWidth: 120, hideOnMd: false },
  { id: 'type',    label: 'Tür',            minWidth: 90,  hideOnMd: true  },
  { id: 'status',  label: 'Durum',          minWidth: 90,  hideOnMd: false },
  { id: 'cpu',     label: 'CPU',            minWidth: 120, hideOnMd: false },
  { id: 'mem',     label: 'Bellek',         minWidth: 120, hideOnMd: false },
  { id: 'disk',    label: 'Disk',           minWidth: 130, hideOnMd: true  },
  { id: 'updated', label: 'Son Güncelleme', minWidth: 140, hideOnMd: true  },
];

// Ortak başlık hücresi stilleri
const thSx = {
  fontWeight: 600,
  borderBottomColor: '#e2e8f0',
  textTransform: 'uppercase',
  fontSize: '0.75rem',
  letterSpacing: '0.05em',
  padding: '10px 16px',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

function DeviceTable({ devices, isLoading, searchTerm }) {
  /* ── Loading skeleton ── */
  if (isLoading) {
    return (
      <TableContainer className="overflow-x-auto w-full min-w-0 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-slate-50 [&::-webkit-scrollbar-track]:dark:bg-slate-900 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:dark:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full">
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              {/* Cihaz Adı */}
              <TableCell sx={{ ...thSx, minWidth: 120 }}>
                <Skeleton variant="text" width="60%" />
              </TableCell>
              {headCells.map((h) => (
                <TableCell
                  key={h.id}
                  className={h.hideOnMd ? 'hidden lg:table-cell' : ''}
                  sx={{ ...thSx, minWidth: h.minWidth }}
                >
                  <Skeleton variant="text" width="60%" />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell sx={{ padding: '10px 16px', borderBottomColor: '#f1f5f9' }}>
                  <Skeleton variant="text" width="80%" />
                </TableCell>
                {headCells.map((h, j) => (
                  <TableCell
                    key={j}
                    className={h.hideOnMd ? 'hidden lg:table-cell' : ''}
                    sx={{ padding: '10px 16px', borderBottomColor: '#f1f5f9' }}
                  >
                    <Skeleton variant="text" width="60%" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  /* ── Empty state ── */
  if (devices.length === 0) {
    const message = searchTerm
      ? `"${searchTerm}" aramasına uygun cihaz bulunamadı.`
      : 'Sistemde kayıtlı cihaz bulunmuyor.';
    return (
      <div className="p-8">
        <EmptyState message={message} icon={<SearchOffIcon fontSize="small" />} />
      </div>
    );
  }

  /* ── Data table ── */
  return (
    <TableContainer className="overflow-x-auto w-full min-w-0 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-slate-50 [&::-webkit-scrollbar-track]:dark:bg-slate-900 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:dark:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full">
      {/*
        Tablet  (md):  minWidth 600 → Tür / Disk / Son Güncelleme gizli, 5 sütun sığar
        Desktop (lg):  minWidth 900 → tüm 8 sütun görünür
      */}
      <Table sx={{ minWidth: 600 }}>
        <TableHead className="bg-slate-100 dark:bg-slate-800">
          <TableRow>
            {/* Cihaz Adı — sticky */}
            <TableCell
              scope="col"
              className="sticky left-0 z-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              sx={{ ...thSx, minWidth: 130 }}
            >
              Cihaz Adı
            </TableCell>

            {headCells.map((h) => (
              <TableCell
                key={h.id}
                scope="col"
                className={`text-slate-700 dark:text-slate-200 ${h.hideOnMd ? 'hidden lg:table-cell' : ''}`}
                sx={{
                  ...thSx,
                  minWidth: h.minWidth,
                  ...(h.id === 'disk' && {
                    borderLeft: '1px solid #e2e8f0',
                    paddingLeft: '20px',
                  }),
                }}
              >
                {h.label}
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

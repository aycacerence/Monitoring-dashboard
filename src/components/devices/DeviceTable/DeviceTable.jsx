import PropTypes from 'prop-types';
import { Skeleton } from '@mui/material';
import DeviceTableRow from '../DeviceTableRow/DeviceTableRow';
import EmptyState from '../../common/EmptyState';
import SearchOffIcon from '@mui/icons-material/SearchOff';

function DeviceTable({ devices, isLoading, searchTerm }) {
  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-3 px-4">Cihaz Adı</th>
              <th className="py-3 px-4">IP Adresi</th>
              <th className="py-3 px-4">Tür</th>
              <th className="py-3 px-4">Durum</th>
              <th className="py-3 px-4">CPU</th>
              <th className="py-3 px-4">Bellek</th>
              <th className="py-3 px-4">Disk</th>
              <th className="py-3 px-4">Son Güncelleme</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-slate-100">
                {[...Array(8)].map((_, j) => (
                  <td key={j} className="py-3 px-4">
                    <Skeleton variant="text" width={j === 0 ? "80%" : "60%"} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
    <div className="w-full overflow-x-auto relative">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <th className="py-3 px-4 sticky left-0 bg-slate-50 z-10 whitespace-nowrap">Cihaz Adı</th>
            <th className="py-3 px-4 whitespace-nowrap">IP Adresi</th>
            <th className="py-3 px-4 whitespace-nowrap">Tür</th>
            <th className="py-3 px-4 whitespace-nowrap">Durum</th>
            <th className="py-3 px-4 whitespace-nowrap">CPU</th>
            <th className="py-3 px-4 whitespace-nowrap">Bellek</th>
            <th className="py-3 px-4 whitespace-nowrap">Disk</th>
            <th className="py-3 px-4 whitespace-nowrap">Son Güncelleme</th>
          </tr>
        </thead>
        <tbody className="group">
          {devices.map((device) => (
            <DeviceTableRow key={device.id} device={device} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

DeviceTable.propTypes = {
  devices: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  searchTerm: PropTypes.string,
};

export default DeviceTable;

import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  setSearchTerm,
  setCurrentPage,
  setItemsPerPage,
  selectPaginatedDevices,
  selectDevicesPagination,
} from '../../../features/dashboard/devicesSlice';
import Card from '../../common/Card';
import DeviceTable from '../DeviceTable/DeviceTable';
import DevicesCardHeader from '../DevicesCardHeader/DevicesCardHeader';
import Pagination from '../../common/Pagination/Pagination';

function DevicesSection() {
  const dispatch = useAppDispatch();
  const { status, searchTerm } = useAppSelector((state) => state.devices);
  
  // Memoized selectors üzerinden verileri çekiyoruz
  const paginatedDevices = useAppSelector(selectPaginatedDevices);
  const paginationState = useAppSelector(selectDevicesPagination);

  // İstek: Sayfa başına 5 cihaz
  useEffect(() => {
    dispatch(setItemsPerPage(5));
  }, [dispatch]);

  const handleSearchChange = (value) => {
    dispatch(setSearchTerm(value));
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  // '1-5 / 128' gibi bilgi metni hesaplaması
  const { currentPage, itemsPerPage, totalItems, totalPages } = paginationState;
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  const recordInfoText = totalItems > 0 
    ? `${startIndex}-${endIndex} / ${totalItems} cihaz` 
    : '0 cihaz';

  return (
    <Card noPadding>
      <DevicesCardHeader 
        title="Cihaz Yönetimi" 
        searchTerm={searchTerm} 
        onSearchChange={handleSearchChange} 
      />
      
      <DeviceTable 
        devices={paginatedDevices} 
        isLoading={status === 'loading' || status === 'idle'} 
        searchTerm={searchTerm}
      />
      
      <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 border-t border-slate-100 gap-4">
        <span className="text-sm font-medium text-slate-500">
          {status === 'loading' ? 'Hesaplanıyor...' : recordInfoText}
        </span>
        <div className="shrink-0">
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </Card>
  );
}

export default DevicesSection;

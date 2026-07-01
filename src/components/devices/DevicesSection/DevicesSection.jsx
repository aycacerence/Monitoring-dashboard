import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  setSearchTerm,
  setCurrentPage,
  setItemsPerPage,
  selectPaginatedDevices,
  selectDevicesPagination,
  fetchDevices,
} from '../../../features/dashboard/devicesSlice';
import Card from '../../common/Card';
import DeviceTable from '../DeviceTable/DeviceTable';
import DevicesCardHeader from '../DevicesCardHeader/DevicesCardHeader';
import Pagination from '../../common/Pagination/Pagination';
import ErrorState from '../../common/ErrorState/ErrorState';

function DevicesSection() {
  const dispatch = useAppDispatch();
  const { status, searchTerm, error } = useAppSelector((state) => state.devices);
  
  // Memoized selectors üzerinden verileri çekiyoruz
  const paginatedDevices = useAppSelector(selectPaginatedDevices);
  const paginationState = useAppSelector(selectDevicesPagination);

  // Kompakt masaüstü görünümünde alt satırı verimli kullanmak için.
  useEffect(() => {
    dispatch(setItemsPerPage(6));
  }, [dispatch]);

  const handleSearchChange = (value) => {
    dispatch(setSearchTerm(value));
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  if (status === 'failed') {
    return <ErrorState message={error || "Cihaz verileri yüklenirken bir hata oluştu."} onRetry={() => dispatch(fetchDevices())} />;
  }

  // '1-5 / 128' gibi bilgi metni hesaplaması
  const { currentPage, itemsPerPage, totalItems, totalPages } = paginationState;
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  const recordInfoText = totalItems > 0 
    ? `${startIndex}-${endIndex} / ${totalItems} cihaz` 
    : '0 cihaz';

  return (
    <Card noPadding className="flex h-auto flex-col overflow-hidden transition-opacity duration-500 ease-in opacity-100 lg:h-full">
      <DevicesCardHeader 
        title="Cihaz Yönetimi" 
        searchTerm={searchTerm} 
        onSearchChange={handleSearchChange} 
      />
      
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <DeviceTable 
          devices={paginatedDevices} 
          isLoading={status === 'loading' || status === 'idle'} 
          searchTerm={searchTerm}
        />
      </div>
      
      <div className="mt-auto flex shrink-0 flex-col sm:flex-row items-center justify-between px-4 pt-2 pb-2 border-t border-slate-100 gap-3 dark:border-slate-800">
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

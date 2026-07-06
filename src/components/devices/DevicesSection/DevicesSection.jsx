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
import { useTranslation } from 'react-i18next';
import { selectRole } from '../../../features/auth/authSlice';
import LockIcon from '@mui/icons-material/Lock';
import { selectIsEditMode } from '../../../features/ui/uiSlice';

function DevicesSection() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { status, searchTerm, error } = useAppSelector((state) => state.devices);
  const role = useAppSelector(selectRole);
  const isEditMode = useAppSelector(selectIsEditMode);
  
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

  const showErrorState = !isEditMode && status === 'failed';
  const isTableLoading = !isEditMode && (status === 'loading' || status === 'idle');

  if (showErrorState) {
    return <ErrorState message={error || t("Cihaz verileri yüklenirken bir hata oluştu.", "Cihaz verileri yüklenirken bir hata oluştu.")} onRetry={() => dispatch(fetchDevices())} />;
  }

  // '1-5 / 128' gibi bilgi metni hesaplaması
  const { currentPage, itemsPerPage, totalItems, totalPages } = paginationState;
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  const recordInfoText = totalItems > 0 
    ? `${startIndex}-${endIndex} / ${totalItems} ${t('cihaz', 'cihaz')}` 
    : `0 ${t('cihaz', 'cihaz')}`;

  return (
    <Card hoverable noPadding className="flex h-auto flex-col overflow-hidden transition-opacity duration-500 ease-in opacity-100 lg:h-full">
      <DevicesCardHeader 
        title={t("Cihaz Yönetimi", "Cihaz Yönetimi")} 
        searchTerm={searchTerm} 
        onSearchChange={handleSearchChange} 
      />
      
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {role === 'admin' ? (
          <DeviceTable 
            devices={paginatedDevices} 
            isLoading={isTableLoading} 
            searchTerm={searchTerm}
            isEditMode={isEditMode}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center h-full w-full bg-slate-50/50 dark:bg-slate-900/20">
            <LockIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
            <span className="text-slate-500 font-medium text-sm">
              {t('auth.noPermission', 'Bu içeriği görüntüleme yetkiniz bulunmamaktadır.')}
            </span>
          </div>
        )}
      </div>
      
      <div className="mt-auto flex shrink-0 flex-col sm:flex-row items-center justify-between px-4 pt-2 pb-2 border-t border-slate-100 gap-3 dark:border-slate-800">
        <span className="text-sm font-medium text-slate-500">
          {!isEditMode && status === 'loading' ? t('Hesaplanıyor...', 'Hesaplanıyor...') : recordInfoText}
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

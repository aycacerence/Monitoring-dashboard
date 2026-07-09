import { useCallback, useEffect, useRef } from 'react';
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
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Box, Typography } from '@mui/material';

const ROW_HEIGHT_PX = 52;
const RESERVED_PX = 150;

function DevicesSection() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { status, searchTerm, error } = useAppSelector((state) => state.devices);
  const role = useAppSelector(selectRole);
  const isEditMode = useAppSelector(selectIsEditMode);
  const containerRef = useRef(null);
  
  // Memoized selectors üzerinden verileri çekiyoruz
  const paginatedDevices = useAppSelector(selectPaginatedDevices);
  const paginationState = useAppSelector(selectDevicesPagination);

  const calculateItemsPerPage = useCallback(() => {
    if (!containerRef.current || isEditMode) return;

    const availableHeight = containerRef.current.clientHeight - RESERVED_PX;
    const nextItemsPerPage = Math.max(3, Math.floor(availableHeight / ROW_HEIGHT_PX));
    if (nextItemsPerPage === paginationState.itemsPerPage) return;

    dispatch(setItemsPerPage(nextItemsPerPage));
  }, [dispatch, isEditMode, paginationState.itemsPerPage]);

  useEffect(() => {
    if (isEditMode) return undefined;

    calculateItemsPerPage();

    const observer = new ResizeObserver(calculateItemsPerPage);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [calculateItemsPerPage, isEditMode]);

  useEffect(() => {
    if (isEditMode) return undefined;

    window.addEventListener('resize', calculateItemsPerPage);
    return () => window.removeEventListener('resize', calculateItemsPerPage);
  }, [calculateItemsPerPage, isEditMode]);



  if (role !== 'admin') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Card hoverable className="h-full flex flex-col overflow-hidden flex-1" noPadding>
          <div className="flex shrink-0 items-center px-4 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            {t("Cihaz Yönetimi", "Cihaz Yönetimi")}
          </h2>
        </div>
        <Box
          className="bg-slate-50/50 dark:bg-slate-800/20"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            p: 3,
            minHeight: 200
          }}
        >
          {/* Kilit ikonu */}
          <Box
            sx={{
              width: 56, height: 56,
              borderRadius: '50%',
              bgcolor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 28, color: 'text.disabled' }} />
          </Box>

          {/* Mesaj */}
          <span className="text-slate-500 dark:text-slate-400 font-medium text-sm text-center px-4">
            {t('devices.accessDenied', 'Bu içeriği görüntüleme yetkiniz bulunmamaktadır.')}
          </span>
        </Box>
      </Card>
      </div>
    );
  }

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
    <div ref={containerRef} className="flex h-auto min-h-0 flex-col lg:h-full">
      <Card hoverable noPadding className="flex h-auto flex-col overflow-hidden transition-opacity duration-500 ease-in opacity-100 lg:h-full">
        <DevicesCardHeader 
          title={t("Cihaz Yönetimi", "Cihaz Yönetimi")} 
          searchTerm={searchTerm} 
          onSearchChange={handleSearchChange} 
        />
        
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <DeviceTable 
            devices={paginatedDevices} 
            isLoading={isTableLoading} 
            searchTerm={searchTerm}
            isEditMode={isEditMode}
          />
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
    </div>
  );
}

export default DevicesSection;

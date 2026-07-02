import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Skeleton } from '@mui/material';
import AlertsCard from '../AlertsCard/AlertsCard';
import AlertItem from '../AlertItem/AlertItem';
import SystemSummaryCard from '../SystemSummaryCard/SystemSummaryCard';
import ErrorState from '../../common/ErrorState/ErrorState';
import { fetchAlerts } from '../../../features/dashboard/alertsSlice';
import { fetchSystemSummary } from '../../../features/dashboard/systemSummarySlice';
import { useTranslation } from 'react-i18next';

function AlertsSection() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { data: alertsData, status: alertsStatus, error: alertsError } = useAppSelector((state) => state.alerts);
  const { data: summaryData, status: summaryStatus, error: summaryError } = useAppSelector((state) => state.systemSummary);

  const isLoading = alertsStatus === 'loading' || alertsStatus === 'idle' || summaryStatus === 'loading' || summaryStatus === 'idle';
  const isFailed = alertsStatus === 'failed' || summaryStatus === 'failed';

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:h-full lg:min-h-0 lg:grid-cols-12">
        <Skeleton variant="rectangular" className="min-h-[120px] w-full rounded-lg lg:col-span-6 lg:h-full" />
        <Skeleton variant="rectangular" className="min-h-[120px] w-full rounded-lg lg:col-span-6 lg:h-full" />
      </div>
    );
  }

  if (isFailed) {
    return (
      <ErrorState 
        message={alertsError || summaryError || "Sistem verileri yüklenirken hata oluştu."} 
        onRetry={() => { dispatch(fetchAlerts()); dispatch(fetchSystemSummary()); }} 
      />
    );
  }

  const summaryItems = summaryData ? [
    { label: t('Kesintisiz Çalışma'), value: summaryData.uptime },
    { label: t('Toplam Trafik'), value: summaryData.totalTraffic },
    { label: t('Kritik Olaylar'), value: summaryData.criticalEvents, sublabel: t('Son 24 saat') },
    { label: t('Başarılı İşlemler'), value: summaryData.successfulOperations, sublabel: t('Saatlik ortalama') },
  ] : [];

  const unresolvedAlerts = alertsData.filter(alert => !alert.isResolved);
  const visibleAlerts = alertsData.slice(0, 4);

  return (
    <div className="grid grid-cols-1 gap-4 transition-opacity duration-500 ease-in opacity-100 lg:h-full lg:min-h-0 lg:grid-cols-12 lg:overflow-hidden">
      <div className="lg:col-span-6 lg:min-h-0 lg:overflow-hidden">
        <AlertsCard count={unresolvedAlerts.length}>
          {visibleAlerts.map((alert) => (
            <AlertItem
              key={alert.id}
              deviceName={alert.deviceName}
              message={alert.message}
              severity={alert.severity}
              timestamp={alert.timestamp}
            />
          ))}
        </AlertsCard>
      </div>
      
      <div className="lg:col-span-6 lg:min-h-0 lg:overflow-hidden">
        <SystemSummaryCard items={summaryItems} />
      </div>
    </div>
  );
}

export default AlertsSection;

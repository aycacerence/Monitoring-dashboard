import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Skeleton } from '@mui/material';
import AlertsCard from '../AlertsCard/AlertsCard';
import AlertItem from '../AlertItem/AlertItem';
import SystemSummaryCard from '../SystemSummaryCard/SystemSummaryCard';
import ErrorState from '../../common/ErrorState/ErrorState';
import { fetchAlerts } from '../../../features/dashboard/alertsSlice';
import { fetchSystemSummary } from '../../../features/dashboard/systemSummarySlice';

function AlertsSection() {
  const dispatch = useAppDispatch();
  const { data: alertsData, status: alertsStatus, error: alertsError } = useAppSelector((state) => state.alerts);
  const { data: summaryData, status: summaryStatus, error: summaryError } = useAppSelector((state) => state.systemSummary);

  const isLoading = alertsStatus === 'loading' || alertsStatus === 'idle' || summaryStatus === 'loading' || summaryStatus === 'idle';
  const isFailed = alertsStatus === 'failed' || summaryStatus === 'failed';

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton variant="rectangular" height={400} className="w-full rounded-lg" />
        <Skeleton variant="rectangular" height={400} className="w-full rounded-lg" />
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
    { label: 'Kesintisiz Çalışma', value: summaryData.uptime },
    { label: 'Toplam Trafik', value: summaryData.totalTraffic },
    { label: 'Kritik Olaylar', value: summaryData.criticalEvents, sublabel: 'Son 24 saat' },
    { label: 'Başarılı İşlemler', value: summaryData.successfulOperations, sublabel: 'Saatlik ortalama' },
  ] : [];

  const unresolvedAlerts = alertsData.filter(alert => !alert.isResolved);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 transition-opacity duration-500 ease-in opacity-100">
      <div className="lg:col-span-1">
        <AlertsCard count={unresolvedAlerts.length}>
          {alertsData.map((alert) => (
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
      
      <div className="lg:col-span-1">
        <SystemSummaryCard items={summaryItems} />
      </div>
    </div>
  );
}

export default AlertsSection;

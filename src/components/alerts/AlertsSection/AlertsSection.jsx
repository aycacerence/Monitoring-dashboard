import { useAppSelector } from '../../../app/hooks';
import { Skeleton } from '@mui/material';
import AlertsCard from '../AlertsCard/AlertsCard';
import AlertItem from '../AlertItem/AlertItem';
import SystemSummaryCard from '../SystemSummaryCard/SystemSummaryCard';

function AlertsSection() {
  const { data: alertsData, status: alertsStatus } = useAppSelector((state) => state.alerts);
  const { data: summaryData, status: summaryStatus } = useAppSelector((state) => state.systemSummary);

  const isLoading = alertsStatus === 'loading' || alertsStatus === 'idle' || summaryStatus === 'loading' || summaryStatus === 'idle';

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton variant="rectangular" height={400} className="w-full rounded-lg" />
        <Skeleton variant="rectangular" height={400} className="w-full rounded-lg" />
      </div>
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

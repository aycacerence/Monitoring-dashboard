import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Skeleton } from '@mui/material';
import ChartCard from '../ChartCard/ChartCard';
import LineChartWidget from '../LineChartWidget/LineChartWidget';
import BarChartWidget from '../BarChartWidget/BarChartWidget';
import PieChartWidget from '../PieChartWidget/PieChartWidget';
import PieLegendList from '../PieChartWidget/PieLegendList';
import ErrorState from '../../common/ErrorState/ErrorState';
import { fetchCharts } from '../../../features/dashboard/chartsSlice';
import { useTranslation } from 'react-i18next';
import { selectVisibility, WIDGET_IDS } from '../../../features/widgetVisibility/widgetVisibilitySlice';

function ChartsSection() {
  const dispatch = useAppDispatch();
  const { data, status, error } = useAppSelector((state) => state.charts);
  const { t } = useTranslation();
  const visibility = useAppSelector(selectVisibility);

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="grid grid-cols-1 gap-4 lg:h-full lg:min-h-0 lg:grid-cols-12 lg:overflow-hidden">
        {[{ title: t('charts.cpuUsageTitle') }, { title: t('charts.networkTrafficTitle') }, { title: t('charts.deviceStatusTitle') }].map((item, idx) => (
          <div key={idx} className="lg:col-span-4 lg:min-h-0 lg:overflow-hidden">
            <ChartCard title={item.title} subtitle="Yükleniyor...">
              <Skeleton variant="rectangular" className="min-h-[120px] w-full rounded lg:h-full" />
            </ChartCard>
          </div>
        ))}
      </div>
    );
  }

  if (status === 'failed') {
    return <ErrorState message={error || "Grafik verileri yüklenirken bir hata oluştu."} onRetry={() => dispatch(fetchCharts())} />;
  }

  const showCpu = visibility[WIDGET_IDS.CPU_CHART];
  const showNetwork = visibility[WIDGET_IDS.NETWORK_CHART];
  const showDeviceStatus = visibility[WIDGET_IDS.DEVICE_STATUS_CHART];
  const visibleCount = [showCpu, showNetwork, showDeviceStatus].filter(Boolean).length;
  const colSpan = visibleCount === 3 ? 'lg:col-span-4' : visibleCount === 2 ? 'lg:col-span-6' : 'lg:col-span-12';

  return (
    <div className="grid grid-cols-1 gap-4 transition-opacity duration-500 ease-in opacity-100 lg:h-full lg:min-h-0 lg:grid-cols-12 lg:overflow-hidden">
      {showCpu && (
        <div className={`${colSpan} lg:min-h-0 lg:overflow-hidden`}>
          <ChartCard 
            title={t('charts.cpuUsageTitle')} 
            subtitle={t('charts.cpuUsageSubtitle')}
            infoText={t('charts.cpuUsageInfo')}
          >
            <LineChartWidget 
              data={data.cpuUsage} 
              seriesName={t('charts.cpuUsageSeries', 'CPU Kullanımı')} 
              color="#8b5cf6" 
              height="100%" 
            />
          </ChartCard>
        </div>
      )}

      {showNetwork && (
        <div className={`${colSpan} lg:min-h-0 lg:overflow-hidden`}>
          <ChartCard 
            title={t('charts.networkTrafficTitle')} 
            subtitle={t('charts.networkTrafficSubtitle')}
            infoText={t('charts.networkTrafficInfo')}
          >
            <BarChartWidget data={data.networkTraffic} height="100%" />
          </ChartCard>
        </div>
      )}

      {showDeviceStatus && (
        <div className={`${colSpan} lg:min-h-0 lg:overflow-hidden`}>
          <ChartCard 
            title={t('charts.deviceStatusTitle')} 
            subtitle={t('charts.deviceStatusSubtitle')}
          >
            <div className="flex h-full min-h-[180px] items-center gap-5 lg:min-h-0">
              <div className="flex w-36 shrink-0 justify-center">
                <div className="h-32 w-32">
                  <PieChartWidget data={data.deviceStatusDistribution} height="100%" />
                </div>
              </div>
              <div className="min-w-0 flex-1 border-l border-slate-100 pl-5 dark:border-slate-800">
                <PieLegendList data={data.deviceStatusDistribution} />
              </div>
            </div>
          </ChartCard>
        </div>
      )}
    </div>
  );
}

export default ChartsSection;

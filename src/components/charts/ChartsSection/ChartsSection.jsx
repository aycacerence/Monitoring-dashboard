import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Skeleton } from '@mui/material';
import ChartCard from '../ChartCard/ChartCard';
import LineChartWidget from '../LineChartWidget/LineChartWidget';
import BarChartWidget from '../BarChartWidget/BarChartWidget';
import PieChartWidget from '../PieChartWidget/PieChartWidget';
import PieLegendList from '../PieChartWidget/PieLegendList';
import ErrorState from '../../common/ErrorState/ErrorState';
import { fetchCharts } from '../../../features/dashboard/chartsSlice';

function ChartsSection() {
  const dispatch = useAppDispatch();
  const { data, status, error } = useAppSelector((state) => state.charts);

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="grid grid-cols-1 gap-4 lg:h-full lg:min-h-0 lg:grid-cols-12 lg:overflow-hidden">
        {[{ title: 'CPU Kullanımı' }, { title: 'Ağ Trafiği' }, { title: 'Cihaz Durumu' }].map((item, idx) => (
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

  return (
    <div className="grid grid-cols-1 gap-4 transition-opacity duration-500 ease-in opacity-100 lg:h-full lg:min-h-0 lg:grid-cols-12 lg:overflow-hidden">
      <div className="lg:col-span-4 lg:min-h-0 lg:overflow-hidden">
        <ChartCard 
          title="CPU Kullanım Eğilimi" 
          subtitle="Son 24 saatlik ortalama işlemci yükü"
          infoText="Tüm cihazların ortalama CPU kullanım yüzdesidir."
        >
          <LineChartWidget 
            data={data.cpuUsage} 
            seriesName="CPU Kullanımı" 
            color="#8b5cf6" 
            height="100%" 
          />
        </ChartCard>
      </div>

      <div className="lg:col-span-4 lg:min-h-0 lg:overflow-hidden">
        <ChartCard 
          title="Ağ Trafik Eğilimi" 
          subtitle="Son 24 saatlik gelen ve giden ağ trafiği (Mbps)"
          infoText="Sistemdeki anlık bant genişliği kullanımını gösterir."
        >
          <BarChartWidget data={data.networkTraffic} height="100%" />
        </ChartCard>
      </div>

      <div className="lg:col-span-4 lg:min-h-0 lg:overflow-hidden">
        <ChartCard 
          title="Cihaz Durum Dağılımı" 
          subtitle="Sistemdeki cihazların anlık erişilebilirlik durumu"
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
    </div>
  );
}

export default ChartsSection;

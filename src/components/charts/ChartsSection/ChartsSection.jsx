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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ChartCard title="Trafik Eğilimi" subtitle="Yükleniyor...">
            <Skeleton variant="rectangular" height={300} className="w-full rounded" />
          </ChartCard>
          <ChartCard title="CPU Kullanımı" subtitle="Yükleniyor...">
            <Skeleton variant="rectangular" height={300} className="w-full rounded" />
          </ChartCard>
        </div>
        <div className="lg:col-span-1">
          <ChartCard title="Cihaz Durumu" subtitle="Yükleniyor...">
            <Skeleton variant="rectangular" height={300} className="w-full rounded" />
          </ChartCard>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return <ErrorState message={error || "Grafik verileri yüklenirken bir hata oluştu."} onRetry={() => dispatch(fetchCharts())} />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 transition-opacity duration-500 ease-in opacity-100">
      {/* Sol Sütun: Line ve Bar Grafikleri (Geniş ekranlarda 2/3 alan) */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <ChartCard 
          title="Ağ Trafik Eğilimi" 
          subtitle="Son 24 saatlik gelen ve giden ağ trafiği (Mbps)"
          infoText="Sistemdeki anlık bant genişliği kullanımını gösterir."
        >
          <BarChartWidget data={data.networkTraffic} height={300} />
        </ChartCard>

        <ChartCard 
          title="CPU Kullanım Eğilimi" 
          subtitle="Son 24 saatlik ortalama işlemci yükü"
          infoText="Tüm cihazların ortalama CPU kullanım yüzdesidir."
        >
          <LineChartWidget 
            data={data.cpuUsage} 
            seriesName="CPU Kullanımı" 
            color="#8b5cf6" 
            height={300} 
          />
        </ChartCard>
      </div>

      {/* Sağ Sütun: Donut Grafiği (Geniş ekranlarda 1/3 alan) */}
      <div className="lg:col-span-1">
        <ChartCard 
          title="Cihaz Durum Dağılımı" 
          subtitle="Sistemdeki cihazların anlık erişilebilirlik durumu"
        >
          <div className="flex flex-col h-full gap-6">
            <div className="flex-1">
              <PieChartWidget data={data.deviceStatusDistribution} height={250} />
            </div>
            <div className="mt-auto pt-4 border-t border-slate-100">
              <PieLegendList data={data.deviceStatusDistribution} />
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

export default ChartsSection;

import { useState } from 'react';
import Card from './components/common/Card/index.js';
import StatusBadge from './components/common/Badge/index.js';
import ProgressBar from './components/common/ProgressBar/index.js';
import SearchInput from './components/common/SearchInput/index.js';
import TrendIndicator from './components/common/TrendIndicator/index.js';
import EmptyState from './components/common/EmptyState/index.js';
import Pagination from './components/common/Pagination/index.js';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900">
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
        <Card title="Common Component Preview" action={<StatusBadge status="online" />}>
          <div className="space-y-4">
            <TrendIndicator percentage={12.5} direction="up" label="gecen aya gore" />
            <ProgressBar value={68} label="Bellek Kullanımı" color="#8b5cf6" />
            <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Cihaz ara..." />
          </div>
        </Card>

        <Card title="Durumlar">
          <div className="flex flex-wrap gap-2">
            <StatusBadge status="online" />
            <StatusBadge status="warning" />
            <StatusBadge status="offline" />
          </div>
        </Card>

        <Card title="Boş Durum" className="md:col-span-2">
          <EmptyState message="Bu filtreye uygun cihaz bulunamadı." />
        </Card>

        <Card title="Sayfalama" className="md:col-span-2">
          <Pagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} />
        </Card>
      </div>
    </main>
  );
}

export default App;

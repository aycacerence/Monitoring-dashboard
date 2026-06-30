import { useState } from 'react';
import Card from './components/common/Card/index.js';
import StatusBadge from './components/common/Badge/index.js';
import ProgressBar from './components/common/ProgressBar/index.js';
import TrendIndicator from './components/common/TrendIndicator/index.js';
import DashboardGrid from './components/layout/DashboardGrid/index.js';
import Header from './components/layout/Header/index.js';
import PageContainer from './components/layout/PageContainer/index.js';
import DashboardPage from './pages/DashboardPage/DashboardPage.jsx';

function App() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.setTimeout(() => setIsRefreshing(false), 700);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Header
        title="Monitoring Dashboard"
        subtitle="İzleme Paneli"
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      <PageContainer>
        <DashboardPage />
      </PageContainer>
    </div>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout/AppLayout';
import DashboardPage from '../pages/DashboardPage/DashboardPage';
import DashboardSettingsPage from '../pages/DashboardSettingsPage/DashboardSettingsPage';
import PIDBuilder from '../pages/pid/PIDBuilder';
import LiveMonitoring from '../pages/pid/LiveMonitoring';
import AlarmsPage from '../pages/AlarmsPage/AlarmsPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="settings" element={<DashboardSettingsPage />} />
          <Route path="pid/builder" element={<PIDBuilder />} />
          <Route path="pid/monitoring" element={<LiveMonitoring />} />
          <Route path="alarms" element={<AlarmsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout/AppLayout';
import DashboardPage from '../pages/DashboardPage/DashboardPage';
import DashboardSettingsPage from '../pages/DashboardSettingsPage/DashboardSettingsPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="settings" element={<DashboardSettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout/AppLayout';
import DashboardPage from '../pages/DashboardPage/DashboardPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

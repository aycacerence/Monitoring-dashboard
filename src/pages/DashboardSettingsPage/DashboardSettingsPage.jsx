import DashboardPage from '../DashboardPage/DashboardPage';
import { useAppSelector } from '../../app/hooks';

function DashboardSettingsPage() {
  const role = useAppSelector((state) => state.auth.role);

  return <DashboardPage key={role} />;
}

export default DashboardSettingsPage;

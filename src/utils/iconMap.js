import DevicesIcon from '@mui/icons-material/Devices';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import DashboardIcon from '@mui/icons-material/Dashboard'; // Fallback icon

/**
 * JSON data'sındaki icon key'lerini MUI ikonlarına eşler.
 */
export const iconMap = {
  devices: DevicesIcon,
  checkCircle: CheckCircleIcon,
  notifications: NotificationsIcon,
  cpu: MemoryIcon,
  memory: MemoryIcon,
  storage: StorageIcon,
};

export const getIconComponent = (iconName) => {
  return iconMap[iconName] || DashboardIcon;
};

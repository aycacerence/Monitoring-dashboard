import { Box, Typography } from '@mui/material';
import ComputerIcon from '@mui/icons-material/Computer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';

export default function KpiPreview({ widgetId }) {
  const getMockData = () => {
    switch (widgetId) {
      case 'kpi-total-devices':
        return { value: '128', unit: 'adet', color: '#6366f1', trend: '↑ 12.5%', isUp: true, Icon: ComputerIcon };
      case 'kpi-online-devices':
        return { value: '102', unit: 'adet', color: '#22c55e', trend: '↑ 8.3%', isUp: true, Icon: CheckCircleIcon };
      case 'kpi-active-alarms':
        return { value: '7', unit: 'adet', color: '#ef4444', trend: '↑ 16.7%', isUp: true, Icon: NotificationsActiveIcon };
      case 'kpi-average-cpu':
        return { value: '42', unit: '%', color: '#8b5cf6', trend: '↓ 5.4%', isUp: false, Icon: MemoryIcon };
      case 'kpi-average-memory':
        return { value: '68', unit: '%', color: '#f59e0b', trend: '↑ 3.1%', isUp: true, Icon: MemoryIcon };
      case 'kpi-average-disk':
        return { value: '57', unit: '%', color: '#d946ef', trend: '↓ 2.8%', isUp: false, Icon: StorageIcon };
      default:
        return { value: '128', unit: 'adet', color: '#6366f1', trend: '↑ 12.5%', isUp: true, Icon: ComputerIcon };
    }
  };

  const data = getMockData();
  const IconCmp = data.Icon;

  return (
    <Box sx={{ px: 1.5, py: 1, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* Icon top right */}
      <Box sx={{ 
        position: 'absolute', top: 6, right: 12, 
        width: 24, height: 24, borderRadius: 1.5, 
        bgcolor: `${data.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' 
      }}>
        <IconCmp sx={{ fontSize: 14, color: data.color }} />
      </Box>

      {/* Value and Unit */}
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mt: 0.5 }}>
        <Typography sx={{ fontSize: 22, fontWeight: 800, color: 'text.primary', lineHeight: 1 }}>
          {data.value}
        </Typography>
        <Typography sx={{ fontSize: 9, color: 'text.secondary', fontWeight: 500 }}>
          {data.unit}
        </Typography>
      </Box>

      {/* Sparkline Mock */}
      <Box sx={{ mt: 'auto', mb: 1, width: '100%', height: 16 }}>
        <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 10">
          <defs>
            <linearGradient id={`grad-${widgetId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={data.color} stopOpacity="0.4"/>
              <stop offset="100%" stopColor={data.color} stopOpacity="0"/>
            </linearGradient>
          </defs>
          <polyline
            fill="none"
            stroke={data.color}
            strokeWidth="1.5"
            points={data.isUp ? "0,8 20,7 40,9 60,6 80,5 100,2" : "0,2 20,4 40,3 60,6 80,7 100,9"}
          />
          <polygon
            fill={`url(#grad-${widgetId})`}
            points={data.isUp ? "0,10 0,8 20,7 40,9 60,6 80,5 100,2 100,10" : "0,10 0,2 20,4 40,3 60,6 80,7 100,9 100,10"}
          />
        </svg>
      </Box>

      {/* Trend */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography sx={{ fontSize: 9, color: data.isUp ? 'success.main' : 'error.main', fontWeight: 600 }}>
          {data.trend}
        </Typography>
        <Typography sx={{ fontSize: 8, color: 'text.disabled' }}>
          geçen aya göre
        </Typography>
      </Box>
    </Box>
  );
}

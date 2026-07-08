import { Box, Typography } from '@mui/material';

export default function AlertsPreview() {
  const alerts = [
    { device: 'FW-EDGE-01', color: '#ef4444' },
    { device: 'SRV-003',    color: '#f59e0b' },
    { device: 'SW-002',     color: '#ef4444' },
  ];
  return (
    <Box sx={{ p: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.75 }}>
        <Box sx={{ bgcolor: '#ef4444', borderRadius: 10, px: 0.75, py: 0.1 }}>
          <Typography sx={{ fontSize: 7, color: 'white', fontWeight: 700 }}>6 Yeni</Typography>
        </Box>
      </Box>
      {alerts.map((a, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, py: 0.4, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: a.color, flexShrink: 0 }} />
          <Typography sx={{ fontSize: 8, color: 'text.primary', fontWeight: 500 }}>{a.device}</Typography>
          <Typography sx={{ fontSize: 7, color: 'text.disabled', ml: 'auto' }}>3dk önce</Typography>
        </Box>
      ))}
    </Box>
  );
}

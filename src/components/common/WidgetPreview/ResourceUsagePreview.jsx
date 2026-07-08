import { Box, Typography } from '@mui/material';

export default function ResourceUsagePreview() {
  const items = [
    { label: 'CPU', pct: 42, color: '#6366f1' },
    { label: 'Bellek', pct: 68, color: '#f59e0b' },
    { label: 'Disk', pct: 57, color: '#a42350' },
  ];
  return (
    <Box sx={{ p: 1, height: '100%', display: 'flex', flexDirection: 'column', gap: 0.75, justifyContent: 'center' }}>
      {items.map((item) => (
        <Box key={item.label}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
            <Typography sx={{ fontSize: 8, color: 'text.secondary' }}>{item.label}</Typography>
            <Typography sx={{ fontSize: 8, fontWeight: 700 }}>{item.pct}%</Typography>
          </Box>
          <Box sx={{ height: 4, bgcolor: 'action.hover', borderRadius: 2 }}>
            <Box sx={{ height: '100%', width: `${item.pct}%`, bgcolor: item.color, borderRadius: 2 }} />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

import { Box, Typography } from '@mui/material';

export default function BarChartPreview() {
  const bars = [
    { incoming: 60, outgoing: 40 },
    { incoming: 80, outgoing: 55 },
    { incoming: 45, outgoing: 30 },
    { incoming: 90, outgoing: 65 },
    { incoming: 70, outgoing: 50 },
    { incoming: 55, outgoing: 35 },
  ];
  return (
    <Box sx={{ p: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
        <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#6366f1' }} />
          <Typography sx={{ fontSize: 7, color: 'text.disabled' }}>Gelen</Typography>
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#22c55e' }} />
          <Typography sx={{ fontSize: 7, color: 'text.disabled' }}>Giden</Typography>
        </Box>
      </Box>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 0.5 }}>
        {bars.map((b, i) => (
          <Box key={i} sx={{ flex: 1, display: 'flex', gap: '1px', alignItems: 'flex-end', height: '100%' }}>
            <Box sx={{ flex: 1, height: `${b.incoming}%`, bgcolor: '#6366f1', borderRadius: '2px 2px 0 0', opacity: 0.8 }} />
            <Box sx={{ flex: 1, height: `${b.outgoing}%`, bgcolor: '#22c55e', borderRadius: '2px 2px 0 0', opacity: 0.8 }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

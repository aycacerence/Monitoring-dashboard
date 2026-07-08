import { Box, Typography } from '@mui/material';

export default function SystemSummaryPreview() {
  const items = [
    { label: 'Çalışma Süresi', value: '15 gün' },
    { label: 'Toplam Trafik',  value: '2.45 TB' },
    { label: 'Kritik Olay',    value: '3' },
    { label: 'Başarılı İşlem', value: '1,245' },
  ];
  return (
    <Box sx={{ p: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5, flex: 1 }}>
        {items.map((item) => (
          <Box key={item.label} sx={{ p: 0.5, bgcolor: 'action.hover', borderRadius: 1 }}>
            <Typography sx={{ fontSize: 7, color: 'text.disabled' }}>{item.label}</Typography>
            <Typography sx={{ fontSize: 9, fontWeight: 700 }}>{item.value}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

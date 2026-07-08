import { Box, Typography } from '@mui/material';

export default function DevicesPreview() {
  const rows = [
    { name: 'SRV-001', ip: '192.168.1.10', status: 'Çevrimiçi', statusColor: '#22c55e' },
    { name: 'SRV-002', ip: '192.168.1.11', status: 'Çevrimiçi', statusColor: '#22c55e' },
    { name: 'FW-001',  ip: '192.168.1.1',  status: 'Uyarı',     statusColor: '#f59e0b' },
  ];
  return (
    <Box sx={{ p: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 0.5, overflow: 'hidden', flex: 1 }}>
        {/* Başlık satırı */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr', bgcolor: 'action.hover', px: 0.75, py: 0.3 }}>
          {['Cihaz Adı', 'IP', 'Durum'].map((h) => (
            <Typography key={h} sx={{ fontSize: 7, fontWeight: 600, color: 'text.disabled' }}>{h}</Typography>
          ))}
        </Box>
        {rows.map((row, i) => (
          <Box key={i} sx={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr', px: 0.75, py: 0.4, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography sx={{ fontSize: 7.5, fontWeight: 500 }}>{row.name}</Typography>
            <Typography sx={{ fontSize: 7, color: 'text.secondary' }}>{row.ip}</Typography>
            <Typography sx={{ fontSize: 7, color: row.statusColor, fontWeight: 600 }}>{row.status}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

import { Box, Typography } from '@mui/material';

export default function PieChartPreview() {
  // SVG ile basit donut çemberi
  const cx = 30, cy = 30, r = 22, stroke = 10;
  const circumference = 2 * Math.PI * r;
  const segments = [
    { pct: 0.79, color: '#22c55e', label: 'Çevrimiçi', value: '102' },
    { pct: 0.14, color: '#f59e0b', label: 'Uyarı',     value: '18' },
    { pct: 0.07, color: '#ef4444', label: 'Çevrimdışı',value: '8'  },
  ];
  let offset = 0;
  return (
    <Box sx={{ p: 1, height: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
      <svg width={60} height={60} viewBox="0 0 60 60">
        {segments.map((s, i) => {
          const dash = s.pct * circumference;
          const el = (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset * circumference}
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          );
          offset += s.pct;
          return el;
        })}
        <text x={cx} y={cy+3} textAnchor="middle" fontSize="8" fontWeight="bold" fill="currentColor">128</text>
      </svg>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4 }}>
        {segments.map((s) => (
          <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: s.color, flexShrink: 0 }} />
            <Typography sx={{ fontSize: 7, color: 'text.secondary' }}>{s.label}</Typography>
            <Typography sx={{ fontSize: 7, fontWeight: 700, ml: 'auto', pl: 0.5 }}>{s.value}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

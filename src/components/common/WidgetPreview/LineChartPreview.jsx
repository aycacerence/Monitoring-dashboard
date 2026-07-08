import { Box, Typography } from '@mui/material';

export default function LineChartPreview() {
  const points = [40,55,45,60,50,65,55,70,60,46];
  const max = Math.max(...points);
  const w = 140, h = 50;
  const coords = points
    .map((v, i) => `${(i/(points.length-1))*w},${h - (v/max)*h}`)
    .join(' ');
  return (
    <Box sx={{ p: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <polyline
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
            points={coords}
          />
          <polygon
            fill="url(#cpuGrad)"
            points={`0,${h} ${coords} ${w},${h}`}
          />
        </svg>
      </Box>
      <Typography sx={{ fontSize: 8, color: 'text.disabled', textAlign: 'right' }}>
        Son 24 saat
      </Typography>
    </Box>
  );
}

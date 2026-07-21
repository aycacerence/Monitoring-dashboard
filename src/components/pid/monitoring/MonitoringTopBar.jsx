import React from 'react';
import { AppBar, Toolbar, Box, Typography, IconButton, Switch, Badge, Tooltip, FormControlLabel, FormControl, Select, MenuItem } from '@mui/material';
import { ArrowLeft, Bell, Activity } from 'lucide-react';

const MonitoringTopBar = ({
  autoRefresh = false,
  onToggleAutoRefresh,
  alarmCount = 0,
  lastUpdate,
  diagramName,
  diagrams = [],
  activeDiagramId,
  onSwitchDiagram,
  onBackToBuilder
}) => {
  return (
    <AppBar position="static" elevation={1} color="inherit" sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 56, sm: 64 }, px: { xs: 2, sm: 3 } }}>
        {/* SOL TARAF */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Builder'a Dön">
            <IconButton onClick={onBackToBuilder} edge="start" color="inherit" sx={{ mr: 0.5 }}>
              <ArrowLeft size={20} className="text-slate-700 dark:text-slate-300" />
            </IconButton>
          </Tooltip>
          
      

          {diagrams && diagrams.length > 0 ? (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 0, sm: 1 }, gap: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, display: { xs: 'none', md: 'block' }, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                Aktif Proses:
              </Typography>
              <FormControl size="small" variant="outlined" sx={{ minWidth: 150 }}>
                <Select
                  value={activeDiagramId || ''}
                  onChange={(e) => onSwitchDiagram && onSwitchDiagram(e.target.value)}
                  displayEmpty
                  sx={{ 
                    height: 32, 
                    bgcolor: 'primary.50', 
                    borderRadius: 2,
                    color: 'primary.700',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    '.MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '.MuiSvgIcon-root': { color: 'primary.700' }
                  }}
                >
                  {diagrams.map((d) => (
                    <MenuItem key={d.id} value={d.id} sx={{ fontWeight: 500 }}>
                      {d.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          ) : (
            diagramName && (
              <Typography variant="body2" sx={{ ml: { xs: 0, sm: 1 }, fontWeight: 600, color: 'primary.700', bgcolor: 'primary.50', px: 1.5, py: 0.5, borderRadius: 2 }}>
                {diagramName}
              </Typography>
            )
          )}
        </Box>

        {/* SAĞ TARAF */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 3 } }}>
          {/* Son Güncelleme & Pulse Indicator */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {autoRefresh && (
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#10B981',
                  '@keyframes pulse-dot': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.3 },
                    '100%': { opacity: 1 },
                  },
                  animation: 'pulse-dot 2s infinite ease-in-out',
                }}
              />
            )}
            {lastUpdate && (
              <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' }, fontWeight: 500 }}>
                Son güncelleme: {lastUpdate instanceof Date ? lastUpdate.toLocaleTimeString() : new Date(lastUpdate).toLocaleTimeString()}
              </Typography>
            )}
          </Box>

          {/* Otomatik Yenile Switch */}
          <FormControlLabel
            control={
              <Switch 
                checked={autoRefresh} 
                onChange={(e) => onToggleAutoRefresh && onToggleAutoRefresh(e.target.checked)} 
                color="primary"
                size="small"
              />
            }
            label={
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, color: 'text.primary', fontWeight: 500 }}>
                Otomatik Yenile
              </Typography>
            }
            sx={{ m: 0 }}
          />

          {/* Bildirim Zili */}
          <Tooltip title="Alarmlar">
            <IconButton color="inherit" sx={{ ml: { xs: 0, sm: 1 } }}>
              <Badge badgeContent={alarmCount} color="error" invisible={alarmCount === 0}>
                <Bell size={20} className="text-slate-700 dark:text-slate-300" />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MonitoringTopBar;

import React from 'react';
import { AppBar, Toolbar, Box, Typography, IconButton, Chip, Switch, Badge, Tooltip, FormControlLabel } from '@mui/material';
import { ArrowLeft, Bell, Activity } from 'lucide-react';

const MonitoringTopBar = ({
  autoRefresh = false,
  onToggleAutoRefresh,
  alarmCount = 0,
  lastUpdate,
  diagramName,
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
          
      

          {diagramName && (
            <Chip 
              size="small" 
              label={diagramName} 
              variant="outlined" 
              color="primary"
              sx={{ ml: { xs: 0, sm: 1 }, fontWeight: 500, bgcolor: 'primary.50', dark: { bgcolor: 'primary.900/20' } }}
            />
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

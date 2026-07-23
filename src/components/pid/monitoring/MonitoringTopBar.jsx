import React from 'react';
import { AppBar, Toolbar, Box, Typography, Button, FormControl, Select, MenuItem } from '@mui/material';
import { Edit } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <AppBar position="static" elevation={1} color="inherit" sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 56, sm: 64 }, px: { xs: 2, sm: 3 } }}>
        {/* SOL TARAF */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

          {diagrams && diagrams.length > 0 ? (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 0, sm: 1 }, gap: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, display: { xs: 'none', md: 'block' }, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                {t('pidMonitoring.activeProcess', 'Aktif Proses:')}
              </Typography>
              <FormControl size="small" variant="outlined" sx={{ minWidth: 150 }}>
                <Select
                  value={activeDiagramId && diagrams.some(d => d.id === activeDiagramId) ? activeDiagramId : ''}
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
                  {!activeDiagramId && (
                    <MenuItem value="" disabled>
                      {t('pidMonitoring.selectDiagram', 'Diyagram Seçin')}
                    </MenuItem>
                  )}
                  {diagrams.map((d) => (
                    <MenuItem key={d.id} value={d.id} sx={{ fontWeight: 500 }}>
                      {d.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {/* Diyagramı Düzenle Butonu (Sola Taşındı) */}
              <Button 
                variant="contained" 
                color="primary" 
                onClick={onBackToBuilder}
                startIcon={<Edit size={16} />}
                disableElevation
                sx={{ ml: { xs: 1, sm: 2 }, fontWeight: 600, px: { xs: 1.5, sm: 2 }, py: 0.5, borderRadius: 2, height: 32, whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                {t('pidBuilder.editDiagram', 'Diyagramı Düzenle')}
              </Button>

            </Box>
          ) : (
            diagramName && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ ml: { xs: 0, sm: 1 }, fontWeight: 600, color: 'primary.700', bgcolor: 'primary.50', px: 1.5, py: 0.5, borderRadius: 2 }}>
                  {diagramName}
                </Typography>
                
                {/* Diyagramı Düzenle Butonu (Tekil Görünüm - Sola Taşındı) */}
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={onBackToBuilder}
                  startIcon={<Edit size={16} />}
                  disableElevation
                  sx={{ fontWeight: 600, px: { xs: 1.5, sm: 2 }, py: 0.5, borderRadius: 2, height: 32, whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                  {t('pidBuilder.editDiagram', 'Diyagramı Düzenle')}
                </Button>
              </Box>
            )
          )}
        </Box>

        {/* SAĞ TARAF */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 3 } }}>
          {/* Son Güncelleme */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {lastUpdate && (
              <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' }, fontWeight: 500 }}>
                {t('header.lastUpdated', 'Son güncelleme')}: {lastUpdate instanceof Date ? lastUpdate.toLocaleTimeString() : new Date(lastUpdate).toLocaleTimeString()}
              </Typography>
            )}
          </Box>

          {/* Sistem Çevrimiçi İndikatörü (Sağa Taşındı, Kenarlıksız) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: '#10B981',
                '@keyframes pulse-dot': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.4 },
                  '100%': { opacity: 1 },
                },
                animation: 'pulse-dot 2s infinite ease-in-out',
              }}
            />
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {t('pidMonitoring.systemOnline', 'Sistem Çevrimiçi')}
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MonitoringTopBar;

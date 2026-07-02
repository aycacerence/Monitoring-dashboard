import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import RefreshIcon from '@mui/icons-material/Refresh';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { Button, Select, MenuItem, Box, IconButton, Tooltip, ToggleButtonGroup, ToggleButton } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import { toggleMode, selectColorMode } from '../../../features/theme/themeSlice';
import { useTranslation } from 'react-i18next';

// Removed static TIME_RANGE_OPTIONS

/**
 * Dashboard üst çubuğu — başlık (sol), son güncelleme + filtre + mod toggle + yenile (sağ).
 */
function Header({ title, lastUpdated, timeRange, onTimeRangeChange, onRefresh, isRefreshing }) {
  const dispatch = useDispatch();
  const mode = useSelector(selectColorMode);
  const { t, i18n: i18nInstance } = useTranslation();

  const timeRangeOptions = [
    { value: '1h',  label: t('header.timeRanges.1h', 'Son 1 Saat') },
    { value: '24h', label: t('header.timeRanges.24h', 'Son 24 Saat') },
    { value: '7d',  label: t('header.timeRanges.7d', 'Son 7 Gün') },
    { value: '30d', label: t('header.timeRanges.30d', 'Son 30 Gün') },
  ];

  return (
    <Box
      component="header"
      className="sticky top-0 z-20 w-full"
      sx={{ bgcolor: 'primary.main' }}
    >
      <div className="flex min-h-16 flex-wrap items-center justify-between gap-2 px-4 py-3 sm:flex-nowrap sm:px-6 lg:px-8">

        {/* Sol: Sayfa başlığı */}
        <div className="min-w-0 basis-full sm:basis-auto">
          <h1 className="text-center whitespace-nowrap text-lg font-bold tracking-normal text-white sm:text-left sm:truncate sm:text-xl lg:text-2xl">
            {t('header.title')}
          </h1>
        </div>

        {/* Sağ: Son güncelleme + Filtre + Mod Toggle + Yenile */}
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2 sm:flex-initial sm:justify-end sm:shrink-0">

          {/* Son güncelleme tarihi */}
          {lastUpdated && (
            <span className="hidden lg:block text-xs font-medium text-white/75 whitespace-nowrap">
              {t('header.lastUpdated')}: {lastUpdated}
            </span>
          )}

          {/* Zaman aralığı filtresi */}
          <Select
            size="small"
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
            aria-label="Zaman aralığı filtresi"
            startAdornment={
              <CalendarTodayIcon sx={{ fontSize: 14, mr: 0.5, color: 'primary.main' }} />
            }
            sx={{
              backgroundColor: '#ffffff',
              color: '#1e293b',
              fontWeight: 500,
              fontSize: { xs: '0.75rem', sm: '0.8125rem' },
              borderRadius: '8px',
              height: '32px',
              minWidth: { xs: 132, sm: 150 },
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '& .MuiSelect-icon': { color: '#64748b' },
              '& .MuiSelect-select': { paddingLeft: '6px', paddingRight: '28px !important' },
            }}
          >
            {timeRangeOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '0.8125rem' }}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>

          {/* Dil Seçici (Toggle) */}
          <Box className="flex items-center gap-1 bg-white/10 rounded-lg p-0.5">
            <TranslateIcon fontSize="small" sx={{ color: 'white', ml: 1 }} />
            <ToggleButtonGroup
              value={i18nInstance.language.startsWith('en') ? 'en' : 'tr'}
              exclusive
              onChange={(_, newLang) => {
                if (newLang && newLang !== i18nInstance.language) {
                  i18nInstance.changeLanguage(newLang).then(() => {
                    window.location.reload();
                  });
                }
              }}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  color: 'rgba(255,255,255,0.7)',
                  border: 'none',
                  px: 1,
                  py: 0.5,
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  '&.Mui-selected': {
                    color: 'primary.main',
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                    }
                  }
                }
              }}
            >
              <ToggleButton value="tr">TR</ToggleButton>
              <ToggleButton value="en">EN</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Dark / Light mode toggle */}
          <Tooltip title={mode === 'dark' ? t('header.lightMode', 'Açık Mod') : t('header.darkMode', 'Koyu Mod')} arrow>
            <IconButton
              onClick={() => dispatch(toggleMode())}
              aria-label={mode === 'dark' ? 'Açık moda geç' : 'Koyu moda geç'}
              size="small"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.25)' },
                width: 32,
                height: 32,
              }}
            >
              {mode === 'dark' ? (
                <LightModeIcon sx={{ fontSize: 18 }} />
              ) : (
                <DarkModeIcon sx={{ fontSize: 18 }} />
              )}
            </IconButton>
          </Tooltip>

          {/* Yenile butonu */}
          <Button
            variant="contained"
            size="small"
            onClick={onRefresh}
            aria-label="Verileri Yenile"
            startIcon={
              <RefreshIcon
                fontSize="small"
                className={isRefreshing ? 'animate-spin' : ''}
              />
            }
            sx={{
              backgroundColor: '#ffffff',
              color: '#000000',
              '&:hover': { backgroundColor: '#f1f1f1' },
              boxShadow: 'none',
              fontWeight: 600,
              fontSize: { xs: '0.75rem', sm: '0.8125rem' },
              textTransform: 'none',
              borderRadius: '8px',
              minWidth: 'auto',
            }}
          >
            {t('header.refresh')}
          </Button>
        </div>
      </div>
    </Box>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  lastUpdated: PropTypes.string,
  timeRange: PropTypes.string.isRequired,
  onTimeRangeChange: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  isRefreshing: PropTypes.bool.isRequired,
};

export default Header;

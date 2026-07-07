import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import RefreshIcon from '@mui/icons-material/Refresh';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { Button, Select, MenuItem, Box, IconButton, Tooltip, ToggleButtonGroup, ToggleButton, Menu } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckIcon from '@mui/icons-material/Check';
import MenuIcon from '@mui/icons-material/Menu';
import { toggleMode, selectColorMode } from '../../../features/theme/themeSlice';
import { useTranslation } from 'react-i18next';
import { selectRole, setRole } from '../../../features/auth/authSlice';
import { useState } from 'react';

// Removed static TIME_RANGE_OPTIONS

/**
 * Dashboard üst çubuğu — başlık (sol), son güncelleme + filtre + mod toggle + yenile (sağ).
 */
function Header({ title, lastUpdated, timeRange, onTimeRangeChange, onRefresh, isRefreshing, onMenuClick }) {
  const dispatch = useDispatch();
  const mode = useSelector(selectColorMode);
  const role = useSelector(selectRole);
  const { t, i18n: i18nInstance } = useTranslation();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const [timeAnchorEl, setTimeAnchorEl] = useState(null);
  const timeOpen = Boolean(timeAnchorEl);
  const handleTimeClick = (event) => setTimeAnchorEl(event.currentTarget);
  const handleTimeClose = () => setTimeAnchorEl(null);

  const handleTimeChange = (value) => {
    onTimeRangeChange(value);
    handleTimeClose();
  };

  const handleRoleChange = (newRole) => {
    dispatch(setRole(newRole));
    
    // Dil secimini role gore guncelle
    const newRoleLang = localStorage.getItem(`i18nLang_${newRole}`) || 'tr';
    if (newRoleLang !== i18nInstance.language) {
      i18nInstance.changeLanguage(newRoleLang);
    }
    
    handleClose();
  };

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
        <div className="min-w-0 basis-full sm:basis-auto flex items-center gap-2">
          {onMenuClick && (
            <IconButton onClick={onMenuClick} sx={{ color: 'white' }}>
              <MenuIcon />
            </IconButton>
          )}
          <h1 className="text-center whitespace-nowrap text-lg font-bold tracking-normal text-white sm:text-left sm:truncate sm:text-xl lg:text-2xl">
            {t('header.title')}
          </h1>
        </div>

        {/* Sağ: Son güncelleme + Filtre + Mod Toggle + Yenile */}
        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-start gap-2 sm:flex-initial sm:justify-end sm:shrink-0">

          {/* Son güncelleme tarihi */}
          {lastUpdated && (
            <span className="hidden lg:block text-xs font-medium text-white/75 whitespace-nowrap">
              {t('header.lastUpdated')}: {lastUpdated}
            </span>
          )}

          {/* Mobil İçin Zaman Aralığı Menüsü */}
          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <IconButton 
              onClick={handleTimeClick}
              sx={{ 
                backgroundColor: '#ffffff', 
                borderRadius: '8px', 
                width: 32, 
                height: 32,
                '&:hover': { backgroundColor: '#f1f1f1' }
              }}
            >
              <CalendarTodayIcon sx={{ fontSize: 16, color: 'primary.main' }} />
            </IconButton>
            <Menu
              anchorEl={timeAnchorEl}
              open={timeOpen}
              onClose={handleTimeClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              slotProps={{
                paper: {
                  sx: { mt: 1, minWidth: 150, borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
                },
              }}
            >
              {timeRangeOptions.map((opt) => (
                <MenuItem 
                  key={opt.value} 
                  onClick={() => handleTimeChange(opt.value)} 
                  selected={timeRange === opt.value}
                  sx={{ fontSize: '0.875rem', py: 1 }}
                >
                  {opt.label}
                  {timeRange === opt.value && <CheckIcon fontSize="small" sx={{ ml: 'auto', color: 'primary.main' }} />}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Masaüstü İçin Zaman Aralığı Seçici */}
          <Select
            size="small"
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
            aria-label="Zaman aralığı filtresi"
            startAdornment={
              <CalendarTodayIcon sx={{ fontSize: 14, mr: 0.5, color: 'primary.main' }} />
            }
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              backgroundColor: '#ffffff',
              color: '#1e293b',
              fontWeight: 500,
              fontSize: '0.8125rem',
              borderRadius: '8px',
              height: '32px',
              minWidth: 150,
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

          {/* Rol Seçici */}
          <Box className="flex items-center">
            <Button
              onClick={handleClick}
              sx={{
                color: 'white',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8125rem',
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
                borderRadius: '8px',
                px: { xs: 1, sm: 2 },
                minWidth: 'auto'
              }}
            >
              <AccountCircleIcon sx={{ mr: { xs: 0, sm: 1 } }} />
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                {role === 'admin' ? t('auth.admin', 'Admin') : t('auth.user', 'Kullanıcı')}
              </Box>
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              slotProps={{
                paper: {
                  sx: { mt: 1, minWidth: 150, borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
                },
              }}
            >
              <MenuItem onClick={() => handleRoleChange('admin')} sx={{ fontSize: '0.875rem', py: 1 }}>
                Rol: {t('auth.admin', 'Admin')}
                {role === 'admin' && <CheckIcon fontSize="small" sx={{ ml: 'auto', color: 'primary.main' }} />}
              </MenuItem>
              <MenuItem onClick={() => handleRoleChange('user')} sx={{ fontSize: '0.875rem', py: 1 }}>
                Rol: {t('auth.user', 'Kullanıcı')}
                {role === 'user' && <CheckIcon fontSize="small" sx={{ ml: 'auto', color: 'primary.main' }} />}
              </MenuItem>
            </Menu>
          </Box>

          {/* Dil Seçici (Toggle) */}
          <Box className="flex items-center gap-1 bg-white/10 rounded-lg p-0.5">
            <TranslateIcon fontSize="small" sx={{ color: 'white', ml: 1, display: { xs: 'none', sm: 'block' } }} />
            <ToggleButtonGroup
              value={i18nInstance.language.startsWith('en') ? 'en' : 'tr'}
              exclusive
              onChange={(_, newLang) => {
                if (newLang && newLang !== i18nInstance.language) {
                  localStorage.setItem(`i18nLang_${role}`, newLang);
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
              px: { xs: 1, sm: 2 },
            }}
          >
            <RefreshIcon
              fontSize="small"
              className={isRefreshing ? 'animate-spin' : ''}
              sx={{ mr: { xs: 0, sm: 1 } }}
            />
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              {t('header.refresh')}
            </Box>
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
  onMenuClick: PropTypes.func,
};

export default Header;

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  IconButton,
  Divider,
  Backdrop,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import NatureOutlinedIcon from '@mui/icons-material/NatureOutlined';
import InvertColorsOutlinedIcon from '@mui/icons-material/InvertColorsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { useTranslation } from 'react-i18next';

function MainSidebar({ activePanelSection = 'panel', onOpenWidgetSidebar, onCloseWidgetSidebar }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const navigate = useNavigate();
  const location = useLocation();

  const [openAccordion, setOpenAccordion] = useState({
    kontrolPaneli: true,
    pid: false,
  });

  // Default to collapsed everywhere as requested
  const [isCollapsed, setIsCollapsed] = useState(true);

  const isDirty = useSelector((state) => state.ui?.isDirty || false);

  const handleNavigate = (targetPath, action) => {
    if (isDirty) {
      // Eğer kullanıcı Dashboard'daysa ve Panel Ayarlarına (kaydetme ekranına) geçmek istiyorsa izin ver.
      const isDashboardArea = location.pathname === '/' || location.pathname === '/settings';
      if (isDashboardArea && targetPath === '/settings') {
        // İzin ver
      } 
      // Eğer kullanıcı zaten aynı ekrandaysa (Tasarım menüsüne tekrar tıklıyorsa) izin ver.
      else if (location.pathname === targetPath) {
        // İzin ver
      } 
      else {
        toast.error(t('pidBuilder.toolbar.unsavedWarning', 'Önce değişiklikleri kaydetmelisiniz.'));
        return;
      }
    }
    action();
  };

  const toggleAccordion = (panel) => {
    setOpenAccordion((prev) => ({
      ...prev,
      [panel]: !prev[panel],
    }));
  };

  const navItemStyle = {
    color: '#9ca3af',
    borderRadius: '8px',
    mb: 0.5,
    mx: 1,
    py: 1,
    px: 2,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: '#ffffff',
      '& .MuiListItemIcon-root': {
        color: '#ffffff',
      },
    },
    '&.Mui-selected, &.Mui-selected:hover': {
      backgroundColor: '#e11d48', // Red/Pink accent color from screenshot
      color: '#ffffff',
      '& .MuiListItemIcon-root': {
        color: '#ffffff',
      },
    },
  };

  const navIconStyle = {
    color: '#9ca3af',
    minWidth: '40px',
  };

  const subItemStyle = {
    ...navItemStyle,
    pl: 6,
  };

  return (
    <>
      {isMobile && !isCollapsed && (
        <Backdrop 
          open={true} 
          onClick={() => setIsCollapsed(true)} 
          sx={{ zIndex: 1299 }} 
        />
      )}
      {isMobile && !isCollapsed && <Box sx={{ width: 80, flexShrink: 0 }} />}
      <Box
        sx={{
          width: isCollapsed ? 80 : 280,
          height: '100%',
          backgroundColor: '#1e1e24', // Dark background similar to screenshot
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease',
          flexShrink: 0,
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          ...(isMobile && !isCollapsed && {
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 1300,
          }),
        }}
      >
        {/* Header Logo Area */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-end', height: 64 }}>
        <IconButton onClick={() => setIsCollapsed(!isCollapsed)} sx={{ color: '#9ca3af' }}>
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Menu Label */}
      {!isCollapsed && (
        <Typography variant="caption" sx={{ px: 3, py: 1, color: '#6b7280', fontWeight: 'bold', letterSpacing: 1 }}>
          {t('mainSidebar.menu', 'MENU')}
        </Typography>
      )}

      {/* Navigation List */}
      <Box sx={{ flex: 1, overflowY: 'auto', '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px' } }}>
        <List sx={{ pt: 0 }}>
          
          {/* Kontrol Paneli */}
          <ListItemButton onClick={() => toggleAccordion('kontrolPaneli')} sx={navItemStyle}>
            <ListItemIcon sx={navIconStyle}>
              <HomeOutlinedIcon />
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary={t('mainSidebar.controlPanel', 'Kontrol Paneli')} primaryTypographyProps={{ fontSize: '0.875rem' }} />}
            {!isCollapsed && (openAccordion.kontrolPaneli ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />)}
          </ListItemButton>
          {!isCollapsed && (
            <Collapse in={openAccordion.kontrolPaneli} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton 
                  selected={location.pathname === '/' && activePanelSection === 'panel'} 
                  onClick={() => handleNavigate('/', () => {
                    navigate('/');
                    if (onCloseWidgetSidebar) onCloseWidgetSidebar();
                  })}
                  sx={subItemStyle}
                >
                  <ListItemIcon sx={navIconStyle}>
                    <DashboardOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={t('mainSidebar.panel', 'Panel')} primaryTypographyProps={{ fontSize: '0.875rem' }} />
                </ListItemButton>
                
                {/* PANEL AYARLARI -> Toggles WidgetSidebar */}
                <ListItemButton 
                  selected={activePanelSection === 'settings'}
                  onClick={() => handleNavigate('/settings', () => {
                    onOpenWidgetSidebar();
                    if (isMobile) {
                      setIsCollapsed(true);
                    }
                  })}
                  sx={subItemStyle}
                >
                  <ListItemIcon sx={navIconStyle}>
                    <SettingsOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={t('mainSidebar.panelSettings', 'Panel Ayarları')} primaryTypographyProps={{ fontSize: '0.875rem' }} />
                </ListItemButton>
              </List>
            </Collapse>
          )}

          {/* P&ID Modülü */}
          <ListItemButton onClick={() => toggleAccordion('pid')} sx={navItemStyle}>
            <ListItemIcon sx={navIconStyle}>
              <AccountTreeOutlinedIcon />
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary={t('mainSidebar.pid', 'P&ID')} primaryTypographyProps={{ fontSize: '0.875rem' }} />}
            {!isCollapsed && (openAccordion.pid ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />)}
          </ListItemButton>
          {!isCollapsed && (
            <Collapse in={openAccordion.pid} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton 
                  selected={location.pathname === '/pid/builder'} 
                  onClick={() => handleNavigate('/pid/builder', () => {
                    navigate('/pid/builder');
                    if (isMobile) setIsCollapsed(true);
                  })}
                  sx={subItemStyle}
                >
                  <ListItemIcon sx={navIconStyle}>
                    <EditOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={t('mainSidebar.pidBuilder', 'Tasarım')} primaryTypographyProps={{ fontSize: '0.875rem' }} />
                </ListItemButton>
                
                <ListItemButton 
                  selected={location.pathname === '/pid/monitoring'}
                  onClick={() => handleNavigate('/pid/monitoring', () => {
                    navigate('/pid/monitoring');
                    if (isMobile) setIsCollapsed(true);
                  })}
                  sx={subItemStyle}
                >
                  <ListItemIcon sx={navIconStyle}>
                    <TimelineOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={t('mainSidebar.pidMonitoring', 'Canlı İzleme')} primaryTypographyProps={{ fontSize: '0.875rem' }} />
                </ListItemButton>

                <ListItemButton 
                  selected={location.pathname === '/pid/alarms'}
                  onClick={() => handleNavigate('/pid/alarms', () => {
                    navigate('/pid/alarms');
                    if (isMobile) setIsCollapsed(true);
                  })}
                  sx={subItemStyle}
                >
                  <ListItemIcon sx={navIconStyle}>
                    <NotificationsNoneOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={t('mainSidebar.pidAlarms', 'Alarmlar')} primaryTypographyProps={{ fontSize: '0.875rem' }} />
                </ListItemButton>
              </List>
            </Collapse>
          )}

          {/* Standalone Items */}
          {[
            { text: t('mainSidebar.settings', 'Ayarlar'), icon: <SettingsOutlinedIcon />, expandable: true },
            { text: t('mainSidebar.profile', 'Profil'), icon: <PersonOutlineOutlinedIcon />, expandable: false },
          ].map((item, idx) => (
            <ListItemButton key={idx} sx={navItemStyle}>
              <ListItemIcon sx={navIconStyle}>{item.icon}</ListItemIcon>
              {!isCollapsed && <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.875rem' }} />}
              {!isCollapsed && item.expandable && (
                <ExpandMore fontSize="small" />
              )}
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Weather Widget Placeholder */}
      {!isCollapsed && (
        <Box sx={{ p: 2, m: 2, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <WbSunnyIcon sx={{ color: '#f59e0b', fontSize: 32 }} />
          <Box>
            <Typography variant="body2" fontWeight="bold">30°C</Typography>
            <Typography variant="caption" sx={{ color: '#9ca3af' }}>{t('mainSidebar.sunny', 'Güneşli')}</Typography>
          </Box>
        </Box>
      )}
    </Box>
    </>
  );
}

export default MainSidebar;

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DataUsageOutlinedIcon from '@mui/icons-material/DataUsageOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import CastOutlinedIcon from '@mui/icons-material/CastOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import NatureOutlinedIcon from '@mui/icons-material/NatureOutlined';
import InvertColorsOutlinedIcon from '@mui/icons-material/InvertColorsOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import FlashOnIcon from '@mui/icons-material/FlashOn';

function MainSidebar({ onOpenWidgetSidebar, onCloseWidgetSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [openAccordion, setOpenAccordion] = useState({
    kontrolPaneli: true,
    gozlemMerkezi: false,
  });

  const [isCollapsed, setIsCollapsed] = useState(false);

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
          MENU
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
            {!isCollapsed && <ListItemText primary="Kontrol Paneli" primaryTypographyProps={{ fontSize: '0.875rem' }} />}
            {!isCollapsed && (openAccordion.kontrolPaneli ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />)}
          </ListItemButton>
          {!isCollapsed && (
            <Collapse in={openAccordion.kontrolPaneli} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton 
                  selected={location.pathname === '/'} 
                  onClick={() => {
                    navigate('/');
                    if (onCloseWidgetSidebar) onCloseWidgetSidebar();
                  }} 
                  sx={subItemStyle}
                >
                  <ListItemIcon sx={navIconStyle}>
                    <DashboardOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Panel" primaryTypographyProps={{ fontSize: '0.875rem' }} />
                </ListItemButton>
                
                {/* PANEL AYARLARI -> Toggles WidgetSidebar */}
                <ListItemButton 
                  onClick={onOpenWidgetSidebar} 
                  sx={subItemStyle}
                >
                  <ListItemIcon sx={navIconStyle}>
                    <SettingsOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Panel Ayarları" primaryTypographyProps={{ fontSize: '0.875rem' }} />
                </ListItemButton>
              </List>
            </Collapse>
          )}

          {/* Gözlem Merkezi */}
          <ListItemButton onClick={() => toggleAccordion('gozlemMerkezi')} sx={navItemStyle}>
            <ListItemIcon sx={navIconStyle}>
              <VisibilityOutlinedIcon />
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary="Gözlem Merkezi" primaryTypographyProps={{ fontSize: '0.875rem' }} />}
            {!isCollapsed && (openAccordion.gozlemMerkezi ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />)}
          </ListItemButton>
          {!isCollapsed && (
            <Collapse in={openAccordion.gozlemMerkezi} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={subItemStyle}>
                  <ListItemIcon sx={navIconStyle}><DataUsageOutlinedIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Veri Paneli" primaryTypographyProps={{ fontSize: '0.875rem' }} />
                </ListItemButton>
                <ListItemButton sx={subItemStyle}>
                  <ListItemIcon sx={navIconStyle}><AssessmentOutlinedIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Enerji Raporu" primaryTypographyProps={{ fontSize: '0.875rem' }} />
                </ListItemButton>
                <ListItemButton sx={subItemStyle}>
                  <ListItemIcon sx={navIconStyle}><NotificationsActiveOutlinedIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Alarm Monitoring" primaryTypographyProps={{ fontSize: '0.875rem' }} />
                </ListItemButton>
                <ListItemButton sx={subItemStyle}>
                  <ListItemIcon sx={navIconStyle}><TimelineOutlinedIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Cihaz Sağlığı Gantt" primaryTypographyProps={{ fontSize: '0.875rem' }} />
                </ListItemButton>
                <ListItemButton sx={subItemStyle}>
                  <ListItemIcon sx={navIconStyle}><TrendingUpOutlinedIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary="KPI İzleme" primaryTypographyProps={{ fontSize: '0.875rem' }} />
                </ListItemButton>
              </List>
            </Collapse>
          )}

          {/* Standalone Items */}
          {[
            { text: 'Canlı İzleme', icon: <CastOutlinedIcon /> },
            { text: 'Analiz', icon: <InsertChartOutlinedIcon /> },
            { text: 'Tanımlama', icon: <ListAltOutlinedIcon /> },
            { text: 'Proje Yönetim Planı', icon: <AccountTreeOutlinedIcon /> },
            { text: 'Ayarlar', icon: <SettingsOutlinedIcon /> },
            { text: 'Organizasyon', icon: <BusinessOutlinedIcon /> },
            { text: 'Profile', icon: <PersonOutlineOutlinedIcon /> },
            { text: 'Wiki', icon: <MenuBookOutlinedIcon /> },
          ].map((item, idx) => (
            <ListItemButton key={idx} sx={navItemStyle}>
              <ListItemIcon sx={navIconStyle}>{item.icon}</ListItemIcon>
              {!isCollapsed && <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.875rem' }} />}
              {!isCollapsed && ['Canlı İzleme', 'Analiz', 'Tanımlama', 'Proje Yönetim Planı', 'Ayarlar'].includes(item.text) && (
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
            <Typography variant="caption" sx={{ color: '#9ca3af' }}>Güneşli</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default MainSidebar;

import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import Header from '../Header/index.js';
import WidgetSidebar from '../WidgetSidebar/WidgetSidebar';
import MainSidebar from '../MainSidebar/index.js';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [savePromptOpen, setSavePromptOpen] = useState(false);
  const [activePanelSection, setActivePanelSection] = useState('panel');
  const [headerProps, setHeaderProps] = useState({
    title: 'Monitoring Dashboard',
    timeRange: '24h',
    onTimeRangeChange: () => {},
    onRefresh: () => {},
    isRefreshing: false,
  });

  useEffect(() => {
    // When sidebar toggles, wait for transition and trigger resize for charts
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
    return () => clearTimeout(timer);
  }, [sidebarOpen]);

  const openEditMode = () => {
    setSavePromptOpen(false);
    setActivePanelSection('settings');
    setSidebarOpen(true);
    setIsEditMode(true);
  };

  const requestViewMode = () => {
    if (isEditMode) {
      setSavePromptOpen(true);
      return;
    }

    setActivePanelSection('panel');
    setSidebarOpen(false);
    setIsEditMode(false);
  };

  const saveAndExitEditMode = () => {
    setSavePromptOpen(false);
    setActivePanelSection('panel');
    setSidebarOpen(false);
    setIsEditMode(false);
    window.dispatchEvent(new Event('resize'));
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <MainSidebar 
        activePanelSection={activePanelSection}
        onOpenWidgetSidebar={openEditMode}
        onCloseWidgetSidebar={requestViewMode}
      />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', minWidth: 0 }}>
        <Header 
          {...headerProps}
        />
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
          <WidgetSidebar
            open={sidebarOpen}
            onClose={requestViewMode}
          />
          <Box
            component="main"
            sx={{
              flex: 1,
              overflow: 'hidden',
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Outlet context={{ setHeaderProps, isEditMode }} />
          </Box>
        </Box>
      </Box>
      <Dialog
        open={savePromptOpen}
        onClose={() => setSavePromptOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Panel ayarları kaydedilsin mi?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Yaptığınız widget düzenlemelerini kaydedip panele dönmek istiyor musunuz?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setSavePromptOpen(false)}>
            Vazgeç
          </Button>
          <Button variant="contained" onClick={saveAndExitEditMode}>
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AppLayout;

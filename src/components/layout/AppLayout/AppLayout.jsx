import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from '../Header/index.js';
import WidgetSidebar from '../WidgetSidebar/WidgetSidebar';
import MainSidebar from '../MainSidebar/index.js';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.js';
import { loadVisibility, setVisibilityConfig } from '../../../features/widgetVisibility/widgetVisibilitySlice.js';
import { setEditMode } from '../../../features/ui/uiSlice.js';

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.role);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isEditMode = location.pathname === '/settings';
  const activePanelSection = isEditMode ? 'settings' : 'panel';
  const [headerProps, setHeaderProps] = useState({
    title: 'Monitoring Dashboard',
    timeRange: '24h',
    onTimeRangeChange: () => {},
    onRefresh: () => {},
    isRefreshing: false,
  });

  useEffect(() => {
    setSidebarOpen(isEditMode);
    dispatch(setEditMode(isEditMode));
    // When sidebar toggles, wait for transition and trigger resize for charts
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
    return () => clearTimeout(timer);
  }, [dispatch, isEditMode]);

  useEffect(() => {
    dispatch(setVisibilityConfig(loadVisibility(role)));
  }, [dispatch, role]);

  const openEditMode = () => {
    setSidebarOpen(true);
    navigate('/settings');
  };

  const requestViewMode = () => {
    setSidebarOpen(false);
    navigate('/');
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
            isEditMode={isEditMode}
          />
          <Box
            key={role}
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
    </Box>
  );
}

export default AppLayout;

import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from '../Header/index.js';
import WidgetSidebar from '../WidgetSidebar/WidgetSidebar';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header 
        {...headerProps}
        onMenuClick={() => setSidebarOpen((prev) => !prev)} 
      />
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        <WidgetSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
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
          <Outlet context={{ setHeaderProps }} />
        </Box>
      </Box>
    </Box>
  );
}

export default AppLayout;

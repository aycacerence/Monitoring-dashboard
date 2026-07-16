import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Chip,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SensorsIcon from '@mui/icons-material/Sensors';
import { usePID } from '../../../context/pid/PIDContext';

// Sekmelerin içeriğini yönetmek için basit bir yardımcı bileşen
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`device-tabpanel-${index}`}
      aria-labelledby={`device-tab-${index}`}
      {...other}
      style={{ height: '100%', overflowY: 'auto' }}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
};

// Künye (bilgi listesi) satırları için tekrar kullanılabilir bileşen
const InfoRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
    <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0, mr: 2 }}>
      {label}
    </Typography>
    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500, textAlign: 'right' }}>
      {value || '-'}
    </Typography>
  </Box>
);

const DeviceDetailPanel = () => {
  const { selectedNode, setSelectedNode } = usePID();
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleClose = () => {
    setSelectedNode(null);
  };

  // Dinamik durum (status) renk eşleşmeleri
  const statusColors = {
    alarm: 'error',
    critical: 'error',
    warning: 'warning',
    normal: 'success',
  };

  // Optional chaining ile güvenli veri erişimi
  const nodeData = selectedNode?.data || {};
  const staticData = nodeData?.defaultData || {};
  const status = nodeData?.status || 'default';
  const chipColor = statusColors[status] || 'default';

  return (
    <Drawer
      anchor="right"
      variant="persistent"
      open={Boolean(selectedNode)}
      sx={{
        width: 320,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: 320, boxSizing: 'border-box' },
      }}
    >
      {/* Üst Bilgi (Header) */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {nodeData?.label || selectedNode?.id || 'Cihaz Detayı'}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />

      {/* Sekmeler (Tabs) */}
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="fullWidth"
        aria-label="Cihaz detay sekmeleri"
      >
        <Tab icon={<InfoOutlinedIcon fontSize="small" />} iconPosition="start" label="Genel" />
        <Tab icon={<SensorsIcon fontSize="small" />} iconPosition="start" label="Canlı Veri" />
      </Tabs>
      <Divider />

      {/* Genel Sekmesi */}
      <TabPanel value={tabIndex} index={0}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
          Cihaz Kimliği
        </Typography>
        <InfoRow label="Cihaz Adı" value={nodeData?.label} />
        <InfoRow label="Tip" value={selectedNode?.type} />
        <InfoRow label="Konum" value={staticData?.location} />
        <InfoRow label="Bağlantı Noktası" value={staticData?.port} />
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
          Teknik Detaylar
        </Typography>
        <InfoRow label="Model" value={staticData?.model} />
        <InfoRow label="Seri No" value={staticData?.serialNumber} />
        <InfoRow label="Devreye Alma Tarihi" value={staticData?.installDate} />
        <InfoRow label="Son Bakım Tarihi" value={staticData?.lastMaintenance} />
      </TabPanel>

      {/* Canlı Veri Sekmesi */}
      <TabPanel value={tabIndex} index={1}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
          {/* Durum Chip'i */}
          <Chip 
            label={status.toUpperCase()} 
            color={chipColor} 
            sx={{ fontWeight: 'bold', mb: 3 }} 
          />
          
          {/* Devasa Tipografi ile Canlı Veri */}
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, color: 'text.primary' }}>
              {nodeData?.liveValue ?? '-'}
            </Typography>
            <Typography variant="h5" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {nodeData?.unit || ''}
            </Typography>
          </Box>
        </Box>
      </TabPanel>
    </Drawer>
  );
};

export default DeviceDetailPanel;

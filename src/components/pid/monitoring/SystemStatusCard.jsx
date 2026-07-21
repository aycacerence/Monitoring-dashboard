import React, { useMemo } from 'react';
import { Card, CardContent, Typography, Box, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';

const SystemStatusCard = ({ nodes = [], liveData = {} }) => {
  const { t } = useTranslation();
  const { totalNodes, activeCount, alarmCount, warningCount, maintenanceCount } = useMemo(() => {
    let total = nodes.length;
    let active = 0;
    let alarm = 0;
    let warning = 0;
    let maintenance = 0;

    nodes.forEach((node) => {
      const status = liveData[node?.id]?.status;
      const nodeDurum = node?.data?.durum;
      
      if (status === 'normal' || status === 'warning' || status === 'alarm') {
        active += 1;
      }
      
      if (status === 'alarm') {
        alarm += 1;
      } else if (status === 'warning') {
        warning += 1;
      }

      if (status === 'bakımda' || nodeDurum === 'Bakımda') {
        maintenance += 1;
      }
    });

    return {
      totalNodes: total,
      activeCount: active,
      alarmCount: alarm,
      warningCount: warning,
      maintenanceCount: maintenance,
    };
  }, [nodes, liveData]);

  return (
    <Card
      sx={{
        width: '100%',
        boxShadow: 1,
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
      }}
    >
      <CardContent sx={{ pb: '16px !important' }}>
        {/* Başlık ve Durum İşareti */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: 'success.main',
              mr: 1,
              boxShadow: '0 0 8px rgba(76, 175, 80, 0.6)' // Çevrimiçi hissi veren hafif parlama
            }}
          />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {t('pidMonitoring.systemStatus.title', 'Sistem Durumu')}
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 2 }} />

        {/* İstatistik Satırları */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {t('pidMonitoring.systemStatus.activeDevices', 'Aktif Cihazlar')}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {activeCount} / {totalNodes}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {t('pidMonitoring.systemStatus.alarms', 'Alarmlar')}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'error.main', fontWeight: 'bold' }}>
            {alarmCount}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {t('pidMonitoring.systemStatus.warnings', 'Uyarılar')}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'warning.main', fontWeight: 'bold' }}>
            {warningCount}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {t('pidMonitoring.systemStatus.maintenance', 'Bakım Gereken')}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
            {maintenanceCount}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SystemStatusCard;

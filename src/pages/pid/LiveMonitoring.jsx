import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { ReactFlowProvider } from 'reactflow';

import { PIDProvider, usePID } from '../../context/pid/PIDContext';
import { useDummySocket } from '../../hooks/useDummySocket';

import MonitoringTopBar from '../../components/pid/monitoring/MonitoringTopBar';
import KPILiveRow from '../../components/pid/monitoring/KPILiveRow';
import SystemStatusCard from '../../components/pid/monitoring/SystemStatusCard';
import AlarmList from '../../components/pid/monitoring/AlarmList';
import MonitoringCanvas from '../../components/pid/monitoring/MonitoringCanvas';
import DeviceDetailPanel from '../../components/pid/monitoring/DeviceDetailPanel';

const MonitoringContent = () => {
  const navigate = useNavigate();
  const { diagrams, activeDiagramId, nodes, edges } = usePID();
  
  const [autoRefresh, setAutoRefresh] = useState(true);

  // 1. PIDContext'ten gelen aktif diyagramı bul (sadece metadata için)
  const diagram = diagrams?.find((d) => d.id === activeDiagramId);

  // 2. Aktif diyagramın cihazlarını (nodes) liveData hook'una bağla
  const { liveData, alarms, lastUpdate } = useDummySocket(nodes || [], autoRefresh);

  // 3. Boş State (Diyagram bulunamazsa)
  if (!diagram) {
    return (
      <Box className="flex flex-col items-center justify-center w-full h-screen bg-slate-50 dark:bg-slate-900">
        <Typography variant="h5" className="mb-4 text-slate-600 dark:text-slate-300">
          İzlenecek bir diyagram seçilmedi veya bulunamadı.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<ArrowLeft size={18} />}
          onClick={() => navigate('/pid/builder')}
          sx={{ textTransform: 'none', px: 3, py: 1 }}
        >
          Düzenleyiciye Dön
        </Button>
      </Box>
    );
  }

  // 4. Ana Yapı
  return (
    <Box className="flex flex-col w-full h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* ÜST BAR */}
      <MonitoringTopBar 
        autoRefresh={autoRefresh}
        onToggleAutoRefresh={setAutoRefresh}
        alarmCount={alarms?.length || 0}
        lastUpdate={lastUpdate}
        diagramName={diagram.name}
        onBackToBuilder={() => navigate('/pid/builder')}
      />

      {/* KPI SATIRI (Canlı değerler) */}
      <KPILiveRow 
        kpiIds={diagram.kpiConfig || []} 
        liveData={liveData} 
      />

      {/* 3'LÜ PANEL YAPISI */}
      <Box className="flex flex-1 overflow-hidden relative border-t border-slate-200 dark:border-slate-800">
        
        {/* SOL PANEL: Sistem Durumu & Alarmlar */}
        <Box className="w-64 p-4 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col gap-4 overflow-y-auto">
          <SystemStatusCard nodes={nodes} liveData={liveData} />
          <AlarmList alarms={alarms} />
        </Box>

        {/* ORTA PANEL: React Flow Canvas */}
        <Box className="flex-1 relative bg-slate-50 dark:bg-slate-950">
          <ReactFlowProvider>
            <MonitoringCanvas 
              nodes={nodes} 
              edges={edges} 
              liveData={liveData} 
            />
          </ReactFlowProvider>
        </Box>
        {/* Sağdan Açılan Overlay Cihaz Detay Çekmecesi (Artık Header'ı örtmez) */}
        <DeviceDetailPanel liveData={liveData} />
      </Box>
    </Box>
  );
};

export default function LiveMonitoring() {
  return (
    <PIDProvider>
      <MonitoringContent />
    </PIDProvider>
  );
}

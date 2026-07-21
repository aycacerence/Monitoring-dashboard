import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  MenuItem,
  Select,
  FormControl
} from '@mui/material';
import { AlertTriangle, AlertCircle, BellRing, Settings2 } from 'lucide-react';
import { PIDProvider, usePID } from '../../context/pid/PIDContext';

function AlarmsContent() {
  const location = useLocation();
  const { diagrams, activeDiagramId } = usePID();

  const [selectedDiagramId, setSelectedDiagramId] = useState(
    location.state?.diagramId || activeDiagramId || ''
  );

  const [alarms, setAlarms] = useState([]);

  useEffect(() => {
    if (!selectedDiagramId && activeDiagramId) {
      setSelectedDiagramId(activeDiagramId);
    }
  }, [activeDiagramId, selectedDiagramId]);

  useEffect(() => {
    if (!selectedDiagramId) return;
    
    // Eğer router üzerinden geldiysek ve id uyuşuyorsa router state'ini kullan
    if (location.state?.diagramId === selectedDiagramId && location.state?.alarms) {
      setAlarms(location.state.alarms);
    } else {
      // Değilse, localStorage'dan bu diyagramın alarmlarını getir
      const savedData = localStorage.getItem(`pid_alarms_data_${selectedDiagramId}`);
      if (savedData) {
        try {
          setAlarms(JSON.parse(savedData) || []);
        } catch (e) {
          console.error("Alarms parse error", e);
          setAlarms([]);
        }
      } else {
        setAlarms([]);
      }
    }
  }, [selectedDiagramId, location.state]);

  const selectedDiagramName = diagrams?.find(d => d.id === selectedDiagramId)?.name || '';

  return (
    <Box className="p-6 h-full flex flex-col">
      <Box className="mb-4 flex items-center justify-between">
        <Box className="flex items-center gap-4">
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select
              value={selectedDiagramId}
              onChange={(e) => setSelectedDiagramId(e.target.value)}
              displayEmpty
              sx={{ fontWeight: 'bold', bgcolor: 'background.paper' }}
              startAdornment={<Settings2 size={16} className="text-slate-500 mr-2 ml-1" />}
            >
              <MenuItem value="" disabled>Diyagram Seçin</MenuItem>
              {diagrams.map((d) => (
                <MenuItem key={d.id} value={d.id} sx={{ fontWeight: 600 }}>{d.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Chip label="Diyagram Alarmları" size="small" sx={{ fontWeight: 500, bgcolor: 'slate.100' }} className="dark:bg-slate-800" />
        </Box>
      </Box>
      <TableContainer component={Paper} className="flex-1 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Zaman</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Seviye</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Cihaz</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Mesaj</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alarms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  Gösterilecek alarm bulunmuyor.
                </TableCell>
              </TableRow>
            ) : (
              alarms.map((alarm) => (
                <TableRow key={alarm.id} hover>
                  <TableCell className="whitespace-nowrap">
                    {alarm.timestamp instanceof Date 
                      ? alarm.timestamp.toLocaleTimeString() 
                      : new Date(alarm.timestamp).toLocaleTimeString()
                    }
                  </TableCell>
                  <TableCell>
                    {alarm.severity === 'alarm' ? (
                      <Chip 
                        icon={<AlertTriangle size={14} className="ml-1" />} 
                        label="Kritik Alarm" 
                        color="error" 
                        size="small" 
                        variant="outlined" 
                        sx={{ fontWeight: 'bold' }} 
                      />
                    ) : (
                      <Chip 
                        icon={<AlertCircle size={14} className="ml-1" />} 
                        label="Uyarı" 
                        color="warning" 
                        size="small" 
                        variant="outlined" 
                        sx={{ fontWeight: 'bold' }} 
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{alarm.deviceLabel}</TableCell>
                  <TableCell>{alarm.message}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default function AlarmsPage() {
  return (
    <PIDProvider>
      <AlarmsContent />
    </PIDProvider>
  );
}

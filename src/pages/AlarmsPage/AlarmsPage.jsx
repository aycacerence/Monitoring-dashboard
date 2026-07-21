import React from 'react';
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
  IconButton
} from '@mui/material';
import { ArrowLeft, AlertTriangle, AlertCircle } from 'lucide-react';

export default function AlarmsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Alarmları router state üzerinden alıyoruz. Yoksa boş dizi.
  const alarms = location.state?.alarms || [];

  return (
    <Box className="p-6 h-full flex flex-col">
      <Box className="flex items-center gap-4 mb-6">
        <IconButton onClick={() => navigate(-1)} className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
          <ArrowLeft size={20} />
        </IconButton>
        <div>
          <Typography variant="h5" className="font-bold text-slate-800 dark:text-slate-100">
            Tüm Alarmlar
          </Typography>
          <Typography variant="body2" className="text-slate-500">
            Sistemdeki tüm aktif uyarı ve alarmların detaylı listesi
          </Typography>
        </div>
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

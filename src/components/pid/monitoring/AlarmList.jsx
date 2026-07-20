import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

const AlarmList = ({ alarms = [] }) => {
  return (
    <Box className="max-h-64 overflow-y-auto">
      <Typography variant="subtitle2" className="mb-2 font-semibold text-slate-800 dark:text-slate-100 px-1">
        Alarm Geçmişi ({alarms.length})
      </Typography>

      {alarms.length === 0 ? (
        <Box className="flex flex-col items-center justify-center py-6 text-slate-400 dark:text-slate-500">
          <CheckCircle className="w-8 h-8 mb-2 text-green-500 opacity-70" />
          <Typography variant="body2">Aktif alarm yok</Typography>
        </Box>
      ) : (
        <List dense disablePadding>
          {alarms.map((alarm) => (
            <ListItem
              key={alarm.id}
              className={`mb-2 rounded bg-slate-50 dark:bg-slate-800/50 ${
                alarm.severity === 'alarm' 
                  ? 'border-l-4 border-red-500' 
                  : 'border-l-4 border-orange-400'
              }`}
              sx={{
                px: 2,
                py: 1,
                display: 'flex',
                alignItems: 'flex-start',
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                {alarm.severity === 'alarm' ? (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-orange-400" />
                )}
              </ListItemIcon>
              <ListItemText
                disableTypography
                primary={
                  <div className="flex justify-between items-start mb-0.5">
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                      {alarm.deviceLabel}
                    </span>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                      {alarm.timestamp instanceof Date 
                        ? alarm.timestamp.toLocaleTimeString() 
                        : new Date(alarm.timestamp).toLocaleTimeString()
                      }
                    </span>
                  </div>
                }
                secondary={
                  <span className="text-xs text-gray-500 dark:text-slate-400 block leading-tight mt-0.5">
                    {alarm.message}
                  </span>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default AlarmList;

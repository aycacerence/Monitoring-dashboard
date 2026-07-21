import React, { useState, useRef, useCallback } from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Button, CircularProgress } from '@mui/material';
import { AlertTriangle, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AlarmList = ({ alarms = [] }) => {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(10);
  const scrollRef = useRef(null);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleScroll = useCallback(() => {
    if (scrollRef.current && !isLoadingMore) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        if (visibleCount < alarms.length) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 10, alarms.length));
            setIsLoadingMore(false);
          }, 500); // Küçük bir yükleniyor efekti için 500ms gecikme
        }
      }
    }
  }, [alarms.length, isLoadingMore, visibleCount]);

  const visibleAlarms = alarms.slice(0, visibleCount);
  return (
    <Box className="flex-1 flex flex-col min-h-0">
      <Box className="flex items-center justify-between mb-2 px-1 shrink-0">
        <Typography variant="subtitle2" className="font-semibold text-slate-800 dark:text-slate-100">
          Alarm Geçmişi ({alarms.length})
        </Typography>
        <Button
          size="small"
          onClick={() => navigate('/alarms', { state: { alarms } })}
          endIcon={<ArrowRight size={12} />}
          sx={{ textTransform: 'none', fontSize: '0.7rem', p: 0, minWidth: 'auto', fontWeight: 700 }}
        >
          Tümü
        </Button>
      </Box>

      {alarms.length === 0 ? (
        <Box className="flex flex-col items-center justify-center py-6 text-slate-400 dark:text-slate-500">
          <CheckCircle className="w-8 h-8 mb-2 text-green-500 opacity-70" />
          <Typography variant="body2">Aktif alarm yok</Typography>
        </Box>
      ) : (
        <Box 
          ref={scrollRef}
          onScroll={handleScroll}
          className="overflow-y-auto pr-1 flex-1"
        >
          <List dense disablePadding>
            {visibleAlarms.map((alarm) => (
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
          {isLoadingMore && (
            <Box className="flex items-center justify-center py-3 text-slate-500">
              <CircularProgress size={14} thickness={5} color="inherit" />
              <Typography variant="caption" className="ml-2 font-medium">
                Yükleniyor...
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AlarmList;

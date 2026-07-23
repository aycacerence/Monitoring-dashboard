import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, useMediaQuery } from '@mui/material';
import * as LucideIcons from 'lucide-react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { getKpiById } from '../../../config/kpiDashboardConfig';
import { useTranslation } from 'react-i18next';

const KPILiveCard = ({ kpiId, liveData, isMobile }) => {
  const { i18n } = useTranslation();
  const kpi = getKpiById(kpiId);
  const data = liveData?.[kpiId];

  if (!kpi || !data) return null;

  const kpiLabel = i18n.language === 'en' ? (kpi.labelEN || kpi.labelTR) : (kpi.labelTR || kpi.labelEN);
  const IconComponent = LucideIcons[kpi.icon] || LucideIcons.Activity;

  const isAlarm = data.status === 'alarm';
  const isWarning = data.status === 'warning';

  let borderColor = 'border-slate-200 dark:border-slate-800';
  if (isAlarm) borderColor = 'border-red-500';
  else if (isWarning) borderColor = 'border-orange-400';

  let textColor = 'text-slate-800 dark:text-slate-100';
  if (isAlarm) textColor = 'text-red-600 dark:text-red-400';
  else if (isWarning) textColor = 'text-orange-500 dark:text-orange-400';

  return (
    <Box 
      className={`relative p-4 rounded-xl border bg-white dark:bg-slate-900 shadow-sm transition-colors duration-300 ${borderColor}`}
      sx={{ 
        minWidth: isMobile ? '180px' : 'auto', 
        flexShrink: 0 
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <Typography 
          variant="caption" 
          className="font-semibold text-slate-500 dark:text-slate-400 line-clamp-1 mr-2" 
          title={kpiLabel}
        >
          {kpiLabel}
        </Typography>
        <Box sx={{ color: kpi.iconColor || 'primary.main', display: 'flex', opacity: 0.9 }}>
          <IconComponent size={18} />
        </Box>
      </div>
      <div className="flex items-baseline gap-1 mt-1">
        <Typography variant="h5" className={`font-bold ${textColor}`}>
          {data.value}
        </Typography>
        <Typography variant="caption" className="text-slate-400 font-medium">
          {data.unit || kpi.unit}
        </Typography>
      </div>
    </Box>
  );
};

const KPILiveRow = ({ kpiIds, liveData }) => {
  const isMobile = useMediaQuery('(max-width:1024px)');
  const scrollRef = useRef(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  // Scroll durumunu kontrol eden fonksiyon
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 2); // 2px tolerans
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
    }
  };

  // Kpi sayısı veya boyut değiştiğinde scroll durumunu güncelle
  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [kpiIds, isMobile]);

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  if (!kpiIds || kpiIds.length === 0) return null;

  if (!isMobile) {
    return (
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '12px', 
          p: 2 
        }}
      >
        {kpiIds.map(id => (
          <KPILiveCard key={id} kpiId={id} liveData={liveData} isMobile={false} />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden', p: 2 }}>
      <Box 
        ref={scrollRef}
        onScroll={checkScroll}
        sx={{ 
          display: 'flex', 
          overflowX: 'auto', 
          gap: '12px', 
          pb: 1, // scrollbar için hafif boşluk
          scrollbarWidth: 'none', // Firefox
          '&::-webkit-scrollbar': { display: 'none' }, // Chrome/Safari
          scrollBehavior: 'smooth'
        }}
      >
        {kpiIds.map(id => (
          <KPILiveCard key={id} kpiId={id} liveData={liveData} isMobile={true} />
        ))}
      </Box>

      {/* Sol Şeffaftan Beyaza Fade ve Sol Ok */}
      {canScrollLeft && (
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '80px',
            background: 'linear-gradient(to left, transparent, var(--mui-palette-background-default))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            pointerEvents: 'none', 
            pl: 1
          }}
        >
          <IconButton 
            onClick={handleScrollLeft}
            size="small"
            sx={{ 
              pointerEvents: 'auto',
              backgroundColor: 'background.paper',
              boxShadow: 2,
              '&:hover': { backgroundColor: 'action.hover' }
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Şeffaftan beyaza doğru fade ve Sağ Ok */}
      {canScrollRight && (
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '80px',
            background: 'linear-gradient(to right, transparent, var(--mui-palette-background-default))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            pointerEvents: 'none', 
            pr: 1
          }}
        >
          <IconButton 
            onClick={handleScrollRight}
            size="small"
            sx={{ 
              pointerEvents: 'auto', 
              backgroundColor: 'background.paper',
              boxShadow: 2,
              '&:hover': { backgroundColor: 'action.hover' }
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default KPILiveRow;

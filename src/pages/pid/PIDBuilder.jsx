import React, { useState, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { PIDProvider, usePID } from '../../context/pid/PIDContext';

import { useMediaQuery, Drawer, Box } from '@mui/material';

import BuilderToolbar from '../../components/pid/builder/BuilderToolbar';
import DevicePalette from '../../components/pid/builder/DevicePalette';
import BuilderCanvas from '../../components/pid/builder/BuilderCanvas';
import PropertyPanel from '../../components/pid/builder/PropertyPanel';
import SplashScreen from '../../components/common/SplashScreen/SplashScreen';
import { useTranslation } from 'react-i18next';

const PIDBuilderContent = () => {
  const { t } = useTranslation();
  const isTabletOrMobile = useMediaQuery('(max-width:1024px)');
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SplashScreen 
        isVisible={isPageLoading} 
        title={t('splash.builderTitle', 'P&ID Tasarımcı')} 
        message={t('splash.builderMessage', 'Çizim araçları ve kütüphane yükleniyor...')} 
      />
      <Box className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 w-full overflow-hidden relative">
        
        <div className="relative z-20">
          <BuilderToolbar onMenuClick={isTabletOrMobile ? () => setMobilePaletteOpen(true) : undefined} />
        </div>

        <div className="flex flex-1 overflow-hidden relative">
          {isTabletOrMobile ? (
            <Drawer
              anchor="left"
              variant="temporary"
              open={mobilePaletteOpen}
              onClose={() => setMobilePaletteOpen(false)}
            >
              <DevicePalette />
            </Drawer>
          ) : (
            <DevicePalette />
          )}
          
          <BuilderCanvas />
          
          <PropertyPanel variant={isTabletOrMobile ? 'temporary' : 'persistent'} />
        </div>
      </Box>
    </>
  );
};

const PIDBuilder = () => {
  return (
    <PIDProvider>
      <ReactFlowProvider>
        <PIDBuilderContent />
      </ReactFlowProvider>
    </PIDProvider>
  );
};

export default PIDBuilder;

import React, { useState, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { PIDProvider, usePID } from '../../context/pid/PIDContext';

import { useMediaQuery, Box } from '@mui/material';

import BuilderToolbar from '../../components/pid/builder/BuilderToolbar';
import DevicePalette from '../../components/pid/builder/DevicePalette';
import BuilderCanvas from '../../components/pid/builder/BuilderCanvas';
import PropertyPanel from '../../components/pid/builder/PropertyPanel';
import SplashScreen from '../../components/common/SplashScreen/SplashScreen';
import { useTranslation } from 'react-i18next';

const PIDBuilderContent = () => {
  const { t } = useTranslation();
  const { selectedNode } = usePID();
  const isTabletOrMobile = useMediaQuery('(max-width:1024px)');
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Tablette her iki panel de persistent — dinamik genişlik hesabı
  // Sol: 220px, Sağ: 240px → toplam 460px → canvas ~50% kalsın diye 220px seçildi
  const paletteWidth = isTabletOrMobile ? 220 : 256;
  const propertyWidth = isTabletOrMobile ? 240 : 320;

  const leftOpen = isTabletOrMobile ? mobilePaletteOpen : true;
  const rightOpen = !!selectedNode && selectedNode.type !== 'textNode';

  return (
    <>
      <SplashScreen 
        isVisible={isPageLoading} 
        title={t('splash.builderTitle', 'P&ID Tasarımcı')} 
        message={t('splash.builderMessage', 'Çizim araçları ve kütüphane yükleniyor...')} 
      />
      <Box className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 w-full overflow-hidden relative">
        
        <div className="relative z-20">
          <BuilderToolbar onMenuClick={isTabletOrMobile ? () => setMobilePaletteOpen((v) => !v) : undefined} />
        </div>

        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
          {/* Sol Panel: Her zaman persistent — tablette toggle ile açılır */}
          <Box
            sx={{
              width: leftOpen ? paletteWidth : 0,
              flexShrink: 0,
              overflow: 'hidden',
              transition: 'width 200ms ease',
              height: '100%',
              borderRight: leftOpen ? 1 : 0,
              borderColor: 'divider',
            }}
          >
            <Box sx={{ width: paletteWidth, height: '100%' }}>
              <DevicePalette />
            </Box>
          </Box>

          {/* Kanvas: kalan alanı tamamen kaplar */}
          <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden', position: 'relative' }}>
            <BuilderCanvas />
          </Box>

          {/* Sağ Panel: Her zaman persistent — seçili node olduğunda açılır */}
          <Box
            sx={{
              width: rightOpen ? propertyWidth : 0,
              flexShrink: 0,
              overflow: 'hidden',
              transition: 'width 200ms ease',
              height: '100%',
              borderLeft: rightOpen ? 1 : 0,
              borderColor: 'divider',
            }}
          >
            <Box sx={{ width: propertyWidth, height: '100%' }}>
              <PropertyPanel />
            </Box>
          </Box>
        </Box>
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

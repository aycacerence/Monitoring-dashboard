import React, { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { PIDProvider } from '../../context/pid/PIDContext';

import { useMediaQuery, Drawer, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import BuilderToolbar from '../../components/pid/builder/BuilderToolbar';
import DevicePalette from '../../components/pid/builder/DevicePalette';
import BuilderCanvas from '../../components/pid/builder/BuilderCanvas';
import PropertyPanel from '../../components/pid/builder/PropertyPanel';

const PIDBuilder = () => {
  const isTabletOrMobile = useMediaQuery('(max-width:1024px)');
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false);

  return (
    <PIDProvider>
      <ReactFlowProvider>
        <div className="flex flex-col h-screen w-full bg-gray-50 overflow-hidden relative">
          
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

        </div>
      </ReactFlowProvider>
    </PIDProvider>
  );
};

export default PIDBuilder;

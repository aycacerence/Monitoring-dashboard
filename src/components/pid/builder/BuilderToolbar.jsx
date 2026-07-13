import React, { useState } from 'react';
import { usePID } from '../../../context/pid/PIDContext';
import toast from 'react-hot-toast';
import {
  AppBar,
  Toolbar,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Box,
} from '@mui/material';
import {
  Mouse,
  Timeline,
  Delete,
  Undo,
  Redo,
  DeleteOutline,
  Save,
} from '@mui/icons-material';

const BuilderToolbar = ({ onModeChange }) => {
  const [mode, setMode] = useState('selection');

  const {
    undo,
    redo,
    saveFlow,
    clearFlow,
    past = [],
    future = [],
  } = usePID();

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
      if (onModeChange) {
        onModeChange(newMode);
      }
    }
  };

  return (
    <>
      <AppBar className="border-b border-gray-200 z-10" color="inherit" elevation={1} position="static">
        <Toolbar className="justify-between min-h-[64px] px-4">
          <ToggleButtonGroup
            className="bg-white"
            exclusive
            onChange={handleModeChange}
            size="small"
            value={mode}
          >
            <ToggleButton value="selection">
              <Mouse fontSize="small" className="mr-1" /> Seçim
            </ToggleButton>
            <ToggleButton value="connection">
              <Timeline fontSize="small" className="mr-1" /> Bağlantı
            </ToggleButton>
            <ToggleButton value="deletion">
              <Delete fontSize="small" className="mr-1" /> Sil
            </ToggleButton>
          </ToggleButtonGroup>

          <Box className="flex items-center gap-3">
            <Button
              startIcon={<Undo />}
              disabled={!past || past.length === 0}
              onClick={undo}
              color="inherit"
            >
              Geri Al
            </Button>

            <Button
              startIcon={<Redo />}
              disabled={!future || future.length === 0}
              onClick={redo}
              color="inherit"
            >
              Yinele
            </Button>

            <div className="h-6 w-px bg-gray-300 mx-1"></div>

            <Button
              startIcon={<DeleteOutline />}
              onClick={clearFlow}
              color="error"
              variant="outlined"
            >
              Temizle
            </Button>

            <Button
              startIcon={<Save />}
              onClick={() => {
                saveFlow();
                toast.success('Diyagram başarıyla kaydedildi');
              }}
              color="primary"
              variant="contained"
            >
              Kaydet
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default BuilderToolbar;

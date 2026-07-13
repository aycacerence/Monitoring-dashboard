import React, { useState } from 'react';
import { usePID } from '../../../context/pid/PIDContext';
import toast from 'react-hot-toast';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
} from '@mui/material';
import {
  Delete,
  Undo,
  Redo,
  DeleteOutline,
  Save,
} from '@mui/icons-material';

const BuilderToolbar = () => {

  const {
    selectedNode,
    deleteNode,
    undo,
    redo,
    saveFlow,
    clearFlow,
    past = [],
    future = [],
  } = usePID();

  const handleDelete = () => {
    if (selectedNode) {
      deleteNode(selectedNode.id);
    }
  };

  return (
    <>
      <AppBar className="border-b border-gray-200 z-10" color="inherit" elevation={1} position="static">
        <Toolbar className="justify-end min-h-[64px] px-4">
          <Box className="flex items-center gap-3">
            <Button
              startIcon={<Delete />}
              disabled={!selectedNode}
              onClick={handleDelete}
              color="inherit"
            >
              Sil
            </Button>

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

import React, { useState } from 'react';
import { usePID } from '../../../context/pid/PIDContext';
import { useTranslation } from 'react-i18next';
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
  Restore,
} from '@mui/icons-material';

const BuilderToolbar = () => {
  const { t } = useTranslation();

  const {
    selectedNode,
    selectedEdge,
    deleteNode,
    deleteEdge,
    undo,
    redo,
    saveFlow,
    clearFlow,
    restoreFlow,
    past = [],
    future = [],
    isDirty,
    nodes = [],
    edges = [],
  } = usePID();

  const handleDelete = () => {
    if (selectedNode) {
      deleteNode(selectedNode.id);
    } else if (selectedEdge) {
      deleteEdge(selectedEdge.id);
    }
  };

  return (
    <>
      <AppBar className="border-b border-gray-200 z-10" color="inherit" elevation={1} position="static">
        <Toolbar className="justify-end min-h-[64px] px-4">
          <Box className="flex items-center gap-3">
            <Button
              startIcon={<Delete />}
              disabled={!selectedNode && !selectedEdge}
              onClick={handleDelete}
              color="inherit"
            >
              {t('pidBuilder.toolbar.delete')}
            </Button>

            <Button
              startIcon={<Undo />}
              disabled={!past || past.length === 0}
              onClick={undo}
              color="inherit"
            >
              {t('pidBuilder.toolbar.undo')}
            </Button>

            <Button
              startIcon={<Redo />}
              disabled={!future || future.length === 0}
              onClick={redo}
              color="inherit"
            >
              {t('pidBuilder.toolbar.redo')}
            </Button>

            <div className="h-6 w-px bg-gray-300 mx-1"></div>

            <Button
              startIcon={<DeleteOutline />}
              disabled={nodes.length === 0 && edges.length === 0}
              onClick={clearFlow}
              color="error"
              variant="outlined"
            >
              {t('pidBuilder.toolbar.clear')}
            </Button>

            <Button
              startIcon={<Restore />}
              disabled={!isDirty}
              onClick={() => {
                restoreFlow();
                toast.success(t('pidBuilder.toolbar.restoreSuccess'));
              }}
              color="warning"
              variant="outlined"
            >
              {t('pidBuilder.toolbar.restore')}
            </Button>

            <Button
              startIcon={<Save />}
              disabled={!isDirty}
              onClick={() => {
                saveFlow();
                toast.success(t('pidBuilder.toolbar.saveSuccess'));
              }}
              color="primary"
              variant="contained"
            >
              {t('pidBuilder.toolbar.save')}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default BuilderToolbar;

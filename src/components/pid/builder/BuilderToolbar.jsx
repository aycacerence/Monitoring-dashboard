import React, { useState } from 'react';
import { usePID } from '../../../context/pid/PIDContext';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useReactFlow, useOnSelectionChange } from 'reactflow';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Delete,
  Undo,
  Redo,
  DeleteOutline,
  Save,
  Restore,
  ZoomOutMap,
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

  const { fitView, getNodes, getEdges } = useReactFlow();
  const [selectedItemCount, setSelectedItemCount] = useState(0);

  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      setSelectedItemCount(nodes.length + edges.length);
    },
  });

  const handleZoomToSelection = () => {
    const allNodes = getNodes();
    const allEdges = getEdges();
    
    const selectedNodes = allNodes.filter(node => node.selected);
    const selectedEdges = allEdges.filter(edge => edge.selected);

    const nodesToFit = new Set(selectedNodes);

    // Seçili boruların (edge) bağlı olduğu cihazları (node) da zoom alanına dahil et
    selectedEdges.forEach(edge => {
      const sourceNode = allNodes.find(n => n.id === edge.source);
      const targetNode = allNodes.find(n => n.id === edge.target);
      if (sourceNode) nodesToFit.add(sourceNode);
      if (targetNode) nodesToFit.add(targetNode);
    });

    const finalNodes = Array.from(nodesToFit);

    if (finalNodes.length > 0) {
      fitView({ nodes: finalNodes, duration: 800, padding: 0.1, maxZoom: 2 });
    }
  };

  const handleDelete = () => {
    if (selectedNode) {
      deleteNode(selectedNode.id);
    } else if (selectedEdge) {
      deleteEdge(selectedEdge.id);
    }
  };

  return (
    <>
      <AppBar 
        sx={{ 
          bgcolor: 'background.paper', 
          color: 'text.primary',
          borderBottom: 1, 
          borderColor: 'divider',
          zIndex: 10
        }} 
        elevation={0} 
        position="static"
      >
        <Toolbar className="justify-end min-h-[64px] px-4">
          <Box className="flex items-center gap-3">
            <Button
              startIcon={<Delete />}
              disabled={!selectedNode && !selectedEdge}
              onClick={handleDelete}
              color="inherit"
              sx={{ 
                '&.Mui-disabled': { color: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)' } 
              }}
            >
              {t('pidBuilder.toolbar.delete')}
            </Button>

            <Button
              startIcon={<Undo />}
              disabled={!past || past.length === 0}
              onClick={undo}
              color="inherit"
              sx={{ 
                '&.Mui-disabled': { color: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)' } 
              }}
            >
              {t('pidBuilder.toolbar.undo')}
            </Button>

            <Button
              startIcon={<Redo />}
              disabled={!future || future.length === 0}
              onClick={redo}
              color="inherit"
              sx={{ 
                '&.Mui-disabled': { color: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)' } 
              }}
            >
              {t('pidBuilder.toolbar.redo')}
            </Button>

            <Box sx={{ height: 24, width: '1px', bgcolor: 'divider', mx: 1 }} />

            <Tooltip title="Seçili Alana Yakınlaş (Shift + Sürükle)">
              <span>
                <IconButton
                  color="inherit"
                  onClick={handleZoomToSelection}
                  disabled={selectedItemCount === 0}
                  sx={{ 
                    '&.Mui-disabled': { color: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)' } 
                  }}
                >
                  <ZoomOutMap />
                </IconButton>
              </span>
            </Tooltip>

            <Box sx={{ height: 24, width: '1px', bgcolor: 'divider', mx: 1 }} />

            <Button
              startIcon={<DeleteOutline />}
              disabled={nodes.length === 0 && edges.length === 0}
              onClick={clearFlow}
              color="error"
              variant="outlined"
              sx={{ whiteSpace: 'nowrap' }}
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
              sx={{ whiteSpace: 'nowrap' }}
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
              sx={{ whiteSpace: 'nowrap' }}
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

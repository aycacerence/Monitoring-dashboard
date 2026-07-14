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
  Menu as MenuIcon,
} from '@mui/icons-material';

const ResponsiveButton = ({ icon: Icon, label, ...props }) => (
  <Tooltip title={label}>
    <span>
      <Button
        sx={{ 
          minWidth: { xs: '40px', md: 'auto' },
          px: { xs: 1, md: 2 },
          whiteSpace: 'nowrap',
          ...props.sx 
        }}
        {...props}
      >
        <Icon sx={{ mr: { xs: 0, md: 1 } }} />
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' } }}>
          {label}
        </Box>
      </Button>
    </span>
  </Tooltip>
);

const BuilderToolbar = ({ onMenuClick }) => {
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
    deleteMultiple,
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
    const allNodes = getNodes();
    const allEdges = getEdges();
    
    const nodesToRemove = allNodes.filter(n => n.selected);
    const edgesToRemove = allEdges.filter(e => e.selected);
    
    if (nodesToRemove.length > 0 || edgesToRemove.length > 0) {
      deleteMultiple(nodesToRemove, edgesToRemove);
    } else if (selectedNode) {
      deleteMultiple([selectedNode], []);
    } else if (selectedEdge) {
      deleteMultiple([], [selectedEdge]);
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
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
        onClick={(e) => e.stopPropagation()}
      >
        <Toolbar className="justify-between min-h-[64px] px-2 sm:px-4">
          <Box className="flex items-center">
            {onMenuClick && (
              <IconButton onClick={onMenuClick} color="inherit" edge="start" sx={{ mr: 1 }}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>
          <Box className="flex items-center gap-1 sm:gap-3 overflow-x-auto no-scrollbar" sx={{ width: '100%', justifyContent: 'flex-end' }}>
            <ResponsiveButton
              icon={Delete}
              label={t('pidBuilder.toolbar.delete')}
              disabled={selectedItemCount === 0 && !selectedNode && !selectedEdge}
              onClick={handleDelete}
              color="inherit"
              sx={{ '&.Mui-disabled': { color: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)' } }}
            />

            <ResponsiveButton
              icon={Undo}
              label={t('pidBuilder.toolbar.undo')}
              disabled={!past || past.length === 0}
              onClick={undo}
              color="inherit"
              sx={{ '&.Mui-disabled': { color: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)' } }}
            />

            <ResponsiveButton
              icon={Redo}
              label={t('pidBuilder.toolbar.redo')}
              disabled={!future || future.length === 0}
              onClick={redo}
              color="inherit"
              sx={{ '&.Mui-disabled': { color: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)' } }}
            />

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

            <ResponsiveButton
              icon={DeleteOutline}
              label={t('pidBuilder.toolbar.clear')}
              disabled={nodes.length === 0 && edges.length === 0}
              onClick={clearFlow}
              color="error"
              variant="outlined"
            />

            <ResponsiveButton
              icon={Restore}
              label={t('pidBuilder.toolbar.restore')}
              disabled={!isDirty}
              onClick={() => {
                restoreFlow();
                toast.success(t('pidBuilder.toolbar.restoreSuccess'));
              }}
              color="warning"
              variant="outlined"
            />

            <ResponsiveButton
              icon={Save}
              label={t('pidBuilder.toolbar.save')}
              disabled={!isDirty}
              onClick={() => {
                saveFlow();
                toast.success(t('pidBuilder.toolbar.saveSuccess'));
              }}
              color="primary"
              variant="contained"
            />
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default BuilderToolbar;

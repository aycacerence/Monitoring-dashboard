import React, { useState } from 'react';
import { usePID } from '../../../context/pid/PIDContext';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useReactFlow, useOnSelectionChange } from 'reactflow';
import {
  Delete,
  Undo,
  Redo,
  DeleteOutline,
  Save,
  Restore,
  ZoomOutMap,
  Menu as MenuIcon,
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';

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
    diagrams,
    activeDiagramId,
    createNewDiagram,
    switchDiagram,
    renameDiagram,
    deleteDiagram,
  } = usePID();

  const { fitView, getNodes, getEdges } = useReactFlow();
  const [selectedItemCount, setSelectedItemCount] = useState(0);
  
  // Çoklu Diyagram State
  const [newDiagramOpen, setNewDiagramOpen] = useState(false);
  const [newDiagramName, setNewDiagramName] = useState('');

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameDiagramName, setRenameDiagramName] = useState('');
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleCreateNew = () => {
    if (isDirty) {
      toast.error(t('pidBuilder.toolbar.unsavedWarning'));
      return;
    }
    setNewDiagramName('');
    setNewDiagramOpen(true);
  };

  const handleConfirmNew = () => {
    if (!newDiagramName.trim()) {
      toast.error(t('pidBuilder.toolbar.invalidName'));
      return;
    }
    createNewDiagram(newDiagramName.trim());
    setNewDiagramOpen(false);
    toast.success(t('pidBuilder.toolbar.diagramCreated'));
  };

  const handleSwitch = (event) => {
    const targetId = event.target.value;
    if (targetId === activeDiagramId) return;

    if (isDirty) {
      toast.error(t('pidBuilder.toolbar.unsavedWarning'));
      return;
    }
    const success = switchDiagram(targetId);
    if (success) {
      toast.success(t('pidBuilder.toolbar.diagramLoaded'));
    }
  };

  const handleOpenRename = () => {
    const activeDiag = diagrams.find(d => d.id === activeDiagramId);
    if (activeDiag) {
      let displayName = activeDiag.name;
      if (displayName === 'Varsayılan Diyagram' || displayName === 'İlk Diyagram' || displayName === 'default_diagram') {
        displayName = t('pidBuilder.toolbar.defaultDiagram');
      }
      setRenameDiagramName(displayName);
      setRenameDialogOpen(true);
    }
  };

  const handleConfirmRename = () => {
    if (!renameDiagramName.trim()) {
      toast.error(t('pidBuilder.toolbar.invalidName'));
      return;
    }
    renameDiagram(activeDiagramId, renameDiagramName.trim());
    setRenameDialogOpen(false);
    toast.success(t('pidBuilder.toolbar.renameSuccess'));
  };

  const handleConfirmDelete = () => {
    deleteDiagram(activeDiagramId);
    setDeleteConfirmOpen(false);
    toast.success(t('pidBuilder.toolbar.deleteSuccess'));
  };

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
          <Box className="flex items-center gap-2">
            {onMenuClick && (
              <IconButton onClick={onMenuClick} color="inherit" edge="start" sx={{ mr: 1 }}>
                <MenuIcon />
              </IconButton>
            )}
            
            {/* Çoklu Diyagram Kontrolleri */}
            <Tooltip title={t('pidBuilder.toolbar.newDiagramTooltip')}>
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={handleCreateNew}
                startIcon={<AddIcon />}
                sx={{ whiteSpace: 'nowrap', display: { xs: 'none', sm: 'flex' }, height: 36 }}
              >
                {t('pidBuilder.toolbar.newDiagram')}
              </Button>
            </Tooltip>
            
            <Tooltip title={t('pidBuilder.toolbar.newDiagram')} placement="bottom">
              <IconButton 
                color="primary" 
                onClick={handleCreateNew}
                sx={{ display: { xs: 'flex', sm: 'none' } }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>

            {diagrams && diagrams.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <FormControl size="small" sx={{ minWidth: { xs: 120, sm: 180 } }}>
                  <Select
                    value={activeDiagramId || ''}
                    onChange={handleSwitch}
                    sx={{ height: 36, bgcolor: 'background.default' }}
                  >
                    {diagrams.map(d => {
                      let displayName = d.name;
                      if (displayName === 'Varsayılan Diyagram' || displayName === 'İlk Diyagram' || displayName === 'default_diagram') {
                        displayName = t('pidBuilder.toolbar.defaultDiagram');
                      }
                      return <MenuItem key={d.id} value={d.id}>{displayName}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
                
                <Tooltip title={t('pidBuilder.toolbar.renameDiagram')}>
                  <IconButton size="small" onClick={handleOpenRename}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title={t('pidBuilder.toolbar.deleteDiagram')}>
                  <IconButton size="small" color="error" onClick={() => setDeleteConfirmOpen(true)}>
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
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

      {/* Yeni Diyagram Pop-up (Kurumsal Tasarım) */}
      <Dialog 
        open={newDiagramOpen} 
        onClose={() => setNewDiagramOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: { xs: 300, sm: 450 },
            bgcolor: 'background.paper',
            backgroundImage: 'none',
            boxShadow: 24,
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          px: 3,
          py: 2,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          color: 'text.primary'
        }}>
          <Box sx={{ 
            bgcolor: 'primary.main', 
            color: 'primary.contrastText',
            borderRadius: 1,
            p: 0.5,
            display: 'flex'
          }}>
            <AddIcon fontSize="small" />
          </Box>
          {t('pidBuilder.toolbar.newDiagramTitle')}
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 4 }}>
          <TextField
            autoFocus
            label={t('pidBuilder.toolbar.diagramNameLabel')}
            placeholder={t('pidBuilder.toolbar.diagramNamePlaceholder')}
            type="text"
            fullWidth
            variant="outlined"
            value={newDiagramName}
            onChange={(e) => setNewDiagramName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleConfirmNew()}
            sx={{ mt: 1 }}
            InputLabelProps={{
              sx: { fontWeight: 500 }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
          <Button 
            onClick={() => setNewDiagramOpen(false)} 
            color="inherit" 
            variant="outlined"
            sx={{ textTransform: 'none', px: 3, fontWeight: 500 }}
          >
            {t('pidBuilder.toolbar.cancel')}
          </Button>
          <Button 
            onClick={handleConfirmNew} 
            variant="contained" 
            color="primary" 
            disableElevation
            sx={{ textTransform: 'none', px: 4, fontWeight: 600 }}
          >
            {t('pidBuilder.toolbar.create')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diyagramı Yeniden Adlandır Pop-up */}
      <Dialog 
        open={renameDialogOpen} 
        onClose={() => setRenameDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: { xs: 300, sm: 450 },
            bgcolor: 'background.paper',
            backgroundImage: 'none',
            boxShadow: 24,
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          px: 3,
          py: 2,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          color: 'text.primary'
        }}>
          <Box sx={{ 
            bgcolor: 'primary.main', 
            color: 'primary.contrastText',
            borderRadius: 1,
            p: 0.5,
            display: 'flex'
          }}>
            <EditIcon fontSize="small" />
          </Box>
          {t('pidBuilder.toolbar.renameDiagramTitle')}
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 4 }}>
          <TextField
            autoFocus
            label={t('pidBuilder.toolbar.diagramNameLabel')}
            type="text"
            fullWidth
            variant="outlined"
            value={renameDiagramName}
            onChange={(e) => setRenameDiagramName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleConfirmRename()}
            sx={{ mt: 1 }}
            InputLabelProps={{
              sx: { fontWeight: 500 }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
          <Button 
            onClick={() => setRenameDialogOpen(false)} 
            color="inherit" 
            variant="outlined"
            sx={{ textTransform: 'none', px: 3, fontWeight: 500 }}
          >
            {t('pidBuilder.toolbar.cancel')}
          </Button>
          <Button 
            onClick={handleConfirmRename} 
            variant="contained" 
            color="primary" 
            disableElevation
            sx={{ textTransform: 'none', px: 4, fontWeight: 600 }}
          >
            {t('pidBuilder.toolbar.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Silme Onay Pop-up */}
      <Dialog 
        open={deleteConfirmOpen} 
        onClose={() => setDeleteConfirmOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: { xs: 300, sm: 400 },
            bgcolor: 'background.paper',
            backgroundImage: 'none',
            boxShadow: 24,
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          px: 3,
          py: 2,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          color: 'error.main'
        }}>
          <DeleteOutline fontSize="small" />
          {t('pidBuilder.toolbar.deleteConfirmTitle')}
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 4 }}>
          {t('pidBuilder.toolbar.deleteConfirmMessage')}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
          <Button 
            onClick={() => setDeleteConfirmOpen(false)} 
            color="inherit" 
            variant="outlined"
            sx={{ textTransform: 'none', px: 3, fontWeight: 500 }}
          >
            {t('pidBuilder.toolbar.cancel')}
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            variant="contained" 
            color="error" 
            disableElevation
            sx={{ textTransform: 'none', px: 4, fontWeight: 600 }}
          >
            {t('pidBuilder.toolbar.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BuilderToolbar;

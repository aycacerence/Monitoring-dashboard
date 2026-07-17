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
  DeleteForever,
  CleaningServices,
  Save,
  Restore,
  ZoomOutMap,
  Menu as MenuIcon,
  Add as AddIcon,
  Edit as EditIcon,
  TextFields as TextFieldsIcon,
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

const ResponsiveButton = ({ icon: Icon, label, ...props }) => {
  const { sx, ...rest } = props;
  return (
    <Tooltip title={label}>
      <span>
        <IconButton
          {...rest}
          sx={{ 
            display: { xs: 'flex', md: 'none' },
            p: 0.5,
            ...sx
          }}
        >
          <Icon fontSize="small" />
        </IconButton>
        
        <Button
          {...rest}
          sx={{ 
            display: { xs: 'none', md: 'flex' },
            whiteSpace: 'nowrap',
            ...sx 
          }}
        >
          <Icon sx={{ mr: 1 }} fontSize="small" />
          {label}
        </Button>
      </span>
    </Tooltip>
  );
};

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

  const { fitView, getNodes, getEdges, screenToFlowPosition, project, setNodes } = useReactFlow();
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

  const handleAddText = () => {
    let position;
    if (screenToFlowPosition) {
       position = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    } else if (project) {
       position = project({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    } else {
       position = { x: 250, y: 150 };
    }
    
    // Eğer üst üste binerse kaydır
    const existingTexts = getNodes().filter(n => n.type === 'textNode');
    position.y += existingTexts.length * 30;

    const newNode = {
      id: `text-${Date.now()}`,
      type: 'textNode',
      position: position,
      data: { text: 'Yeni Metin' },
      style: { 
        zIndex: 10,
        backgroundColor: 'transparent',
        border: 'none',
        boxShadow: 'none',
        padding: 0
      }
    };

    setNodes((nds) => nds.concat(newNode));
    toast.success('Metin alanı eklendi');
  };

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
        <Toolbar 
          sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'center' },
            justifyContent: 'space-between',
            minHeight: '56px',
            p: { xs: 1, sm: 2 },
            gap: { xs: 1, md: 0 }
          }}
        >
          <Box className="flex items-center gap-0.5 sm:gap-2" sx={{ width: { xs: '100%', md: 'auto' }, justifyContent: { xs: 'space-between', md: 'flex-start' } }}>
            {onMenuClick && (
              <IconButton onClick={onMenuClick} color="inherit" edge="start" sx={{ p: 0.5 }}>
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <FormControl size="small" sx={{ minWidth: { xs: 100, sm: 180 }, flex: { xs: 1, md: 'none' } }}>
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
                    <DeleteForever fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
          <Box className="flex items-center gap-0.5 sm:gap-2" sx={{ justifyContent: { xs: 'center', md: 'flex-end' }, width: { xs: '100%', md: 'auto' }, flex: { md: 1 }, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
            <ResponsiveButton
              icon={TextFieldsIcon}
              label="Metin Ekle"
              onClick={handleAddText}
              color="primary"
              variant="text"
            />

            <Box sx={{ height: 24, width: '1px', bgcolor: 'divider', mx: 1 }} />

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
                    p: 0.5,
                    '&.Mui-disabled': { color: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)' } 
                  }}
                >
                  <ZoomOutMap fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>

            <Box sx={{ height: 24, width: '1px', bgcolor: 'divider', mx: 1 }} />

            <ResponsiveButton
              icon={CleaningServices}
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
          <DeleteForever fontSize="small" />
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

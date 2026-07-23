import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { usePID } from '../../../context/pid/PIDContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useReactFlow, useOnSelectionChange, getNodesBounds, getViewportForBounds } from 'reactflow';
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
  WarningAmber as WarningIcon,
} from '@mui/icons-material';
import { toPng } from 'html-to-image';
import SaveConfigureModal from '../../modals/SaveConfigureModal';
import CircularProgress from '@mui/material/CircularProgress';
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
  Typography,
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
  const dispatch = useDispatch();

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
  
  const [unsavedConfirmOpen, setUnsavedConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [screenshotBase64, setScreenshotBase64] = useState('');
  const [screenshotLoading, setScreenshotLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleCreateNew = () => {
    if (isDirty) {
      setPendingAction({ type: 'new' });
      setUnsavedConfirmOpen(true);
    } else {
      handleConfirmNew();
    }
  };

  const handleConfirmNew = () => {
    clearFlow();
    switchDiagram(null);
  };

  const handleSwitch = (event) => {
    const targetId = event.target.value;
    if (targetId === activeDiagramId) return;

    if (isDirty) {
      setPendingAction({ type: 'switch', payload: targetId });
      setUnsavedConfirmOpen(true);
      return;
    }
    const success = switchDiagram(targetId);
    if (success) {
      toast.success(t('pidBuilder.toolbar.diagramLoaded'));
    }
  };

  const handleUnsavedAction = (actionType) => {
    if (actionType === 'save') {
      saveFlow();
      toast.success(t('pidBuilder.toolbar.saveSuccess', 'Diyagram kaydedildi'));
    }
    
    if (pendingAction?.type === 'switch') {
      switchDiagram(pendingAction.payload, true);
      toast.success(t('pidBuilder.toolbar.diagramLoaded'));
    } else if (pendingAction?.type === 'new') {
      handleConfirmNew();
    }
    
    setUnsavedConfirmOpen(false);
    setPendingAction(null);
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
      selected: true,
      data: { text: t('pidBuilder.canvas.newText', 'Yeni Metin') },
      style: { 
        zIndex: 10,
        backgroundColor: 'transparent',
        border: 'none',
        boxShadow: 'none',
        padding: 0
      }
    };

    setNodes((nds) => nds.map(n => ({ ...n, selected: false })).concat(newNode));
    toast.success(t('pidBuilder.toolbar.textAdded', 'Metin alanı eklendi'));
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
                    value={activeDiagramId && diagrams.some(d => d.id === activeDiagramId) ? activeDiagramId : ''}
                    onChange={handleSwitch}
                    displayEmpty
                    sx={{ height: 36, bgcolor: 'background.default' }}
                  >
                    {!activeDiagramId && (
                      <MenuItem value="" disabled sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                        Yeni Diyagram (kaydedilmedi)
                      </MenuItem>
                    )}
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
              label={t('pidBuilder.toolbar.addText', 'Metin Ekle')}
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

            <Tooltip title={t('pidBuilder.toolbar.zoomToSelection', 'Seçili Alana Yakınlaş (Shift + Sürükle)')}>
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
              icon={screenshotLoading ? () => <CircularProgress size={16} color="inherit" /> : Save}
              label={t('pidBuilder.toolbar.save')}
              disabled={screenshotLoading}
              onClick={async () => {
                const element = document.querySelector('.react-flow__viewport');
                if (!element) return;
                
                // Ok işaretlerinin (marker) ekran görüntüsüne dahil olabilmesi için
                // viewport'un içine geçici olarak kopyalayalım.
                const markerSvg = document.querySelector('.custom-markers-svg');
                let clonedMarkerSvg = null;
                if (markerSvg) {
                  clonedMarkerSvg = markerSvg.cloneNode(true);
                  element.prepend(clonedMarkerSvg);
                }
                
                const currentNodes = getNodes();
                const selectedNodeIds = currentNodes.filter(n => n.selected).map(n => n.id);
                
                const currentEdges = getEdges();
                const selectedEdgeIds = currentEdges.filter(e => e.selected).map(e => e.id);
                
                if (selectedNodeIds.length > 0 || selectedEdgeIds.length > 0) {
                  if (selectedNodeIds.length > 0) setNodes(currentNodes.map(n => ({ ...n, selected: false })));
                  if (selectedEdgeIds.length > 0) setEdges(currentEdges.map(e => ({ ...e, selected: false })));
                  
                  // State güncellemelerinin DOM'a yansıması için güvenli bir bekleme (50ms bazen yetersiz kalabiliyor)
                  await new Promise(resolve => setTimeout(resolve, 250));
                }

                setScreenshotLoading(true);
                try {
                  // Arka planda görünmez bir şekilde tüm düğümleri kapsayan alanı hesapla
                  // getNodes() güncel state'i alır (seçimler temizlenmiş)
                  const nodesBounds = getNodesBounds(getNodes());
                  const imageWidth = Math.max(nodesBounds.width || 800, 800) + 100;
                  const imageHeight = Math.max(nodesBounds.height || 600, 600) + 100;

                  const transform = getViewportForBounds(
                    nodesBounds,
                    imageWidth,
                    imageHeight,
                    0.5,
                    2
                  );

                  const dataUrl = await toPng(element, {
                    backgroundColor: '#ffffff',
                    width: imageWidth,
                    height: imageHeight,
                    style: {
                      width: `${imageWidth}px`,
                      height: `${imageHeight}px`,
                      transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`
                    },
                    quality: 0.95,
                    pixelRatio: 2,
                    filter: (node) => {
                      const cl = node.classList;
                      if (!cl) return true;
                      return !cl.contains('react-flow__controls') && 
                             !cl.contains('react-flow__panel') &&
                             !cl.contains('react-flow__handle') &&
                             !cl.contains('react-flow__selection') &&
                             !cl.contains('node-delete-badge') &&
                             !cl.contains('react-flow__resize-control');
                    }
                  });
                  setScreenshotBase64(dataUrl);
                  setSaveModalOpen(true);
                } catch (err) {
                  toast.error("Ekran görüntüsü alınırken hata oluştu.");
                } finally {
                  setScreenshotLoading(false);
                  
                  // Geçici kopyalanan ok işareti SVG'sini temizle
                  if (clonedMarkerSvg && clonedMarkerSvg.parentNode) {
                    clonedMarkerSvg.parentNode.removeChild(clonedMarkerSvg);
                  }
                  
                  // Seçim state'ini geri yükle
                  if (selectedNodeIds.length > 0) {
                    setNodes(getNodes().map(n => ({ ...n, selected: selectedNodeIds.includes(n.id) })));
                  }
                  if (selectedEdgeIds.length > 0) {
                    setEdges(getEdges().map(e => ({ ...e, selected: selectedEdgeIds.includes(e.id) })));
                  }
                }
              }}
              color="primary"
              variant="contained"
            />
          </Box>
        </Toolbar>
      </AppBar>

      <SaveConfigureModal 
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        screenshotBase64={screenshotBase64}
        initialDiagramName={diagrams.find(d => d.id === activeDiagramId)?.name || ''}
        initialSelectedKpiIds={diagrams.find(d => d.id === activeDiagramId)?.kpiConfig || []}
        diagramNodes={nodes}
        diagramEdges={edges}
        onConfirm={({ name, screenshot, selectedKpiIds }, shouldNavigate) => {
          // Güncel çizim verilerini al
          const currentNodes = getNodes();
          const currentEdges = getEdges();
          
          /* 
            NOT: saveDiagramThunk henüz bu dosyada import edilmediği için 
            Vite hata vermesin diye yoruma alındı. Redux action'ınız hazır olduğunda
            yukarıda import edip aşağıdaki satırı aktif edebilirsiniz.
            
            dispatch(saveDiagramThunk({
                name,
                screenshot,
                kpiConfig: selectedKpiIds,
                nodes: currentNodes,
                edges: currentEdges
            }));
          */

          // Mevcut yapı (bozulmadan korundu)
          if (!activeDiagramId) {
            createNewDiagram(name, currentNodes, currentEdges, selectedKpiIds);
          } else {
            renameDiagram(activeDiagramId, name, selectedKpiIds);
            saveFlow(); // Sadece var olan diyagram güncellenirken saveFlow çağrılır
          }
          
          // Sadece klasik, temiz toast göster (içinde ek buton yok)
          toast.success(t('pidBuilder.toolbar.saveSuccess', 'Diyagram kaydedildi'));
          setSaveModalOpen(false);

          if (shouldNavigate) {
            navigate('/pid/monitoring');
          }
        }}
      />

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

      {/* Kaydedilmemiş Değişiklikler Uyarı Pop-up */}
      <Dialog 
        open={unsavedConfirmOpen} 
        onClose={() => setUnsavedConfirmOpen(false)}
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
          color: 'warning.main'
        }}>
          <WarningIcon fontSize="small" />
          {t('pidBuilder.toolbar.unsavedChangesTitle', 'Kaydedilmemiş Değişiklikler')}
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 4 }}>
          <Typography color="text.secondary">
            {t('pidBuilder.toolbar.unsavedChangesMessage', 'Devam etmeden önce değişikliklerinizi kaydetmek ister misiniz? Kaydetmezseniz son değişiklikler kaybolacaktır.')}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
          <Button 
            onClick={() => setUnsavedConfirmOpen(false)} 
            color="inherit" 
            variant="outlined"
            sx={{ textTransform: 'none', px: 3, fontWeight: 500 }}
          >
            {t('pidBuilder.toolbar.cancel')}
          </Button>
          <Button 
            onClick={() => handleUnsavedAction('discard')} 
            variant="outlined" 
            color="error" 
            sx={{ textTransform: 'none', px: 3, fontWeight: 500 }}
          >
            {t('pidBuilder.toolbar.discard', 'Yine de Devam Et')}
          </Button>
          <Button 
            onClick={() => handleUnsavedAction('save')} 
            variant="contained" 
            color="primary" 
            disableElevation
            sx={{ textTransform: 'none', px: 4, fontWeight: 600 }}
          >
            {t('pidBuilder.toolbar.saveAndContinue', 'Kaydet ve Devam Et')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BuilderToolbar;

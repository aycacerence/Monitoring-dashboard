import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Divider,
  IconButton,
  Box,
  InputAdornment
} from '@mui/material';
import { X, Image as ImageIcon, Search } from 'lucide-react';
import { KPI_CATEGORIES, kpiDashboardConfig } from '../../config/kpiDashboardConfig';
import KPIPreviewCard from '../pid/kpi/KPIPreviewCard';

function SaveConfigureModal({
  open,
  onClose,
  screenshotBase64,
  initialDiagramName = '',
  initialSelectedKpiIds = [],
  diagramNodes = [],
  onConfirm
}) {
  const [name, setName] = useState(initialDiagramName);
  const [selectedKpiIds, setSelectedKpiIds] = useState(initialSelectedKpiIds);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Modal her açıldığında (veya initial proplar değiştiğinde) state'i resetle
  useEffect(() => {
    if (open) {
      setName(initialDiagramName || '');
      setSelectedKpiIds(initialSelectedKpiIds || []);
      setSearchQuery('');
      setSubmitAttempted(false);
    }
  }, [open, initialDiagramName, initialSelectedKpiIds]);

  // Cihaz Tiplerini Çıkar (Benzersiz)
  const activeDeviceTypes = new Set(
    diagramNodes
      .map(n => n.data?.label || n.data?.code)
      .filter(Boolean)
      .map(val => val.toLowerCase())
  );

  const isKpiRecommended = (kpi) => {
    if (!kpi.relatedDeviceTypes || kpi.relatedDeviceTypes.length === 0) return false;
    return kpi.relatedDeviceTypes.some(type => activeDeviceTypes.has(type));
  };

  const recommendedKpis = kpiDashboardConfig.filter(isKpiRecommended);
  const recommendedCount = recommendedKpis.length;

  const handleSelectAllRecommended = () => {
    const recommendedIds = recommendedKpis.map(k => k.id);
    setSelectedKpiIds(prev => {
      const newSelection = new Set([...prev, ...recommendedIds]);
      return Array.from(newSelection);
    });
  };

  // KPI seçim/kaldırma işlevi
  const handleToggleKpi = (id) => {
    setSelectedKpiIds(prev => 
      prev.includes(id) 
        ? prev.filter(kpiId => kpiId !== id) 
        : [...prev, id]
    );
  };

  const handleCategorySelectAll = (categoryKpis, isAllSelected) => {
    const categoryIds = categoryKpis.map(k => k.id);
    setSelectedKpiIds(prev => {
      if (isAllSelected) {
        return prev.filter(id => !categoryIds.includes(id));
      } else {
        const newSelection = new Set([...prev, ...categoryIds]);
        return Array.from(newSelection);
      }
    });
  };

  // Kaydet Butonu
  const handleSave = () => {
    setSubmitAttempted(true);
    
    // Validasyon: İsim boş mu?
    if (!name.trim()) return;
    
    // Validasyon: En az 1 KPI seçili mi? (Buton zaten disabled ama güvenlik amaçlı)
    if (selectedKpiIds.length === 0) return; 

    // Dışarıya veriyi yolla
    onConfirm({
      name: name.trim(),
      screenshot: screenshotBase64,
      selectedKpiIds
    });
    
    // Modalı kapat
    onClose();
  };

  const totalKpis = kpiDashboardConfig.length;
  const hasNoKpiSelected = selectedKpiIds.length === 0;

  const filteredTotalKpis = kpiDashboardConfig.filter(kpi => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return kpi.labelTR.toLowerCase().includes(q) || kpi.labelEN.toLowerCase().includes(q);
  }).length;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: { minHeight: '80vh' }
      }}
    >
      {/* BAŞLIK VE KAPATMA BUTONU */}
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div" fontWeight="bold">
          Diyagramı Kaydet ve Dashboard'ı Yapılandır
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: (theme) => theme.palette.grey[500] }}
        >
          <X />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ overflow: { md: 'hidden' } }}>
        <Grid container spacing={4} sx={{ height: '100%' }}>
          
          {/* SOL PANEL */}
          <Grid item xs={12} md={4} sx={{ height: '100%' }}>
            <Box className="flex flex-col gap-5 sticky top-0">
              
              {/* Ekran Görüntüsü Önizleme */}
              <Box 
                className="flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden"
                sx={{ width: '100%', height: 'auto', minHeight: 200, maxHeight: 300, p: 1 }}
              >
                {screenshotBase64 ? (
                  <img 
                    src={screenshotBase64} 
                    alt="Diagram Preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: '280px', borderRadius: '4px' }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                    <Typography variant="body2">Görsel bulunamadı</Typography>
                  </div>
                )}
              </Box>

              {/* Diyagram Adı Input */}
              <TextField
                label="Diyagram Adı"
                required
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={submitAttempted && !name.trim()}
                helperText={submitAttempted && !name.trim() ? "Diyagram adı zorunludur" : ""}
                variant="outlined"
              />

              {/* Seçili KPI Sayısı Bilgisi */}
              <Box className="p-3 bg-brand-50/50 dark:bg-brand-900/10 rounded-lg border border-brand-100 dark:border-brand-900/30 text-center md:text-left">
                <Typography variant="body2" color="text.secondary" className="font-medium">
                  Seçilen KPI sayısı: <span className="text-brand-600 dark:text-brand-400 font-bold ml-1">{selectedKpiIds.length}</span> / {totalKpis}
                </Typography>
                
                {recommendedCount > 0 && (
                  <Typography 
                    variant="caption" 
                    className="block mt-2 text-brand-600 dark:text-brand-400 cursor-pointer hover:underline font-semibold"
                    onClick={handleSelectAllRecommended}
                  >
                    Diyagramınıza göre {recommendedCount} kart öneriliyor. Tümünü Seç.
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>

          {/* SAĞ PANEL */}
          <Grid item xs={12} md={8} sx={{ height: '100%' }}>
            <Box sx={{ overflowY: 'auto', maxHeight: { xs: 'none', md: '75vh' }, pr: { xs: 0, md: 2 }, pb: 4 }} className="flex flex-col gap-6">
              
              {/* Arama Kutusu */}
              <TextField
                placeholder="KPI ara... (örn. Fan, Basınç)"
                size="small"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search className="w-4 h-4 text-slate-400" />
                    </InputAdornment>
                  )
                }}
                sx={{ mb: 2 }}
              />

              {filteredTotalKpis === 0 ? (
                <Box className="flex flex-col items-center justify-center py-10 text-slate-500">
                  <Search className="w-10 h-10 mb-3 opacity-30" />
                  <Typography variant="body1">Sonuç bulunamadı</Typography>
                </Box>
              ) : (
                KPI_CATEGORIES.map((category, index) => {
                  // Bu kategoriye ait KPI'ları filtrele, öneri durumunu belirle ve önerilenleri başa al
                  const categoryKpis = kpiDashboardConfig
                    .filter(kpi => kpi.categoryKey === category.key)
                    .filter(kpi => {
                      if (!searchQuery.trim()) return true;
                      const q = searchQuery.toLowerCase();
                      return kpi.labelTR.toLowerCase().includes(q) || kpi.labelEN.toLowerCase().includes(q);
                    })
                    .map(kpi => ({ ...kpi, isRecommended: isKpiRecommended(kpi) }))
                    .sort((a, b) => (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0));
                  
                  // Eğer bu kategoride KPI yoksa render etme
                  if (categoryKpis.length === 0) return null;

                  const selectedInCategory = categoryKpis.filter(k => selectedKpiIds.includes(k.id)).length;
                  const totalInCategory = categoryKpis.length;
                  const isAllSelected = selectedInCategory === totalInCategory;

                  return (
                    <Box key={category.key}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" className="mb-4">
                        <Typography 
                          variant="subtitle2" 
                          fontWeight="bold" 
                          className="text-slate-800 dark:text-slate-200 uppercase tracking-wider"
                        >
                          {category.labelTR}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Typography variant="caption" color="text.secondary" fontWeight="medium">
                            ({selectedInCategory} / {totalInCategory} seçili)
                          </Typography>
                          <Button 
                            size="small" 
                            variant="text" 
                            color="primary"
                            onClick={() => handleCategorySelectAll(categoryKpis, isAllSelected)}
                            sx={{ textTransform: 'none', fontWeight: 600, minWidth: 'auto', p: 0, '&:hover': { background: 'transparent', textDecoration: 'underline' } }}
                          >
                            {isAllSelected ? "Temizle" : "Tümünü Seç"}
                          </Button>
                        </Box>
                      </Box>
                    
                    {/* CSS Grid (Responsive) */}
                    <div 
                      style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
                        gap: '12px' 
                      }}
                    >
                      {categoryKpis.map(kpi => (
                        <KPIPreviewCard
                          key={kpi.id}
                          kpi={kpi}
                          selected={selectedKpiIds.includes(kpi.id)}
                          isRecommended={kpi.isRecommended}
                          onToggle={handleToggleKpi}
                          size="default"
                        />
                      ))}
                    </div>
                    
                      {/* Son kategori değilse araya ayırıcı çizgi koy */}
                      {index < KPI_CATEGORIES.length - 1 && (
                        <Divider className="mt-6" />
                      )}
                    </Box>
                  );
                })
              )}
              
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      
      {/* ALT BUTONLAR (ACTIONS) */}
      <DialogActions sx={{ px: 3, py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          {hasNoKpiSelected && (
            <Typography variant="body2" color="error" className="font-medium animate-pulse flex items-center">
              * Lütfen en az bir KPI kartı seçin.
            </Typography>
          )}
        </Box>
        
        <Box className="flex gap-3">
          <Button onClick={onClose} color="inherit" variant="text" sx={{ px: 3 }}>
            Vazgeç
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            color="primary"
            disabled={hasNoKpiSelected}
            sx={{ px: 4, py: 1 }}
            disableElevation
          >
            Kaydet
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

SaveConfigureModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  screenshotBase64: PropTypes.string,
  initialDiagramName: PropTypes.string,
  initialSelectedKpiIds: PropTypes.arrayOf(PropTypes.string),
  diagramNodes: PropTypes.array,
  onConfirm: PropTypes.func.isRequired
};

export default SaveConfigureModal;

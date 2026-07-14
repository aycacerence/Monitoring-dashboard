import React, { useState, useEffect } from 'react';
import { usePID } from '../../../context/pid/PIDContext';
import toast from 'react-hot-toast';
import {
  Drawer,
  IconButton,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Divider,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { iconMap } from '../../../data/pid/iconMap';
import { useSelector } from 'react-redux';
import { selectRole } from '../../../features/auth/authSlice';
import { useTranslation } from 'react-i18next';

const PropertyPanel = ({ variant }) => {
  const { t } = useTranslation();
  const { selectedNode, updateNodeData, setSelectedNode, saveFlow } = usePID();
  const role = useSelector(selectRole);
  const isAdmin = role === 'admin';

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsEditing(false);
  }, [selectedNode?.id]);

  if (!selectedNode) return null;

  const handleDataChange = (field, value) => {
    updateNodeData(selectedNode.id, { [field]: value });
  };

  const handleDefaultDataChange = (key, value) => {
    const updatedDefaultData = {
      ...selectedNode.data.defaultData,
      [key]: value
    };
    handleDataChange('defaultData', updatedDefaultData);
  };

  const durum = selectedNode.data?.durum || 'Aktif';
  const getDurumColor = (d) => {
    switch (d) {
      case 'Aktif': return 'bg-green-500';
      case 'Pasif': return 'bg-red-500';
      case 'Bakımda': return 'bg-orange-500';
      default: return 'bg-green-500';
    }
  };
  const canliVeri = selectedNode.data?.canliVeri || 'gelecek';

  const unitMap = {
    debi: 'm³/h', basinc: 'bar', farkBasinc: 'bar',
    guc: 'kW', girisGucu: 'kW', cikisGucu: 'kW', nominalGuc: 'kW',
    verim: '%', akim: 'A', gerilim: 'V', voltaj: 'V', frekans: 'Hz',
    sicaklik: '°C', girisSicakligi: '°C', cikisSicakligi: '°C',
    akiskanSicakligi: '°C', setSicaklik: '°C', isinim: 'W/m²',
    fanHizi: 'RPM', devir: 'RPM', kapasite: 'L',
    seviye: '%', sarjDurumu: '%', aciklikOrani: '%', nem: '%',
    toplamTuketim: 'kWh', anlikGuc: 'kW', cpuKullanimi: '%', parlaklik: '%'
  };

  const getUnit = (key, deviceCode) => {
    if (key === 'kapasite' && deviceCode === 'BATTERY') return 'Ah';
    return selectedNode.data?.defaultData?.birim || unitMap[key] || '';
  };

  return (
    <Drawer
      anchor="right"
      variant="persistent"
      open={!!selectedNode}
      sx={{
        width: 320,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 320,
          position: 'absolute',
          right: 0,
          height: '100%',
          borderLeft: '1px solid',
          borderColor: 'divider',
          boxSizing: 'border-box'
        }
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%', 
          bgcolor: 'background.paper',
          color: 'text.primary',
          textTransform: 'uppercase',
          '& input, & textarea, & .MuiSelect-select': { textTransform: 'uppercase' } 
        }}
      >
        {/* Üst Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.875rem' }}>
            {t('pidBuilder.propertyPanel.properties')}
          </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {!isEditing ? (
              <IconButton onClick={() => setIsEditing(true)} size="small" color="primary" title={t('pidBuilder.propertyPanel.edit')}>
                <EditIcon fontSize="small" />
              </IconButton>
            ) : (
              <IconButton 
                onClick={() => {
                  setIsEditing(false);
                  saveFlow();
                  toast.success(t('pidBuilder.propertyPanel.updateSuccess'));
                }} 
                size="small" 
                color="success" 
                title={t('pidBuilder.propertyPanel.save')}
              >
                <SaveIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton onClick={() => setSelectedNode(null)} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
            </Box>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Başlık Profili */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: 'background.default', p: 1.5, borderRadius: 2, border: 1, borderColor: 'divider', boxShadow: 1 }}>
            <Box sx={{ width: 48, height: 48, flexShrink: 0, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 0.75 }}>
              <img
                src={iconMap[selectedNode.data?.iconKey]}
                alt={selectedNode.data?.label || 'icon'}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.875rem' }}>
                {selectedNode.data?.label || selectedNode.data?.code || t('pidBuilder.propertyPanel.device')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: getDurumColor(durum), mr: 1.5 }}></Box>
                  <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontWeight: 500 }}>
                    {t(`pidBuilder.propertyPanel.status.${durum}`, { defaultValue: durum })}
                  </Typography>
                </Box>
                {canliVeri === 'gelecek' ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'info.main', mr: 1.5 }}></Box>
                    <Typography sx={{ fontSize: '11px', color: 'info.main', fontWeight: 500 }}>
                      {t('pidBuilder.propertyPanel.liveData')}
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'text.disabled', mr: 0.75 }} />
                    <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontWeight: 500 }}>
                      {t('pidBuilder.propertyPanel.static')}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {/* Genel Bilgiler */}
          <Box>
            <Typography variant="overline" sx={{ fontSize: '9px', fontWeight: 'bold', color: 'text.secondary', letterSpacing: 1, mb: 2, display: 'block' }}>
              {t('pidBuilder.propertyPanel.generalInfo')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 0.5 }}>
              <TextField
                label={t('pidBuilder.propertyPanel.deviceName')}
                size="small"
                fullWidth
                disabled={!isEditing}
                value={selectedNode.data?.label || ''}
                onChange={(e) => handleDataChange('label', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label={t('pidBuilder.propertyPanel.deviceType')}
                size="small"
                fullWidth
                disabled={!isEditing}
                value={selectedNode.data?.type || selectedNode.type || ''}
                onChange={(e) => handleDataChange('type', e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ backgroundColor: !isEditing ? 'action.hover' : 'inherit' }}
              />
              <TextField
                label={t('pidBuilder.propertyPanel.description')}
                size="small"
                fullWidth
                multiline
                rows={2}
                disabled={!isEditing}
                value={selectedNode.data?.aciklama || ''}
                onChange={(e) => handleDataChange('aciklama', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <FormControl size="small" fullWidth>
                <InputLabel shrink>{t('Durum', { defaultValue: 'Durum' })}</InputLabel>
                <Select
                  value={selectedNode.data?.durum || 'Aktif'}
                  onChange={(e) => handleDataChange('durum', e.target.value)}
                  label={t('Durum', { defaultValue: 'Durum' })}
                  disabled={!isEditing}
                  notched
                >
                  <MenuItem value="Aktif">{t('pidBuilder.propertyPanel.status.Aktif')}</MenuItem>
                  <MenuItem value="Pasif">{t('pidBuilder.propertyPanel.status.Pasif')}</MenuItem>
                  <MenuItem value="Bakımda">{t('pidBuilder.propertyPanel.status.Bakımda')}</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Divider />

          {/* Canlı Veri Bölümü */}
          <Box>
            <Typography variant="overline" sx={{ fontSize: '11px', fontWeight: 'bold', color: 'text.secondary', letterSpacing: 1, mb: 2, display: 'block' }}>
              {t('pidBuilder.propertyPanel.liveDataStatus')}
            </Typography>
            <FormControl component="fieldset" sx={{ width: '100%', pt: 0.5 }}>
              <RadioGroup
                row
                value={selectedNode.data?.canliVeri || 'gelecek'}
                onChange={(e) => handleDataChange('canliVeri', e.target.value)}
              >
                <FormControlLabel
                  value="gelecek"
                  disabled={!isEditing}
                  control={<Radio size="small" />}
                  label={<Typography sx={{ fontSize: '0.875rem' }}>{t('pidBuilder.propertyPanel.willArrive')}</Typography>}
                />
                <FormControlLabel
                  value="gelmeyecek"
                  disabled={!isEditing}
                  control={<Radio size="small" />}
                  label={<Typography sx={{ fontSize: '0.875rem' }}>{t('pidBuilder.propertyPanel.wontArrive')}</Typography>}
                />
              </RadioGroup>
            </FormControl>
          </Box>

          <Divider />

          {/* Teknik Değerler */}
          {selectedNode.data?.defaultData && Object.keys(selectedNode.data.defaultData).length > 0 && (
            <Box>
              <Typography variant="overline" sx={{ fontSize: '11px', fontWeight: 'bold', color: 'text.secondary', letterSpacing: 1, mb: 2, display: 'block' }}>
                {t('pidBuilder.propertyPanel.technicalValues')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 0.5 }}>
                {Object.entries(selectedNode.data.defaultData).map(([key, val]) => {
                  if (key === 'birim' || key === 'durum') return null;
                  
                  const fallbackLabel = key.charAt(0).toUpperCase() + key.slice(1);
                  const label = t(`pidBuilder.techKeys.${key}`, { defaultValue: fallbackLabel });
                  const unit = getUnit(key, selectedNode.data?.code);
                  
                  return (
                    <TextField
                      key={key}
                      label={label}
                      size="small"
                      fullWidth
                      disabled={!isEditing}
                      value={val}
                      onChange={(e) => handleDefaultDataChange(key, e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        endAdornment: unit ? (
                          <InputAdornment position="end">
                            <Box sx={{ fontSize: '11px', fontWeight: 'bold', color: 'text.secondary', bgcolor: 'background.default', height: '100%', display: 'flex', alignItems: 'center', px: 2, borderRadius: 1, border: 1, borderColor: 'divider' }}>
                              {unit}
                            </Box>
                          </InputAdornment>
                        ) : null
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          paddingRight: unit ? '4px' : '14px'
                        }
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          )}

          <Divider />

          {/* Çalışma Bilgileri */}
          <Box>
            <Typography variant="overline" sx={{ fontSize: '11px', fontWeight: 'bold', color: 'text.secondary', letterSpacing: 1, mb: 2, display: 'block' }}>
              {t('pidBuilder.propertyPanel.operationalInfo')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 0.5 }}>
              <TextField
                label={t('pidBuilder.propertyPanel.operatingTime')}
                size="small"
                fullWidth
                disabled={!isAdmin || !isEditing}
                value={selectedNode.data?.calismaSuresi || '1256'}
                onChange={(e) => handleDataChange('calismaSuresi', e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box sx={{ fontSize: '11px', fontWeight: 'bold', color: 'text.secondary', bgcolor: 'background.default', height: '100%', display: 'flex', alignItems: 'center', px: 2, py: 2, borderRadius: 1, border: 1, borderColor: 'divider' }}>
                        {t('pidBuilder.propertyPanel.hours')}
                      </Box>
                    </InputAdornment>
                  )
                }}
                sx={{ 
                  backgroundColor: !isAdmin ? 'action.hover' : 'inherit',
                  '& .MuiOutlinedInput-root': { paddingRight: '4px' }
                }}
              />
              <TextField
                label={t('pidBuilder.propertyPanel.lastMaintenanceDate')}
                size="small"
                fullWidth
                disabled={!isAdmin || !isEditing}
                type="date"
                value={selectedNode.data?.sonBakimTarihi || '2025-03-12'}
                onChange={(e) => handleDataChange('sonBakimTarihi', e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ backgroundColor: !isAdmin ? 'action.hover' : 'inherit' }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default PropertyPanel;

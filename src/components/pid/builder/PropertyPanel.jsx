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

const PropertyPanel = ({ variant }) => {
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
          borderLeft: '1px solid #e5e7eb',
          boxSizing: 'border-box'
        }
      }}
    >
      <Box className="flex flex-col h-full bg-white">
        {/* Üst Bar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Typography className="text-gray-500 font-bold uppercase tracking-wider text-sm">
            Özellikler
          </Typography>
          <div className="flex items-center gap-1">
            {!isEditing ? (
              <IconButton onClick={() => setIsEditing(true)} size="small" color="primary" title="Düzenle">
                <EditIcon fontSize="small" />
              </IconButton>
            ) : (
              <IconButton 
                onClick={() => {
                  setIsEditing(false);
                  saveFlow();
                  toast.success('Özellikler başarıyla güncellendi');
                }} 
                size="small" 
                color="success" 
                title="Kaydet"
              >
                <SaveIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton onClick={() => setSelectedNode(null)} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
          {/* Başlık Profili */}
          <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border border-gray-100 shadow-sm">
            <div className="w-12 h-12 flex-shrink-0 bg-white rounded border border-gray-200 flex items-center justify-center p-1.5">
              <img
                src={iconMap[selectedNode.data?.iconKey]}
                alt={selectedNode.data?.label || 'icon'}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-800 text-sm">
                {selectedNode.data?.label || selectedNode.data?.code || 'Cihaz'}
              </span>
              <div className="flex items-center space-x-3 mt-1.5">
                <div className="flex items-center">
                  <span className={`w-2 h-2 rounded-full ${getDurumColor(durum)} mr-1.5`}></span>
                  <span className="text-[11px] text-gray-600 font-medium">{durum}</span>
                </div>
                {canliVeri === 'gelecek' ? (
                  <div className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5 animate-pulse"></span>
                    <span className="text-[11px] text-blue-600 font-medium">Canlı Veri</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-gray-400 mr-1.5"></span>
                    <span className="text-[11px] text-gray-500 font-medium">Statik</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Genel Bilgiler */}
          <div>
            <Typography className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-4">
              Genel Bilgiler
            </Typography>
            <div className="flex flex-col gap-5 pt-2">
              <TextField
                label="Cihaz Adı"
                size="small"
                fullWidth
                disabled={!isEditing}
                value={selectedNode.data?.label || ''}
                onChange={(e) => handleDataChange('label', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Cihaz Tipi"
                size="small"
                fullWidth
                disabled={!isEditing}
                value={selectedNode.data?.type || selectedNode.type || ''}
                onChange={(e) => handleDataChange('type', e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ backgroundColor: !isEditing ? '#f9fafb' : 'inherit' }}
              />
              <TextField
                label="Açıklama"
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
                <InputLabel shrink>Durum</InputLabel>
                <Select
                  value={selectedNode.data?.durum || 'Aktif'}
                  onChange={(e) => handleDataChange('durum', e.target.value)}
                  label="Durum"
                  disabled={!isEditing}
                  notched
                >
                  <MenuItem value="Aktif">Aktif</MenuItem>
                  <MenuItem value="Pasif">Pasif</MenuItem>
                  <MenuItem value="Bakımda">Bakımda</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          <Divider />

          {/* Canlı Veri Bölümü */}
          <div>
            <Typography className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4">
              Canlı Veri Durumu
            </Typography>
            <FormControl component="fieldset" className="w-full pt-2">
              <RadioGroup
                row
                value={selectedNode.data?.canliVeri || 'gelecek'}
                onChange={(e) => handleDataChange('canliVeri', e.target.value)}
              >
                <FormControlLabel
                  value="gelecek"
                  disabled={!isEditing}
                  control={<Radio size="small" />}
                  label={<span className="text-sm">Gelecek</span>}
                />
                <FormControlLabel
                  value="gelmeyecek"
                  disabled={!isEditing}
                  control={<Radio size="small" />}
                  label={<span className="text-sm">Gelmeyecek</span>}
                />
              </RadioGroup>
            </FormControl>
          </div>

          <Divider />

          {/* Teknik Değerler */}
          {selectedNode.data?.defaultData && Object.keys(selectedNode.data.defaultData).length > 0 && (
            <div>
              <Typography className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4">
                Teknik Değerler
              </Typography>
              <div className="flex flex-col gap-5 pt-2">
                {Object.entries(selectedNode.data.defaultData).map(([key, val]) => {
                  if (key === 'birim' || key === 'durum') return null;
                  
                  const label = key.charAt(0).toUpperCase() + key.slice(1);
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
                            <span className="text-[11px] font-bold text-gray-500 bg-gray-100 h-full flex items-center px-4 py-4 rounded border border-gray-300">
                              {unit}
                            </span>
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
              </div>
            </div>
          )}

          <Divider />

          {/* Çalışma Bilgileri */}
          <div>
            <Typography className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4">
              Çalışma Bilgileri
            </Typography>
            <div className="flex flex-col gap-5 pt-2">
              <TextField
                label="Çalışma Süresi"
                size="small"
                fullWidth
                disabled={!isAdmin || !isEditing}
                value={selectedNode.data?.calismaSuresi || '1256'}
                onChange={(e) => handleDataChange('calismaSuresi', e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <span className="text-[11px] font-bold text-gray-500 bg-gray-100 h-full flex items-center px-4 py-4 rounded border border-gray-300">
                        saat
                      </span>
                    </InputAdornment>
                  )
                }}
                sx={{ 
                  backgroundColor: !isAdmin ? '#f9fafb' : 'inherit',
                  '& .MuiOutlinedInput-root': { paddingRight: '4px' }
                }}
              />
              <TextField
                label="Son Bakım Tarihi"
                size="small"
                fullWidth
                disabled={!isAdmin || !isEditing}
                type="date"
                value={selectedNode.data?.sonBakimTarihi || '2025-03-12'}
                onChange={(e) => handleDataChange('sonBakimTarihi', e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ backgroundColor: !isAdmin ? '#f9fafb' : 'inherit' }}
              />
            </div>
          </div>
        </div>
      </Box>
    </Drawer>
  );
};

export default PropertyPanel;

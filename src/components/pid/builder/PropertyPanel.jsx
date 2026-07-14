import React from 'react';
import { usePID } from '../../../context/pid/PIDContext';
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
import { iconMap } from '../../../data/pid/iconMap';
import { useSelector } from 'react-redux';
import { selectRole } from '../../../features/auth/authSlice';

const PropertyPanel = ({ variant }) => {
  const { selectedNode, updateNodeData, setSelectedNode } = usePID();
  const role = useSelector(selectRole);
  const isAdmin = role === 'admin';

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
          <IconButton onClick={() => setSelectedNode(null)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Başlık Profili */}
          <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div className="w-10 h-10 flex-shrink-0 bg-white rounded border border-gray-200 flex items-center justify-center p-1">
              <img
                src={iconMap[selectedNode.data?.iconKey]}
                alt={selectedNode.data?.label || 'icon'}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-800">
                {selectedNode.data?.label || selectedNode.data?.code || 'Cihaz'}
              </span>
              <div className="flex items-center mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                <span className="text-xs text-gray-500 font-medium">Aktif</span>
              </div>
            </div>
          </div>

          {/* Genel Bilgiler */}
          <div>
            <Typography className="text-xs font-bold text-gray-800 uppercase mb-3">
              Genel Bilgiler
            </Typography>
            <div className="space-y-3">
              <TextField
                label="Cihaz Adı"
                size="small"
                fullWidth
                value={selectedNode.data?.label || ''}
                onChange={(e) => handleDataChange('label', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Cihaz Tipi"
                size="small"
                fullWidth
                InputProps={{ readOnly: true }}
                value={selectedNode.data?.type || selectedNode.type || ''}
                InputLabelProps={{ shrink: true }}
                sx={{ backgroundColor: '#f9fafb' }}
              />
              <TextField
                label="Açıklama"
                size="small"
                fullWidth
                multiline
                rows={2}
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
            <Typography className="text-xs font-bold text-gray-800 uppercase mb-2">
              Canlı Veri
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                row
                value={selectedNode.data?.canliVeri || 'gelecek'}
                onChange={(e) => handleDataChange('canliVeri', e.target.value)}
              >
                <FormControlLabel
                  value="gelecek"
                  control={<Radio size="small" />}
                  label={<span className="text-sm">Gelecek</span>}
                />
                <FormControlLabel
                  value="gelmeyecek"
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
              <Typography className="text-xs font-bold text-gray-800 uppercase mb-3">
                Teknik Değerler
              </Typography>
              <div className="space-y-3">
                {Object.entries(selectedNode.data.defaultData).map(([key, val]) => {
                  // If the key is 'birim', skip rendering it as a separate field
                  // Or if there is a specific format you want, we handle it generally here
                  const label = key.charAt(0).toUpperCase() + key.slice(1);
                  return (
                    <TextField
                      key={key}
                      label={label}
                      size="small"
                      fullWidth
                      value={val}
                      onChange={(e) => handleDefaultDataChange(key, e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        endAdornment: selectedNode.data.defaultData.birim && key !== 'birim' && key !== 'durum' ? (
                          <InputAdornment position="end">{selectedNode.data.defaultData.birim}</InputAdornment>
                        ) : null
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
            <Typography className="text-xs font-bold text-gray-800 uppercase mb-3">
              Çalışma Bilgileri
            </Typography>
            <div className="space-y-3">
              <TextField
                label="Çalışma Süresi"
                size="small"
                fullWidth
                disabled={!isAdmin}
                value={selectedNode.data?.calismaSuresi || '1256'}
                onChange={(e) => handleDataChange('calismaSuresi', e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">saat</InputAdornment>
                }}
                sx={{ backgroundColor: !isAdmin ? '#f9fafb' : 'inherit' }}
              />
              <TextField
                label="Son Bakım Tarihi"
                size="small"
                fullWidth
                disabled={!isAdmin}
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

import React from 'react';
import { usePID } from '../../../context/PIDContext';
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const PropertyPanel = () => {
  const { selectedNode, updateNodeData, setSelectedNode } = usePID();

  if (selectedNode === null || !selectedNode) {
    return null;
  }

  return (
    <Drawer
      anchor="right"
      variant="persistent"
      open={!!selectedNode}
      PaperProps={{
        className: 'w-80 flex flex-col border-l border-gray-200 bg-white',
      }}
    >
      <div className="flex items-center justify-between p-4">
        <Typography variant="subtitle1" className="font-bold text-gray-800">
          Özellikler
        </Typography>
        <IconButton onClick={() => setSelectedNode(null)} size="small">
          <CloseIcon />
        </IconButton>
      </div>
      <Divider />

      <div className="p-4 flex flex-col gap-4">
        <TextField
          label="Cihaz Adı"
          size="small"
          fullWidth
          value={selectedNode.data?.label || ''}
          onChange={(e) =>
            updateNodeData(selectedNode.id, {
              ...selectedNode.data,
              label: e.target.value,
            })
          }
        />
        
        <TextField
          label="Cihaz Tipi"
          size="small"
          fullWidth
          value={selectedNode.data?.type || selectedNode.type || ''}
          InputProps={{ readOnly: true }}
        />

        <FormControl fullWidth size="small">
          <InputLabel>Durum</InputLabel>
          <Select
            label="Durum"
            value={selectedNode.data?.durum || selectedNode.data?.defaultData?.durum || 'Aktif'}
            onChange={(e) =>
              updateNodeData(selectedNode.id, {
                ...selectedNode.data,
                durum: e.target.value,
              })
            }
          >
            <MenuItem value="Aktif">Aktif</MenuItem>
            <MenuItem value="Pasif">Pasif</MenuItem>
            <MenuItem value="Bakımda">Bakımda</MenuItem>
          </Select>
        </FormControl>

        <Divider className="my-4" />
        <Typography variant="subtitle2" className="text-gray-600 font-semibold mb-2">
          Teknik Değerler
        </Typography>

        {selectedNode.data?.defaultData &&
          Object.entries(selectedNode.data.defaultData).map(([key, value]) => {
            if (key === 'durum') return null;

            return (
              <TextField
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                size="small"
                fullWidth
                value={value ?? ''}
                type={typeof value === 'number' ? 'number' : 'text'}
                onChange={(e) =>
                  updateNodeData(selectedNode.id, {
                    ...selectedNode.data,
                    defaultData: {
                      ...selectedNode.data.defaultData,
                      [key]: e.target.type === 'number' ? Number(e.target.value) : e.target.value,
                    },
                  })
                }
              />
            );
          })}
      </div>
    </Drawer>
  );
};

export default PropertyPanel;

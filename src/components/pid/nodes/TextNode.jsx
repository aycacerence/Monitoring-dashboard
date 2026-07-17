import React, { useRef, useState } from 'react';
import { useReactFlow, NodeToolbar, Position } from 'reactflow';
import { Box, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { useTranslation } from 'react-i18next';

const TextNode = ({ id, data, selected }) => {
  const { updateNodeData, setNodes } = useReactFlow();
  const { t } = useTranslation();
  const fontSize = data.fontSize || 24;
  const textRef = useRef(data.text || t('pidBuilder.canvas.newText', 'Yeni Metin'));
  const [isEditing, setIsEditing] = useState(false);

  const handleBlur = (e) => {
    setIsEditing(false);
    const newText = e.target.innerText;
    textRef.current = newText;
    if (updateNodeData) {
      updateNodeData(id, { text: newText });
    } else {
      setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, text: newText } } : n)));
    }
  };

  const handleFocus = () => {
    setIsEditing(true);
  };

  const handleFontSizeChange = (delta) => {
    const newSize = Math.max(10, Math.min(100, fontSize + delta));
    if (updateNodeData) {
      updateNodeData(id, { fontSize: newSize });
    } else {
      setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, fontSize: newSize } } : n)));
    }
  };

  const handleDelete = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
  };

  return (
    <>
      <NodeToolbar 
        isVisible={selected} 
        position={Position.Top} 
        offset={10}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            p: 0.5, 
            bgcolor: 'background.paper', 
            borderRadius: 1, 
            boxShadow: 3,
            border: 1,
            borderColor: 'divider'
          }}
          className="nodrag"
        >
          <IconButton onClick={() => handleFontSizeChange(-2)} size="small">
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: 24, textAlign: 'center' }}>
            {fontSize}
          </Typography>
          <IconButton onClick={() => handleFontSizeChange(2)} size="small">
            <AddIcon fontSize="small" />
          </IconButton>
          
          <Box sx={{ width: '1px', height: 24, bgcolor: 'divider', mx: 0.5 }} />
          
          <IconButton onClick={handleDelete} size="small" color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </NodeToolbar>

      <Box
        component="div"
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onFocus={handleFocus}
        className={isEditing ? 'nodrag' : ''}
        sx={{
          outline: selected ? '1px dashed #3b82f6' : '1px dashed transparent',
          padding: '4px 8px',
          minWidth: '20px',
          fontSize: `${fontSize}px`,
          fontWeight: 600,
          color: 'inherit',
          textAlign: 'center',
          whiteSpace: 'pre',
          cursor: isEditing ? 'text' : 'grab',
          display: 'inline-block',
          backgroundColor: selected ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
          lineHeight: 1.2,
          transition: 'all 0.2s ease',
          fontFamily: 'inherit',
          borderRadius: 1,
          '&:hover': {
            outline: !selected ? '1px dashed rgba(0,0,0,0.1)' : '1px dashed #3b82f6',
            backgroundColor: !selected ? 'rgba(0,0,0,0.02)' : 'rgba(59, 130, 246, 0.05)',
          }
        }}
      >
        {textRef.current}
      </Box>
    </>
  );
};

export default React.memo(TextNode);

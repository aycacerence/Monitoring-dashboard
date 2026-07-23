import React, { useRef, useState } from 'react';
import { useReactFlow, NodeToolbar, Position, NodeResizer } from 'reactflow';
import { Box, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
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
    
    // Defer the node data update to avoid race conditions with ReactFlow's selection state
    setTimeout(() => {
      if (updateNodeData) {
        updateNodeData(id, { text: newText });
      } else {
        setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, text: newText } } : n)));
      }
    }, 0);
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
    <Box sx={{ position: 'relative', width: '100%', height: '100%', minWidth: '100px', minHeight: '40px' }}>
      <NodeResizer 
        color="#3b82f6" 
        isVisible={selected} 
        minWidth={100} 
        minHeight={40}
        handleStyle={{
          width: 10,
          height: 10,
          backgroundColor: '#ef4444',
          border: '1px solid white',
          borderRadius: '50%'
        }}
        lineStyle={{
          borderWidth: 1,
          borderColor: '#3b82f6'
        }}
      />
      {selected && (
        <IconButton
          size="small"
          onClick={handleDelete}
          sx={{
            position: 'absolute',
            top: -12,
            right: -12,
            bgcolor: 'error.main',
            color: 'white',
            width: 24,
            height: 24,
            '&:hover': {
              bgcolor: 'error.dark',
            },
            zIndex: 10,
          }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      )}

      <NodeToolbar 
        isVisible={selected} 
        position={Position.Top} 
        offset={15}
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
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          padding: '8px 16px',
          fontSize: `${fontSize}px`,
          fontWeight: 600,
          color: 'inherit',
          textAlign: 'center',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          cursor: isEditing ? 'text' : 'grab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: selected ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
          lineHeight: 1.2,
          transition: 'all 0.2s ease',
          fontFamily: 'inherit',
          borderRadius: '8px',
          outline: 'none',
          border: '1px solid',
          borderColor: selected ? '#3b82f6' : '#cbd5e1', // Hafif gri, sabit border
          '&:hover': {
            borderColor: selected ? '#3b82f6' : '#94a3b8',
            backgroundColor: !selected ? 'action.hover' : 'rgba(59, 130, 246, 0.05)',
          }
        }}
      >
        {textRef.current}
      </Box>
    </Box>
  );
};

export default React.memo(TextNode);

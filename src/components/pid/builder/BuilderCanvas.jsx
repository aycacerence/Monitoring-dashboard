import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, { Background, Controls, useReactFlow, ReactFlowProvider, useStore, Panel, useOnSelectionChange } from 'reactflow';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import 'reactflow/dist/style.css';

import { usePID } from '../../../context/pid/PIDContext';
import { builderNodeTypes, edgeTypes } from '../registry';
import { useSelector } from 'react-redux';
import { selectColorMode } from '../../../features/theme/themeSlice';
import { iconMap } from '../../../data/pid/iconMap';
import CustomConnectionLine from './CustomConnectionLine';

// Hizalama toleransı (kaç piksel kala kılavuz çizgi çıksın ve yapışsın?)
const SNAP_DISTANCE = 15; 

const getHelperLines = (draggedNode, allNodes) => {
  const helperLines = { horizontal: null, vertical: null, snapPosition: { x: draggedNode.position.x, y: draggedNode.position.y } };
  
  // Sürüklenen cihazın gerçek boyutlarını al (yoksa varsayılan)
  const draggedWidth = draggedNode.width || 48;
  const draggedHeight = draggedNode.height || 48;
  const draggedCenterX = draggedNode.position.x + draggedWidth / 2;
  const draggedCenterY = draggedNode.position.y + draggedHeight / 2;

  let minDiffX = SNAP_DISTANCE;
  let minDiffY = SNAP_DISTANCE;

  allNodes.forEach((node) => {
    if (node.id === draggedNode.id) return; // Kendisiyle kıyaslama yapma

    const targetWidth = node.width || 48;
    const targetHeight = node.height || 48;
    const targetCenterX = node.position.x + targetWidth / 2;
    const targetCenterY = node.position.y + targetHeight / 2;

    // Dikey Hizalama Kontrolü (X koordinatları yakın mı?)
    const diffX = Math.abs(draggedCenterX - targetCenterX);
    if (diffX < minDiffX) {
      minDiffX = diffX;
      helperLines.vertical = targetCenterX; // Çizginin çizileceği X koordinatı
      // Merkezleri hizalamak için sol (x) koordinatını hesapla
      helperLines.snapPosition.x = targetCenterX - draggedWidth / 2; 
    }

    // Yatay Hizalama Kontrolü (Y koordinatları yakın mı?)
    const diffY = Math.abs(draggedCenterY - targetCenterY);
    if (diffY < minDiffY) {
      minDiffY = diffY;
      helperLines.horizontal = targetCenterY; // Çizginin çizileceği Y koordinatı
      // Merkezleri hizalamak için üst (y) koordinatını hesapla
      helperLines.snapPosition.y = targetCenterY - draggedHeight / 2; 
    }
  });

  return helperLines;
};

// AABB ve Matematiksel SVG Path Çarpışma Algılama ve Çözümleme Fonksiyonu
const resolveNodeCollision = (targetNode, allNodes) => {
  const PADDING = 10; // Cihazlar ve borular arası zorunlu minimum boşluk
  let { x, y } = targetNode.position;
  let hasCollision = true;
  let safetyLimit = 0; // Sonsuz döngüyü önlemek için

  // DOM'daki mevcut boruların (edges) SVG yollarını al
  const edgePaths = Array.from(document.querySelectorAll('.react-flow__edge-path'));

  while (hasCollision && safetyLimit < 100) {
    hasCollision = false;
    const w1 = targetNode.width || 48; const h1 = targetNode.height || 48;

    // 1. Düğüm (Node) Çarpışma Testi
    for (const node of allNodes) {
      if (node.id === targetNode.id) continue;
      
      const w2 = node.width || 48; const h2 = node.height || 48;

      const isIntersecting = 
        x < node.position.x + w2 + PADDING &&
        x + w1 + PADDING > node.position.x &&
        y < node.position.y + h2 + PADDING &&
        y + h1 + PADDING > node.position.y;

      if (isIntersecting) {
        hasCollision = true;
        // Üst üste bindiği cihazın hemen sağına it
        x = node.position.x + w2 + PADDING; 
        break; 
      }
    }

    // 2. Boru (Edge) Çarpışma Testi (Eğer düğümle çarpışma yoksa test et)
    if (!hasCollision) {
      for (const path of edgePaths) {
        // Borunun görünürlüğünü kontrol et (silinmiş/gizli borularla çarpışmayı önle)
        if (!path.getTotalLength) continue; 
        
        const length = path.getTotalLength();
        for (let i = 0; i <= length; i += 15) {
          const point = path.getPointAtLength(i);
          
          if (
            point.x >= x - PADDING &&
            point.x <= x + w1 + PADDING &&
            point.y >= y - PADDING &&
            point.y <= y + h1 + PADDING
          ) {
            hasCollision = true;
            // Borunun hemen sağına/aşağısına itmek yerine basitçe X'i kaydır
            x += 20; 
            break;
          }
        }
        if (hasCollision) break;
      }
    }

    safetyLimit++;
  }
  return { x, y };
};

import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const BuilderCanvasInner = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setSelectedNode,
    setSelectedEdge,
    setActiveFlowType,
    setNodes,
    deleteMultiple,
    activeDiagramId
  } = usePID();

  const theme = useTheme();
  const mode = useSelector(selectColorMode);
  const { t } = useTranslation();
  
  const { screenToFlowPosition, getNodes, fitView } = useReactFlow();
  const transform = useStore((s) => s.transform);
  const wrapperRef = useRef(null);

  // ResizeObserver: Tablet/Web geçişlerinde diyagramın boyutlara uyum sağlaması için
  useEffect(() => {
    if (!wrapperRef.current) return;
    
    // Küçük boyut değişikliklerini ignore etmek ve performansı korumak için timeout
    let timeoutId = null;
    
    const observer = new ResizeObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Yeni boyuta göre diyagramı anında merkeze al
        fitView({ padding: 0.1 });
      }, 100);
    });

    observer.observe(wrapperRef.current);

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [fitView]);

  // Diyagramlar arası geçişte kamerayı ortalama
  useEffect(() => {
    if (nodes && nodes.length > 0) {
      // React Flow'un node'ları DOM'a basmasını beklemek için kısa bir delay
      const timeoutId = setTimeout(() => {
        window.requestAnimationFrame(() => {
          fitView({ padding: 0.2 });
        });
      }, 150); 
      
      return () => clearTimeout(timeoutId);
    }
  }, [activeDiagramId]);

  const [helperLines, setHelperLines] = useState({ horizontal: null, vertical: null });
  const [selectedNodesLocal, setSelectedNodesLocal] = useState([]);
  const [selectedEdgesLocal, setSelectedEdgesLocal] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);

  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      setSelectedNodesLocal(nodes);
      setSelectedEdgesLocal(edges);
    },
  });

  const handleMultiDelete = () => {
    if (selectedNodesLocal.length > 0 || selectedEdgesLocal.length > 0) {
      deleteMultiple(selectedNodesLocal, selectedEdgesLocal);
    }
  };

  const onNodeDrag = useCallback((event, draggedNode) => {
    const allNodes = getNodes();
    const lines = getHelperLines(draggedNode, allNodes);

    setHelperLines({ horizontal: lines.horizontal, vertical: lines.vertical });

    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === draggedNode.id) {
          return {
            ...n,
            position: {
              x: lines.vertical ? lines.snapPosition.x : draggedNode.position.x,
              y: lines.horizontal ? lines.snapPosition.y : draggedNode.position.y,
            },
          };
        }
        return n;
      })
    );
  }, [getNodes, setNodes]);

  const onNodeDragStop = useCallback((event, node) => {
    setHelperLines({ horizontal: null, vertical: null });
    
    const allNodes = getNodes();
    const newPosition = resolveNodeCollision(node, allNodes);
    
    if (newPosition.x !== node.position.x || newPosition.y !== node.position.y) {
      setNodes((nds) => 
        nds.map((n) => 
          n.id === node.id ? { ...n, position: newPosition } : n
        )
      );
    }
  }, [getNodes, setNodes]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const tempPosition = screenToFlowPosition({
      x: e.clientX - 40,
      y: e.clientY - 40,
    });
    
    const mockNode = { id: 'temp-drag', position: tempPosition, width: 48, height: 48 };
    const lines = getHelperLines(mockNode, getNodes());
    
    setHelperLines({ horizontal: lines.horizontal, vertical: lines.vertical });
  }, [screenToFlowPosition, getNodes]);

  const onDragLeave = useCallback(() => {
    setHelperLines({ horizontal: null, vertical: null });
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/reactflow');
    if (!type) return;
    
    const device = JSON.parse(type);
    
    let position = screenToFlowPosition({
      x: e.clientX - 40,
      y: e.clientY - 40,
    });
    
    const mockNode = { id: 'temp-drag', position, width: 48, height: 48 };
    const allNodes = getNodes();
    const lines = getHelperLines(mockNode, allNodes);
    
    if (lines.vertical) position.x = lines.snapPosition.x;
    if (lines.horizontal) position.y = lines.snapPosition.y;

    mockNode.position = position;
    const safePosition = resolveNodeCollision(mockNode, allNodes);
    position = safePosition;

    addNode(device, position);
    setHelperLines({ horizontal: null, vertical: null });
  }, [screenToFlowPosition, getNodes, addNode]);

  const onNodeClick = (e, node) => {
    setSelectedEdge(null);
    setSelectedNode(node);
  };

  const onEdgeClick = (e, edge) => {
    setSelectedNode(null);
    setSelectedEdge(edge);
    if (edge.data?.flowType) {
      setActiveFlowType(edge.data.flowType);
    }
  };

  const onPaneClick = () => {
    setSelectedNode(null);
    setSelectedEdge(null);
    // Force blur on any active element (like contentEditable text nodes)
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
    // Clear any native text selections to avoid "stuck" highlights
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }
  };

  const showMultiDelete = selectedNodesLocal.length > 1 || selectedEdgesLocal.length > 1 || (selectedNodesLocal.length > 0 && selectedEdgesLocal.length > 0);
  
  const getMultiDeletePosition = () => {
    if (selectedNodesLocal.length > 0) {
      let minY = Infinity, maxX = -Infinity;
      selectedNodesLocal.forEach(n => {
        minY = Math.min(minY, n.position.y);
        maxX = Math.max(maxX, n.position.x + (n.width || 100));
      });
      return {
        left: maxX * transform[2] + transform[0] + 20,
        top: minY * transform[2] + transform[1] - 20,
        transform: 'none'
      };
    }
    return { left: '50%', top: 20, transform: 'translateX(-50%)' };
  };

  const multiSelectionCount = selectedNodesLocal.length + selectedEdgesLocal.length;

  return (
    <div ref={wrapperRef} className={`flex-1 h-full relative bg-slate-50 dark:bg-slate-950 ${isConnecting ? 'react-flow-connecting' : ''}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={() => setIsConnecting(true)}
        onConnectEnd={() => setIsConnecting(false)}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={builderNodeTypes}
        edgeTypes={edgeTypes}
        connectionLineComponent={CustomConnectionLine}
        panOnScroll={true}
        panOnScrollMode="free"
        panOnDrag={true}
        preventScrolling={false}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background variant="dots" gap={16} size={1} color={mode === 'dark' ? '#475569' : '#cbd5e1'} />
        <Controls />
        
        {/* Özel Kılavuz Çizgileri Katmanı */}
        <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
          {helperLines.vertical && (
            <line
              x1={helperLines.vertical * transform[2] + transform[0]}
              y1={0}
              x2={helperLines.vertical * transform[2] + transform[0]}
              y2="100%"
              className="react-flow__helper-line"
            />
          )}
          {helperLines.horizontal && (
            <line
              x1={0}
              y1={helperLines.horizontal * transform[2] + transform[1]}
              x2="100%"
              y2={helperLines.horizontal * transform[2] + transform[1]}
              className="react-flow__helper-line"
            />
          )}
        </svg>

        {/* Özel ok işaretleri (Custom Markers) - Handle'ların altında kalmasını önlemek için refX="11" kaydırması */}
        <svg className="custom-markers-svg" style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0 }}>
          <defs>
            <marker id="arrow-duct_mixed" viewBox="0 0 10 10" refX="11" refY="5" markerWidth="6" markerHeight="6" orient="auto" overflow="visible">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
            </marker>
            <marker id="arrow-duct_hot" viewBox="0 0 10 10" refX="11" refY="5" markerWidth="6" markerHeight="6" orient="auto" overflow="visible">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
            </marker>
            <marker id="arrow-duct_cold" viewBox="0 0 10 10" refX="11" refY="5" markerWidth="6" markerHeight="6" orient="auto" overflow="visible">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
            </marker>
            <marker id="arrow-duct_exhaust" viewBox="0 0 10 10" refX="11" refY="5" markerWidth="6" markerHeight="6" orient="auto" overflow="visible">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
          </defs>
        </svg>
      </ReactFlow>

      {/* Yüzen Çoklu Silme Butonu */}
      {showMultiDelete && (
        <div style={{ position: 'absolute', zIndex: 100, ...getMultiDeletePosition() }}>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleMultiDelete}
            sx={{ borderRadius: 8, px: 3, boxShadow: 3, textTransform: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}
          >
            {t('pidBuilder.canvas.deleteSelected', 'Seçilileri Sil')} ({multiSelectionCount})
          </Button>
        </div>
      )}
    </div>
  );
};

export default BuilderCanvasInner;
import React, { useState, useCallback } from 'react';
import ReactFlow, { Background, Controls, MiniMap, useReactFlow, ReactFlowProvider, useStore } from 'reactflow';
import 'reactflow/dist/style.css';

import { usePID } from '../../../context/pid/PIDContext';
import { builderNodeTypes, edgeTypes } from '../registry';
import { useSelector } from 'react-redux';
import { selectColorMode } from '../../../features/theme/themeSlice';

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
    setNodes
  } = usePID();

  const mode = useSelector(selectColorMode);
  
  // project yerine ekran koordinatlarını kanvas koordinatlarına milimetrik çeviren fonksiyonu alıyoruz
  const { screenToFlowPosition, getNodes } = useReactFlow();
  
  // Kameranın (tuvalin) anlık yakınlaştırma ve kaydırma verisi
  const transform = useStore((s) => s.transform);

  const [helperLines, setHelperLines] = useState({ horizontal: null, vertical: null });

  const onNodeDrag = useCallback((event, draggedNode) => {
    const allNodes = getNodes(); // react flow'dan veya context'ten gelen güncel cihazlar
    const lines = getHelperLines(draggedNode, allNodes);

    setHelperLines({ horizontal: lines.horizontal, vertical: lines.vertical });

    // Eğer yapışma sınırındaysa cihazın konumunu otomatik olarak kilitlenen (snap) koordinata çek
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

  const onNodeDragStop = useCallback(() => {
    // Sürükleme bittiğinde kılavuz çizgilerini temizle
    setHelperLines({ horizontal: null, vertical: null });
  }, []);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    // Dışarıdan yeni bir PNG/Cihaz sürüklenirken de helper lines göster
    const tempPosition = screenToFlowPosition({
      x: e.clientX - 40,
      y: e.clientY - 40,
    });
    
    // Varsayılan bir genişlik/yükseklik vererek geçici bir node objesi oluşturuyoruz
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
    
    // Bırakıldığı anda eğer hizalama çizgisine yakınsa tam oraya yapıştır (snap)
    const mockNode = { id: 'temp-drag', position, width: 48, height: 48 };
    const lines = getHelperLines(mockNode, getNodes());
    
    if (lines.vertical) position.x = lines.snapPosition.x;
    if (lines.horizontal) position.y = lines.snapPosition.y;

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
  };

  return (
    <div className="flex-1 h-full relative bg-slate-50 dark:bg-slate-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
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
        fitView
        colorMode={mode}
      >
        <Background variant="dots" gap={16} size={1} color={mode === 'dark' ? '#475569' : '#cbd5e1'} />
        <Controls />
        <MiniMap />
        
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

        {/* Özel ok işaretleri (Custom Markers) - Handle'ların altında kalmasını önlemek için refX="15" kaydırması */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0 }}>
          <defs>
            <marker id="arrow-duct_mixed" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto" overflow="visible">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
            </marker>
            <marker id="arrow-duct_hot" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto" overflow="visible">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
            </marker>
            <marker id="arrow-duct_cold" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto" overflow="visible">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
            </marker>
            <marker id="arrow-duct_exhaust" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto" overflow="visible">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
          </defs>
        </svg>
      </ReactFlow>
    </div>
  );
};

export default BuilderCanvasInner;
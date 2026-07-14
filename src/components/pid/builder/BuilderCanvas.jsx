import React from 'react';
import ReactFlow, { Background, Controls, MiniMap, useReactFlow, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';

import { usePID } from '../../../context/pid/PIDContext';
import { builderNodeTypes, edgeTypes } from '../registry';

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
    setActiveFlowType
  } = usePID();

  // project yerine ekran koordinatlarını kanvas koordinatlarına milimetrik çeviren fonksiyonu alıyoruz
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/reactflow');
    if (!type) return;
    
    const device = JSON.parse(type);
    
    // screenToFlowPosition farenin bıraktığı anki gerçek ekran koordinatlarını (e.clientX, e.clientY) alır.
    // -40 offset'i ise ikonun (genişliği 80px varsayarsak) tam farenin ucunun ortasına oturmasını sağlar.
    const position = screenToFlowPosition({
      x: e.clientX - 40,
      y: e.clientY - 40,
    });
    
    addNode(device, position);
  };

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
    <div className="flex-1 h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={builderNodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background variant="dots" gap={16} size={1} />
        <Controls />
        <MiniMap />
        
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

const BuilderCanvas = () => {
  return (
    <ReactFlowProvider>
      <BuilderCanvasInner />
    </ReactFlowProvider>
  );
};

export default BuilderCanvas;
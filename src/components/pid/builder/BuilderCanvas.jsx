import React from 'react';
import ReactFlow, { Background, Controls, MiniMap, useReactFlow, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';

import { usePID } from '../../../context/PIDContext';
import { builderNodeTypes, edgeTypes } from '../registry';

const BuilderCanvasInner = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setSelectedNode
  } = usePID();

  const { project } = useReactFlow();

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/reactflow');
    if (!type) return;
    
    const device = JSON.parse(type);
    const position = project({ x: e.clientX, y: e.clientY - 50 });
    
    addNode(device, position);
  };

  const onNodeClick = (e, node) => {
    setSelectedNode(node);
  };

  const onPaneClick = () => {
    setSelectedNode(null);
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
        onPaneClick={onPaneClick}
        nodeTypes={builderNodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background variant="dots" gap={16} size={1} />
        <Controls />
        <MiniMap />
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

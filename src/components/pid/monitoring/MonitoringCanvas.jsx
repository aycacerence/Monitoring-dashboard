import React, { useEffect, useMemo, useCallback } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

import { usePID } from '../../../context/pid/PIDContext';
import { monitoringNodeTypes, edgeTypes } from '../registry';

const MonitoringCanvas = ({ nodes = [], edges = [], liveData = {} }) => {
  const { setSelectedNode } = usePID();

  // Performans dostu veri birleştirme
  const mergedNodes = useMemo(() => {
    return nodes.map(n => ({
      ...n,
      data: {
        ...n.data,
        liveValue: liveData[n.id]?.value ?? null,
        unit: liveData[n.id]?.unit ?? '',
        status: liveData[n.id]?.status ?? 'normal'
      }
    }));
  }, [nodes, liveData]);

  // Node seçimi için useCallback kullanımı
  const handleNodeClick = useCallback((e, node) => {
    setSelectedNode(node);
  }, [setSelectedNode]);

  const [reactFlowInstance, setReactFlowInstance] = React.useState(null);
  const wrapperRef = React.useRef(null);

  // ResizeObserver: Ekran boyutu değiştiğinde diyagramı ortala
  useEffect(() => {
    if (!wrapperRef.current || !reactFlowInstance) return;
    
    let timeoutId = null;
    const observer = new ResizeObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        reactFlowInstance.fitView({ duration: 600, padding: 0.1 });
      }, 100);
    });

    observer.observe(wrapperRef.current);

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [reactFlowInstance]);

  // Diyagram (nodes) değiştiğinde (örn: diyagramlar arası geçiş yapıldığında) ortala
  useEffect(() => {
    if (reactFlowInstance && nodes.length > 0) {
      // Çizimin bitmesini beklemek için küçük bir gecikme
      const timeoutId = setTimeout(() => {
        reactFlowInstance.fitView({ duration: 600, padding: 0.1 });
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [reactFlowInstance, nodes]);

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={mergedNodes}
        edges={edges}
        nodeTypes={monitoringNodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={handleNodeClick}
        onInit={setReactFlowInstance}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls />

        {/* Özel ok işaretleri (Custom Markers) - Builder ile aynı */}
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
    </div>
  );
};

export default React.memo(MonitoringCanvas);

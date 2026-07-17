import React, { useEffect, useMemo, useCallback } from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

import { usePID } from '../../../context/pid/PIDContext';
import { useDummySocket } from '../../../hooks/useDummySocket';

// TODO: Import your specific node and edge types for monitoring
// import { monitoringNodeTypes } from './monitoringNodeTypes';
// import { edgeTypes } from '../builder/edgeTypes';

const MonitoringCanvas = ({ autoRefresh = true, onAlarmsChange }) => {
  const { nodes, edges, restoreFlow, setSelectedNode } = usePID();

  // 1. Component mount olduğunda kaydedilmiş diyagramı yükle
  useEffect(() => {
    restoreFlow();
  }, [restoreFlow]);

  // 2. Canlı veriyi simüle eden soket hook'unu çağır
  const { liveData, alarms } = useDummySocket(nodes, autoRefresh);

  // 3. Alarmlar değiştiğinde callback'i güvenli şekilde çağır
  useEffect(() => {
    if (onAlarmsChange && typeof onAlarmsChange === 'function') {
      onAlarmsChange(alarms);
    }
  }, [alarms, onAlarmsChange]);

  // 4. Performans dostu veri birleştirme
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

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={mergedNodes}
        edges={edges}
        // nodeTypes={monitoringNodeTypes}
        // edgeTypes={edgeTypes}
        onNodeClick={handleNodeClick}
        onInit={setReactFlowInstance}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap zoomable pannable />
      </ReactFlow>
    </div>
  );
};

export default React.memo(MonitoringCanvas);

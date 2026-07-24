import React, { useEffect, useMemo, useCallback } from 'react';
import ReactFlow, { Controls } from 'reactflow';
import 'reactflow/dist/style.css';

import { usePID } from '../../../context/pid/PIDContext';
import { monitoringNodeTypes, edgeTypes } from '../registry';

/* ─── Serbest gezinme kilidi kaldırıldı ─────────────────────────────────── */

const MonitoringCanvas = ({ nodes = [], edges = [], liveData = {} }) => {
  const { selectedNode, setSelectedNode } = usePID();

  // Node koordinatlarını dinamik olarak ölçeklendirmek için kullanılacak katsayılar.
  // Y ekseninde cihazlar daha uzun olduğu için asimetrik ölçeklendirme uygulanır.
  const SCALE_FACTOR_X = 1.8;
  const SCALE_FACTOR_Y = 2.8;

  // Performans dostu veri birleştirme ve ölçekleme
  const mergedNodes = useMemo(() => {
    return nodes.map(n => {
      const isText = n.type === 'textNode';
      const textScale = (SCALE_FACTOR_X + SCALE_FACTOR_Y) / 2;

      let scaledWidth = n.width;
      let scaledHeight = n.height;
      let scaledStyle = n.style ? { ...n.style } : undefined;

      if (isText) {
        if (n.width) scaledWidth = n.width * textScale;
        if (n.height) scaledHeight = n.height * textScale;
        if (scaledStyle) {
          if (scaledStyle.width) scaledStyle.width = (parseFloat(scaledStyle.width) * textScale) + 'px';
          if (scaledStyle.height) scaledStyle.height = (parseFloat(scaledStyle.height) * textScale) + 'px';
        }
      }

      let finalX, finalY;
      if (n.parentNode) {
        finalX = n.position.x * 1.5; // Genişlik oranına göre (100 -> 150)
        finalY = n.position.y * textScale;
        
        // Monitoring cihaz kartı ortalama 150x220 boyutlarındadır.
        // Metin bu alanın içine düşüyorsa, okunaklılığı bozmamak için dışarı (üste veya alta) itilir.
        const isHorizontallyOverlapping = finalX > -100 && finalX < 140;
        const isVerticallyOverlapping = finalY > -60 && finalY < 220;
        
        if (isHorizontallyOverlapping && isVerticallyOverlapping) {
           // Builder'daki orta nokta (y=42.5) baz alınarak en yakın kenara itilir
           if (n.position.y < 42.5) {
              finalY = -60; // Üste it
           } else {
              finalY = 220; // Alta it
           }
        }
      } else {
        finalX = n.position.x * SCALE_FACTOR_X;
        finalY = n.position.y * SCALE_FACTOR_Y;
      }

      return {
        ...n,
        width: scaledWidth,
        height: scaledHeight,
        style: scaledStyle,
        selectable: !isText,
        position: { x: finalX, y: finalY },
        selected: selectedNode?.id === n.id,
        data: {
          ...n.data,
          fontSize: isText ? (n.data.fontSize || 24) * textScale : n.data.fontSize,
          liveValue: liveData[n.id]?.value ?? null,
          unit: liveData[n.id]?.unit ?? '',
          secondaryValue: liveData[n.id]?.secondaryValue ?? null,
          secondaryUnit: liveData[n.id]?.secondaryUnit ?? '',
          status: liveData[n.id]?.status ?? 'normal',
          isMonitoring: true
        }
      };
    });
  }, [nodes, liveData, selectedNode]);

  // Node seçimi için useCallback kullanımı
  const handleNodeClick = useCallback((e, node) => {
    if (node.type === 'textNode') return;
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
        reactFlowInstance.fitView({ duration: 600, padding: 0.12, maxZoom: 1.5 });
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
        reactFlowInstance.fitView({ duration: 600, padding: 0.12, maxZoom: 1.5 });
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
        className="monitoring-flow"
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        edgesSelectable={false}
        edgesFocusable={false}
        deleteKeyCode={null}
        fitView
        fitViewOptions={{ padding: 0.12, maxZoom: 1.5, duration: 600 }}
        /* ── Gezinme kilitleri kaldırıldı ── */
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={true}
        panOnDrag={true}
        panOnScroll={false}
        preventScrolling={true}
        minZoom={0.1}
        maxZoom={4}
        proOptions={{ hideAttribution: true }}
      >
        {/* Zoom In / Zoom Out / Fit View kontrol butonları */}
        <Controls
          showZoom={true}
          showFitView={true}
          showInteractive={false}
          position="bottom-right"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            bottom: '16px',
            right: '16px',
          }}
        />


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

        {/* İzleme ekranına özel cursor ve Controls stilleri */}
        <style>{`
          .monitoring-flow .react-flow__pane {
            cursor: grab !important;
          }
          .monitoring-flow .react-flow__pane:active {
            cursor: grabbing !important;
          }
          /* Edge seçimi ve tıklaması tamamen engellendi */
          .monitoring-flow .react-flow__edge {
            pointer-events: none !important;
          }
          .monitoring-flow .react-flow__edge.selected .react-flow__edge-path,
          .monitoring-flow .react-flow__edge:focus .react-flow__edge-path {
            stroke: inherit !important;
          }
          .monitoring-flow .react-flow__controls {
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid rgba(0,0,0,0.08);
          }
          .monitoring-flow .react-flow__controls-button {
            width: 28px;
            height: 28px;
            border-bottom: 1px solid rgba(0,0,0,0.06);
            background: var(--monitoring-ctrl-bg, #ffffff);
            color: var(--monitoring-ctrl-color, #475569);
            transition: background 0.15s, color 0.15s;
          }
          .monitoring-flow .react-flow__controls-button:hover {
            background: var(--monitoring-ctrl-hover, #f1f5f9);
            color: #0f172a;
          }
          .monitoring-flow .react-flow__controls-button:last-child {
            border-bottom: none;
          }
          html.dark .monitoring-flow .react-flow__controls {
            --monitoring-ctrl-bg: #1e293b;
            --monitoring-ctrl-color: #94a3b8;
            --monitoring-ctrl-hover: #334155;
            border-color: rgba(255,255,255,0.08);
          }
          html.dark .monitoring-flow .react-flow__controls-button {
            border-bottom-color: rgba(255,255,255,0.06);
          }
        `}</style>
      </ReactFlow>
    </div>
  );
};

export default React.memo(MonitoringCanvas);

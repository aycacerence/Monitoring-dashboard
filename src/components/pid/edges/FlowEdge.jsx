import React, { useState, useCallback } from 'react';
import { getSmoothStepPath, BaseEdge, useReactFlow, EdgeLabelRenderer } from 'reactflow';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import './flowEdge.css';

// 1. Matematiksel Rota Çizici (Keskin Köşeleri Yuvarlatır)
const drawRoundedOrthogonalPath = (points, radius = 8) => {
  const validPoints = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const prev = validPoints[validPoints.length - 1];
    const curr = points[i];
    if (Math.abs(prev.x - curr.x) > 0.1 || Math.abs(prev.y - curr.y) > 0.1) {
      validPoints.push(curr);
    }
  }
  
  if (validPoints.length < 2) return `M ${points[0].x},${points[0].y} L ${points[0].x},${points[0].y}`;
  
  let path = `M ${validPoints[0].x},${validPoints[0].y}`;
  for (let i = 1; i < validPoints.length - 1; i++) {
    const prev = validPoints[i - 1];
    const curr = validPoints[i];
    const next = validPoints[i + 1];
    
    const dx1 = curr.x - prev.x;
    const dy1 = curr.y - prev.y;
    const len1 = Math.sqrt(dx1*dx1 + dy1*dy1);
    
    const dx2 = next.x - curr.x;
    const dy2 = next.y - curr.y;
    const len2 = Math.sqrt(dx2*dx2 + dy2*dy2);
    
    const r = Math.min(radius, len1 / 2, len2 / 2);
    
    if (r === 0) {
      path += ` L ${curr.x},${curr.y}`;
      continue;
    }
    
    const p1x = curr.x - (dx1 / len1) * r;
    const p1y = curr.y - (dy1 / len1) * r;
    
    const p2x = curr.x + (dx2 / len2) * r;
    const p2y = curr.y + (dy2 / len2) * r;
    
    path += ` L ${p1x},${p1y} Q ${curr.x},${curr.y} ${p2x},${p2y}`;
  }
  const last = validPoints[validPoints.length - 1];
  path += ` L ${last.x},${last.y}`;
  return path;
};

// Nokta temizleyici (Gereksiz aynı hat üzerindeki noktaları birleştirir)
const cleanPoints = (points) => {
    if (points.length <= 2) return points;
    let res = [points[0]];
    for (let i = 1; i < points.length - 1; i++) {
        let prev = res[res.length - 1];
        let curr = points[i];
        let next = points[i+1];
        
        let dx1 = curr.x - prev.x;
        let dy1 = curr.y - prev.y;
        let dx2 = next.x - curr.x;
        let dy2 = next.y - curr.y;
        
        // Eğer her iki segment de yataysa veya dikeyse orta noktaya gerek yok
        if (Math.abs(dy1) < 1 && Math.abs(dy2) < 1) continue;
        if (Math.abs(dx1) < 1 && Math.abs(dx2) < 1) continue;
        // Mesafesi 0 ise
        if (Math.abs(dx1) < 1 && Math.abs(dy1) < 1) continue;
        
        res.push(curr);
    }
    let last = points[points.length-1];
    let prev = res[res.length-1];
    if (Math.abs(last.x - prev.x) < 1 && Math.abs(last.y - prev.y) < 1) {
        res[res.length-1] = last;
    } else {
        res.push(last);
    }
    return res;
};

// Manhattan paralel ofset (Duct Mixed için paralel çizgiler çizer)
const getParallelPoints = (pts, offset) => {
  let newPts = [];
  for (let i = 0; i < pts.length; i++) {
      let p = pts[i];
      let pPrev = i > 0 ? pts[i-1] : null;
      let pNext = i < pts.length - 1 ? pts[i+1] : null;
      
      let dxIn = pPrev ? p.x - pPrev.x : 0;
      let dyIn = pPrev ? p.y - pPrev.y : 0;
      let dxOut = pNext ? pNext.x - p.x : 0;
      let dyOut = pNext ? pNext.y - p.y : 0;
      
      if (dxIn === 0 && dxOut === 0 && dyIn === 0 && dyOut === 0) { dxOut = 1; }
      
      let isHorizIn = Math.abs(dxIn) > Math.abs(dyIn);
      let isHorizOut = Math.abs(dxOut) > Math.abs(dyOut);
      
      let offX = 0;
      let offY = 0;
      
      if (!isHorizIn && pPrev) offX = dyIn > 0 ? -offset : offset;
      else if (!isHorizOut && pNext) offX = dyOut > 0 ? -offset : offset;
      
      if (isHorizIn && pPrev) offY = dxIn > 0 ? offset : -offset;
      else if (isHorizOut && pNext) offY = dxOut > 0 ? offset : -offset;
      
      newPts.push({ x: p.x + offX, y: p.y + offY });
  }
  return newPts;
};

const getDynamicMargins = (sourcePos, targetPos, sx, sy, tx, ty, isSelf) => {
  let smX = sourcePos === 'left' ? -40 : sourcePos === 'right' ? 40 : 0;
  let smY = sourcePos === 'top' ? -40 : sourcePos === 'bottom' ? 40 : 0;
  let emX = targetPos === 'left' ? -40 : targetPos === 'right' ? 40 : 0;
  let emY = targetPos === 'top' ? -40 : targetPos === 'bottom' ? 40 : 0;

  if (!isSelf) {
    if (sourcePos === 'right' && tx > sx && tx - sx < 80) {
      let space = tx - sx;
      if (targetPos === 'left') { smX = space / 2; emX = -space / 2; }
      else { smX = Math.min(40, space); }
    } else if (sourcePos === 'left' && sx > tx && sx - tx < 80) {
      let space = sx - tx;
      if (targetPos === 'right') { smX = -space / 2; emX = space / 2; }
      else { smX = Math.max(-40, -space); }
    }
    
    if (sourcePos === 'bottom' && ty > sy && ty - sy < 80) {
      let space = ty - sy;
      if (targetPos === 'top') { smY = space / 2; emY = -space / 2; }
      else { smY = Math.min(40, space); }
    } else if (sourcePos === 'top' && sy > ty && sy - ty < 80) {
      let space = sy - ty;
      if (targetPos === 'bottom') { smY = -space / 2; emY = space / 2; }
      else { smY = Math.max(-40, -space); }
    }

    if (targetPos === 'right' && sx > tx && sx - tx < 80 && sourcePos !== 'left') {
      emX = Math.min(40, sx - tx);
    } else if (targetPos === 'left' && tx > sx && tx - sx < 80 && sourcePos !== 'right') {
      emX = Math.max(-40, -(tx - sx));
    }
    
    if (targetPos === 'bottom' && sy > ty && sy - ty < 80 && sourcePos !== 'top') {
      emY = Math.min(40, sy - ty);
    } else if (targetPos === 'top' && ty > sy && ty - sy < 80 && sourcePos !== 'bottom') {
      emY = Math.max(-40, -(ty - sy));
    }
  }
  return { smX, smY, emX, emY };
};

const FlowEdge = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
  selected,
  sourceHandleId,
  targetHandleId,
}) => {
  const theme = useTheme();
  const { setEdges, screenToFlowPosition, getEdges, getNodes } = useReactFlow();

  const handleDelete = (e) => {
    e.stopPropagation();
    setEdges((eds) => eds.filter((edge) => edge.id !== id));
  };

  const [hoveredHandle, setHoveredHandle] = useState(null);
  const [draggingHandle, setDraggingHandle] = useState(null);

  // -- Çoklu Bağlantı (Overlap) Önleme Mantığı --
  const allEdges = getEdges();
  const allNodes = getNodes();

  // Aynı hedefe giren çizgileri bul ve geldikleri kaynağın konumuna göre sırala (çizgilerin kesişmesini önler)
  const sharedTargetEdges = allEdges
    .filter(e => e.target === target && (e.targetHandle || null) === (targetHandleId || null))
    .sort((a, b) => {
      const nodeA = allNodes.find(n => n.id === a.source);
      const nodeB = allNodes.find(n => n.id === b.source);
      if (!nodeA || !nodeB) return a.id.localeCompare(b.id);
      
      if (['left', 'right'].includes(targetPosition)) {
        if (Math.abs(nodeA.position.y - nodeB.position.y) < 1) return a.id.localeCompare(b.id);
        return nodeA.position.y - nodeB.position.y;
      } else {
        if (Math.abs(nodeA.position.x - nodeB.position.x) < 1) return a.id.localeCompare(b.id);
        return nodeA.position.x - nodeB.position.x;
      }
    });
  const sharedTargetIndex = sharedTargetEdges.findIndex(e => e.id === id);
  const targetOffsetVal = sharedTargetEdges.length > 1 ? (sharedTargetIndex - (sharedTargetEdges.length - 1) / 2) * 20 : 0;

  let adjTargetX = targetX;
  let adjTargetY = targetY;
  if (['left', 'right'].includes(targetPosition)) {
      adjTargetY += targetOffsetVal;
  } else {
      adjTargetX += targetOffsetVal;
  }

  // Aynı kaynaktan çıkan çizgileri bul ve gittikleri hedefin konumuna göre sırala
  const sharedSourceEdges = allEdges
    .filter(e => e.source === source && (e.sourceHandle || null) === (sourceHandleId || null))
    .sort((a, b) => {
      const nodeA = allNodes.find(n => n.id === a.target);
      const nodeB = allNodes.find(n => n.id === b.target);
      if (!nodeA || !nodeB) return a.id.localeCompare(b.id);
      
      if (['left', 'right'].includes(sourcePosition)) {
        if (Math.abs(nodeA.position.y - nodeB.position.y) < 1) return a.id.localeCompare(b.id);
        return nodeA.position.y - nodeB.position.y;
      } else {
        if (Math.abs(nodeA.position.x - nodeB.position.x) < 1) return a.id.localeCompare(b.id);
        return nodeA.position.x - nodeB.position.x;
      }
    });
  const sharedSourceIndex = sharedSourceEdges.findIndex(e => e.id === id);
  const sourceOffsetVal = sharedSourceEdges.length > 1 ? (sharedSourceIndex - (sharedSourceEdges.length - 1) / 2) * 20 : 0;

  let adjSourceX = sourceX;
  let adjSourceY = sourceY;
  if (['left', 'right'].includes(sourcePosition)) {
      adjSourceY += sourceOffsetVal;
  } else {
      adjSourceX += sourceOffsetVal;
  }
  // ----------------------------------------------

  const isSelfLoop = source === target;
  const isReversed = id.includes('reverse') || (source > target) || isSelfLoop;
  // İlk çizginin (ana hattın) dümdüz olması için offset 0. Dönüş/Ters hattın etrafından dolanması için offset 60.
  // Kendi kendine bağlanan (self-loop) oklarda da node'un içinden geçmemesi için offset (Örn: 150) uyguluyoruz.
  const offset = isSelfLoop ? 150 : isReversed ? 75 : 0;

  const getInitialPoints = useCallback(() => {
    let pts = [{ x: adjSourceX, y: adjSourceY }];

    const { smX, smY, emX, emY } = getDynamicMargins(sourcePosition, targetPosition, adjSourceX, adjSourceY, adjTargetX, adjTargetY, isSelfLoop);

    const p1 = { x: adjSourceX + smX, y: adjSourceY + smY };
    const p2 = { x: adjTargetX + emX, y: adjTargetY + emY };
    pts.push(p1);

    if (['left', 'right'].includes(sourcePosition) && ['left', 'right'].includes(targetPosition)) {
      if (sourcePosition === targetPosition) {
        // C Şekli
        const farX = sourcePosition === 'left' ? Math.min(p1.x, p2.x) - (30 + offset) : Math.max(p1.x, p2.x) + (30 + offset);
        pts.push({ x: farX, y: p1.y });
        pts.push({ x: farX, y: p2.y });
      } else {
        const isBackward = sourcePosition === 'right' ? p1.x > p2.x + 1 : sourcePosition === 'left' ? p1.x < p2.x - 1 : false;
        if (isBackward) {
          // S Şekli (Geri dönüş)
          const midY = (p1.y + p2.y) / 2 + offset;
          pts.push({ x: p1.x, y: midY });
          pts.push({ x: p2.x, y: midY });
        } else {
          // Normal Z (İleri)
          if (Math.abs(p1.y - p2.y) < 30) {
            // Yükseklikleri neredeyse aynı (Düz çizgi). Orta kısma Y offset veriyoruz (Eğer 0 ise dümdüz çizer)
            pts.push({ x: p1.x, y: p1.y + offset });
            pts.push({ x: p2.x, y: p1.y + offset });
          } else {
            // Yükseklikleri farklı
            const midX = (p1.x + p2.x) / 2 + offset;
            pts.push({ x: midX, y: p1.y });
            pts.push({ x: midX, y: p2.y });
          }
        }
      }
    } else if (['top', 'bottom'].includes(sourcePosition) && ['top', 'bottom'].includes(targetPosition)) {
      if (sourcePosition === targetPosition) {
        // C Şekli
        const farY = sourcePosition === 'top' ? Math.min(p1.y, p2.y) - (30 + offset) : Math.max(p1.y, p2.y) + (30 + offset);
        pts.push({ x: p1.x, y: farY });
        pts.push({ x: p2.x, y: farY });
      } else {
        const isBackward = sourcePosition === 'bottom' ? p1.y > p2.y + 1 : sourcePosition === 'top' ? p1.y < p2.y - 1 : false;
        if (isBackward) {
          // S Şekli
          const midX = (p1.x + p2.x) / 2 + offset;
          pts.push({ x: midX, y: p1.y });
          pts.push({ x: midX, y: p2.y });
        } else {
          // Normal Z
          if (Math.abs(p1.x - p2.x) < 30) {
            pts.push({ x: p1.x + offset, y: p1.y });
            pts.push({ x: p1.x + offset, y: p2.y });
          } else {
            const midY = (p1.y + p2.y) / 2 + offset;
            pts.push({ x: p1.x, y: midY });
            pts.push({ x: p2.x, y: midY });
          }
        }
      }
    } else {
      if (['left', 'right'].includes(sourcePosition)) {
        pts.push({ x: p2.x, y: p1.y });
      } else {
        pts.push({ x: p1.x, y: p2.y });
      }
    }

    pts.push(p2);
    pts.push({ x: adjTargetX, y: adjTargetY });

    return cleanPoints(pts);
  }, [adjSourceX, adjSourceY, adjTargetX, adjTargetY, sourcePosition, targetPosition, offset]);

  const activePoints = data?.points ? JSON.parse(JSON.stringify(data.points)) : getInitialPoints();
  
  // Düğüm taşınırsa uç noktaları düğüme tekrar dik açıyla kilitle
  if (data?.points && activePoints.length >= 2) {
      activePoints[0] = { x: adjSourceX, y: adjSourceY };
      const { smX, smY, emX, emY } = getDynamicMargins(sourcePosition, targetPosition, adjSourceX, adjSourceY, adjTargetX, adjTargetY, isSelfLoop);
      
      // İlk segment kırılma noktasını her zaman mesafeye göre tut
      activePoints[1] = { x: adjSourceX + smX, y: adjSourceY + smY };
      
      activePoints[activePoints.length - 1] = { x: adjTargetX, y: adjTargetY };
      
      // Son segment kırılma noktasını her zaman mesafeye göre tut
      activePoints[activePoints.length - 2] = { x: adjTargetX + emX, y: adjTargetY + emY };
  }

  const onHandlePointerDown = (event, segmentIndex) => {
    event.stopPropagation();
    setDraggingHandle(segmentIndex);
    
    let points = data?.points ? JSON.parse(JSON.stringify(data.points)) : getInitialPoints();
    let pA = points[segmentIndex];
    let pB = points[segmentIndex + 1];
    let isHoriz = Math.abs(pA.y - pB.y) < 1;
    
    let canMoveA = (segmentIndex !== 0);
    let canMoveB = (segmentIndex + 1 !== points.length - 1);
    let updateIndices = [];
    
    // Segment Bölme (Split) Algoritması
    if (isHoriz) {
        if (!canMoveA && !canMoveB) {
            let splitX1 = points[0].x + (sourcePosition === 'left' ? -20 : 20);
            let splitX2 = points[1].x + (targetPosition === 'right' ? 20 : -20);
            points.splice(1, 0, { x: splitX1, y: pA.y }, { x: splitX1, y: pA.y }, { x: splitX2, y: pA.y }, { x: splitX2, y: pB.y });
            updateIndices = [2, 3];
        } else if (!canMoveA && canMoveB) {
            let splitX = points[0].x + (sourcePosition === 'left' ? -20 : 20);
            points.splice(1, 0, { x: splitX, y: pA.y }, { x: splitX, y: pA.y });
            updateIndices = [2, 3];
        } else if (canMoveA && !canMoveB) {
            let splitX = points[points.length-1].x + (targetPosition === 'right' ? 20 : -20);
            points.splice(segmentIndex + 1, 0, { x: splitX, y: pA.y }, { x: splitX, y: pB.y });
            updateIndices = [segmentIndex, segmentIndex + 1];
        } else {
            updateIndices = [segmentIndex, segmentIndex + 1];
        }
    } else {
        if (!canMoveA && !canMoveB) {
            let splitY1 = points[0].y + (sourcePosition === 'top' ? -20 : 20);
            let splitY2 = points[1].y + (targetPosition === 'bottom' ? 20 : -20);
            points.splice(1, 0, { x: pA.x, y: splitY1 }, { x: pA.x, y: splitY1 }, { x: pA.x, y: splitY2 }, { x: pB.x, y: splitY2 });
            updateIndices = [2, 3];
        } else if (!canMoveA && canMoveB) {
            let splitY = points[0].y + (sourcePosition === 'top' ? -20 : 20);
            points.splice(1, 0, { x: pA.x, y: splitY }, { x: pA.x, y: splitY });
            updateIndices = [2, 3];
        } else if (canMoveA && !canMoveB) {
            let splitY = points[points.length-1].y + (targetPosition === 'bottom' ? 20 : -20);
            points.splice(segmentIndex + 1, 0, { x: pA.x, y: splitY }, { x: pB.x, y: splitY });
            updateIndices = [segmentIndex, segmentIndex + 1];
        } else {
            updateIndices = [segmentIndex, segmentIndex + 1];
        }
    }
    
    // Sürükleme başlar başlamaz bölünmüş state'i kaydet
    setEdges((edges) => edges.map((edge) => edge.id === id ? { ...edge, data: { ...edge.data, points } } : edge));

    let isDragging = true;
    const onPointerMove = (e) => {
      if (!isDragging) return;
      const flowPos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      
      setEdges((edges) =>
        edges.map((edge) => {
          if (edge.id !== id) return edge;
          const newPts = JSON.parse(JSON.stringify(edge.data.points || points));
          if (isHoriz) {
              updateIndices.forEach(idx => newPts[idx].y = flowPos.y);
          } else {
              updateIndices.forEach(idx => newPts[idx].x = flowPos.x);
          }
          return { ...edge, data: { ...edge.data, points: newPts } };
        })
      );
    };

    const onPointerUp = () => {
      isDragging = false;
      setDraggingHandle(null);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      
      // Sürükleme bitince aynı doğrultudaki gereksiz noktaları temizle
      setEdges((edges) =>
        edges.map((edge) => {
          if (edge.id !== id) return edge;
          return { ...edge, data: { ...edge.data, points: cleanPoints(edge.data.points) } };
        })
      );
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const getFlowColor = (flowType) => {
    switch (flowType) {
      case 'duct_mixed': return theme.palette.flow.mixed;
      case 'duct_hot': return theme.palette.flow.hot;
      case 'duct_cold': return theme.palette.flow.cold;
      case 'duct_exhaust': return theme.palette.flow.exhaust;
      default: return theme.palette.flow.default;
    }
  };

  const color = getFlowColor(data?.flowType);
  const path = drawRoundedOrthogonalPath(activePoints);

  // Tutamaçları (Handles) Oluştur
  const handles = [];
  if (selected) {
    for (let i = 0; i < activePoints.length - 1; i++) {
      const pA = activePoints[i];
      const pB = activePoints[i+1];
      const midX = (pA.x + pB.x) / 2;
      const midY = (pA.y + pB.y) / 2;
      
      // Mesafe çok kısaysa handle gösterme
      if (Math.abs(pA.x - pB.x) < 20 && Math.abs(pA.y - pB.y) < 20) continue;

      const isActive = draggingHandle === i || hoveredHandle === i;
      
      handles.push(
        <g
          key={i}
          transform={`translate(${midX}, ${midY})`}
          onPointerDown={(e) => onHandlePointerDown(e, i)}
          onPointerEnter={() => setHoveredHandle(i)}
          onPointerLeave={() => setHoveredHandle(null)}
          style={{ cursor: Math.abs(pA.y - pB.y) < 1 ? 'ns-resize' : 'ew-resize', pointerEvents: 'all' }}
        >
          {/* Çift tıklama algılaması için geniş ve görünmez dokunma alanı */}
          <rect x={-15} y={-15} width={30} height={30} fill="transparent" />
          {/* Görsel Tutamaç (Kare veya Yuvarlak) */}
          <rect 
            x={-6} y={-6} width={12} height={12} rx={isActive ? 3 : 6} 
            fill={isActive ? "#1e293b" : "transparent"} 
            stroke={isActive ? "#f97316" : "transparent"} 
            strokeWidth={1.5} 
            style={{ transition: 'all 0.2s' }}
          />
          <circle 
            cx={0} cy={0} r={isActive ? 2 : 3.5} 
            fill={isActive ? "#f97316" : "#e2e8f0"} 
            stroke={isActive ? "transparent" : "#94a3b8"}
            strokeWidth={1}
            style={{ transition: 'all 0.2s' }}
          />
        </g>
      );
    }
  }

  const midIndex = Math.max(0, Math.floor((activePoints.length - 1) / 2));
  const pA = activePoints[midIndex] || { x: sourceX, y: sourceY };
  const pB = activePoints[midIndex+1] || pA;
  const labelX = (pA.x + pB.x) / 2;
  const labelY = (pA.y + pB.y) / 2;

  const isHoriz = Math.abs(pA.y - pB.y) < 1;
  const offsetX = isHoriz ? 0 : 25;
  const offsetY = isHoriz ? -25 : 0;

  const deleteButton = selected ? (
    <EdgeLabelRenderer>
      <div
        style={{
          position: 'absolute',
          transform: `translate(-50%, -50%) translate(${labelX + offsetX}px, ${labelY + offsetY}px)`,
          pointerEvents: 'all',
          zIndex: 20,
        }}
      >
        <IconButton
          size="small"
          onClick={handleDelete}
          sx={{
            bgcolor: 'error.main',
            color: 'white',
            width: 24,
            height: 24,
            '&:hover': {
              bgcolor: 'error.dark',
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </div>
    </EdgeLabelRenderer>
  ) : null;

  if (data?.flowType === 'duct_mixed') {
    const pathTop = drawRoundedOrthogonalPath(getParallelPoints(activePoints, -6));
    const pathBottom = drawRoundedOrthogonalPath(getParallelPoints(activePoints, 6));

    return (
      <>
        <path
          id={`${id}-top`}
          d={pathTop}
          fill="none"
          markerEnd="url(#arrow-duct_cold)"
          className="react-flow__edge-path"
          style={{ stroke: theme.palette.flow.cold, strokeWidth: selected ? 2.5 : 2, filter: selected ? `drop-shadow(0px 0px 4px ${theme.palette.flow.cold})` : 'none', transition: 'all 0.2s ease' }}
        />
        <path
          id={`${id}-bottom`}
          d={pathBottom}
          fill="none"
          markerEnd="url(#arrow-duct_hot)"
          className="react-flow__edge-path"
          style={{ stroke: theme.palette.flow.hot, strokeWidth: selected ? 2.5 : 2, filter: selected ? `drop-shadow(0px 0px 4px ${theme.palette.flow.hot})` : 'none', transition: 'all 0.2s ease' }}
        />
        <path d={path} fill="none" strokeOpacity={0} strokeWidth={20} className="react-flow__edge-interaction" />
        {handles}
        {deleteButton}
      </>
    );
  }

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        markerEnd={`url(#arrow-${data?.flowType || 'duct_cold'})`}
        style={{ stroke: color, strokeWidth: selected ? 2.5 : 2, filter: selected ? `drop-shadow(0px 0px 4px ${color})` : 'none', transition: 'all 0.2s ease' }}
      />
      <path d={path} fill="none" strokeOpacity={0} strokeWidth={20} className="react-flow__edge-interaction" />
      {handles}
      {deleteButton}
    </>
  );
};

export default React.memo(FlowEdge);

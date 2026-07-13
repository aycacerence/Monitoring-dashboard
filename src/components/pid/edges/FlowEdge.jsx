import React from 'react';
import { getSmoothStepPath, BaseEdge } from 'reactflow';
import './flowEdge.css';

const FlowEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}) => {
  const [path] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const getFlowColor = (flowType) => {
    switch (flowType) {
      case 'flow_mixed':
        return '#2563eb'; // Mavi
      case 'duct_hot':
        return '#ea580c'; // Turuncu
      case 'duct_cold':
        return '#dc2626'; // Kırmızı
      case 'duct_exhaust':
        return '#9333ea'; // Mor
      default:
        return '#9ca3af'; // Gri
    }
  };

  const color = getFlowColor(data?.flowType);

  return (
    <BaseEdge
      id={id}
      path={path}
      markerEnd={markerEnd}
      style={{
        ...style,
        stroke: color,
        strokeWidth: 2,
        strokeDasharray: '5,5',
        animation: 'dashdraw 0.5s linear infinite',
      }}
    />
  );
};

export default FlowEdge;

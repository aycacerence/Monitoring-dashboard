import React from 'react';
import { getSmoothStepPath, BaseEdge } from 'reactflow';
import { useTheme } from '@mui/material/styles';
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
  const theme = useTheme();
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
      case 'flow_mixed': return theme.palette.flow.mixed;
      case 'duct_hot': return theme.palette.flow.hot;
      case 'duct_cold': return theme.palette.flow.cold;
      case 'duct_exhaust': return theme.palette.flow.exhaust;
      default: return theme.palette.flow.default;
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

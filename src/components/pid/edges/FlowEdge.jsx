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
  selected,
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
      case 'duct_mixed': return theme.palette.flow.mixed;
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
        strokeWidth: selected ? 2.75 : 2,
        filter: selected ? `drop-shadow(0px 0px 4px ${color})` : 'none',
        transition: 'all 0.2s ease',
      }}
    />
  );
};

export default FlowEdge;

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

  const getOffsetParams = (offset) => {
    let sX = sourceX;
    let sY = sourceY;
    let tX = targetX;
    let tY = targetY;

    if (sourcePosition === 'left' || sourcePosition === 'right') {
      sY += offset;
    } else {
      sX += offset;
    }

    if (targetPosition === 'left' || targetPosition === 'right') {
      tY += offset;
    } else {
      tX += offset;
    }

    return {
      sourceX: sX,
      sourceY: sY,
      targetX: tX,
      targetY: tY,
      sourcePosition,
      targetPosition,
      centerX: sX + (tX - sX) / 2 + offset,
      centerY: sY + (tY - sY) / 2 + offset,
    };
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

  if (data?.flowType === 'duct_mixed') {
    const [pathTop] = getSmoothStepPath(getOffsetParams(-6));
    const [pathBottom] = getSmoothStepPath(getOffsetParams(6));

    return (
      <>
        {/* Mavi hat (Soğuk) */}
        <path
          id={`${id}-top`}
          d={pathTop}
          fill="none"
          markerEnd="url(#arrow-duct_cold)"
          className="react-flow__edge-path"
          style={{
            stroke: theme.palette.flow.cold,
            strokeWidth: selected ? 2.5 : 2,
            filter: selected ? `drop-shadow(0px 0px 4px ${theme.palette.flow.cold})` : 'none',
            transition: 'all 0.2s ease',
          }}
        />
        {/* Kırmızı hat (Sıcak) */}
        <path
          id={`${id}-bottom`}
          d={pathBottom}
          fill="none"
          markerEnd="url(#arrow-duct_hot)"
          className="react-flow__edge-path"
          style={{
            stroke: theme.palette.flow.hot,
            strokeWidth: selected ? 2.5 : 2,
            filter: selected ? `drop-shadow(0px 0px 4px ${theme.palette.flow.hot})` : 'none',
            transition: 'all 0.2s ease',
          }}
        />
        {/* Etkileşim alanı (tıklamayı kolaylaştırmak için görünmez kalın çizgi) */}
        <path
          d={path}
          fill="none"
          strokeOpacity={0}
          strokeWidth={20}
          className="react-flow__edge-interaction"
        />
      </>
    );
  }

  return (
    <BaseEdge
      id={id}
      path={path}
      markerEnd={markerEnd}
      style={{
        ...style,
        stroke: color,
        strokeWidth: selected ? 2.5 : 2,
        filter: selected ? `drop-shadow(0px 0px 4px ${color})` : 'none',
        transition: 'all 0.2s ease',
      }}
    />
  );
};

export default FlowEdge;

import React from 'react';
import { getSmoothStepPath } from 'reactflow';
import { useTheme } from '@mui/material/styles';

const CustomConnectionLine = ({
  fromX,
  fromY,
  toX,
  toY,
  connectionLineType,
  connectionLineStyle,
  connectionStatus,
}) => {
  const theme = useTheme();

  const [edgePath] = getSmoothStepPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
    borderRadius: 8,
  });

  const isInvalid = connectionStatus === 'invalid';
  const color = isInvalid ? theme.palette.error.main : theme.palette.primary.main;
  
  return (
    <g>
      <path
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeDasharray={isInvalid ? "5,5" : "none"}
        className="animated-connection-line"
        d={edgePath}
        style={{ transition: 'stroke 0.2s, stroke-dasharray 0.2s' }}
      />
      <circle
        cx={toX}
        cy={toY}
        fill={color}
        r={4}
        stroke={color}
        strokeWidth={1.5}
        style={{ transition: 'fill 0.2s, stroke 0.2s' }}
      />
      {/* Global cursor override when invalid */}
      {isInvalid && (
        <style>
          {`
            body, .react-flow__pane {
              cursor: not-allowed !important;
            }
          `}
        </style>
      )}
    </g>
  );
};

export default React.memo(CustomConnectionLine);

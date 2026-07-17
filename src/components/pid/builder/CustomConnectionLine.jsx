import React from 'react';
import { getSmoothStepPath } from 'reactflow';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const CustomConnectionLine = ({
  fromX,
  fromY,
  toX,
  toY,
  connectionLineType,
  connectionLineStyle,
  connectionStatus,
  connectionHandleType,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [edgePath] = getSmoothStepPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
    borderRadius: 8,
  });

  const isInvalid = connectionStatus === 'invalid';
  const color = isInvalid ? theme.palette.error.main : theme.palette.primary.main;
  
  const getErrorMessage = () => {
    if (connectionHandleType === 'source') {
      return t('pidBuilder.canvas.connectionError.sourceToSource');
    } else if (connectionHandleType === 'target') {
      return t('pidBuilder.canvas.connectionError.targetToTarget');
    }
    return t('pidBuilder.canvas.connectionError.generic');
  };
  
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
      
      {/* Dynamic Invalid Connection Tooltip */}
      {isInvalid && (
        <foreignObject
          x={toX + 15}
          y={toY + 15}
          width={250}
          height={60}
          style={{ pointerEvents: 'none', overflow: 'visible' }}
        >
          <div className="inline-flex items-center bg-gray-900 text-white text-xs font-semibold px-3 py-2 rounded-md shadow-md animate-fade-in-up border border-gray-700">
            {getErrorMessage()}
          </div>
        </foreignObject>
      )}

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


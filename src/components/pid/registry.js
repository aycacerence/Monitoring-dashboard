import GenericDeviceNode from './nodes/GenericDeviceNode';
import MonitoringDeviceNode from './nodes/MonitoringDeviceNode';
import FlowEdge from './edges/FlowEdge';

export const builderNodeTypes = {
  device: GenericDeviceNode
};

export const monitoringNodeTypes = {
  device: MonitoringDeviceNode
};

export const edgeTypes = {
  flowEdge: FlowEdge
};

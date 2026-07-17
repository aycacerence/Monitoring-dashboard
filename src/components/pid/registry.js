import GenericDeviceNode from './nodes/GenericDeviceNode';
import MonitoringDeviceNode from './nodes/MonitoringDeviceNode';
import TextNode from './nodes/TextNode';
import FlowEdge from './edges/FlowEdge';

export const builderNodeTypes = {
  device: GenericDeviceNode,
  textNode: TextNode
};

export const monitoringNodeTypes = {
  device: MonitoringDeviceNode,
  textNode: TextNode
};

export const edgeTypes = {
  flowEdge: FlowEdge
};

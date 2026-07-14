import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { addEdge, applyNodeChanges, applyEdgeChanges, MarkerType } from 'reactflow';
import { useSelector } from 'react-redux';
import { selectRole } from '../../features/auth/authSlice';

const PIDContext = createContext();

export const usePID = () => {
  const context = useContext(PIDContext);
  if (!context) {
    throw new Error('usePID must be used within a PIDProvider');
  }
  return context;
};

const loadSavedFlow = (role) => {
  try {
    const saved = localStorage.getItem(`pid_saved_flow_${role}`);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Local storage okuma hatası', e);
  }
  return { nodes: [], edges: [] };
};

export const PIDProvider = ({ children }) => {
  const role = useSelector(selectRole) || 'admin';
  const initialData = loadSavedFlow(role);
  const [nodes, setNodes] = useState(initialData.nodes);
  const [edges, setEdges] = useState(initialData.edges);
  const [savedState, setSavedState] = useState(JSON.stringify(initialData));
  
  const isDirty = JSON.stringify({ nodes, edges }) !== savedState;
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [activeFlowType, setActiveFlowType] = useState('flow_mixed');

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;
  const selectedEdge = edges.find(e => e.id === selectedEdgeId) || null;

  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  // Her değişiklikten önce mevcut durumu past dizisine atar ve future dizisini sıfırlar
  const pushHistory = useCallback(() => {
    setPast((currPast) => {
      const currentState = JSON.parse(JSON.stringify({ nodes, edges }));
      return [...currPast, currentState];
    });
    setFuture([]); // Yeni bir işlem yapıldığında eski 'redo' geçmişi geçersizdir
  }, [nodes, edges]);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    
    const previousState = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    setFuture((currFuture) => {
      const currentState = JSON.parse(JSON.stringify({ nodes, edges }));
      return [...currFuture, currentState];
    });
    
    setNodes(previousState.nodes);
    setEdges(previousState.edges);
    setPast(newPast);
  }, [nodes, edges, past]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    
    const nextState = future[future.length - 1];
    const newFuture = future.slice(0, future.length - 1);
    
    setPast((currPast) => {
      const currentState = JSON.parse(JSON.stringify({ nodes, edges }));
      return [...currPast, currentState];
    });
    
    setNodes(nextState.nodes);
    setEdges(nextState.edges);
    setFuture(newFuture);
  }, [nodes, edges, future]);

  const addNode = useCallback((device, position) => {
    pushHistory();
    const newNode = {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'device',
      position,
      data: { ...device }
    };
    setNodes((nds) => [...nds, newNode]);
  }, [pushHistory]);

  const updateNodeData = useCallback((nodeId, newData) => {
    pushHistory();
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      })
    );
  }, [pushHistory]);

  const deleteNode = useCallback((nodeId) => {
    pushHistory();
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  }, [pushHistory, selectedNodeId]);

  const deleteEdge = useCallback((edgeId) => {
    pushHistory();
    setEdges((eds) => eds.filter((e) => e.id !== edgeId));
    if (selectedEdgeId === edgeId) {
      setSelectedEdgeId(null);
    }
  }, [pushHistory, selectedEdgeId]);

  const getFlowColor = (flowType) => {
    switch (flowType) {
      case 'flow_mixed': return '#3b82f6';
      case 'duct_hot': return '#f97316';
      case 'duct_cold': return '#ef4444';
      case 'duct_exhaust': return '#64748b';
      default: return '#3b82f6';
    }
  };

  const onConnect = useCallback((connection) => {
    pushHistory();
    setEdges((eds) => addEdge({ 
      ...connection, 
      type: 'flowEdge', 
      data: { flowType: activeFlowType },
      markerEnd: `arrow-${activeFlowType}`
    }, eds));
  }, [pushHistory, activeFlowType]);

  const handleSetSelectedNode = useCallback((node) => {
    pushHistory();
    setSelectedNodeId(node ? node.id : null);
  }, [pushHistory]);

  const handleSetSelectedEdge = useCallback((edge) => {
    pushHistory();
    setSelectedEdgeId(edge ? edge.id : null);
  }, [pushHistory]);

  const updateEdgeData = useCallback((id, newData) => {
    pushHistory();
    setEdges((eds) => eds.map((edge) => {
      if (edge.id === id) {
        const updatedEdge = { ...edge, data: { ...edge.data, ...newData } };
        if (newData.flowType) {
          updatedEdge.markerEnd = `arrow-${newData.flowType}`;
        }
        return updatedEdge;
      }
      return edge;
    }));
  }, [pushHistory]);

  // React Flow'un kendi sürükleme/seçme eventleri için (Geçmişe atmak istenirse burası genişletilebilir)
  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const saveFlow = useCallback(() => {
    const flow = { nodes, edges };
    const flowStr = JSON.stringify(flow);
    localStorage.setItem(`pid_saved_flow_${role}`, flowStr);
    setSavedState(flowStr);
  }, [nodes, edges, role]);

  const restoreFlow = useCallback(() => {
    const savedFlow = localStorage.getItem(`pid_saved_flow_${role}`);
    if (savedFlow) {
      try {
        const parsedFlow = JSON.parse(savedFlow);
        if (parsedFlow.nodes) setNodes(parsedFlow.nodes);
        if (parsedFlow.edges) setEdges(parsedFlow.edges);
        setSavedState(savedFlow);
      } catch (error) {
        console.error('Akış geri yüklenirken hata oluştu:', error);
      }
    } else {
      // If there's no saved flow for this role, clear the canvas
      setNodes([]);
      setEdges([]);
      setSavedState(JSON.stringify({ nodes: [], edges: [] }));
    }
  }, [role]);

  // Rol değiştiğinde o role ait diyagramı yükle
  useEffect(() => {
    restoreFlow();
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setPast([]);
    setFuture([]);
  }, [role, restoreFlow]);

  const clearFlow = useCallback(() => {
    pushHistory();
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    localStorage.removeItem(`pid_saved_flow_${role}`);
    setSavedState(JSON.stringify({ nodes: [], edges: [] }));
  }, [pushHistory, role]);

  const value = {
    nodes,
    edges,
    selectedNode,
    selectedEdge,
    activeFlowType,
    setActiveFlowType,
    setSelectedNode: handleSetSelectedNode,
    setSelectedEdge: handleSetSelectedEdge,
    addNode,
    updateNodeData,
    updateEdgeData,
    deleteNode,
    deleteEdge,
    onConnect,
    onNodesChange,
    onEdgesChange,
    undo,
    redo,
    past,
    future,
    saveFlow,
    restoreFlow,
    clearFlow,
    isDirty
  };

  return <PIDContext.Provider value={value}>{children}</PIDContext.Provider>;
};

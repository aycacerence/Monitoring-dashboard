import React, { createContext, useContext, useState, useCallback } from 'react';
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';

const PIDContext = createContext();

export const usePID = () => {
  const context = useContext(PIDContext);
  if (!context) {
    throw new Error('usePID must be used within a PIDProvider');
  }
  return context;
};

export const PIDProvider = ({ children }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

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
      type: device.type || 'default',
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
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  }, [pushHistory, selectedNode]);

  const onConnect = useCallback((connection) => {
    pushHistory();
    setEdges((eds) => addEdge(connection, eds));
  }, [pushHistory]);

  const handleSetSelectedNode = useCallback((node) => {
    pushHistory();
    setSelectedNode(node);
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
    localStorage.setItem('pid_builder_flow', JSON.stringify(flow));
  }, [nodes, edges]);

  const restoreFlow = useCallback(() => {
    const savedFlow = localStorage.getItem('pid_builder_flow');
    if (savedFlow) {
      try {
        const parsedFlow = JSON.parse(savedFlow);
        if (parsedFlow.nodes) setNodes(parsedFlow.nodes);
        if (parsedFlow.edges) setEdges(parsedFlow.edges);
      } catch (error) {
        console.error('Akış geri yüklenirken hata oluştu:', error);
      }
    }
  }, []);

  const clearFlow = useCallback(() => {
    pushHistory();
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
  }, [pushHistory]);

  const value = {
    nodes,
    edges,
    selectedNode,
    setSelectedNode: handleSetSelectedNode,
    addNode,
    updateNodeData,
    deleteNode,
    onConnect,
    onNodesChange,
    onEdgesChange,
    undo,
    redo,
    past,
    future,
    saveFlow,
    restoreFlow,
    clearFlow
  };

  return <PIDContext.Provider value={value}>{children}</PIDContext.Provider>;
};

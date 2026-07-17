import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { useSelector, useDispatch } from 'react-redux';
import { selectRole } from '../../features/auth/authSlice';
import { setIsDirty as setGlobalIsDirty } from '../../features/ui/uiSlice';

const PIDContext = createContext();

export const usePID = () => {
  const context = useContext(PIDContext);
  if (!context) {
    throw new Error('usePID must be used within a PIDProvider');
  }
  return context;
};

const generateId = () => `diag_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`;

const loadDiagramList = (role) => {
  try {
    const list = localStorage.getItem(`pid_diagram_list_${role}`);
    if (list) return JSON.parse(list);
    
    // Geriye dönük uyumluluk (Migration)
    const oldSaved = localStorage.getItem(`pid_saved_flow_${role}`);
    if (oldSaved) {
      const defaultId = generateId();
      localStorage.setItem(`pid_flow_${defaultId}`, oldSaved);
      const initialList = [{ id: defaultId, name: 'default_diagram', updatedAt: Date.now() }];
      localStorage.setItem(`pid_diagram_list_${role}`, JSON.stringify(initialList));
      localStorage.setItem(`pid_active_diagram_${role}`, defaultId);
      // Eski veriyi silebiliriz ama güvenlik için şimdilik bırakalım
      return initialList;
    }
  } catch (e) {
    console.error('Local storage okuma hatası', e);
  }
  return [];
};

const loadDiagramContent = (id) => {
  try {
    const saved = localStorage.getItem(`pid_flow_${id}`);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Diyagram okuma hatası', e);
  }
  return { nodes: [], edges: [] };
};

const cleanFlow = (nodes, edges) => {
  const cleanNodes = (nodes || []).map(({ width, height, selected, dragging, positionAbsolute, ...rest }) => rest);
  const cleanEdges = (edges || []).map(({ selected, ...rest }) => rest);
  return JSON.stringify({ nodes: cleanNodes, edges: cleanEdges });
};

export const PIDProvider = ({ children }) => {
  const role = useSelector(selectRole) || 'admin';
  
  const [diagrams, setDiagrams] = useState([]);
  const [activeDiagramId, setActiveDiagramId] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [savedStateStr, setSavedStateStr] = useState(cleanFlow([], []));
  
  const isDirty = cleanFlow(nodes, edges) !== savedStateStr;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setGlobalIsDirty(isDirty));
    return () => dispatch(setGlobalIsDirty(false));
  }, [isDirty, dispatch]);
  
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [activeFlowType, setActiveFlowType] = useState('duct_mixed');

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;
  const selectedEdge = edges.find(e => e.id === selectedEdgeId) || null;

  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  // Role değiştiğinde veya ilk yüklemede diyagramları getir
  useEffect(() => {
    const list = loadDiagramList(role);
    setDiagrams(list);
    
    let activeId = localStorage.getItem(`pid_active_diagram_${role}`);
    if (!activeId && list.length > 0) {
      activeId = list[0].id;
    } else if (list.length === 0) {
      // Hiç diyagram yoksa temiz bir tane oluştur
      activeId = generateId();
      const newList = [{ id: activeId, name: 'default_diagram', updatedAt: Date.now() }];
      setDiagrams(newList);
      localStorage.setItem(`pid_diagram_list_${role}`, JSON.stringify(newList));
    }
    
    setActiveDiagramId(activeId);
    localStorage.setItem(`pid_active_diagram_${role}`, activeId);
    
    const content = loadDiagramContent(activeId);
    setNodes(content.nodes || []);
    setEdges(content.edges || []);
    setSavedStateStr(cleanFlow(content.nodes, content.edges));
    setPast([]);
    setFuture([]);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, [role]);

  const pushHistory = useCallback(() => {
    setPast((currPast) => {
      const currentState = JSON.parse(JSON.stringify({ nodes, edges }));
      
      // Sadece tarihçeye kaydedilmesi GEÇERLİ olan (saf) verileri kıyaslamak için al
      const stripUI = (nds, eds) => ({
        nodes: nds.map(({ id, type, position, data }) => ({ id, type, position, data })),
        edges: eds.map(({ id, source, sourceHandle, target, targetHandle, type, data }) => ({ id, source, sourceHandle, target, targetHandle, type, data }))
      });

      if (currPast.length > 0) {
        const lastState = currPast[currPast.length - 1];
        const strippedCurrent = stripUI(currentState.nodes, currentState.edges);
        const strippedLast = stripUI(lastState.nodes, lastState.edges);
        
        if (JSON.stringify(strippedCurrent) === JSON.stringify(strippedLast)) {
          return currPast; // Skip if only selection/dragging changed
        }
      }
      return [...currPast, currentState];
    });
    setFuture([]); 
  }, [nodes, edges]);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previousState = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    setFuture((currFuture) => {
      const currentState = JSON.parse(JSON.stringify({ nodes, edges }));
      return [...currFuture, currentState];
    });

    // Mevcut seçim durumlarını (selected) koruyarak geçmiş durumu yükle
    setNodes(previousState.nodes.map(n => {
      const curr = nodes.find(c => c.id === n.id);
      return { ...n, selected: curr ? curr.selected : false };
    }));
    setEdges(previousState.edges.map(e => {
      const curr = edges.find(c => c.id === e.id);
      return { ...e, selected: curr ? curr.selected : false };
    }));
    
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

    // Mevcut seçim durumlarını koruyarak ileri durumu yükle
    setNodes(nextState.nodes.map(n => {
      const curr = nodes.find(c => c.id === n.id);
      return { ...n, selected: curr ? curr.selected : false };
    }));
    setEdges(nextState.edges.map(e => {
      const curr = edges.find(c => c.id === e.id);
      return { ...e, selected: curr ? curr.selected : false };
    }));

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

  const deleteMultiple = useCallback((nodesToRemove, edgesToRemove) => {
    if (nodesToRemove.length === 0 && edgesToRemove.length === 0) return;
    pushHistory();
    
    const nodeIds = new Set(nodesToRemove.map(n => n.id));
    const edgeIds = new Set(edgesToRemove.map(e => e.id));

    setNodes((nds) => nds.filter((n) => !nodeIds.has(n.id)));
    setEdges((eds) => eds.filter((e) => !edgeIds.has(e.id) && !nodeIds.has(e.source) && !nodeIds.has(e.target)));

    if (selectedNodeId && nodeIds.has(selectedNodeId)) {
      setSelectedNodeId(null);
    }
    if (selectedEdgeId && edgeIds.has(selectedEdgeId)) {
      setSelectedEdgeId(null);
    }
  }, [pushHistory, selectedNodeId, selectedEdgeId]);

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
    setSelectedNodeId(node ? node.id : null);
  }, []);

  const handleSetSelectedEdge = useCallback((edge) => {
    setSelectedEdgeId(edge ? edge.id : null);
  }, []);

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

  const onNodesChange = useCallback((changes) => {
    // Sadece önemli değişikliklerde (ekleme, silme, taşıma bitişi) tarihçeye kaydet
    const hasSignificantChange = changes.some((c) => {
      if (c.type === 'select') return false;
      if (c.type === 'dimensions') return false;
      if (c.type === 'position' && c.dragging) return false;
      return true;
    });
    
    if (hasSignificantChange) {
      pushHistory();
    }
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, [pushHistory]);

  const onEdgesChange = useCallback((changes) => {
    const hasSignificantChange = changes.some((c) => c.type !== 'select');
    
    if (hasSignificantChange) {
      pushHistory();
    }
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, [pushHistory]);

  const saveFlow = useCallback((customName = null) => {
    if (!activeDiagramId) return;
    
    const flow = { nodes, edges };
    const flowStr = JSON.stringify(flow);
    localStorage.setItem(`pid_flow_${activeDiagramId}`, flowStr);
    setSavedStateStr(cleanFlow(nodes, edges));
    
    setDiagrams(prev => {
      const updated = prev.map(d => {
        if (d.id === activeDiagramId) {
          return { ...d, name: customName || d.name, updatedAt: Date.now() };
        }
        return d;
      });
      localStorage.setItem(`pid_diagram_list_${role}`, JSON.stringify(updated));
      return updated;
    });
  }, [nodes, edges, activeDiagramId, role]);

  const createNewDiagram = useCallback((name) => {
    const newId = generateId();
    const newDiagram = { id: newId, name: name || 'Yeni Diyagram', updatedAt: Date.now() };
    
    setDiagrams(prev => {
      const updated = [...prev, newDiagram];
      localStorage.setItem(`pid_diagram_list_${role}`, JSON.stringify(updated));
      return updated;
    });
    
    setActiveDiagramId(newId);
    localStorage.setItem(`pid_active_diagram_${role}`, newId);
    localStorage.setItem(`pid_flow_${newId}`, JSON.stringify({ nodes: [], edges: [] }));
    
    setNodes([]);
    setEdges([]);
    setSavedStateStr(cleanFlow([], []));
    setPast([]);
    setFuture([]);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, [role]);

  const switchDiagram = useCallback((id, force = false) => {
    if (isDirty && !force) {
      return false; 
    }
    
    setActiveDiagramId(id);
    localStorage.setItem(`pid_active_diagram_${role}`, id);
    
    const content = loadDiagramContent(id);
    setNodes(content.nodes || []);
    setEdges(content.edges || []);
    setSavedStateStr(cleanFlow(content.nodes, content.edges));
    setPast([]);
    setFuture([]);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    return true; 
  }, [isDirty, role]);

  const renameDiagram = useCallback((id, newName) => {
    setDiagrams(prev => {
      const updated = prev.map(d => {
        if (d.id === id) {
          return { ...d, name: newName, updatedAt: Date.now() };
        }
        return d;
      });
      localStorage.setItem(`pid_diagram_list_${role}`, JSON.stringify(updated));
      return updated;
    });
  }, [role]);

  const deleteDiagram = useCallback((id) => {
    setDiagrams(prev => {
      const updated = prev.filter(d => d.id !== id);
      localStorage.setItem(`pid_diagram_list_${role}`, JSON.stringify(updated));
      
      localStorage.removeItem(`pid_flow_${id}`);
      
      if (updated.length === 0) {
        const newId = generateId();
        const newDiagram = { id: newId, name: 'default_diagram', updatedAt: Date.now() };
        const newList = [newDiagram];
        localStorage.setItem(`pid_diagram_list_${role}`, JSON.stringify(newList));
        
        setActiveDiagramId(newId);
        localStorage.setItem(`pid_active_diagram_${role}`, newId);
        localStorage.setItem(`pid_flow_${newId}`, JSON.stringify({ nodes: [], edges: [] }));
        
        setNodes([]);
        setEdges([]);
        setSavedStateStr(cleanFlow([], []));
        setPast([]);
        setFuture([]);
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
        
        return newList;
      } else if (activeDiagramId === id) {
        const fallbackId = updated[0].id;
        setActiveDiagramId(fallbackId);
        localStorage.setItem(`pid_active_diagram_${role}`, fallbackId);
        
        const content = loadDiagramContent(fallbackId);
        setNodes(content.nodes || []);
        setEdges(content.edges || []);
        setSavedStateStr(cleanFlow(content.nodes, content.edges));
        setPast([]);
        setFuture([]);
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
      }
      
      return updated;
    });
  }, [activeDiagramId, role]);

  const restoreFlow = useCallback(() => {
    if (!activeDiagramId) return;
    const content = loadDiagramContent(activeDiagramId);
    setNodes(content.nodes || []);
    setEdges(content.edges || []);
    setSavedStateStr(cleanFlow(content.nodes, content.edges));
    setPast([]);
    setFuture([]);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, [activeDiagramId]);

  const clearFlow = useCallback(() => {
    pushHistory();
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, [pushHistory]);

  const value = {
    diagrams,
    activeDiagramId,
    createNewDiagram,
    switchDiagram,
    renameDiagram,
    deleteDiagram,
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
    deleteMultiple,
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
    isDirty,
    setNodes
  };

  return <PIDContext.Provider value={value}>{children}</PIDContext.Provider>;
};

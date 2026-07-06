import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import { useLocation } from 'react-router-dom';
import { Box, IconButton, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  ORIGINAL_POSITIONS,
  selectVisibility,
  setWidgetVisibility,
} from '../../../features/widgetVisibility/widgetVisibilitySlice';
import { selectIsEditMode, setIsDirty } from '../../../features/ui/uiSlice';
import { loadLayout, saveLayout } from '../../../utils/layoutStorage';

const BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480 };
const COLS = { lg: 12, md: 12, sm: 6, xs: 4 };
const DROPPING_ITEM_ID = '__dropping_widget__';
const GRID_MARGIN = [16, 12];
const EDIT_BOARD_ROWS = 12;
const MIN_EDIT_ROW_HEIGHT = 34;
const MAX_EDIT_ROW_HEIGHT = 58;
const MIN_ROW_HEIGHT = 44;
const MAX_ROW_HEIGHT = 64;
const ResponsiveGridLayout = WidthProvider(Responsive);

const DEFAULT_PRESET_POSITIONS = {
  kpiGrid: { x: 0, y: 0, w: 12, h: 3 },
  cpuChart: { x: 0, y: 3, w: 4, h: 3 },
  networkChart: { x: 4, y: 3, w: 4, h: 3 },
  deviceStatusChart: { x: 8, y: 3, w: 4, h: 3 },
  alertsCard: { x: 0, y: 6, w: 4, h: 2 },
  systemSummary: { x: 4, y: 6, w: 4, h: 2 },
  resourceUsage: { x: 8, y: 6, w: 4, h: 4 },
  devicesTable: { x: 0, y: 8, w: 8, h: 3 },
};

const createInstanceId = (type) =>
  `widget-${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const createDefaultInstanceId = (type) => `widget-${type}-default`;

const getAvailableTypes = (widgets = []) =>
  widgets.map((widget) => widget.id).filter((id) => ORIGINAL_POSITIONS[id]);

const createDefaultInstances = (types = Object.keys(ORIGINAL_POSITIONS)) =>
  types.map((type) => ({ id: createDefaultInstanceId(type), type }));

const getDefaultPosition = (type) => ({
  ...(ORIGINAL_POSITIONS[type] || {}),
  ...(DEFAULT_PRESET_POSITIONS[type] || {}),
});

const createLayoutItem = (instance) => {
  const original = getDefaultPosition(instance.type);
  const minW = original.minW ?? 1;
  const minH = original.minH ?? 1;
  const maxW = original.maxW ?? 12;
  const maxH = original.maxH ?? 12;

  return {
    i: instance.id,
    x: original.x ?? 0,
    y: original.y ?? 0,
    w: original.w ?? 4,
    h: original.h ?? 4,
    minW,
    minH,
    maxW,
    maxH,
  };
};

const createDefaultLayouts = (instances) => {
  const items = instances.map(createLayoutItem);
  return {
    lg: items,
    md: items.map((item) => fitItemToBreakpoint(item, 'md')),
    sm: items.map((item) => fitItemToBreakpoint(item, 'sm')),
    xs: items.map((item) => fitItemToBreakpoint(item, 'xs')),
  };
};

const createDefaultDashboardState = (types) => {
  const widgets = createDefaultInstances(types);
  return {
    widgets,
    layouts: createDefaultLayouts(widgets),
  };
};

const getInstanceTypeMap = (instances = []) =>
  instances.reduce((acc, instance) => {
    acc[instance.id] = instance.type;
    return acc;
  }, {});

const sanitizeLayoutItems = (items = [], instances = []) => {
  const instanceTypeMap = getInstanceTypeMap(instances);
  const safeItems = Array.isArray(items) ? items : [];

  return safeItems
    .filter((item) => item.i !== DROPPING_ITEM_ID && instanceTypeMap[item.i])
    .map((item) => {
      const type = instanceTypeMap[item.i];
      const original = ORIGINAL_POSITIONS[type] || {};
      const minW = original.minW ?? item.minW ?? 1;
      const minH = original.minH ?? item.minH ?? 1;
      const maxW = original.maxW ?? item.maxW ?? 12;
      const maxH = original.maxH ?? item.maxH ?? 12;
      const nextW = Number.isFinite(item.w) ? item.w : original.w ?? 4;
      const nextH = Number.isFinite(item.h) ? item.h : original.h ?? 4;
      const h = Math.max(minH, Math.min(nextH, maxH, EDIT_BOARD_ROWS));

      return {
        i: item.i,
        x: Number.isFinite(item.x) ? item.x : original.x ?? 0,
        y: Math.max(
          0,
          Math.min(
            Number.isFinite(item.y) ? item.y : original.y ?? 0,
            Math.max(EDIT_BOARD_ROWS - h, 0),
          ),
        ),
        w: Math.max(minW, Math.min(nextW, maxW)),
        h,
        minW,
        minH,
        maxW,
        maxH,
      };
    });
};

const sanitizeLayouts = (nextLayouts, instances = []) => {
  if (!nextLayouts) return null;

  return Object.keys(COLS).reduce((acc, key) => {
    acc[key] = sanitizeLayoutItems(nextLayouts[key], instances);
    return acc;
  }, {});
};

const fitItemToBreakpoint = (item, breakpoint) => {
  const cols = COLS[breakpoint] || COLS.lg;
  const maxW = Math.min(item.maxW ?? cols, cols);
  const width = Math.min(item.w, maxW);

  return {
    ...item,
    x: Math.max(0, Math.min(item.x, Math.max(cols - width, 0))),
    w: width,
    minW: Math.min(item.minW || 1, width),
    maxW,
  };
};

const ensureLayoutsForInstances = (layouts, instances) =>
  Object.keys(COLS).reduce((acc, key) => {
    const items = layouts?.[key] || [];
    const missingItems = instances
      .filter((instance) => !items.some((item) => item.i === instance.id))
      .map((instance) => fitItemToBreakpoint(createLayoutItem(instance), key));

    acc[key] = [...items, ...missingItems];
    return acc;
  }, {});

const normalizeStoredDashboardState = (storedState, availableTypes) => {
  const defaultState = createDefaultDashboardState(availableTypes);
  if (!storedState) return defaultState;

  if (storedState.widgets && storedState.layouts) {
    const widgets = storedState.widgets
      .filter((instance) => availableTypes.includes(instance.type))
      .map((instance) => ({ id: instance.id, type: instance.type }));

    if (!widgets.length) return defaultState;

    const layouts = ensureLayoutsForInstances(
      sanitizeLayouts(storedState.layouts, widgets) || createDefaultLayouts(widgets),
      widgets,
    );
    return { widgets, layouts };
  }

  const oldLayoutIds = Array.from(
    new Set(
      Object.values(storedState || {})
        .flat()
        .map((item) => item?.i)
        .filter((id) => availableTypes.includes(id)),
    ),
  );

  if (!oldLayoutIds.length) return defaultState;

  const widgets = oldLayoutIds.map((type) => ({
    id: createDefaultInstanceId(type),
    type,
  }));

  const migratedLayouts = Object.keys(COLS).reduce((acc, key) => {
    acc[key] = (storedState[key] || []).map((item) => {
      const instance = widgets.find((widget) => widget.type === item.i);
      return instance ? { ...item, i: instance.id } : item;
    });
    return acc;
  }, {});

  return {
    widgets,
    layouts: ensureLayoutsForInstances(
      sanitizeLayouts(migratedLayouts, widgets) || createDefaultLayouts(widgets),
      widgets,
    ),
  };
};

const removeInstanceFromLayouts = (layouts, instanceId) =>
  Object.keys(COLS).reduce((acc, key) => {
    acc[key] = (layouts[key] || []).filter((item) => item.i !== instanceId);
    return acc;
  }, {});

const areDashboardStatesEqual = (firstState, secondState) =>
  JSON.stringify(firstState) === JSON.stringify(secondState);

const areLayoutsEqual = (firstLayouts, secondLayouts) =>
  JSON.stringify(firstLayouts) === JSON.stringify(secondLayouts);

const hasDroppingItem = (nextLayouts) =>
  Object.values(nextLayouts || {}).some((items = []) =>
    items.some((item) => item.i === DROPPING_ITEM_ID),
  );

const getLayoutRows = (items = []) =>
  items.reduce((max, item) => Math.max(max, (item.y || 0) + (item.h || 1)), 1);

const getAvailableGridHeight = (container, isEditMode) => {
  if (!container) return 0;
  const containerHeight = container.clientHeight || 0;
  const rect = container.getBoundingClientRect();
  const viewportHeight = window.innerHeight || 0;
  const viewportSpace = rect?.top ? viewportHeight - rect.top : 0;

  return Math.max(containerHeight, viewportSpace, 0);
};

const calculateRowHeight = (container, layouts, isEditMode) => {
  if (isEditMode) {
    const availableHeight = getAvailableGridHeight(container, isEditMode);
    const verticalMargins = Math.max(EDIT_BOARD_ROWS - 1, 0) * GRID_MARGIN[1];
    const nextRowHeight = Math.floor((availableHeight - verticalMargins) / EDIT_BOARD_ROWS);

    return Math.max(
      MIN_EDIT_ROW_HEIGHT,
      Math.min(MAX_EDIT_ROW_HEIGHT, Number.isFinite(nextRowHeight) ? nextRowHeight : MAX_EDIT_ROW_HEIGHT),
    );
  }

  const availableHeight = getAvailableGridHeight(container, isEditMode);
  const rows = getLayoutRows(layouts?.lg);
  const verticalMargins = Math.max(rows - 1, 0) * GRID_MARGIN[1];
  const nextRowHeight = Math.floor((availableHeight - verticalMargins) / rows);

  return Math.max(
    MIN_ROW_HEIGHT,
    Math.min(MAX_ROW_HEIGHT, Number.isFinite(nextRowHeight) ? nextRowHeight : MAX_ROW_HEIGHT),
  );
};

const scheduleChartResize = () => {
  window.requestAnimationFrame(() => {
    window.dispatchEvent(new Event('resize'));
  });
  window.setTimeout(() => window.dispatchEvent(new Event('resize')), 120);
  window.setTimeout(() => window.dispatchEvent(new Event('resize')), 280);
};

const GridItemWrapper = React.forwardRef(function GridItemWrapper(
  { instanceId, isEditMode, onRemove, children, style, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      style={{ ...style, display: 'flex', flexDirection: 'column' }}
      className={className}
      {...rest}
    >
      <Box
        className="widget-drag-handle drag-handle"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: isEditMode ? 1.5 : 0,
          py: isEditMode ? 0.5 : 0,
          cursor: isEditMode ? 'grab' : 'default',
          userSelect: 'none',
          flexShrink: 0,
          height: isEditMode ? 32 : 4,
          bgcolor: isEditMode ? 'action.hover' : 'transparent',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          borderBottom: isEditMode ? '1px solid' : 'none',
          borderColor: 'divider',
          overflow: 'hidden',
          transition: 'height 0.2s ease, background-color 0.2s ease',
          '&:active': { cursor: isEditMode ? 'grabbing' : 'default' },
        }}
      >
        {isEditMode && (
          <>
            <DragIndicatorIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
            <IconButton
              size="small"
              onMouseDown={(event) => event.stopPropagation()}
              onClick={() => onRemove?.(instanceId)}
              sx={{ p: 0.3, opacity: 0.6, '&:hover': { opacity: 1 } }}
            >
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </>
        )}
      </Box>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          mb: isEditMode ? '8px' : 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 1,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {children}
      </Box>
    </div>
  );
});

export default function DraggableGrid({ widgets = [] }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const location = useLocation();
  const dispatch = useAppDispatch();
  const visibility = useAppSelector(selectVisibility);
  const isEditMode = useAppSelector(selectIsEditMode) || location.pathname.includes('settings');
  const role = useAppSelector((state) => state.auth.role);
  const containerRef = useRef(null);
  const droppingWidgetTypeRef = useRef(null);
  const availableTypes = useMemo(() => getAvailableTypes(widgets), [widgets]);
  const availableTypesKey = availableTypes.join('|');
  const [savedState, setSavedState] = useState(() =>
    normalizeStoredDashboardState(loadLayout(role), availableTypes),
  );
  const [draftState, setDraftState] = useState(savedState);
  const [rowHeight, setRowHeight] = useState(MAX_ROW_HEIGHT);
  const [droppingItem, setDroppingItem] = useState({
    i: DROPPING_ITEM_ID,
    w: 4,
    h: 4,
  });
  const [activeDropType, setActiveDropType] = useState(null);
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');

  const widgetMap = useMemo(() => {
    return widgets.reduce((acc, widget) => {
      acc[widget.id] = widget;
      return acc;
    }, {});
  }, [widgets]);

  const renderedWidgets = useMemo(
    () => draftState.widgets.filter((instance) => widgetMap[instance.type]),
    [draftState.widgets, widgetMap],
  );
  const layoutRows = useMemo(() => getLayoutRows(draftState.layouts.lg), [draftState.layouts.lg]);

  useEffect(() => {
    const handleDragStart = (event) => {
      const type = event.detail?.widgetId;
      droppingWidgetTypeRef.current = type || null;
      setActiveDropType(type || null);

      if (type && ORIGINAL_POSITIONS[type]) {
        const { w, h } = ORIGINAL_POSITIONS[type];
        setDroppingItem({ i: DROPPING_ITEM_ID, w, h });
      } else {
        setDroppingItem({ i: DROPPING_ITEM_ID, w: 4, h: 4 });
      }
    };
    const handleDragEnd = () => {
      droppingWidgetTypeRef.current = null;
      setActiveDropType(null);
      setDroppingItem({ i: DROPPING_ITEM_ID, w: 4, h: 4 });
    };

    window.addEventListener('rgl:dragstart', handleDragStart);
    window.addEventListener('rgl:dragend', handleDragEnd);
    window.addEventListener('dragend', handleDragEnd);
    return () => {
      window.removeEventListener('rgl:dragstart', handleDragStart);
      window.removeEventListener('rgl:dragend', handleDragEnd);
      window.removeEventListener('dragend', handleDragEnd);
    };
  }, []);

  useEffect(() => {
    const handleResetLayout = () => {
      const defaultState = createDefaultDashboardState(availableTypes);
      setSavedState(defaultState);
      setDraftState(defaultState);
      dispatch(setIsDirty(false));
      scheduleChartResize();
    };

    window.addEventListener('dashboard:reset-layout', handleResetLayout);
    return () => window.removeEventListener('dashboard:reset-layout', handleResetLayout);
  }, [availableTypes, dispatch]);

  useEffect(() => {
    const nextState = normalizeStoredDashboardState(loadLayout(role), availableTypes);
    setSavedState(nextState);
    setDraftState(nextState);
    dispatch(setIsDirty(false));
    scheduleChartResize();
  }, [availableTypesKey, dispatch, role]);

  useEffect(() => {
    setDraftState((currentState) => {
      const nextWidgets = currentState.widgets.filter(
        (instance) => visibility[instance.type] && availableTypes.includes(instance.type),
      );
      const existingTypes = new Set(nextWidgets.map((instance) => instance.type));

      availableTypes.forEach((type) => {
        if (visibility[type] && !existingTypes.has(type)) {
          nextWidgets.push({ id: createInstanceId(type), type });
          existingTypes.add(type);
        }
      });

      if (
        nextWidgets.length === currentState.widgets.length &&
        nextWidgets.every((instance, index) => instance.id === currentState.widgets[index]?.id)
      ) {
        return currentState;
      }

      const nextIds = new Set(nextWidgets.map((instance) => instance.id));
      const nextLayouts = Object.keys(COLS).reduce((acc, key) => {
        const existingItems = (currentState.layouts[key] || []).filter((item) => nextIds.has(item.i));
        const missingItems = nextWidgets
          .filter((instance) => !existingItems.some((item) => item.i === instance.id))
          .map((instance) => fitItemToBreakpoint(createLayoutItem(instance), key));
        acc[key] = [...existingItems, ...missingItems];
        return acc;
      }, {});

      return { widgets: nextWidgets, layouts: nextLayouts };
    });
  }, [availableTypes, visibility]);

  useEffect(() => {
    dispatch(setIsDirty(!areDashboardStatesEqual(savedState, draftState)));
  }, [dispatch, savedState, draftState]);

  useEffect(() => {
    const handleSaveLayout = () => {
      setSavedState(draftState);
      saveLayout(draftState, role);
      dispatch(setIsDirty(false));
    };

    const handleCancelLayout = () => {
      setDraftState(savedState);
      dispatch(setIsDirty(false));
      scheduleChartResize();
    };

    window.addEventListener('save-layout', handleSaveLayout);
    window.addEventListener('cancel-layout', handleCancelLayout);

    return () => {
      window.removeEventListener('save-layout', handleSaveLayout);
      window.removeEventListener('cancel-layout', handleCancelLayout);
    };
  }, [dispatch, draftState, role, savedState]);

  useEffect(() => {
    if (!isDesktop || !containerRef.current) return undefined;

    const updateRowHeight = () => {
      const nextRowHeight = calculateRowHeight(containerRef.current, draftState.layouts, isEditMode);
      setRowHeight((currentRowHeight) =>
        currentRowHeight === nextRowHeight ? currentRowHeight : nextRowHeight,
      );
    };

    updateRowHeight();
    window.addEventListener('resize', updateRowHeight);

    return () => {
      window.removeEventListener('resize', updateRowHeight);
    };
  }, [containerRef, isDesktop, isEditMode, layoutRows]);

  const handleLayoutChange = useCallback((_currentLayout, allLayouts) => {
    if (!isEditMode) return;

    if (hasDroppingItem(allLayouts)) {
      return;
    }

    setDraftState((currentState) => {
      const nextLayouts = sanitizeLayouts(allLayouts, currentState.widgets) || currentState.layouts;
      if (areLayoutsEqual(nextLayouts, currentState.layouts)) {
        return currentState;
      }

      return {
        ...currentState,
        layouts: nextLayouts,
      };
    });
  }, [isEditMode]);

  const handleInteractionStop = useCallback((layout) => {
    if (isEditMode && Array.isArray(layout)) {
      setDraftState((currentState) => {
        const nextLayouts = {
          ...currentState.layouts,
          [currentBreakpoint]: sanitizeLayoutItems(layout, currentState.widgets),
        };

        if (areLayoutsEqual(nextLayouts, currentState.layouts)) {
          return currentState;
        }

        return {
          ...currentState,
          layouts: nextLayouts,
        };
      });
    }
  }, [currentBreakpoint, isEditMode]);

  const handleRemove = useCallback((instanceId) => {
    setDraftState((currentState) => {
      const removedInstance = currentState.widgets.find((instance) => instance.id === instanceId);
      const nextWidgets = currentState.widgets.filter((instance) => instance.id !== instanceId);
      const nextLayouts = removeInstanceFromLayouts(currentState.layouts, instanceId);

      if (removedInstance) {
        dispatch(setWidgetVisibility({ id: removedInstance.type, visible: false, role }));
      }

      return { widgets: nextWidgets, layouts: nextLayouts };
    });
    scheduleChartResize();
  }, [dispatch, role]);

  const onDrop = useCallback((layout, layoutItem, event) => {
    const eventWidgetType = event?.dataTransfer?.getData('text/plain');
    const widgetType = droppingWidgetTypeRef.current || eventWidgetType;
    droppingWidgetTypeRef.current = null;
    setActiveDropType(null);
    setDroppingItem({ i: DROPPING_ITEM_ID, w: 4, h: 4 });
    if (!widgetType || !ORIGINAL_POSITIONS[widgetType] || !widgetMap[widgetType]) return;

    setDraftState((currentState) => {
      if (currentState.widgets.some((instance) => instance.type === widgetType)) {
        return currentState;
      }

      const newInstance = { id: createInstanceId(widgetType), type: widgetType };
      const original = ORIGINAL_POSITIONS[widgetType] || {};
      const newItem = {
        i: newInstance.id,
        x: layoutItem.x,
        y: layoutItem.y,
        w: original.w ?? 4,
        h: original.h ?? 4,
        minW: original.minW ?? 2,
        minH: original.minH ?? 2,
        maxW: original.maxW ?? 12,
        maxH: original.maxH ?? 12,
      };
      const nextWidgets = [...currentState.widgets, newInstance];
      const updatedLayouts = sanitizeLayouts(currentState.layouts, currentState.widgets) || createDefaultLayouts(currentState.widgets);
      const resolvedLayout = sanitizeLayoutItems(layout, currentState.widgets);

      Object.keys(COLS).forEach((key) => {
        const baseLayout = key === 'lg'
          ? resolvedLayout
          : (updatedLayouts[key] || []);
        updatedLayouts[key] = [
          ...baseLayout.filter((item) => item.i !== DROPPING_ITEM_ID),
          fitItemToBreakpoint(newItem, key),
        ];
      });

      return { widgets: nextWidgets, layouts: updatedLayouts };
    });

    dispatch(setWidgetVisibility({ id: widgetType, visible: true, role }));
    scheduleChartResize();
  }, [dispatch, role, widgetMap]);

  if (!isDesktop && !isEditMode) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        {renderedWidgets.map(({ id, type }) => (
          <Box key={id} sx={{ minWidth: 0 }}>
            {isEditMode && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  px: 1.5,
                  py: 0.5,
                  bgcolor: 'background.paper',
                  borderTopLeftRadius: 2,
                  borderTopRightRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderBottom: 0,
                }}
              >
                <IconButton size="small" onClick={() => handleRemove(id)} sx={{ p: 0.3 }}>
                  <CloseIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Box>
            )}
            <Box
              sx={{
                minWidth: 0,
                overflow: { xs: 'visible', lg: 'hidden' },
                bgcolor: 'background.paper',
                borderTopLeftRadius: isEditMode ? 0 : 2,
                borderTopRightRadius: isEditMode ? 0 : 2,
                borderBottomLeftRadius: 2,
                borderBottomRightRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                '& > *': {
                  minWidth: 0,
                },
              }}
            >
              {widgetMap[type]?.children}
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        flex: { xs: '0 0 auto', lg: 1 },
        height: { xs: 'auto', lg: '100%' },
        minHeight: { xs: 'auto', lg: 0 },
        overflowX: 'hidden',
        overflowY: 'hidden',
        border: isEditMode ? '1px solid' : 0,
        borderColor: 'divider',
        borderRadius: isEditMode ? 2 : 0,
        bgcolor: isEditMode ? 'rgba(15, 23, 42, 0.025)' : 'transparent',
        boxShadow: isEditMode ? 'inset 0 0 0 1px rgba(148, 163, 184, 0.16)' : 'none',
        px: isEditMode ? 1.5 : 0,
        pt: isEditMode ? 1.5 : 0,
        '& .react-grid-item.react-grid-placeholder': {
          bgcolor: 'primary.main',
          opacity: 0.08,
          border: '1px dashed',
          borderColor: 'primary.main',
          borderRadius: 2,
        },
      }}
    >
      <ResponsiveGridLayout
        key={role}
        className={`layout smart-snap-grid ${isEditMode ? 'is-editing' : ''} ${activeDropType ? 'has-external-drop' : ''}`}
        layouts={draftState.layouts}
        breakpoints={BREAKPOINTS}
        cols={COLS}
        measureBeforeMount={false}
        useCSSTransforms={true}
        rowHeight={rowHeight}
        margin={GRID_MARGIN}
        containerPadding={[0, 0]}
        compactType="vertical"
        preventCollision={false}
        allowOverlap={false}
        isBounded={isEditMode}
        maxRows={isEditMode ? EDIT_BOARD_ROWS : 100}
        draggableHandle=".widget-drag-handle"
        draggableCancel=".react-resizable-handle,button,.MuiIconButton-root"
        isResizable={isEditMode}
        isDraggable={isEditMode}
        isDroppable={isEditMode && Boolean(activeDropType)}
        resizeHandles={['se', 's', 'e']}
        droppingItem={droppingItem}
        onDrop={onDrop}
        onLayoutChange={handleLayoutChange}
        onBreakpointChange={setCurrentBreakpoint}
        onDragStop={handleInteractionStop}
        onResizeStop={handleInteractionStop}
        style={{ height: isEditMode ? '100%' : undefined, minHeight: isEditMode ? undefined : '100%' }}
      >
        {renderedWidgets.map(({ id, type }) => (
          <GridItemWrapper
            key={id}
            instanceId={id}
            isEditMode={isEditMode}
            onRemove={handleRemove}
          >
            {widgetMap[type]?.children}
          </GridItemWrapper>
        ))}
      </ResponsiveGridLayout>
    </Box>
  );
}

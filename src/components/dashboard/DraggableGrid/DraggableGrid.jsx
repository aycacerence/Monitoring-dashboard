import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import { Box, IconButton, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  ORIGINAL_POSITIONS,
  selectVisibility,
  setWidgetVisibility,
} from '../../../features/widgetVisibility/widgetVisibilitySlice';
import { setIsDirty } from '../../../features/ui/uiSlice';
import { loadLayout, saveLayout } from '../../../utils/layoutStorage';

const BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480 };
const COLS = { lg: 12, md: 12, sm: 6, xs: 4 };
const DROPPING_ITEM_ID = '__dropping_widget__';
const GRID_MARGIN = [16, 12];
const MIN_ROW_HEIGHT = 44;
const MAX_ROW_HEIGHT = 64;
const ResponsiveGridLayout = WidthProvider(Responsive);

const createDefaultLayoutItems = () =>
  Object.entries(ORIGINAL_POSITIONS).map(([id, position]) => ({
    i: id,
    ...position,
  }));

const createDefaultLayouts = () => {
  return {
    lg: createDefaultLayoutItems(),
    md: createDefaultLayoutItems(),
    sm: createDefaultLayoutItems(),
    xs: createDefaultLayoutItems(),
  };
};

const buildDefaultLayouts = createDefaultLayouts;

const sanitizeLayoutItems = (items = []) => {
  const safeItems = Array.isArray(items) ? items : [];
  return safeItems
    .filter((item) => item.i !== DROPPING_ITEM_ID && ORIGINAL_POSITIONS[item.i])
    .map((item) => {
      const original = ORIGINAL_POSITIONS[item.i];
      const minW = original.minW || 1;
      const minH = original.minH || 1;
      const {
        static: _static,
        isDraggable: _isDraggable,
        isResizable: _isResizable,
        resizeHandles: _resizeHandles,
        ...safeItem
      } = item;

      return {
        ...safeItem,
        x: Number.isFinite(item.x) ? item.x : original.x,
        y: Number.isFinite(item.y) ? item.y : original.y,
        w: Number.isFinite(item.w) && item.w >= minW ? item.w : original.w,
        h: Number.isFinite(item.h) && item.h >= minH ? item.h : original.h,
        minW,
        minH,
      };
    });
};

const sanitizeLayouts = (nextLayouts) => {
  if (!nextLayouts) return null;

  return Object.entries(nextLayouts).reduce((acc, [key, value]) => {
    acc[key] = sanitizeLayoutItems(value);
    return acc;
  }, {});
};

const cleanLayouts = sanitizeLayouts;

const areLayoutsEqual = (firstLayouts, secondLayouts) =>
  JSON.stringify(firstLayouts) === JSON.stringify(secondLayouts);

const hasDroppingItem = (nextLayouts) =>
  Object.values(nextLayouts || {}).some((items = []) =>
    items.some((item) => item.i === DROPPING_ITEM_ID),
  );

const getBreakpointLayoutsWithItem = (currentLayouts, nextItem) => {
  const source = sanitizeLayouts(currentLayouts) || createDefaultLayouts();
  return Object.entries(source).reduce((acc, [key, items]) => {
    acc[key] = (items || []).map((item) =>
      item.i === nextItem.i
        ? {
            ...item,
            x: nextItem.x,
            y: nextItem.y,
            w: nextItem.w,
            h: nextItem.h,
            minW: nextItem.minW || item.minW,
            minH: nextItem.minH || item.minH,
          }
        : item,
    );
    return acc;
  }, {});
};

const fitItemToBreakpoint = (item, breakpoint) => {
  const cols = COLS[breakpoint] || COLS.lg;
  const width = Math.min(item.w, cols);
  return {
    ...item,
    x: Math.max(0, Math.min(item.x, Math.max(cols - width, 0))),
    w: width,
    minW: Math.min(item.minW || 1, width),
  };
};

const getLayoutRows = (items = []) =>
  items.reduce((max, item) => Math.max(max, (item.y || 0) + (item.h || 1)), 1);

const scheduleChartResize = () => {
  window.requestAnimationFrame(() => {
    window.dispatchEvent(new Event('resize'));
  });
  window.setTimeout(() => window.dispatchEvent(new Event('resize')), 120);
  window.setTimeout(() => window.dispatchEvent(new Event('resize')), 280);
};

const GridItemWrapper = React.forwardRef(function GridItemWrapper(
  { widgetId, isEditMode, onRemove, children, style, className, ...rest }, ref
) {
  return (
    <div
      ref={ref}
      style={{ ...style, display: 'flex', flexDirection: 'column' }}
      className={className}
      {...rest}
    >
      {isEditMode && (
        <Box className="drag-handle" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.5, py: 0.5, cursor: 'grab', userSelect: 'none', flexShrink: 0, bgcolor: 'background.paper', borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottom: '1px solid', borderColor: 'divider', '&:active': { cursor: 'grabbing' }}}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <DragIndicatorIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
          </Box>
          <IconButton size="small" onMouseDown={(e) => e.stopPropagation()} onClick={() => onRemove(widgetId)} sx={{ p: 0.3 }}>
            <CloseIcon sx={{ fontSize: 15 }} />
          </IconButton>
        </Box>
      )}
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden', bgcolor: 'background.paper', borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
        {children}
      </Box>
    </div>
  );
});

export default function DraggableGrid({ widgets = [], isEditMode = false }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const dispatch = useAppDispatch();
  const visibility = useAppSelector(selectVisibility);
  const role = useAppSelector((state) => state.auth.role);
  const containerRef = useRef(null);
  const droppingWidgetIdRef = useRef(null);
  const pendingLayoutsRef = useRef(null);
  const isInteractingRef = useRef(false);
  const layoutFrameRef = useRef(null);
  const [savedLayouts, setSavedLayouts] = useState(
    () => cleanLayouts(loadLayout(role)) ?? buildDefaultLayouts(),
  );
  const [draftLayouts, setDraftLayouts] = useState(savedLayouts);
  const [rowHeight, setRowHeight] = useState(MAX_ROW_HEIGHT);

  const widgetMap = useMemo(() => {
    return widgets.reduce((acc, widget) => {
      acc[widget.id] = widget;
      return acc;
    }, {});
  }, [widgets]);

  useEffect(() => {
    const handleDragStart = (event) => {
      droppingWidgetIdRef.current = event.detail?.widgetId || null;
    };

    window.addEventListener('rgl:dragstart', handleDragStart);
    return () => window.removeEventListener('rgl:dragstart', handleDragStart);
  }, []);

  useEffect(() => {
    const handleResetLayout = () => {
      const defaultLayouts = buildDefaultLayouts();
      setDraftLayouts(defaultLayouts);
      scheduleChartResize();
    };

    window.addEventListener('dashboard:reset-layout', handleResetLayout);
    return () => window.removeEventListener('dashboard:reset-layout', handleResetLayout);
  }, []);

  useEffect(() => {
    const saved = cleanLayouts(loadLayout(role)) ?? buildDefaultLayouts();
    pendingLayoutsRef.current = null;
    isInteractingRef.current = false;
    if (layoutFrameRef.current) {
      window.cancelAnimationFrame(layoutFrameRef.current);
      layoutFrameRef.current = null;
    }
    setSavedLayouts(saved);
    setDraftLayouts(saved);
    dispatch(setIsDirty(false));
    scheduleChartResize();
  }, [dispatch, role]);

  useEffect(() => {
    dispatch(setIsDirty(!areLayoutsEqual(savedLayouts, draftLayouts)));
  }, [dispatch, savedLayouts, draftLayouts]);

  useEffect(() => {
    const handleSaveLayout = () => {
      setSavedLayouts(draftLayouts);
      saveLayout(draftLayouts, role);
      dispatch(setIsDirty(false));
    };

    const handleCancelLayout = () => {
      setDraftLayouts(savedLayouts);
      dispatch(setIsDirty(false));
      scheduleChartResize();
    };

    window.addEventListener('save-layout', handleSaveLayout);
    window.addEventListener('cancel-layout', handleCancelLayout);

    return () => {
      window.removeEventListener('save-layout', handleSaveLayout);
      window.removeEventListener('cancel-layout', handleCancelLayout);
    };
  }, [dispatch, draftLayouts, role, savedLayouts]);

  useEffect(() => {
    if (!isDesktop || !containerRef.current) return undefined;
    if (isEditMode) return undefined;

    const calculateRowHeight = () => {
      const availableHeight = containerRef.current?.clientHeight || 0;
      const rows = getLayoutRows(draftLayouts.lg);
      const verticalMargins = Math.max(rows - 1, 0) * GRID_MARGIN[1];
      const nextRowHeight = Math.floor((availableHeight - verticalMargins) / rows);
      setRowHeight(Math.max(MIN_ROW_HEIGHT, Math.min(MAX_ROW_HEIGHT, nextRowHeight || MAX_ROW_HEIGHT)));
      scheduleChartResize();
    };

    calculateRowHeight();
    const resizeObserver = new ResizeObserver(calculateRowHeight);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [containerRef, isDesktop, isEditMode, draftLayouts.lg]);

  const queueLiveLayouts = useCallback((nextLayouts) => {
    pendingLayoutsRef.current = nextLayouts;
    if (layoutFrameRef.current) return;

    layoutFrameRef.current = window.requestAnimationFrame(() => {
      layoutFrameRef.current = null;
      if (pendingLayoutsRef.current) {
        setDraftLayouts(pendingLayoutsRef.current);
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      if (layoutFrameRef.current) {
        window.cancelAnimationFrame(layoutFrameRef.current);
      }
    };
  }, []);

  const handleLayoutChange = useCallback((_currentLayout, allLayouts) => {
    if (!isEditMode) return;

    if (hasDroppingItem(allLayouts)) {
      return;
    }

    const sanitized = cleanLayouts(allLayouts) ?? buildDefaultLayouts();
    setDraftLayouts(sanitized);
  }, [isEditMode]);

  const handleInteractionStart = useCallback(() => {
    isInteractingRef.current = true;
    pendingLayoutsRef.current = draftLayouts;
  }, [draftLayouts]);

  const handleInteractionStop = useCallback(() => {
    isInteractingRef.current = false;
    if (layoutFrameRef.current) {
      window.cancelAnimationFrame(layoutFrameRef.current);
      layoutFrameRef.current = null;
    }
    if (pendingLayoutsRef.current) {
      setDraftLayouts(pendingLayoutsRef.current);
    }
    scheduleChartResize();
  }, []);

  const handleResize = useCallback((_layout, _oldItem, newItem) => {
    if (!isEditMode || !newItem?.i || newItem.i === DROPPING_ITEM_ID) return;

    const sanitizedItem = sanitizeLayoutItems([newItem])[0];
    if (!sanitizedItem) return;

    const resizedLayouts = getBreakpointLayoutsWithItem(draftLayouts, sanitizedItem);
    queueLiveLayouts(resizedLayouts);
  }, [isEditMode, draftLayouts, queueLiveLayouts]);

  const handleRemove = useCallback((widgetId) => {
    const updated = { ...draftLayouts };
    Object.keys(updated).forEach((key) => {
      updated[key] = (updated[key] || []).filter((item) => item.i !== widgetId);
    });

    setDraftLayouts(updated);
    dispatch(setWidgetVisibility({ id: widgetId, visible: false, role }));
    scheduleChartResize();
  }, [dispatch, draftLayouts, role]);

  const onDrop = useCallback((layout, layoutItem, event) => {
    const eventWidgetId = event?.dataTransfer?.getData('text/plain');
    const widgetId = droppingWidgetIdRef.current || eventWidgetId;
    if (!widgetId || !ORIGINAL_POSITIONS[widgetId]) return;
    droppingWidgetIdRef.current = null;

    const original = ORIGINAL_POSITIONS[widgetId] || { x: 0, y: 99, w: 4, h: 4 };
    const newItem = {
      i: widgetId,
      x: Number.isFinite(layoutItem?.x) ? layoutItem.x : original.x,
      y: Number.isFinite(layoutItem?.y) ? layoutItem.y : original.y,
      w: original.w,
      h: original.h,
      minW: original.minW || 2,
      minH: original.minH || 2,
    };

    setDraftLayouts((currentLayouts) => {
      const updated = cleanLayouts(currentLayouts) ?? buildDefaultLayouts();
      const resolvedLayout = sanitizeLayoutItems(layout).filter(item => item.i !== widgetId);
      Object.keys(COLS).forEach((key) => {
        const baseLayout = key === 'lg'
          ? resolvedLayout
          : (updated[key] || []).filter(item => item.i !== widgetId);
        updated[key] = [...baseLayout, fitItemToBreakpoint(newItem, key)];
      });
      return updated;
    });

    dispatch(setWidgetVisibility({ id: widgetId, visible: true, role }));
    scheduleChartResize();
  }, [dispatch, role]);

  const visibleWidgets = widgets.filter((widget) => visibility[widget.id]);

  if (!isDesktop) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        {visibleWidgets.map(({ id, title, children }) => (
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
                <IconButton size="small" onClick={() => dispatch(setWidgetVisibility({ id, visible: false, role }))} sx={{ p: 0.3 }}>
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
              {children || widgetMap[id]?.children}
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
        overflowY: { xs: 'visible', lg: 'hidden' },
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
        className={`layout smart-snap-grid ${isEditMode ? 'is-editing' : ''}`}
        layouts={draftLayouts}
        breakpoints={BREAKPOINTS}
        cols={COLS}
        measureBeforeMount={false}
        rowHeight={rowHeight}
        margin={GRID_MARGIN}
        containerPadding={[0, 0]}
        compactType="vertical"
        preventCollision={false}
        allowOverlap={false}
        draggableHandle=".drag-handle"
        draggableCancel=".react-resizable-handle,button,.MuiIconButton-root"
        isResizable={isEditMode}
        isDraggable={isEditMode}
        isDroppable={isEditMode}
        resizeHandles={['se']}
        droppingItem={{ i: DROPPING_ITEM_ID, w: 4, h: 4 }}
        onDrop={onDrop}
        onLayoutChange={handleLayoutChange}
        onDragStart={handleInteractionStart}
        onResizeStart={handleInteractionStart}
        onResize={handleResize}
        onDragStop={handleInteractionStop}
        onResizeStop={handleInteractionStop}
        style={{ minHeight: '100%' }}
      >
        {visibleWidgets.map(({ id, children }) => (
          <GridItemWrapper
            key={id}
            widgetId={id}
            isEditMode={isEditMode}
            onRemove={handleRemove}
          >
            {children || widgetMap[id]?.children}
          </GridItemWrapper>
        ))}
      </ResponsiveGridLayout>
    </Box>
  );
}

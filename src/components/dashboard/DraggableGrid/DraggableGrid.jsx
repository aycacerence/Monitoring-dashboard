import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Responsive as ResponsiveGridLayout, useContainerWidth } from 'react-grid-layout';
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
import { loadLayout, saveLayout } from '../../../utils/layoutStorage';

const BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480 };
const COLS = { lg: 12, md: 12, sm: 6, xs: 4 };
const DROPPING_ITEM_ID = '__dropping_widget__';

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

const sanitizeLayoutItems = (items = []) =>
  items
    .filter((item) => item.i !== DROPPING_ITEM_ID && ORIGINAL_POSITIONS[item.i]);

const sanitizeLayouts = (nextLayouts) => {
  if (!nextLayouts) return null;

  return Object.entries(nextLayouts).reduce((acc, [key, value]) => {
    acc[key] = sanitizeLayoutItems(value);
    return acc;
  }, {});
};

const hasDroppingItem = (nextLayouts) =>
  Object.values(nextLayouts || {}).some((items = []) =>
    items.some((item) => item.i === DROPPING_ITEM_ID),
  );

const scheduleChartResize = () => {
  window.requestAnimationFrame(() => {
    window.dispatchEvent(new Event('resize'));
  });
  window.setTimeout(() => window.dispatchEvent(new Event('resize')), 120);
  window.setTimeout(() => window.dispatchEvent(new Event('resize')), 280);
};

const GridItemWrapper = React.forwardRef(function GridItemWrapper(
  { title, widgetId, onRemove, children, style, className, onMouseDown, onMouseUp, onTouchEnd, ...rest }, ref
) {
  return (
    <div
      ref={ref}
      style={{ ...style, display: 'flex', flexDirection: 'column' }}
      className={className}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchEnd={onTouchEnd}
      {...rest}
    >
      <Box className="drag-handle" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.5, py: 0.5, cursor: 'grab', userSelect: 'none', flexShrink: 0, bgcolor: 'background.paper', borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottom: '1px solid', borderColor: 'divider', '&:active': { cursor: 'grabbing' }}}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <DragIndicatorIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
          <Typography variant="caption" color="text.secondary" fontWeight={600}>{title}</Typography>
        </Box>
        <IconButton size="small" onMouseDown={(e) => e.stopPropagation()} onClick={() => onRemove(widgetId)} sx={{ p: 0.3 }}>
          <CloseIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Box>
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden', bgcolor: 'background.paper', borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
        {children}
      </Box>
    </div>
  );
});

export default function DraggableGrid({ widgets = [] }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const dispatch = useAppDispatch();
  const visibility = useAppSelector(selectVisibility);
  const { width, containerRef } = useContainerWidth({ initialWidth: 1200 });
  const droppingWidgetIdRef = useRef(null);
  const [layouts, setLayouts] = useState(() => sanitizeLayouts(loadLayout()) || createDefaultLayouts());

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

  const handleLayoutChange = useCallback((_currentLayout, allLayouts) => {
    if (hasDroppingItem(allLayouts)) {
      scheduleChartResize();
      return;
    }

    const sanitized = sanitizeLayouts(allLayouts) || createDefaultLayouts();
    setLayouts(sanitized);
    saveLayout(sanitized);
    scheduleChartResize();
  }, []);

  const handleRemove = useCallback((widgetId) => {
    const updated = { ...layouts };
    Object.keys(updated).forEach((key) => {
      updated[key] = (updated[key] || []).filter((item) => item.i !== widgetId);
    });

    setLayouts(updated);
    saveLayout(updated);
    dispatch(setWidgetVisibility({ id: widgetId, visible: false }));
    scheduleChartResize();
  }, [dispatch, layouts]);

  const onDrop = useCallback((layout, layoutItem, event) => {
    const eventWidgetId = event?.dataTransfer?.getData('text/plain');
    const widgetId = droppingWidgetIdRef.current || eventWidgetId;
    if (!widgetId || !ORIGINAL_POSITIONS[widgetId]) return;
    droppingWidgetIdRef.current = null;

    const original = ORIGINAL_POSITIONS[widgetId] || { x: 0, y: 99, w: 4, h: 4 };
    const newItem = { i: widgetId, x: original.x, y: original.y, w: original.w, h: original.h, minW: original.minW || 2, minH: original.minH || 2 };

    setLayouts((currentLayouts) => {
      const updated = sanitizeLayouts(currentLayouts) || createDefaultLayouts();
      (['lg', 'md', 'sm', 'xs']).forEach((key) => {
        const existing = (updated[key] || []).filter(item => item.i !== widgetId);
        updated[key] = [...existing, newItem];
      });
      saveLayout(updated); // veya localStorage.setItem('dashboardLayout', JSON.stringify(updated));
      return updated;
    });

    dispatch(setWidgetVisibility({ id: widgetId, visible: true }));
    scheduleChartResize();
  }, [dispatch]);

  const visibleWidgets = widgets.filter((widget) => visibility[widget.id]);

  if (!isDesktop) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        {visibleWidgets.map(({ id, title, children }) => (
          <Box key={id} sx={{ minWidth: 0 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 1.5,
                py: 0.75,
                bgcolor: 'background.paper',
                borderTopLeftRadius: 2,
                borderTopRightRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderBottom: 0,
              }}
            >
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {title}
              </Typography>
              <IconButton size="small" onClick={() => dispatch(setWidgetVisibility({ id, visible: false }))} sx={{ p: 0.3 }}>
                <CloseIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Box>
            <Box
              sx={{
                minWidth: 0,
                overflow: 'hidden',
                bgcolor: 'background.paper',
                borderBottomLeftRadius: 2,
                borderBottomRightRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
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
        className="layout"
        width={width}
        layouts={layouts}
        breakpoints={BREAKPOINTS}
        cols={COLS}
        rowHeight={64}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        draggableHandle=".drag-handle"
        dragConfig={{ enabled: true, handle: '.drag-handle' }}
        resizeConfig={{ enabled: true }}
        dropConfig={{ enabled: true, defaultItem: { w: 4, h: 4 } }}
        isResizable={true}
        isDraggable={true}
        isDroppable={true}
        droppingItem={{ i: DROPPING_ITEM_ID, w: 4, h: 4 }}
        onDrop={onDrop}
        onLayoutChange={handleLayoutChange}
        style={{ minHeight: '100%' }}
      >
        {visibleWidgets.map(({ id, title, children }) => (
          <GridItemWrapper
            key={id}
            title={title}
            widgetId={id}
            onRemove={handleRemove}
            data-grid={ORIGINAL_POSITIONS[id]}
          >
            {children || widgetMap[id]?.children}
          </GridItemWrapper>
        ))}
      </ResponsiveGridLayout>
    </Box>
  );
}

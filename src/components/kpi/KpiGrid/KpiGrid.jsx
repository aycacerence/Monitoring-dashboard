import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import KpiCard from '../KpiCard/KpiCard';
import KpiCardSkeleton from '../KpiCardSkeleton/KpiCardSkeleton';
import ErrorState from '../../common/ErrorState/ErrorState';
import { fetchKpis } from '../../../features/dashboard/kpiSlice';
import { selectIsEditMode, setIsDirty } from '../../../features/ui/uiSlice';

const editModeKpis = [
  { id: 'placeholder-1', title: 'CPU', value: '—', unit: '%', changePercentage: 0, changeDirection: 'neutral', changeLabel: '—', icon: 'cpu', sparklineData: [], color: '#8b5cf6' },
  { id: 'placeholder-2', title: 'Bellek', value: '—', unit: '%', changePercentage: 0, changeDirection: 'neutral', changeLabel: '—', icon: 'memory', sparklineData: [], color: '#06b6d4' },
  { id: 'placeholder-3', title: 'Disk', value: '—', unit: '%', changePercentage: 0, changeDirection: 'neutral', changeLabel: '—', icon: 'storage', sparklineData: [], color: '#f59e0b' },
  { id: 'placeholder-4', title: 'Ağ', value: '—', unit: '', changePercentage: 0, changeDirection: 'neutral', changeLabel: '—', icon: 'network', sparklineData: [], color: '#10b981' },
  { id: 'placeholder-5', title: 'Uyarı', value: '—', unit: '', changePercentage: 0, changeDirection: 'neutral', changeLabel: '—', icon: 'warning', sparklineData: [], color: '#ef4444' },
  { id: 'placeholder-6', title: 'Çalışma', value: '—', unit: '', changePercentage: 0, changeDirection: 'neutral', changeLabel: '—', icon: 'activity', sparklineData: [], color: '#6366f1' },
];

const getKpiOrderKey = (role) => `kpiCardOrder_${role || 'user'}`;

const loadKpiOrder = (role) => {
  try {
    const raw = localStorage.getItem(getKpiOrderKey(role));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveKpiOrder = (order, role) => {
  try {
    localStorage.setItem(getKpiOrderKey(role), JSON.stringify(order));
  } catch (error) {
    throw new Error('Kaydetme başarısız oldu.');
  }
};

const sortKpisByOrder = (items, order) => {
  if (!Array.isArray(order) || order.length === 0) return items;

  const itemMap = new Map(items.map((item) => [item.id, item]));
  const orderedItems = order
    .map((id) => itemMap.get(id))
    .filter(Boolean);
  const remainingItems = items.filter((item) => !order.includes(item.id));

  return [...orderedItems, ...remainingItems];
};

function KpiGrid() {
  const dispatch = useAppDispatch();
  const { data: kpiData, status, error } = useAppSelector((state) => state.kpi);
  const role = useAppSelector((state) => state.auth.role);
  const isEditMode = useAppSelector(selectIsEditMode);
  const [draggedKpiId, setDraggedKpiId] = useState(null);
  const [savedKpiOrder, setSavedKpiOrder] = useState(() => loadKpiOrder(role));
  const [draftKpiOrder, setDraftKpiOrder] = useState(savedKpiOrder);
  const previousIsEditMode = React.useRef(isEditMode);

  useEffect(() => {
    if (previousIsEditMode.current && !isEditMode) {
      setDraftKpiOrder(savedKpiOrder);
      dispatch(setIsDirty(false));
    }
    previousIsEditMode.current = isEditMode;
  }, [isEditMode, savedKpiOrder, dispatch]);

  useEffect(() => {
    const savedOrder = loadKpiOrder(role);
    setSavedKpiOrder(savedOrder);
    setDraftKpiOrder(savedOrder);
  }, [role]);

  useEffect(() => {
    const handleSaveLayout = (e) => {
      try {
        saveKpiOrder(draftKpiOrder, role);
        setSavedKpiOrder(draftKpiOrder);
        dispatch(setIsDirty(false));
      } catch (err) {
        if (e && e.detail && typeof e.detail.reportError === 'function') {
          e.detail.reportError(err);
        }
      }
    };

    const handleCancelLayout = () => {
      setDraftKpiOrder(savedKpiOrder);
      dispatch(setIsDirty(false));
    };

    const handlePreviewDefault = () => {
      setDraftKpiOrder([]);
      dispatch(setIsDirty(true));
    };

    window.addEventListener('save-layout', handleSaveLayout);
    window.addEventListener('cancel-layout', handleCancelLayout);
    window.addEventListener('dashboard:preview-default', handlePreviewDefault);

    return () => {
      window.removeEventListener('save-layout', handleSaveLayout);
      window.removeEventListener('cancel-layout', handleCancelLayout);
      window.removeEventListener('dashboard:preview-default', handlePreviewDefault);
    };
  }, [dispatch, draftKpiOrder, role, savedKpiOrder]);

  const showLoadingState = !isEditMode && (status === 'loading' || status === 'idle');
  const showErrorState = !isEditMode && status === 'failed';
  const sourceItems = isEditMode && kpiData.length === 0 ? editModeKpis : kpiData;
  const items = useMemo(() => sortKpisByOrder(sourceItems, draftKpiOrder), [sourceItems, draftKpiOrder]);

  const handleKpiDrop = (targetKpiId) => {
    if (!isEditMode || !draggedKpiId || draggedKpiId === targetKpiId) return;

    const currentIds = items.map((item) => item.id);
    const fromIndex = currentIds.indexOf(draggedKpiId);
    const toIndex = currentIds.indexOf(targetKpiId);
    if (fromIndex === -1 || toIndex === -1) return;

    const nextIds = [...currentIds];
    const [movedId] = nextIds.splice(fromIndex, 1);
    nextIds.splice(toIndex, 0, movedId);

    setDraftKpiOrder(nextIds);
    dispatch(setIsDirty(true));
    setDraggedKpiId(null);
  };

  if (showLoadingState) {
    return (
      <div className="grid grid-cols-1 gap-4 transition-opacity duration-500 ease-in opacity-100 sm:grid-cols-2 md:grid-cols-3 lg:h-full lg:grid-cols-12">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="lg:col-span-2 lg:min-h-0">
            <KpiCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (showErrorState) {
    return <ErrorState message={error || "KPI verileri yüklenirken bir hata oluştu."} onRetry={() => dispatch(fetchKpis())} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 transition-opacity duration-500 ease-in opacity-100 sm:grid-cols-2 md:grid-cols-3 lg:h-full lg:grid-cols-12">
      {items.map((kpi, index) => (
        <div
          key={kpi.id}
          draggable={isEditMode}
          onDragStart={(event) => {
            if (!isEditMode) return;
            event.stopPropagation();
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', kpi.id);
            setDraggedKpiId(kpi.id);
          }}
          onDragOver={(event) => {
            if (!isEditMode) return;
            event.preventDefault();
            event.stopPropagation();
            event.dataTransfer.dropEffect = 'move';
          }}
          onDrop={(event) => {
            if (!isEditMode) return;
            event.preventDefault();
            event.stopPropagation();
            handleKpiDrop(kpi.id);
          }}
          onDragEnd={() => setDraggedKpiId(null)}
          className={`kpi-draggable-item relative lg:col-span-2 lg:min-h-0 animate-fade-in-up ${isEditMode ? 'cursor-grab active:cursor-grabbing' : ''} ${draggedKpiId === kpi.id ? 'opacity-50' : ''}`}
          style={{ animationDelay: `${index * 75}ms` }}
        >
          {isEditMode && (
            <div className="pointer-events-none absolute left-2 top-2 z-10 rounded bg-white/80 px-1 text-xs text-slate-400 shadow-sm">
              ⠿
            </div>
          )}
          <KpiCard
            title={kpi.title}
            value={kpi.value}
            unit={kpi.unit}
            changePercentage={kpi.changePercentage}
            changeDirection={kpi.changeDirection}
            changeLabel={kpi.changeLabel}
            icon={kpi.icon}
            sparklineData={kpi.sparklineData}
            color={kpi.color}
          />
        </div>
      ))}
    </div>
  );
}

export default KpiGrid;

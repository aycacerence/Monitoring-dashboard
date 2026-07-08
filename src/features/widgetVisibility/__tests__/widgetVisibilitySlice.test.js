import { configureStore } from '@reduxjs/toolkit';
import widgetVisibilityReducer, {
  toggleWidget,
  setWidgetVisibility,
  resetVisibility,
  hideAllWidgets,
  selectVisibility,
  WIDGET_IDS,
} from '../widgetVisibilitySlice';

describe('widgetVisibilitySlice', () => {
  let store;
  beforeEach(() => {
    localStorage.clear();
    store = configureStore({ reducer: { widgetVisibility: widgetVisibilityReducer } });
  });

  test('başlangıçta tüm widgetlar görünür olmalı', () => {
    const visibility = selectVisibility(store.getState());
    Object.values(WIDGET_IDS).forEach((id) => {
      expect(visibility[id]).toBe(true);
    });
  });

  test('toggleWidget: görünür widget gizlenmeli', () => {
    store.dispatch(toggleWidget(WIDGET_IDS.KPI_TOTAL_DEVICES));
    expect(selectVisibility(store.getState())[WIDGET_IDS.KPI_TOTAL_DEVICES]).toBe(false);
  });

  test('toggleWidget: gizli widget görünür olmalı', () => {
    store.dispatch(setWidgetVisibility({ id: WIDGET_IDS.KPI_TOTAL_DEVICES, visible: false, role: 'admin' }));
    store.dispatch(toggleWidget(WIDGET_IDS.KPI_TOTAL_DEVICES));
    expect(selectVisibility(store.getState())[WIDGET_IDS.KPI_TOTAL_DEVICES]).toBe(true);
  });

  test('hideAllWidgets: tüm widgetlar gizlenmeli', () => {
    store.dispatch(hideAllWidgets());
    const visibility = selectVisibility(store.getState());
    Object.values(WIDGET_IDS).forEach((id) => {
      expect(visibility[id]).toBe(false);
    });
  });

  test('resetVisibility: tüm widgetlar tekrar görünür olmalı', () => {
    store.dispatch(hideAllWidgets());
    store.dispatch(resetVisibility());
    const visibility = selectVisibility(store.getState());
    Object.values(WIDGET_IDS).forEach((id) => {
      expect(visibility[id]).toBe(true);
    });
  });

});

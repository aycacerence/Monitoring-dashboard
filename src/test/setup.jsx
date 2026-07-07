import '@testing-library/jest-dom';
import { vi } from 'vitest';

// ECharts mock — jsdom'da canvas yok
vi.mock('echarts-for-react', () => ({
  default: ({ style }) => (
    <div data-testid="echarts-mock" style={style} />
  ),
}));

// react-grid-layout mock — jsdom'da layout hesabı çalışmıyor
vi.mock('react-grid-layout', () => ({
  Responsive: ({ children }) => <div data-testid="rgl-mock">{children}</div>,
  WidthProvider: (Component) => Component,
  useContainerWidth: () => ({ width: 1200, containerRef: { current: null } }),
}));

// localStorage mock
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// window.matchMedia mock (MUI responsive için)
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ResizeObserver mock
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

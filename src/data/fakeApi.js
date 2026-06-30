import {
  alertsData,
  cpuUsageData,
  devicesData,
  deviceStatusDistribution,
  kpiData,
  networkTrafficData,
  resourceUsageData,
  systemSummaryData,
  themeData,
} from './index.js';

const getRandomDelay = () => Math.floor(Math.random() * 301) + 300;

const resolveWithDelay = (payload) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(payload), getRandomDelay());
  });

export const fetchKpiData = () => resolveWithDelay(kpiData);

export const fetchChartsData = () =>
  resolveWithDelay({
    cpuUsage: cpuUsageData,
    networkTraffic: networkTrafficData,
    deviceStatusDistribution,
  });

export const fetchAlertsData = () => resolveWithDelay(alertsData);

export const fetchSystemSummaryData = () => resolveWithDelay(systemSummaryData);

export const fetchResourceUsageData = () => resolveWithDelay(resourceUsageData);

export const fetchDevicesData = () => resolveWithDelay(devicesData);

export const fetchThemeData = () => resolveWithDelay(themeData);

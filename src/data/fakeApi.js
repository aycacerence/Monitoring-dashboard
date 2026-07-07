import {
  alertsData,
  alertsDataEn,
  cpuUsageData,
  devicesData,
  devicesDataEn,
  deviceStatusDistribution,
  deviceStatusDistributionEn,
  kpiData,
  kpiDataEn,
  networkTrafficData,
  resourceUsageData,
  resourceUsageDataEn,
  systemSummaryData,
  systemSummaryDataEn,
  themeData,
} from './index.js';

const getLang = () => {
  try {
    const role = localStorage.getItem('userRole') || 'admin';
    const lang = localStorage.getItem(`i18nLang_${role}`) || localStorage.getItem('i18nLang') || 'tr';
    return lang.startsWith('en') ? 'en' : 'tr';
  } catch {
    return 'tr';
  }
};

const getRandomDelay = () => Math.floor(Math.random() * 301) + 300;

const resolveWithDelay = (payload) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(payload);
    }, getRandomDelay());
  });

export const fetchKpiData = () => resolveWithDelay(getLang() === 'en' ? kpiDataEn : kpiData);

export const fetchChartsData = () =>
  resolveWithDelay({
    cpuUsage: cpuUsageData,
    networkTraffic: networkTrafficData,
    deviceStatusDistribution: getLang() === 'en' ? deviceStatusDistributionEn : deviceStatusDistribution,
  });

export const fetchAlertsData = () => resolveWithDelay(getLang() === 'en' ? alertsDataEn : alertsData);

export const fetchSystemSummaryData = () => resolveWithDelay(getLang() === 'en' ? systemSummaryDataEn : systemSummaryData);

export const fetchResourceUsageData = () => resolveWithDelay(getLang() === 'en' ? resourceUsageDataEn : resourceUsageData);

export const fetchDevicesData = () => resolveWithDelay(getLang() === 'en' ? devicesDataEn : devicesData);

export const fetchThemeData = () => resolveWithDelay(themeData);

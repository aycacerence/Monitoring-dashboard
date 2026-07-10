import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function usePageTitle() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const PAGE_MAP = {
    '/settings': { title: t('pageTitles.settings'),  subtitle: t('pageSubtitles.settings')  },
    '/pid/builder': { title: t('pageTitles.pidBuilder'), subtitle: t('pageSubtitles.pidBuilder') },
    '/pid/monitoring': { title: t('pageTitles.pidMonitoring'), subtitle: t('pageSubtitles.pidMonitoring') },
    '/':         { title: t('pageTitles.dashboard'), subtitle: t('pageSubtitles.dashboard') },
  };

  // Tam eşleşme önce, yoksa prefix eşleşmesi
  return PAGE_MAP[pathname]
    ?? Object.entries(PAGE_MAP).find(([key]) => pathname.startsWith(key))?.[1]
    ?? { title: t('pageTitles.dashboard'), subtitle: t('pageSubtitles.dashboard') };
}

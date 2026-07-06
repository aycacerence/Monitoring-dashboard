import PropTypes from 'prop-types';
import Card from '../../common/Card';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../app/hooks';
import { selectIsEditMode } from '../../../features/ui/uiSlice';
import WidgetPlaceholder from '../../common/WidgetPlaceholder/WidgetPlaceholder';

function AlertsCard({ count, children }) {
  const { t } = useTranslation();
  const isEditMode = useAppSelector(selectIsEditMode);
  if (isEditMode) return <WidgetPlaceholder widgetId="alertsCard" />;

  return (
    <Card hoverable className="flex h-auto flex-col overflow-hidden lg:h-full" noPadding>
      <div className="flex shrink-0 items-center justify-between px-4 pt-4 mb-2">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{t('alerts.title')}</h2>
        <div className="flex items-center justify-center bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50 font-bold text-sm h-7 px-3 rounded-full border border-transparent">
          {count} {t('alerts.new')}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto min-h-0 space-y-2 mx-4 pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-50 [&::-webkit-scrollbar-track]:dark:bg-slate-900 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:dark:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full">
        {children}
      </div>

      <div className="mt-auto shrink-0 px-4 pt-2 pb-2 border-t border-slate-100 dark:border-slate-800">
        <a 
          href="#alerts" 
          className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 focus:ring-2 focus:ring-brand-500 focus:outline-none rounded transition-colors w-max"
          aria-label={t('alerts.viewAll')}
        >
          {t('alerts.viewAll')}
          <ArrowForwardIcon sx={{ fontSize: 16 }} />
        </a>
      </div>
    </Card>
  );
}

AlertsCard.propTypes = {
  count: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};

export default AlertsCard;

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Card from '../../common/Card';
import { useAppSelector } from '../../../app/hooks';
import { selectIsEditMode } from '../../../features/ui/uiSlice';
import WidgetPlaceholder from '../../common/WidgetPlaceholder/WidgetPlaceholder';

function SystemSummaryCard({ items }) {
  const { t } = useTranslation();
  const isEditMode = useAppSelector(selectIsEditMode);
  if (isEditMode) return <WidgetPlaceholder widgetId="systemSummary" />;

  return (
    <Card hoverable className="h-auto lg:h-full flex flex-col" noPadding>
      <div className="shrink-0 px-4 pt-4 mb-2">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{t('sidebar.widgets.systemSummary', 'System Summary')}</h2>
      </div>
      <div className="flex flex-row gap-3 px-4 pb-4 overflow-x-auto overflow-y-auto flex-1 items-stretch custom-scrollbar">
        {items.map((item, index) => (
          <div key={index} className="flex-1 sm:flex-none flex flex-col justify-center min-w-[130px] p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 break-words whitespace-normal leading-tight">
              {item.label}
            </span>
            <span className="text-lg font-bold leading-none text-slate-900 dark:text-white break-words whitespace-normal my-1">
              {item.value}
            </span>
            {item.sublabel && (
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 break-words whitespace-normal leading-tight">
                {item.sublabel}
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

SystemSummaryCard.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      sublabel: PropTypes.string,
    })
  ).isRequired,
};

export default SystemSummaryCard;

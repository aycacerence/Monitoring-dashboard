import PropTypes from 'prop-types';
import RefreshIcon from '@mui/icons-material/Refresh';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Button, Select, MenuItem } from '@mui/material';

const TIME_RANGE_OPTIONS = [
  { value: '1h',  label: 'Son 1 Saat' },
  { value: '24h', label: 'Son 24 Saat' },
  { value: '7d',  label: 'Son 7 Gün' },
  { value: '30d', label: 'Son 30 Gün' },
];

/**
 * Dashboard üst çubuğu — başlık (sol), son güncelleme + filtre + yenile (sağ).
 *
 * @param {object}   props
 * @param {string}   props.title        Sayfa başlığı.
 * @param {string}   [props.lastUpdated] Son güncelleme tam tarih metni.
 * @param {string}   props.timeRange    Seçili zaman aralığı değeri.
 * @param {Function} props.onTimeRangeChange Filtre değişince çağrılır.
 * @param {Function} props.onRefresh    Yenile butonu tıklandığında çalışır.
 * @param {boolean}  props.isRefreshing Yenileme animasyonunu yönetir.
 */
function Header({ title, lastUpdated, timeRange, onTimeRangeChange, onRefresh, isRefreshing }) {
  return (
    <header className="sticky top-0 z-20 w-full" style={{ backgroundColor: '#a42350' }}>
      <div className="flex flex-nowrap min-h-16 items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:px-8">

        {/* Sol: Sayfa başlığı */}
        <div className="min-w-0">
          <h1 className="truncate text-base font-bold tracking-normal text-white sm:text-xl lg:text-2xl">
            {title}
          </h1>
        </div>

        {/* Sağ: Son güncelleme + Filtre + Yenile */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Son güncelleme tarihi */}
          {lastUpdated && (
            <span className="hidden lg:block text-xs font-medium text-white/75 whitespace-nowrap">
              Son güncelleme: {lastUpdated}
            </span>
          )}

          {/* Zaman aralığı filtresi */}
          <Select
            size="small"
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
            aria-label="Zaman aralığı filtresi"
            startAdornment={
              <CalendarTodayIcon sx={{ fontSize: 14, mr: 0.5, color: '#a42350' }} />
            }
            sx={{
              backgroundColor: '#ffffff',
              color: '#1e293b',
              fontWeight: 500,
              fontSize: '0.8125rem',
              borderRadius: '8px',
              height: '32px',
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '& .MuiSelect-icon': { color: '#64748b' },
              '& .MuiSelect-select': { paddingLeft: '6px', paddingRight: '28px !important' },
            }}
          >
            {TIME_RANGE_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '0.8125rem' }}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>

          {/* Yenile butonu */}
          <Button
            variant="contained"
            size="small"
            onClick={onRefresh}
            aria-label="Verileri Yenile"
            startIcon={
              <RefreshIcon
                fontSize="small"
                className={isRefreshing ? 'animate-spin' : ''}
              />
            }
            sx={{
              backgroundColor: '#ffffff',
              color: '#000000',
              '&:hover': { backgroundColor: '#f1f1f1' },
              boxShadow: 'none',
              fontWeight: 600,
              fontSize: '0.8125rem',
              textTransform: 'none',
              borderRadius: '8px',
              minWidth: 'auto',
            }}
          >
            Yenile
          </Button>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  lastUpdated: PropTypes.string,
  timeRange: PropTypes.string.isRequired,
  onTimeRangeChange: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  isRefreshing: PropTypes.bool.isRequired,
};

export default Header;

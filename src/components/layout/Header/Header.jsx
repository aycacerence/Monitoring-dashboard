import PropTypes from 'prop-types';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Button } from '@mui/material';

/**
 * Dashboard sayfasinin minimalist baslik ve yenileme aksiyon alanini yonetir.
 *
 * @param {object} props
 * @param {string} props.title Sayfa basligi.
 * @param {string} [props.subtitle] Sayfa alt basligi.
 * @param {() => void} props.onRefresh Yenile butonu tiklandiginda calisir.
 * @param {boolean} props.isRefreshing Yenileme ikonunun loading animasyonunu belirler.
 * @returns {JSX.Element}
 */
function Header({ title, subtitle, onRefresh, isRefreshing }) {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold tracking-normal text-slate-950 sm:text-2xl">
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-sm font-medium text-slate-500">{subtitle}</p>}
        </div>

        <Button
          variant="outlined"
          size="small"
          onClick={onRefresh}
          aria-label="Verileri Yenile"
          startIcon={
            <RefreshIcon
              fontSize="small"
              className={isRefreshing ? 'animate-spin' : ''}
            />
          }
          className="shrink-0 border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          Yenile
        </Button>
      </div>
    </header>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  onRefresh: PropTypes.func.isRequired,
  isRefreshing: PropTypes.bool.isRequired,
};

export default Header;

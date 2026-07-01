import PropTypes from 'prop-types';
import SearchInput from '../../common/SearchInput/SearchInput';

function DevicesCardHeader({ title, searchTerm, onSearchChange }) {
  return (
    <div className="flex shrink-0 flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 pt-4 mb-3">
      <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h2>
      <div className="w-full sm:w-72 shrink-0">
        <SearchInput
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="İsim veya IP ile ara..."
        />
      </div>
    </div>
  );
}

DevicesCardHeader.propTypes = {
  title: PropTypes.string.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default DevicesCardHeader;

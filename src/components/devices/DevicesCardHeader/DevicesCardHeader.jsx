import PropTypes from 'prop-types';
import SearchInput from '../../common/SearchInput/SearchInput';

function DevicesCardHeader({ title, searchTerm, onSearchChange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 pt-5 mb-4">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
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

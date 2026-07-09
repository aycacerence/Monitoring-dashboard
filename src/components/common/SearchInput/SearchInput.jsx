import PropTypes from 'prop-types';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, TextField } from '@mui/material';

/**
 * Tablo ve liste aramalari icin kullanilan kontrollu arama inputudur.
 *
 * @param {object} props
 * @param {string} props.value Input degeri.
 * @param {(value: string) => void} props.onChange Deger degistiginde calisan callback.
 * @param {string} [props.placeholder] Input placeholder metni.
 * @returns {JSX.Element}
 */
function SearchInput({ value, onChange, placeholder = 'Ara...' }) {
  return (
    <TextField
      fullWidth
      size="small"
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      InputProps={{
        className: 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white',
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" className="text-slate-400 dark:text-slate-500" />
          </InputAdornment>
        ),
      }}
      inputProps={{
        'aria-label': placeholder,
        className: 'focus:ring-2 focus:ring-brand-500 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500',
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          '& fieldset': {
            border: 'none',
          },
        },
      }}
    />
  );
}

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default SearchInput;

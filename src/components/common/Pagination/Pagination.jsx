import PropTypes from 'prop-types';
import { Pagination as MuiPagination } from '@mui/material';

/**
 * Dashboard tablolarinda kullanilacak MUI Pagination sarmalayicisidir.
 *
 * @param {object} props
 * @param {number} props.currentPage Aktif sayfa.
 * @param {number} props.totalPages Toplam sayfa sayisi.
 * @param {(page: number) => void} props.onPageChange Sayfa degistiginde calisan callback.
 * @returns {JSX.Element}
 */
function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <MuiPagination
      page={currentPage}
      count={Math.max(totalPages, 1)}
      color="primary"
      shape="rounded"
      onChange={(_, page) => onPageChange(page)}
      className="flex justify-center"
    />
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;

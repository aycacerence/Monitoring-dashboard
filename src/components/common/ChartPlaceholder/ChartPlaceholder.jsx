import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

function ChartPlaceholder({ label }) {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'action.hover',
        borderRadius: 1,
      }}
    >
      <Typography variant="caption" color="text.disabled">
        {label ?? 'Grafik'}
      </Typography>
    </Box>
  );
}

ChartPlaceholder.propTypes = {
  label: PropTypes.string,
};

export default ChartPlaceholder;

import PropTypes from 'prop-types';
import { Box, Typography, CircularProgress, Fade } from '@mui/material';

function SplashScreen({ isVisible }) {
  return (
    <Fade in={isVisible} timeout={300} unmountOnExit>
      <Box
        sx={{
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100vw',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 3 }}>
          Monitoring Dashboard
        </Typography>
        <CircularProgress color="primary" sx={{ mb: 2 }} />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Sistem verileri yükleniyor...
        </Typography>
      </Box>
    </Fade>
  );
}

SplashScreen.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

export default SplashScreen;

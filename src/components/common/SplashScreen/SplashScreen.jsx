import PropTypes from 'prop-types';
import { Box, Typography, CircularProgress, Fade } from '@mui/material';
import { useTranslation } from 'react-i18next';

function SplashScreen({ isVisible, title, message }) {
  const { t } = useTranslation();
  return (
    <Fade in={isVisible} timeout={300} unmountOnExit>
      <Box
        sx={{
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 50,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 3 }}>
          {title || 'Monitoring Dashboard'}
        </Typography>
        <CircularProgress color="primary" sx={{ mb: 2 }} />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {message || t('splash.loading', 'Sistem verileri yükleniyor...')}
        </Typography>
      </Box>
    </Fade>
  );
}

SplashScreen.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
};

export default SplashScreen;

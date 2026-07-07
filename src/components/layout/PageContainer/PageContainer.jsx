import PropTypes from 'prop-types';

/**
 * Dashboard icerigini ferah padding ve maksimum genislikle saran sayfa wrapper'i.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children Sayfa icerigi.
 * @param {string} [props.className] Ek Tailwind class'lari.
 * @returns {JSX.Element}
 */
function PageContainer({ children, className = '', ...props }) {
  return (
    <main className={`mx-auto w-full max-w-[1560px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8 ${className}`} {...props}>
      {children}
    </main>
  );
}

PageContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default PageContainer;

import PropTypes from 'prop-types';

/**
 * Responsive dashboard grid wrapper'i.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children Grid icerigi.
 * @param {string} [props.className] Ek Tailwind class'lari.
 * @returns {JSX.Element}
 */
function DashboardGrid({ children, className = '' }) {
  return (
    // Mobilde tek kolon, tablette iki/uc kolon, masaustunde alti kolonlu ferah bir kart sistemi kullaniyoruz.
    <section className={`grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-6 ${className}`}>
      {children}
    </section>
  );
}

DashboardGrid.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default DashboardGrid;

import { useScroll } from 'framer-motion';
// @mui
// components
import ScrollProgress from 'src/components/scroll-progress';
//
import KYCHero from '../kyc-hero';
// ----------------------------------------------------------------------

export default function KYCView() {
  const { scrollYProgress } = useScroll();

  return (
    <>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      <KYCHero />
    </>
  );
}

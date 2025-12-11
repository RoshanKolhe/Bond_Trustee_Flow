import { useScroll } from 'framer-motion';
// @mui
// components
import ScrollProgress from 'src/components/scroll-progress';
//
import Stepper from '../kyc-stepper';
// ----------------------------------------------------------------------

export default function KYCView() {
  const { scrollYProgress } = useScroll();

  return (
    <>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      <Stepper />
    </>
  );
}

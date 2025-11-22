import { useTheme, alpha } from '@mui/material/styles';
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Button,
  useMediaQuery,
} from '@mui/material';
import { useRef } from 'react';

import PropTypes from 'prop-types';
import BondLibraryCardGrid from 'src/components/bonds-cqard-grid/bond-library-card-grid';


// ----------------------------------------------------------------------

export default function MarketComparisons({ bonds }) {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 4, md: 6 }, py: 6, position: 'relative' }}>
      {/* Section Header */}
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h3" fontWeight={700} color='#154A8F'>
          Market Comparisons
        </Typography>
        <Typography variant="body2" color="#000">
          Compare bonds based on various metrics.
        </Typography>
      </Stack>

      {/* Carousel Container */}
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          gap: 3,
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          pb: 2,
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {bonds.map((item, index) => (
          <Box
            key={index}
            sx={{
              flex: '0 0 auto',
              width: { xs: 260, sm: 280, md: 290 },
            }}
          >
            <BondLibraryCardGrid item={item} />
          </Box>
        ))}
      </Box>

      {/* Navigation Arrows */}
      {isSmUp && (
        <>
         <IconButton
  onClick={() => scroll('left')}
  sx={{
    position: 'absolute',
    top: '50%',
    left: 10,
    transform: 'translateY(-50%)',
    bgcolor: '#fff',
    width: 50,
    height: 50,
    borderRadius: '50%',
    boxShadow: `0 4px 10px ${alpha(theme.palette.grey[600], 0.25)}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      bgcolor: alpha('#fff', 0.9),
      transform: 'translateY(-50%) scale(1.05)',
      boxShadow: `0 6px 12px ${alpha(theme.palette.grey[600], 0.3)}`,
    },
  }}
>
  <Box
    component="img"
    src="/assets/icons/market-comparisons/left.svg"
    alt="Scroll Left"
    sx={{
      width: 18,
      height: 18,
      objectFit: 'contain',
    }}
  />
</IconButton>


          <IconButton
            onClick={() => scroll('right')}
            sx={{
    position: 'absolute',
    top: '50%',
    right: 10,
    transform: 'translateY(-50%)',
    bgcolor: '#fff',
    width: 50,
    height: 50,
    borderRadius: '50%',
    boxShadow: `0 4px 10px ${alpha(theme.palette.grey[600], 0.25)}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      bgcolor: alpha('#fff', 0.9),
      transform: 'translateY(-50%) scale(1.05)',
      boxShadow: `0 6px 12px ${alpha(theme.palette.grey[600], 0.3)}`,
    },
  }}
>
            <Box
    component="img"
    src="/assets/icons/market-comparisons/right.svg"
    alt="Scroll Left"
    sx={{
      width: 18,
      height: 18,
      objectFit: 'contain',
    }}
  />
          </IconButton>
        </>
      )}
    </Box>
  );
}

MarketComparisons.propTypes = {
  bonds: PropTypes.array.isRequired,
};

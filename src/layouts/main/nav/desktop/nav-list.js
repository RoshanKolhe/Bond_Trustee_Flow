import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import Fade from '@mui/material/Fade';
import Stack from '@mui/material/Stack';
import Portal from '@mui/material/Portal';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// routes
import { usePathname } from 'src/routes/hook';
import { useActiveLink } from 'src/routes/hook/use-active-link';
//
import { NavItem, NavItemDashboard } from './nav-item';
import { StyledSubheader, StyledMenu } from './styles';

// ----------------------------------------------------------------------

export default function NavList({ item, offsetTop }) {
  const pathname = usePathname();

  const nav = useBoolean();

  const { path, children } = item;

  const active = useActiveLink(path, false);

  // const externalLink = path.includes('http');

  const [anchorRect, setAnchorRect] = useState(null);

  useEffect(() => {
    if (nav.value) {
      nav.onFalse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpenMenu = (event) => {
    if (children) {
      const rect = event?.currentTarget?.getBoundingClientRect?.();
      if (rect) {
        setAnchorRect({ left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width });
      }
      nav.onTrue();
    }
  };

  return (
    <>
      <NavItem
        item={item}
        offsetTop={offsetTop}
        active={active}
        open={nav.value}
        // externalLink={externalLink}
        onMouseEnter={handleOpenMenu}
        onMouseLeave={nav.onFalse}
      />

      {!!children && nav.value && (
        <Portal>
          <Fade in={nav.value}>
            <StyledMenu
              onMouseEnter={nav.onTrue}
              onMouseLeave={nav.onFalse}
              sx={{
                display: 'flex',
                // Position directly under hovered item
                left: anchorRect ? anchorRect.left : 0,
                right: 'auto',
                margin: 0,
                // Slightly overlap the parent item to avoid hover gap
                top: anchorRect ? anchorRect.bottom - 8 : undefined,
                maxWidth: 'unset',
              }}
            >
              {children.map((list) => (
                <NavSubList
                  key={list.subheader}
                  subheader={list.subheader}
                  items={list.items}
                  isDashboard={list.subheader === 'Dashboard'}
                  onClose={nav.onFalse}
                />
              ))}
            </StyledMenu>
          </Fade>
        </Portal>
      )}
    </>
  );
}

NavList.propTypes = {
  item: PropTypes.object,
  offsetTop: PropTypes.bool,
};

// ----------------------------------------------------------------------

function NavSubList({ items, isDashboard, onClose }) {
  const pathname = usePathname();

  return (
    <Stack
      spacing={2}
      alignItems="flex-start"
      sx={{
        flexGrow: 1,
        ...(isDashboard && {
          maxWidth: 540,
        }),
      }}
    >
      {/* <StyledSubheader disableSticky>{subheader}</StyledSubheader> */}

      {items.map((item) =>
        isDashboard ? (
          <NavItemDashboard key={item.title} item={item} onClick={onClose} />
        ) : (
          <NavItem
            subItem
            key={item.title}
            item={item}
            active={pathname === `${item.path}/`}
            onClick={onClose}
          />
        )
      )}
    </Stack>
  );
}

NavSubList.propTypes = {
  isDashboard: PropTypes.bool,
  items: PropTypes.array,
  onClose: PropTypes.func,
  subheader: PropTypes.string,
};

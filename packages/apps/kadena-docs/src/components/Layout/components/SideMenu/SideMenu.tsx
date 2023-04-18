import { Heading, Text } from '@kadena/react-components';

import { LayoutType } from '../../types';

import { MenuCard } from './MenuCard';
import { StyledItem, StyledLink, StyledSideMenu, StyledUl } from './styles';

import { useMediumScreen } from '@/hooks';
import { hasSameBasePath } from '@/utils';
import { useRouter } from 'next/router';
import React, {
  FC,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';

interface IProps {
  closeMenu: () => void;
  layout?: LayoutType;
}

export const SideMenu: FC<IProps> = ({ closeMenu, layout = 'full' }) => {
  const router = useRouter();
  const [oldPathname, setOldPathname] = useState<string>('');
  const [active, setActive] = useState<number>(1);
  const [activeTitle, setActiveTitle] = useState<string>('');
  const [hasSubmenu, setHasSubmenu] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const subMenuRef = useRef<HTMLDivElement>(null);

  const { hasMediumScreen } = useMediumScreen();

  useEffect(() => {
    setOldPathname(router.pathname);
    let innerHasSubmenu = false;
    const menuLinks = Array.from(menuRef.current?.querySelectorAll('a') ?? []);
    const foundMenuItem = menuLinks.find((item) => {
      return hasSameBasePath(router.pathname, item.getAttribute('href') ?? '');
    });

    if (!foundMenuItem) {
      innerHasSubmenu = false;
    } else if (foundMenuItem.getAttribute('data-hassubmenu') === 'true') {
      innerHasSubmenu = true;
    }

    if (innerHasSubmenu) {
      setActive(1);
      setHasSubmenu(true);
      setActiveTitle(foundMenuItem?.innerText ?? '');
    } else {
      setActive(0);
      setHasSubmenu(false);
    }

    router.events.on('routeChangeStart', (url) => {
      if (hasSameBasePath(url, oldPathname) && innerHasSubmenu) {
        setActive(1);
      } else {
        setActive(0);
      }
    });
  }, [
    hasMediumScreen,
    setOldPathname,
    oldPathname,
    router.pathname,
    router.events,
    hasSubmenu,
  ]);

  const clickMenu: MouseEventHandler<HTMLUListElement> = (e) => {
    e.preventDefault();
    const clickedItem = e.target as HTMLAnchorElement;

    //check if the CURRENT pathname has a submenu.
    if (
      hasSameBasePath(
        router.pathname,
        clickedItem.getAttribute('href') ?? '',
      ) &&
      clickedItem.getAttribute('data-hassubmenu') === 'true'
    ) {
      setActiveTitle(clickedItem.innerText);
      setActive(1);
      setHasSubmenu(true);
    } else {
      closeMenu();
      setHasSubmenu(false);
    }
  };

  const clickSubMenu: MouseEventHandler<HTMLUListElement> = (e) => {
    const clickedItem = e.target as HTMLAnchorElement;
    if (clickedItem.tagName.toLowerCase() !== 'a') return;

    if (clickedItem.hasAttribute('href')) {
      closeMenu();
    }
  };

  return (
    <StyledSideMenu>
      <MenuCard active={active} idx={0} ref={menuRef}>
        <Heading as="h5" bold={true}>
          Kadena Docs
        </Heading>
        <StyledUl onClick={clickMenu}>
          <StyledItem>
            <StyledLink href="/docs/pact" data-hassubmenu={true}>
              Pact
            </StyledLink>
          </StyledItem>
          <StyledItem>
            <StyledLink href="/docs/kadenajs" data-hassubmenu={false}>
              KadenaJS
            </StyledLink>
          </StyledItem>
          <StyledItem>
            <StyledLink href="/docs/chainweb" data-hassubmenu={true}>
              Chainweb
            </StyledLink>
          </StyledItem>
        </StyledUl>
      </MenuCard>
      {hasSubmenu && (
        <MenuCard active={active} idx={1} ref={subMenuRef}>
          {!hasMediumScreen && (
            <button onClick={() => setActive(0)}>{activeTitle}</button>
          )}

          <section onClick={clickSubMenu}>
            <Text as="p" bold={true}>
              TODO: fill with the correct menu content
            </Text>

            <StyledLink href="/docs/pact">start</StyledLink>
            <StyledLink href="/docs/pact/how-does-it-work">
              How does it work?
            </StyledLink>
          </section>
        </MenuCard>
      )}
    </StyledSideMenu>
  );
};

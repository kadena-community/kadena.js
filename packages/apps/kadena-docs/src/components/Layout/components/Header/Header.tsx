import React, {
  FC,
  useRef,
  RefObject,
  useEffect,
  ReactNode,
  Ref,
  useState,
  MouseEvent,
} from 'react';
import { styled } from '@kadena/react-components';
import { DocsLogo } from '@/components/DocsLogo';
import Link from 'next/link';
import { NavItem } from './NavItem';

const StyledHeader = styled('header', {
  backgroundColor: '#1D1D1F',
  color: 'white',
});

const Wrapper = styled('div', {
  display: 'flex',
  margin: '0',
  padding: '10px 16px',

  '@lg': {
    margin: '0 200px',
  },
});

const StyleNav = styled('nav', {
  display: 'flex',
  alignItems: 'center',
  zIndex: 1,
});

const StyledUl = styled('ul', {
  display: 'flex',
  gap: '$4',
  padding: 0,
  listStyle: 'none',
  width: '100%',
});

interface IItemProps extends Element {
  'data-active'?: boolean;
}

export const Header: FC = () => {
  const listRef = useRef<HTMLUListElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number>(1);

  useEffect(() => {
    if (!listRef.current || !backgroundRef.current) return;

    const list = listRef.current;
    const bg = backgroundRef.current;

    selectItem(list, bg, active);
  }, [listRef, backgroundRef]);

  const getActiveItem = (list: HTMLUListElement) => {
    let item = list.firstChild;
    let idx = 0;
    Array.from(list.children).forEach((innerItem, innerIdx) => {
      if (innerItem.getAttribute('data-active') === 'true') {
        item = innerItem;
        idx = innerIdx;
      }
    });

    return { item, idx };
  };

  const selectItem = (
    list: HTMLUListElement,
    bg: HTMLDivElement,
    active: number,
    activeElement: HTMLLIElement,
  ) => {
    const { item: activeItem, idx } = getActiveItem(list);
    console.log(activeItem);

    const newPosition =
      activeItem?.getBoundingClientRect().x +
      activeItem?.getBoundingClientRect().width / 2 -
      bg.getBoundingClientRect().width / 2;
    bg.style.transform = `translateX(${newPosition}px)`;
    bg.style.transitionDuration = `${0.3 + 0.1 * Math.abs(active - idx)}s`;
  };

  const handleSelectItem = (e: MouseEvent<HTMLUListElement>) => {
    if (!listRef.current || !backgroundRef.current) return;

    const oldActive = active;
    const list = listRef.current;
    const bg = backgroundRef.current;
    const clickedElement = e.target.parentElement;

    let idx: number = 0;
    Array.from(list.children).forEach((item, key) => {
      if (item === clickedElement) idx = key;
    });

    const activeItem = idx ? e.target.parentElement : list.firstChild;

    if (activeItem) {
      const newPosition =
        activeItem?.getBoundingClientRect().x +
        activeItem?.getBoundingClientRect().width / 2 -
        bg.getBoundingClientRect().width / 2;
      bg.style.transform = `translateX(${newPosition}px)`;
      bg.style.transitionDuration = `${0.3 + 0.1 * Math.abs(oldActive - idx)}s`;
    }

    setActive(idx);
  };

  return (
    <StyledHeader>
      <Wrapper>
        <DocsLogo />

        <NavItemActiveBackground ref={backgroundRef} />

        <StyleNav>
          <StyledUl ref={listRef} onClick={handleSelectItem}>
            <NavItem href="/docs/pact" active={active === 0}>
              Pact
            </NavItem>
            <NavItem href="/docs/kadenajs" active={active === 1}>
              KadenaJS
            </NavItem>
            <NavItem active={active === 2}>Chainweaver</NavItem>

            <NavItem active={active === 3}>Apis</NavItem>
            <NavItem active={active === 4}>Academy</NavItem>
            <NavItem active={active === 5}>Support</NavItem>
            <NavItem active={active === 6}>Blog</NavItem>
          </StyledUl>
        </StyleNav>
      </Wrapper>
    </StyledHeader>
  );
};

const BackgroundWrapper = styled('div', {
  position: 'absolute',
  top: 0,
  left: 0,
  transition: 'transform .5s ease',
  transform: 'translateX(0px)',
  zIndex: 0,
});

type IProps = {
  ref: React.ForwardedRef<HTMLDivElement>;
};

export const NavItemActiveBackground: FC<IProps> =
  React.forwardRef<HTMLDivElement>(({}, ref) => {
    return (
      <BackgroundWrapper ref={ref}>
        <svg
          width="256"
          height="64"
          viewBox="0 0 256 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_f_673_923)">
            <path
              d="M138.243 17.7691C216.545 21.08 220.91 -12.0285 182.168 -29.576C143.427 -47.1235 86.4056 -40.5018 59.9412 -24.6097C33.4769 -8.71766 59.9412 14.4583 138.243 17.7691Z"
              fill="url(#paint0_linear_673_923)"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_673_923"
              x="0"
              y="-90"
              width="256"
              height="158"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="25"
                result="effect1_foregroundBlur_673_923"
              />
            </filter>
            <linearGradient
              id="paint0_linear_673_923"
              x1="50"
              y1="-40"
              x2="197.045"
              y2="35.5324"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#ED098F" />
              <stop offset="1" stopColor="#2997FF" />
            </linearGradient>
          </defs>
        </svg>
      </BackgroundWrapper>
    );
  });

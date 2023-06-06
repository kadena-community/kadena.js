import { AsideLink, AsideList } from '../components';

import { ISubHeaderElement } from '@/types/Layout';
import { createSlug } from '@/utils';
import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import { useRouter } from 'next/router';
import React, { FC, MouseEvent } from 'react';

interface IProps {
  // eslint-disable-next-line @rushstack/no-new-null
  scrollArea: HTMLDivElement | null;
  item: ISubHeaderElement;
  setActiveItem: React.Dispatch<React.SetStateAction<string>>;
  activeItem?: string;
  slug: string;
}

export const ListItem: FC<IProps> = ({
  item,
  setActiveItem,
  activeItem,
  scrollArea,
  slug,
}) => {
  const router = useRouter();

  if (item.title === undefined) return null;

  const handleItemClick = (ev: MouseEvent<HTMLAnchorElement>): void => {
    ev.preventDefault();

    analyticsEvent(EVENT_NAMES['click:asidemenu_deeplink'], {
      label: item.title,
      url: slug,
    });

    scrollArea?.querySelector(slug)?.scrollIntoView({
      behavior: 'smooth',
    });

    setTimeout(async () => {
      await router.push(slug);
      setActiveItem(slug);
    }, 500);
  };

  return (
    <AsideLink
      href={slug}
      key={slug}
      label={item.title}
      isActive={activeItem === slug}
      onClick={handleItemClick}
    >
      {item.children.length > 0 && (
        <AsideList inner={true}>
          {item.children.map((innerItem) => {
            const innerSlug = createSlug(innerItem.title);
            return (
              <ListItem
                key={innerSlug}
                slug={innerSlug}
                scrollArea={scrollArea}
                item={innerItem}
                activeItem={activeItem}
                setActiveItem={setActiveItem}
              />
            );
          })}
        </AsideList>
      )}
    </AsideLink>
  );
};

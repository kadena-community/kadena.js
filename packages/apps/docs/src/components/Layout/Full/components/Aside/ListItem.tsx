import { EVENT_NAMES, analyticsEvent } from '@/utils/analytics';
import type { ISubHeaderElement } from '@kadena/docs-tools';
import { useRouter } from 'next/router';
import type { FC, MouseEvent } from 'react';
import React from 'react';
import { AsideLink, AsideList } from './';

interface IProps {
  // eslint-disable-next-line @rushstack/no-new-null
  scrollArea: HTMLDivElement | null;
  item: ISubHeaderElement;
  setActiveItem: React.Dispatch<React.SetStateAction<string>>;
  activeItem?: string;
}

export const ListItem: FC<IProps> = ({
  item,
  setActiveItem,
  activeItem,
  scrollArea,
}) => {
  const router = useRouter();

  if (item.title === undefined || item.title === '') return null;
  const slug = `#${item.slug}`;

  const handleItemClick = (ev: MouseEvent<HTMLAnchorElement>): void => {
    ev.preventDefault();

    analyticsEvent(EVENT_NAMES['click:asidemenu_deeplink'], {
      label: item.title,
      hash: slug,
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
      href={`${slug}`}
      key={slug}
      label={item.title}
      isActive={activeItem === slug}
      onClick={handleItemClick}
    >
      {item.children.length > 0 && (
        <AsideList inner={true}>
          {item.children.map((innerItem: ISubHeaderElement) => {
            return (
              <ListItem
                key={innerItem.title}
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

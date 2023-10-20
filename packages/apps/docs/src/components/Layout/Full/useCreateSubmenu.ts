import type { ISubHeaderElement, TagNameType } from '@/Layout';
import { createSlug } from '@/utils/createSlug.mjs';
import { getParentHeading } from '@/utils/getParentHeading';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

interface IReturn {
  docRef: React.RefObject<HTMLDivElement>;
  headers: ISubHeaderElement[];
}

export const useCreateSubMenu = (): IReturn => {
  const router = useRouter();
  const docRef = useRef<HTMLDivElement>(null);
  const [headers, setHeaders] = useState<ISubHeaderElement[]>([]);

  useEffect(() => {
    if (docRef.current) {
      const doc = docRef.current;

      const startArray: ISubHeaderElement[] = [
        {
          tag: 'h1',
          children: [],
        },
      ];

      let parent = startArray[0];

      const elements: NodeListOf<HTMLHeadingElement> =
        doc.querySelectorAll('h2,h3,h4,h5,h6');
      Array.from(elements).forEach((item) => {
        parent = getParentHeading(startArray[0], item);

        const elm: ISubHeaderElement = {
          tag: item.tagName.toLowerCase() as TagNameType,
          title: item.firstChild?.nodeValue ?? '',
          slug: createSlug(item.firstChild?.nodeValue ?? ''),
          children: [],
        };
        parent.children.push(elm);
      });

      setHeaders(startArray[0].children);
    }
  }, [docRef, router.pathname]);

  return { headers, docRef };
};

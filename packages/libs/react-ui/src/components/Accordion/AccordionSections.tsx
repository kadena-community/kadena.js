import {
  accordionContentWrapperClass,
  accordionSectionClass,
  accordionTitleClass,
  accordionTitleVariants,
} from './Accordion.css';
import useLinked from './useLinked';
import { IAccordionSectionProps } from '.';

import classNames from 'classnames';
import React, {
  FC,
  FunctionComponentElement,
  useCallback,
  useEffect,
} from 'react';

export interface IAccordionSectionsProps {
  children?: FunctionComponentElement<IAccordionSectionProps>[];
  linked?: boolean;
  openSection?: number;
}

export const AccordionSections: FC<IAccordionSectionsProps> = ({
  children,
  linked = false,
  openSection,
}) => {
  const { usingLinked, setUsingLinked, openSections, setOpenSections } =
    useLinked(openSection);

  useEffect(() => {
    setUsingLinked(linked);
    if (linked && openSections.length > 1) {
      const lastOpen = openSections.pop() || -1;
      setOpenSections([lastOpen]);
    }
  }, [linked]);

  const handleToggleSection = useCallback(
    (
      index: number,
      { onOpen, onClose }: Pick<IAccordionSectionProps, 'onOpen' | 'onClose'>,
    ): void => {
      const isOpen = openSections.includes(index);
      if (isOpen) {
        setOpenSections(openSections.filter((i) => i !== index));
        onClose?.();
      } else {
        setOpenSections(usingLinked ? [index] : [...openSections, index]);
        onOpen?.();
      }
    },
    [openSections, usingLinked],
  );

  return (
    <div data-testid="kda-accordion-sections">
      {React.Children.map(children, (section, sectionIndex) => (
        <section
          className={accordionSectionClass}
          data-testid="kda-accordion-section"
        >
          <div
            data-testid="kda-accordion-section-title"
            onClick={() =>
              handleToggleSection(sectionIndex, {
                onOpen: section?.props.onOpen,
                onClose: section?.props.onClose,
              })
            }
            className={classNames(
              accordionTitleClass,
              accordionTitleVariants[
                openSections.includes(sectionIndex) ? 'opened' : 'closed'
              ],
            )}
          >
            {React.cloneElement(
              section as React.ReactElement<
                HTMLElement | IAccordionSectionProps,
                | string
                | React.JSXElementConstructor<
                    JSX.Element & IAccordionSectionProps
                  >
              >,
              {
                isOpen: openSections.includes(sectionIndex),
              },
            )}
          </div>
          {openSections.includes(sectionIndex) && section && (
            <div className={accordionContentWrapperClass}>
              {section.props.children}
            </div>
          )}
        </section>
      ))}
    </div>
  );
};

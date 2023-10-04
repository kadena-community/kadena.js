import {
  container,
  leftSideBar,
  logoClassH1,
  logoClassP,
  main,
  mainRow,
  outerContainer,
  weekIndicator,
  weekIndicatorBox,
  yearLabel,
  yearLabelActive,
  yearsSidebar,
} from './Home.css';

import { BackgroundGrid } from '@/components/BackgroundGrid/BackgroundGrid';
import { Footer } from '@/components/Footer/Footer';
import { NftBlock } from '@/components/NftBlock/NftBlock';
import { clsx } from 'clsx';
import type { FC } from 'react';

export const Home: FC = () => {
  // todo: state
  const selectedYear = 1992;
  const startYear = 1991;
  const yearsList = Array.from(
    { length: new Date().getFullYear() - startYear + 1 },
    (_, i) => i + startYear,
  );
  const daysList = Array.from({ length: 52 }, (_, i) => i);
  const availableNfts = Array.from({ length: 12 }, (_, i) => i);
  const activeBidding = 11;

  return (
    <div className={outerContainer}>
      <div className={container}>
        <div className={leftSideBar}>
          <div>
            <div className={weekIndicator}>25</div>
            <div className={weekIndicatorBox}>{'WK ’92'}</div>
          </div>
          <div>
            <h1 className={logoClassH1}>Immutable Record</h1>
            <p className={logoClassP}>{'>> The Blockchain before Bitcoin'}</p>
          </div>
        </div>
        <main className={main}>
          <BackgroundGrid />
          <div className={mainRow}>
            {daysList.map((day) => (
              <NftBlock
                key={day}
                day={day}
                available={availableNfts.includes(day)}
                active={day === activeBidding}
                progress={50}
              />
            ))}
          </div>
        </main>
        <div className={yearsSidebar}>
          {yearsList.map((year) => (
            <div
              key={year}
              className={clsx(yearLabel, {
                [yearLabelActive]: year === selectedYear,
              })}
            >
              {year}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

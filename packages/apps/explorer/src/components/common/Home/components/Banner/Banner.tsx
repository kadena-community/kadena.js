import React, { FC, memo, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { IBanner, IDataChart } from 'services/banner';
import { Navigation, Pagination } from 'swiper';
import { TimeInterval } from 'utils/api';
import BannerBlock from './components/BannerBlocks/BannerBlock';
import LeftArrow from './components/Icons/LeftArrow';
import RightArrow from './components/Icons/RightArrow';
import { useWindowSize } from 'utils/hooks';

import s from './Banner.module.css';

interface IProps {
  banners: IBanner[];
  onChangeBg: (current: number, data: IDataChart[]) => void;
  active: number;
  timeInterval: TimeInterval;
  onChangeTimeInterval: (current: TimeInterval) => void;
}

const Banner: FC<IProps> = ({
  banners,
  onChangeBg,
  active,
  timeInterval,
  onChangeTimeInterval,
}) => {
  const { width } = useWindowSize();

  const slidesPerView = useMemo(() => {
    if (width) {
      if (width < 360) {
        return 1;
      }
      if (width >= 360 && width < 1024) {
        return 2;
      }
      if (width > 1023 && width < 1367) {
        return 3;
      }
      if (width > 1366) {
        return 4;
      }
    }
  }, [width]);

  return (
    <div className="carousel-container">
      {slidesPerView && (
        <Swiper
          className={s.containerCarousel}
          slidesPerGroup={1}
          slidesPerView={slidesPerView}
          pagination={{
            clickable: true,
            bulletElement: 'button',
            el: '.swiper-pagination-custom',
          }}
          loop
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          modules={[Navigation, Pagination]}
          breakpoints={carouselBreakpoints}
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={banner.id}>
              <BannerBlock
                banner={banner}
                active={active}
                onChangeBg={onChangeBg}
                timeInterval={timeInterval}
                onChangeTimeInterval={onChangeTimeInterval}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <div className="swiper-pagination-custom" />
      <div className={s.sliderArrows}>
        <div className={`${s.sliderPrev} swiper-button-prev-custom`}>
          <LeftArrow />
        </div>
        <div className={`${s.sliderNext} swiper-button-next-custom`}>
          <RightArrow />
        </div>
      </div>
    </div>
  );
};

const carouselBreakpoints: any = {
  10: {
    slidesPerView: 1,
    spaceBetween: 32,
    navigation: false,
    pagination: {
      clickable: true,
      type: 'bullets',
    },
  },
  360: {
    slidesPerView: 2,
    spaceBetween: 24,
    navigation: false,
    pagination: {
      clickable: true,
      type: 'bullets',
    },
  },
  640: {
    slidesPerView: 3,
    spaceBetween: 24,
    navigation: false,
    pagination: {
      clickable: true,
      type: 'bullets',
    },
  },
  861: {
    slidesPerView: 2,
    spaceBetween: 24,
    navigation: false,
    pagination: {
      clickable: true,
      type: 'bullets',
    },
  },
  1024: {
    slidesPerView: 3,
    spaceBetween: 24,
    navigation: false,
    pagination: {
      clickable: true,
      type: 'bullets',
    },
  },
  1366: {
    slidesPerView: 4,
    spaceBetween: 24,
  },
};

export default memo(Banner);

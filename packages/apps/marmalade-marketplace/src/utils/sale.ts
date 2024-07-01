export const getTokenSaleBadgeLabel = (saleType?: string): string => {
  if (saleType === 'marmalade-sale.conventional-auction') {
    return 'Conventional Auction';
  }

  if (saleType === 'marmalade-sale.dutch-auction') {
    return 'Dutch Auction';
  }

  return 'Regular Sale';
};

type Auction = {
  startDate: number; // timestamps in milliseconds
  endDate: number; // timestamps in milliseconds
  reservePrice: number;
  startPrice: number;
  priceIntervalSeconds: number; // in seconds
};

export const getCurrentPrice = (
  auction: Auction,
  targetTime: number,
): number => {
  console.log('getCurrentPrice', auction, targetTime);
  const { startDate, endDate, reservePrice, startPrice, priceIntervalSeconds } =
    auction;

  const auctionDurationSeconds = (endDate - startDate) / 1000;
  const salePeriodFullIntervals =
    Math.ceil(auctionDurationSeconds / priceIntervalSeconds) - 1;
  const remainingIntervals =
    Math.ceil((endDate - targetTime) / 1000 / priceIntervalSeconds) - 1;
  const priceRange = startPrice - reservePrice;
  const priceDropPerInterval = priceRange / salePeriodFullIntervals;

  if (targetTime < startDate || targetTime >= endDate) {
    return 0.0;
  }

  return parseFloat(
    (reservePrice + remainingIntervals * priceDropPerInterval).toFixed(2),
  );
};

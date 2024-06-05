export const getTokenSaleBadgeLabel = (saleType?: string): string => {
  if (saleType === 'marmalade-sale.conventional-auction') {
    return 'Conventional Auction';
  }

  if (saleType === 'marmalade-sale.dutch-auction') {
    return 'Dutch Auction';
  }

  return 'Regular Sale';
};

import { IFungibleBalance, builder } from '../builder';

export default builder
  .objectRef<IFungibleBalance>('FungibleBalance')
  .implement({ fields: (t) => ({}) });

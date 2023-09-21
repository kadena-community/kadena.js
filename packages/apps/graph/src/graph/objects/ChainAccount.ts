import { IChainAccount, builder } from '../builder';

export default builder
  .objectRef<IChainAccount>('ChainAccount')
  .implement({ fields: (t) => ({}) });

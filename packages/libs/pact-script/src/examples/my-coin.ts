import { enforce } from '../fw';
import { CoinContract } from './coin-contract';

// define a contract that behave exactly like the CoinContract but its not possible to change the admin guard
export class MyCoin extends CoinContract {
  public static readonly moduleName = 'my-coin';

  protected CHANGE_ADMIN_GUARD = this.capability('CHANGE_ADMIN_GUARD', () => {
    enforce(false, 'NOT_CHANGEABLE', 'You cannot change the admin guard');
  });
}

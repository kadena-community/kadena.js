import { createStore } from 'zustand';
import {
  persist,
  devtools,
  subscribeWithSelector
} from 'zustand/middleware';

// -----
// Chains
import {
  ChainActions,
  Chains,
  StoreHandlers as ChainStoreHandlers
} from './chain/type';
import {
  initialState as chainInitialState,
  reducer as chainReducer
} from './chain/reducers';
import {
  storeChainHandlers,
} from './chain/handlers';
// -----
// UX
import {
  UXActions,
  UXState,
  StoreHandlers as UXStoreHandlers
} from './ux/type';
import {
  initialState as uxInitialState,
  reducer as uxReducer,
} from './ux/reducers';
import {
  storeUXHandlers
} from './ux/handlers';
// -----

export type AppState = Chains & UXState;

export type AppAction = {
  entity: string;
} & (
  | ChainActions
  | UXActions
);

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.entity) {
    case 'chain':
      const chainState = chainReducer(state, action);
      return { ...state, ...chainState };
    case 'ux':
      const uxState = uxReducer(state, action);
      return { ...state, ...uxState };
    default:
      return state;
  }
};

export type AppStore = AppState
  & {
    dispatch: (action: AppAction) => void
  };

const initialState: AppState = {
  ...chainInitialState,
  ...uxInitialState,
};


const hasPayload = (action: AppAction): action is AppAction & { payload: unknown } => {
  return 'payload' in action;
};

export const appStore = createStore<AppStore>()(
  devtools(
    subscribeWithSelector(
      persist(
        (set, get) => {
          const dispatch = (action: AppAction) => {
            const actionType = `${action.entity}/${(action as { type?: string }).type || 'unknown'}`;
            const currentState = get();
            const newState = appReducer(currentState, action);

            set(newState, false, {
              type: actionType,
              payload: hasPayload(action) ? action.payload : undefined,
            });
          };

          return {
            dispatch,
            ...initialState,
          };
        },
        {
          name: 'chainweb-app-store',
        }
      )
    ),
    {
      name: 'Chainweb App Store',
      enabled: process.env.NODE_ENV === 'development',
      trace: true,
      traceLimit: 25,
      serialize: {
        actions: true,
      }
    }
  )
);

export default appStore;

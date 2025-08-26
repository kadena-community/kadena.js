export type Action =
  | { type: 'init'; payload: string[] }
  | { type: 'add'; payload: string }
  | { type: 'remove'; payload: string };

export const domainsReducer = (state: string[] = [], action: Action) => {
  switch (action.type) {
    case 'init':
      return action.payload || [];
    case 'add':
      return [...state, action.payload];
    case 'remove':
      return state.filter((domain) => domain !== action.payload);
    default:
      return state;
  }
};

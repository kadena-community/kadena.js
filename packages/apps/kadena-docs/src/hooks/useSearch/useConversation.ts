import type { StreamMetaData } from '@7-docs/edge';
import type { Reducer } from 'react';
import { useReducer } from 'react';

interface Interaction {
  input: string;
  output: string;
}

interface InteractionWithMetadata extends Interaction {
  metadata: StreamMetaData[] | null;
}

export interface IConversation extends Interaction {
  history: InteractionWithMetadata[];
}

type ActionType =
  | {
      type: 'setInput';
      value: string;
    }
  | {
      type: 'commit';
      value: string;
      metadata: StreamMetaData[] | null;
    }
  | {
      type: 'reset';
    };

const initialState = { input: '', output: '', history: [] };

const conversationReducer: Reducer<IConversation, ActionType> = (
  state,
  action,
) => {
  switch (action.type) {
    case 'setInput':
      return { ...state, input: action.value };
    case 'commit':
      return {
        input: '',
        output: '',
        history: [
          ...state.history,
          {
            input: state.input,
            output: action.value,
            metadata: action.metadata,
          },
        ],
      };
    case 'reset':
      return initialState;
    default:
      return state;
  }
};

export const useConversation = (): [
  IConversation,
  (action: ActionType) => void,
] => {
  const [state, dispatch] = useReducer(conversationReducer, initialState);
  return [state, dispatch];
};

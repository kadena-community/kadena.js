import type { StreamMetaData } from '@7-docs/shared/dist/types';
import type { Reducer } from 'react';
import { useReducer } from 'react';

interface IInteraction {
  input: string;
  output: string;
}

interface IInteractionWithMetadata extends IInteraction {
  metadata?: StreamMetaData[];
}

export interface IConversation extends IInteraction {
  history: IInteractionWithMetadata[];
}

type ActionType =
  | {
      type: 'setInput';
      value: string;
    }
  | {
      type: 'commit';
      value: string;
      metadata?: StreamMetaData[];
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

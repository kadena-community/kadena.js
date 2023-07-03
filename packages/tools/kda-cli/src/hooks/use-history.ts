import fs from 'fs';
import { useCallback, useState } from 'react';

const readOrCreateHistory = (): Record<string, HistoryValue> => {
  try {
    return JSON.parse(fs.readFileSync('.kda-history.json', 'utf-8'));
  } catch (e) {
    return {};
  }
};

export type HistoryValue =
  | string
  | boolean
  | string[]
  | Record<string, unknown>;

const isSuggestable = (value: unknown): value is string[] => {
  return Array.isArray(value);
};

type Callback = (newValue: HistoryValue) => void;
export const useHistory = (
  name: string,
): { history: HistoryValue; onSave: Callback; onSet: Callback } => {
  const [history, setHistory] = useState<Record<string, HistoryValue>>(
    readOrCreateHistory(),
  );
  const onSave = useCallback(
    (newValues: HistoryValue): void => {
      const h = readOrCreateHistory();
      const v = Array.isArray(newValues) ? newValues : [newValues];
      const readSuggestions = h[name];
      const suggestions: string[] = isSuggestable(readSuggestions)
        ? readSuggestions
        : [];
      fs.writeFileSync(
        '.kda-history.json',
        JSON.stringify(
          {
            ...h,
            [name]: Array.from(new Set([...suggestions, ...v]).values()),
          },
          null,
          2,
        ),
        'utf-8',
      );
    },
    [history, setHistory, name],
  );
  const onSet = useCallback(
    (newValue: HistoryValue): void => {
      const h = readOrCreateHistory();
      fs.writeFileSync(
        '.kda-history.json',
        JSON.stringify(
          {
            ...h,
            [name]: newValue,
          },
          null,
          2,
        ),
        'utf-8',
      );
    },
    [history, setHistory, name],
  );
  const requestedHistory = history[name];
  return {
    history: requestedHistory === 'undefined' ? [] : requestedHistory,
    onSave,
    onSet,
  };
};

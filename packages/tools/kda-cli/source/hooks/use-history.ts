import fs from 'fs';
import {useCallback, useState} from 'react';
const readOrCreateHistory = () => {
	try {
		return JSON.parse(fs.readFileSync('.kda-history.json', 'utf-8'));
	} catch (e) {
		return {};
	}
};

type HistoryValue = string | string[] | Record<string, any>;

export const useHistory = (
	name: string,
): {history: HistoryValue; onSave: Function; onSet: Function} => {
	const [history, setHistory] = useState<Record<string, HistoryValue>>(
		readOrCreateHistory(),
	);
	const onSave = useCallback(
		(newValues: string | string[]) => {
			const h = readOrCreateHistory();
			const v = Array.isArray(newValues) ? newValues : [newValues];
			fs.writeFileSync(
				'.kda-history.json',
				JSON.stringify(
					{
						...h,
						[name]: Array.from(new Set([...(h[name] ?? []), ...v]).values()),
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
		(newValue: any) => {
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
	return {
		history: history[name] || [],
		onSave,
		onSet,
	};
};

export type Answers = {
	[key: string]: string | string[];
};

type Choice = {
	label: string;
	value: string;
};
export type Question = {
	type:
		| 'input'
		| 'select'
		| 'multi-select'
		| 'confirm'
		| 'multi-input'
		| 'rerun'
		| 'execute';
	name: string;
	message: string;
	defaultValue?: string | string[];
	choices?: Choice[];
	suggestions?: string[];
	when?: (answers: Answers) => boolean;
	action?: (answers: Answers) => Promise<Answers>;
};
export type QuestionAnswer = {
	current?: Question;
	questions: Question[];
	answers: Answers;
	answeredQuestions: {question: Question; answer: Answers}[];
};

const findNextQuestion = (
	question: Question,
	questions: Question[],
	answers: Answers,
): Question | undefined => {
	const index = questions.indexOf(question);
	if (index === -1) return undefined;
	const next = questions[index + 1];
	if (next?.when && !next.when(answers))
		return findNextQuestion(next, questions, answers);
	return next;
};
export const getNextQuestion = ({
	current,
	questions,
	answers,
	answeredQuestions,
}: QuestionAnswer): QuestionAnswer => {
	if (!current)
		return {
			current: questions[0],
			questions,
			answers,
			answeredQuestions,
		};

	return {
		current: findNextQuestion(current, questions, answers),
		questions,
		answers,
		answeredQuestions,
	};
};

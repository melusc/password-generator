import {randomInt} from 'node:crypto';

export const defaultOptions: Readonly<Options> = {
	length: 32,
	number: true,
	uppercase: true,
	lowercase: true,
	special: true,
} as const;

export const red = (s: string) => `\u001B[91m${s}\u001B[0m`;

const charSets = ['uppercase', 'lowercase', 'number', 'special'] as const;

export type Options = {
	length: number;
	number: boolean;
	uppercase: boolean;
	lowercase: boolean;
	special: boolean;
};

const getMinLength = (options: Options) => {
	let result = 0;

	for (const set of charSets) {
		if (options[set]) {
			++result;
		}
	}

	return result;
};

export const normalizeOptions = (
	flags: Partial<Omit<Options, 'length'>>,
	input: string[],
): Options => {
	const result = {...defaultOptions};

	for (const set of charSets) {
		result[set] = flags[set] ?? false;
	}

	if (!charSets.some(set => result[set])) {
		for (const set of charSets) {
			result[set] = true;
		}
	}

	const lengthOverride = input[0];

	if (lengthOverride !== undefined) {
		result.length = Number(lengthOverride.trim().trim());

		if (!Number.isInteger(result.length)) {
			throw new TypeError(`Non-digit input for length: "${lengthOverride}"`);
		}
	}

	result.length = Math.max(result.length, getMinLength(result));

	return result;
};

export const shuffleArray = <T>(array: T[]) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = randomInt(i);
		[array[i], array[j]] = [array[j]!, array[i]!];
	}
};

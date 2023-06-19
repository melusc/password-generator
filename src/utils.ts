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

export const normalizeOptions = (
	flags: Partial<Omit<Options, 'length'>>,
	input: string[],
): Options => {
	const result = {...defaultOptions};

	// Only enable the explicitely enabled character sets
	for (const set of charSets) {
		result[set] = flags[set] ?? false;
	}

	// Unless none are enabled, in that case enable all
	if (!charSets.some(set => result[set])) {
		for (const set of charSets) {
			result[set] = true;
		}
	}

	const lengthOverride = input[0];

	if (lengthOverride !== undefined) {
		result.length = Number(lengthOverride.trim());

		if (!Number.isInteger(result.length)) {
			throw new TypeError(`Received non-integer length: "${lengthOverride}"`);
		}
	}

	return result;
};

export const shuffleArray = <T>(array: T[]) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = randomInt(i);
		[array[i], array[j]] = [array[j]!, array[i]!];
	}
};

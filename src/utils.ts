import {randomInt} from 'node:crypto';

export const defaultOptions: Readonly<Options> = {
	length: 32,
	number: true,
	uppercase: true,
	lowercase: true,
	special: true,
} as const;

export const red = (s: string) => `\u001B[91m${s}\u001B[0m`;

export type Options = {
	length: number;
	number: boolean;
	uppercase: boolean;
	lowercase: boolean;
	special: boolean;
};

export const normalizeOptions = (
	flags: Partial<{
		uppercase: boolean | undefined;
		lowercase: boolean | undefined;
		special: boolean | undefined;
		number: boolean | undefined;
	}>,
	input: string[],
): Options => {
	const result = {...defaultOptions};

	result.uppercase = flags.uppercase ?? false;
	result.lowercase = flags.lowercase ?? false;
	result.number = flags.number ?? false;
	result.special = flags.special ?? false;

	if (
		!result.uppercase
		&& !result.lowercase
		&& !result.special
		&& !result.number
	) {
		result.lowercase = true;
		result.uppercase = true;
		result.number = true;
		result.special = true;
	}

	const lengthOverride = input[0];

	if (lengthOverride !== undefined) {
		result.length = Number(lengthOverride.trim().trim());

		if (!Number.isInteger(result.length)) {
			throw new TypeError(`Non-digit input for length: "${lengthOverride}"`);
		}
	}

	result.length = Math.max(result.length, 4);

	return result;
};

export const shuffleArray = (array: string[]) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = randomInt(i);
		[array[i], array[j]] = [array[j]!, array[i]!];
	}
};

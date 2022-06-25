import {randomInt} from 'node:crypto';

export const defaultOptions: Readonly<Options> = {
	length: 14,
	ambiguous: false,
	number: true,
	uppercase: true,
	lowercase: true,
	special: true,
} as const;

export const red = (s: string) => `\u001B[91m${s}\u001B[0m`;

export type Options = {
	length: number;
	ambiguous: boolean;
	number: boolean;
	uppercase: boolean;
	lowercase: boolean;
	special: boolean;
};

export const normalizeOptions = (
	flags: Partial<{
		length: string | undefined;
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

	const lengthOverride = flags.length ?? input[0];
	if (lengthOverride !== undefined) {
		if (!/^\s*\d+\s*$/.test(lengthOverride)) {
			throw new Error(`Length received a non-digit input: "${lengthOverride}"`);
		}

		result.length = Number(lengthOverride.trim());
	}

	result.length = Math.max(result.length, 4);

	if (!Number.isInteger(result.length)) {
		// In theory it should never get here
		result.length = defaultOptions.length;

		throw new Error(`Unexpected non-integer for length: ${result.length}`);
	}

	return result;
};

export const shuffleArray = (array: string[]) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = randomInt(i);
		[array[i], array[j]] = [array[j]!, array[i]!];
	}
};

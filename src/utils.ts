import {randomInt} from 'node:crypto';

export const defaultOptions: Readonly<Options> = {
	length: 14,
	ambiguous: false,
	number: true,
	minNumber: 1,
	uppercase: true,
	minUppercase: 1,
	lowercase: true,
	minLowercase: 1,
	special: true,
	minSpecial: 1,
} as const;

export const red = (s: string) => `\u001B[91m${s}\u001B[0m`;

export type Options = {
	length: number;
	ambiguous: boolean;
	number: boolean;
	minNumber: number;
	uppercase: boolean;
	minUppercase: number;
	lowercase: boolean;
	minLowercase: number;
	special: boolean;
	minSpecial: number;
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
			throw new Error(
				`Length received a non-digit input: "${lengthOverride}"`,
			);
		}

		result.length = Number(lengthOverride.trim());
	}

	result.minSpecial = result.special ? 1 : 0;
	result.minNumber = result.number ? 1 : 0;
	result.minUppercase = result.uppercase ? 1 : 0;
	result.minLowercase = result.lowercase ? 1 : 0;

	result.length = Math.max(
		result.length,
		result.minSpecial
			+ result.minNumber
			+ result.minUppercase
			+ result.minLowercase,
	);

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

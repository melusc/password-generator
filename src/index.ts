import {randomInt} from 'node:crypto';

import meow from 'meow';

type Options = {
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

const normalizeOptions = (options: Partial<Options>) => {
	options.length ??= 14;

	if (
		!options.uppercase
		&& !options.lowercase
		&& !options.special
		&& !options.number
	) {
		options.lowercase = true;
		options.uppercase = true;
		options.number = true;
	}

	options.lowercase = Boolean(options.lowercase);
	options.uppercase = Boolean(options.uppercase);
	options.special = Boolean(options.special);
	options.number = Boolean(options.number);

	options.length = Math.max(options.length, 5);
};

const defaultOptions: Readonly<Options> = {
	length: 14,
	ambiguous: false,
	number: true,
	minNumber: 1,
	uppercase: true,
	minUppercase: 0,
	lowercase: true,
	minLowercase: 0,
	special: false,
	minSpecial: 1,
} as const;

const sanitizePasswordLength = (options: Options) => {
	let minUppercaseCalc = 0;
	let minLowercaseCalc = 0;
	let minNumberCalc: number = options.minNumber;
	let minSpecialCalc: number = options.minSpecial;

	if (options.uppercase && options.minUppercase <= 0) {
		minUppercaseCalc = 1;
	} else if (!options.uppercase) {
		minUppercaseCalc = 0;
	}

	if (options.lowercase && options.minLowercase <= 0) {
		minLowercaseCalc = 1;
	} else if (!options.lowercase) {
		minLowercaseCalc = 0;
	}

	if (options.number && options.minNumber <= 0) {
		minNumberCalc = 1;
	} else if (!options.number) {
		minNumberCalc = 0;
	}

	if (options.special && options.minSpecial <= 0) {
		minSpecialCalc = 1;
	} else if (!options.special) {
		minSpecialCalc = 0;
	}

	// This should never happen but is a final safety net
	if (options.length === 0) {
		options.length = 10;
	}

	const minLength: number
		= minUppercaseCalc + minLowercaseCalc + minNumberCalc + minSpecialCalc;
	// Normalize and Generation both require this modification
	if (options.length < minLength) {
		options.length = minLength;
	}

	options.minUppercase = minUppercaseCalc;
	options.minLowercase = minLowercaseCalc;
	options.minNumber = minNumberCalc;
	options.minSpecial = minSpecialCalc;
};

const shuffleArray = (array: string[]) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = randomInt(i);
		[array[i], array[j]] = [array[j]!, array[i]!];
	}
};

// eslint-disable-next-line complexity
const generatePassword = (options: Partial<Options>): string => {
	normalizeOptions(options);
	// Overload defaults with given options
	const o: Options = {...defaultOptions, ...options};

	// Sanitize
	sanitizePasswordLength(o);

	const minLength: number
		= o.minUppercase + o.minLowercase + o.minNumber + o.minSpecial;
	if (o.length < minLength) {
		o.length = minLength;
	}

	const positions: string[] = [];
	if (o.lowercase) {
		for (let i = 0; i < o.minLowercase; i++) {
			positions.push('l');
		}
	}

	if (o.uppercase) {
		for (let i = 0; i < o.minUppercase; i++) {
			positions.push('u');
		}
	}

	if (o.number) {
		for (let i = 0; i < o.minNumber; i++) {
			positions.push('n');
		}
	}

	if (o.special) {
		for (let i = 0; i < o.minSpecial; i++) {
			positions.push('s');
		}
	}

	while (positions.length < o.length) {
		positions.push('a');
	}

	// Shuffle
	shuffleArray(positions);

	// Build out the char sets
	let allCharSet = '';

	let lowercaseCharSet = 'abcdefghijkmnopqrstuvwxyz';
	if (o.ambiguous) {
		lowercaseCharSet += 'l';
	}

	if (o.lowercase) {
		allCharSet += lowercaseCharSet;
	}

	let uppercaseCharSet = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
	if (o.ambiguous) {
		uppercaseCharSet += 'IO';
	}

	if (o.uppercase) {
		allCharSet += uppercaseCharSet;
	}

	let numberCharSet = '23456789';
	if (o.ambiguous) {
		numberCharSet += '01';
	}

	if (o.number) {
		allCharSet += numberCharSet;
	}

	const specialCharSet = '!@#$%^&*';
	if (o.special) {
		allCharSet += specialCharSet;
	}

	let password = '';
	for (let i = 0; i < o.length; i++) {
		let positionChars: string;
		switch (positions[i]) {
			case 'l':
				positionChars = lowercaseCharSet;
				break;
			case 'u':
				positionChars = uppercaseCharSet;
				break;
			case 'n':
				positionChars = numberCharSet;
				break;
			case 's':
				positionChars = specialCharSet;
				break;
			case 'a':
				positionChars = allCharSet;
				break;
			default:
				throw new Error('Unexpected default branch'); // Should never happen
		}

		const randomCharIndex = randomInt(positionChars.length - 1);
		password += positionChars.charAt(randomCharIndex);
	}

	return password;
};

const {flags} = meow(
	`
Usage: bw [options]

Generate a password/passphrase.

Options:
  -u, --uppercase          Include uppercase characters.
  -l, --lowercase          Include lowercase characters.
  -n, --number             Include numeric characters.
  -s, --special            Include special characters.
  --length <length>        Length of the password.
  -h, --help               display help for command

  Notes:

    Default options are \`-uln --length 14\`.

    Minimum \`length\` is 5.

  Examples:

    bw
    bw -u -l --length 18
    bw -ulns --length 25
    bw -ul
`,
	{
		importMeta: import.meta,
		allowUnknownFlags: false,
		booleanDefault: undefined,
		flags: {
			uppercase: {
				alias: 'u',
				type: 'boolean',
			},
			lowercase: {
				alias: 'l',
				type: 'boolean',
			},
			number: {
				alias: 'n',
				type: 'boolean',
			},
			special: {
				alias: 's',
				type: 'boolean',
			},
			length: {
				type: 'number',
			},
			help: {
				alias: 'h',
				type: 'boolean',
			},
		},
	},
);

console.log(generatePassword(flags));

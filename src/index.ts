import {randomInt} from 'node:crypto';
import {exit} from 'node:process';

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
	if (
		!options.uppercase
		&& !options.lowercase
		&& !options.special
		&& !options.number
	) {
		options.lowercase = true;
		options.uppercase = true;
		options.number = true;
		options.special = true;
	}

	options.lowercase ??= false;
	options.uppercase ??= false;
	options.number ??= false;
	options.special ??= false;

	options.length = Math.max(options.length ?? defaultOptions.length, 5);
	if (Number.isNaN(options.length)) {
		options.length = defaultOptions.length;
	}
};

const defaultOptions: Readonly<Options> = {
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

const setMinLengths = (options: Options) => {
	options.minSpecial = options.special ? 1 : 0;
	options.minLowercase = options.lowercase ? 1 : 0;
	options.minUppercase = options.uppercase ? 1 : 0;
	options.minNumber = options.number ? 1 : 0;
};

const shuffleArray = (array: string[]) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = randomInt(i);
		[array[i], array[j]] = [array[j]!, array[i]!];
	}
};

const generatePassword = (options: Partial<Options>): string => {
	normalizeOptions(options);
	// Overload defaults with given options
	const o: Options = {...defaultOptions, ...options};

	// Sanitize
	setMinLengths(o);

	const positions: string[] = [];
	for (let i = 0; i < o.minLowercase; i++) {
		positions.push('l');
	}

	for (let i = 0; i < o.minUppercase; i++) {
		positions.push('u');
	}

	for (let i = 0; i < o.minNumber; i++) {
		positions.push('n');
	}

	for (let i = 0; i < o.minSpecial; i++) {
		positions.push('s');
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

const {flags, input} = meow(
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

if (input.length > 0 && !/^\d+$/.test(input[0]!)) {
	console.error(
		'\u001B[91mUnexpected non-digit input for length: "%s"\u001B[0m',
		input[0],
	);
	exit(1);
}

flags.length ??= Number(input[0]);

console.log(generatePassword(flags));

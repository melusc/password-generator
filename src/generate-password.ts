import {randomInt} from 'node:crypto';

import {Options, shuffleArray} from './utils.js';

export const generatePositions = (options: Options): string[] => {
	const positions: string[] = [];

	if (options.lowercase) {
		positions.push('l');
	}

	if (options.uppercase) {
		positions.push('u');
	}

	if (options.number) {
		positions.push('n');
	}

	if (options.special) {
		positions.push('s');
	}

	while (positions.length < options.length) {
		positions.push('a');
	}

	return positions;
};

export const generatePassword = (options: Options): string => {
	const positions = generatePositions(options);

	// Shuffle
	shuffleArray(positions);

	// Build out the char sets
	let allCharSet = '';

	const lowercaseCharSet = 'abcdefghijklmnopqrstuvwxyz';

	if (options.lowercase) {
		allCharSet += lowercaseCharSet;
	}

	const uppercaseCharSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

	if (options.uppercase) {
		allCharSet += uppercaseCharSet;
	}

	const numberCharSet = '0123456789';

	if (options.number) {
		allCharSet += numberCharSet;
	}

	const specialCharSet = '~`!@#$%^&*()_-+={[}]|:;"\'<,>.?/';
	if (options.special) {
		allCharSet += specialCharSet;
	}

	let password = '';
	for (let i = 0; i < options.length; i++) {
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

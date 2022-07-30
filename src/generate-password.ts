import {randomInt} from 'node:crypto';

import {Options, shuffleArray} from './utils.js';

type Chars = 'a' | 'l' | 'n' | 's' | 'u';

export const generatePositions = (options: Options): Chars[] => {
	const positions: Chars[] = [];

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

export const lowercaseCharSet = 'abcdefghijklmnopqrstuvwxyz';
export const uppercaseCharSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const numberCharSet = '0123456789';
export const specialCharSet = '~!@#$%^&*()_-+=:;<,>.?/';

export const generatePassword = (options: Options): string => {
	const positions = generatePositions(options);

	// Shuffle
	shuffleArray(positions);

	// Build out the char sets
	let allCharSet = '';

	if (options.lowercase) {
		allCharSet += lowercaseCharSet;
	}

	if (options.uppercase) {
		allCharSet += uppercaseCharSet;
	}

	if (options.number) {
		allCharSet += numberCharSet;
	}

	if (options.special) {
		allCharSet += specialCharSet;
	}

	const map = {
		a: allCharSet,
		l: lowercaseCharSet,
		n: numberCharSet,
		s: specialCharSet,
		u: uppercaseCharSet,
	} as const;

	let password = '';
	for (const type of positions) {
		const positionChars = map[type];
		const randomCharIndex = randomInt(positionChars.length);
		password += positionChars.charAt(randomCharIndex);
	}

	return password;
};

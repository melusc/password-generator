import {randomInt} from 'node:crypto';

import {Options, shuffleArray} from './utils.js';

export const generatePassword = (options: Options): string => {
	const positions: string[] = [];
	for (let i = 0; i < options.minLowercase; i++) {
		positions.push('l');
	}

	for (let i = 0; i < options.minUppercase; i++) {
		positions.push('u');
	}

	for (let i = 0; i < options.minNumber; i++) {
		positions.push('n');
	}

	for (let i = 0; i < options.minSpecial; i++) {
		positions.push('s');
	}

	while (positions.length < options.length) {
		positions.push('a');
	}

	// Shuffle
	shuffleArray(positions);

	// Build out the char sets
	let allCharSet = '';

	let lowercaseCharSet = 'abcdefghijkmnopqrstuvwxyz';
	if (options.ambiguous) {
		lowercaseCharSet += 'l';
	}

	if (options.lowercase) {
		allCharSet += lowercaseCharSet;
	}

	let uppercaseCharSet = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
	if (options.ambiguous) {
		uppercaseCharSet += 'IO';
	}

	if (options.uppercase) {
		allCharSet += uppercaseCharSet;
	}

	let numberCharSet = '23456789';
	if (options.ambiguous) {
		numberCharSet += '01';
	}

	if (options.number) {
		allCharSet += numberCharSet;
	}

	const specialCharSet = '!@#$%^&*';
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

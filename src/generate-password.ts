import {randomInt} from 'node:crypto';

import {type Options, shuffleArray} from './utils.js';

export const lowercaseCharSet = 'abcdefghijklmnopqrstuvwxyz';
export const uppercaseCharSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const numberCharSet = '0123456789';
export const specialCharSet = '~!@#$%^&*()_-+=:;<,>.?/';

function randomChar(chars: string) {
	const index = randomInt(chars.length);
	return chars.charAt(index);
}

export function generatePassword(options: Options): string {
	// For `-luns` it pushes a lowercase, uppercase, etc. character
	// to the password, to guarantee at least one of each
	// Any requested type is also pushed to `allCharSet`
	// The rest of the password will be taken from there
	let allCharSet = '';
	const password: string[] = [];

	if (options.lowercase) {
		allCharSet += lowercaseCharSet;
		password.push(randomChar(lowercaseCharSet));
	}

	if (options.uppercase) {
		allCharSet += uppercaseCharSet;
		password.push(randomChar(uppercaseCharSet));
	}

	if (options.number) {
		allCharSet += numberCharSet;
		password.push(randomChar(numberCharSet));
	}

	if (options.special) {
		allCharSet += specialCharSet;
		password.push(randomChar(specialCharSet));
	}

	while (password.length < options.length) {
		password.push(randomChar(allCharSet));
	}

	shuffleArray(password);
	return password.join('');
}

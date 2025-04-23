/*!
	This program is free software: you can redistribute it
	and/or modify it under the terms of the GNU General Public
	License as published by the Free Software Foundation,
	either version 3 of the License, or (at your option)
	any later version.

	This program is distributed in the hope that it will be
	useful, but WITHOUT ANY WARRANTY; without even the implied
	warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
	PURPOSE. See the GNU General Public License for more details.

	You should have received a copy of the GNU General Public
	License along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

import {exit} from 'node:process';
import {styleText, parseArgs} from 'node:util';

import {generatePassword} from '@lusc/util/generate-password';

import {normalizeOptions} from './utilities.js';

const {values: flags, positionals: input} = parseArgs({
	options: {
		uppercase: {
			short: 'u',
			type: 'boolean',
		},
		lowercase: {
			short: 'l',
			type: 'boolean',
		},
		number: {
			short: 'n',
			type: 'boolean',
		},
		special: {
			short: 's',
			type: 'boolean',
		},
		help: {
			short: 'h',
			type: 'boolean',
		},
	},
	allowPositionals: true,
});

if (flags.help) {
	console.log();
	console.log(
		`
Usage: pw [options]

Generate a password/passphrase.

Options:
  -u, --uppercase          Include uppercase characters.
  -l, --lowercase          Include lowercase characters.
  -n, --number             Include numeric characters.
  -s, --special            Include special characters.
  -h, --help               display help for command

  Notes:

    Default options are \`-luns 14\`.

    Minimum \`length\` is 4.

  Examples:

    pw
    pw -u -l 18
    pw -s 25
    pw -ul
	
	GPLv3 (c) Luca Schnellmann, 2025
`
			.trim()
			.replaceAll(/^/gm, '  '),
	);
	console.log();

	exit(0);
}

try {
	const options = normalizeOptions(flags, input);
	console.log(generatePassword(options));
} catch (error: unknown) {
	if (error instanceof Error) {
		console.error(styleText('red', error.message));
		exit(1);
	} else {
		throw error;
	}
}

import {exit} from 'node:process';
import {parseArgs} from 'node:util';
import {generatePassword} from './generate-password.js';

import {normalizeOptions, red} from './utils.js';

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
Usage: bw [options]

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

    bw
    bw -u -l 18
    bw -s 25
    bw -ul
`
			.trim()
			.replace(/^/gm, '  '),
	);
	console.log();

	exit(0);
}

try {
	const options = normalizeOptions(flags, input);
	console.log(generatePassword(options));
} catch (error: unknown) {
	if (error instanceof Error) {
		console.error(red(error.message));
		exit(1);
	} else {
		throw error;
	}
}

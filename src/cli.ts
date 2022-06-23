import {exit} from 'node:process';
import {parseArgs} from 'node:util';
import {generatePassword} from './generate-password.js';

import {normalizeOptions} from './utils.js';

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
		length: {
			type: 'string',
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
`
			.trim()
			.replace(/^/gm, '  '),
	);
	console.log();

	exit(0);
}

const options = normalizeOptions(flags, input);

console.log(generatePassword(options));

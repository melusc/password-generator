import assert from 'node:assert/strict';
import test from 'node:test';

import {generatePositions} from '../src/generate-password.js';
import {defaultOptions, Options} from '../src/utils.js';

const defaultOff: Options = {
	ambiguous: false,
	length: 0,
	lowercase: false,
	minLowercase: 0,
	uppercase: false,
	minUppercase: 0,
	number: false,
	minNumber: 0,
	special: false,
	minSpecial: 0,
};

await test('generatePositions', async t => {
	await t.test('lowercase, minLowercase 1', () => {
		assert.deepEqual(
			generatePositions({
				...defaultOff,
				minLowercase: 1,
				lowercase: true,
			}),
			['l'],
		);
	});

	await t.test('-luns all 1', () => {
		assert.deepEqual(
			generatePositions({
				...defaultOptions,
				length: 0,
			}).sort(),
			['l', 'n', 'u', 's'].sort(),
		);
	});

	await t.test('default', () => {
		assert.deepEqual(
			generatePositions(defaultOptions).sort(),
			[...'luns', ...'a'.repeat(10)].sort(),
		);
	});
});

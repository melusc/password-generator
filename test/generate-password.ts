import assert from 'node:assert/strict';
import test from 'node:test';

import {generatePositions} from '../src/generate-password.js';
import {defaultOptions, Options} from '../src/utils.js';

const defaultOff: Options = {
	length: 0,
	lowercase: false,
	uppercase: false,
	number: false,
	special: false,
};

await test('generatePositions', async t => {
	await t.test('lowercase, minLowercase 1', () => {
		assert.deepEqual(
			generatePositions({
				...defaultOff,
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

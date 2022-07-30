import assert from 'node:assert/strict';
import test from 'node:test';

import {
	generatePassword,
	generatePositions,
	lowercaseCharSet,
	numberCharSet,
	specialCharSet,
	uppercaseCharSet,
} from '../src/generate-password.js';
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
			[...'luns', ...'a'.repeat(28)].sort(),
		);
	});
});

await test('generatePassword', async t => {
	await t.test('length 200', () => {
		const password = generatePassword({
			length: 200,
			uppercase: true,
			lowercase: true,
			special: true,
			number: true,
		});
		assert.deepEqual(password.length, 200);
	});

	await t.test('-u length 200', () => {
		const password = generatePassword({
			length: 200,
			uppercase: true,
			lowercase: false,
			special: false,
			number: false,
		});

		assert.match(password, /^[A-Z]{200}$/);
	});

	await t.test('-l length 200', () => {
		const password = generatePassword({
			length: 200,
			uppercase: false,
			lowercase: true,
			special: false,
			number: false,
		});

		assert.match(password, /^[a-z]{200}$/);
	});

	await t.test('-n length 200', () => {
		const password = generatePassword({
			length: 200,
			uppercase: false,
			lowercase: false,
			special: false,
			number: true,
		});

		assert.match(password, /^\d{200}$/);
	});

	await t.test('-s length 200', () => {
		const password = generatePassword({
			length: 200,
			uppercase: false,
			lowercase: false,
			special: true,
			number: false,
		});

		assert.match(password, /^[^\da-z]{200}$/i);
	});

	await t.test('-luns length 200000', () => {
		const password = generatePassword({
			length: 200_000,
			uppercase: true,
			lowercase: true,
			special: true,
			number: true,
		});

		assert.equal(password.length, 200_000);

		assert.deepEqual(
			new Set([...password].sort()),
			new Set(
				[
					...(uppercaseCharSet
						+ lowercaseCharSet
						+ numberCharSet
						+ specialCharSet),
				].sort(),
			),
		);
	});
});

import assert from 'node:assert/strict';
import test from 'node:test';

import {
	generatePassword,
	lowercaseCharSet,
	numberCharSet,
	specialCharSet,
	uppercaseCharSet,
} from '../src/generate-password.js';

await test('generatePassword', async t => {
	await t.test('-luns 2', () => {
		const password = generatePassword({
			length: 2,
			lowercase: true,
			uppercase: true,
			special: true,
			number: true,
		});

		assert.match(password, /.*[a-z]/);
		assert.match(password, /.*[A-Z]/);
		assert.match(password, /.*\d/);
		assert.match(password, /.*[^\da-z]/i);
	});

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
					...(uppercaseCharSet +
						lowercaseCharSet +
						numberCharSet +
						specialCharSet),
				].sort(),
			),
		);
	});
});

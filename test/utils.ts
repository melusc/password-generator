import assert from 'node:assert/strict';
import test from 'node:test';

import type {Options} from '@lusc/util/generate-password';

import {defaultOptions, normalizeOptions} from '../src/utils.js';

await test('normalizeOptions', async t => {
	await t.test('Empty', () => {
		assert.deepEqual<Options>(normalizeOptions({}, []), {
			lowercase: true,
			uppercase: true,
			number: true,
			special: true,
			length: 32,
		});
	});

	await t.test('--lowercase', () => {
		assert.deepEqual<Options>(
			normalizeOptions(
				{
					lowercase: true,
				},
				[],
			),
			{
				...defaultOptions,
				lowercase: true,
				uppercase: false,
				number: false,
				special: false,
			},
		);
	});

	await t.test('Length 2', () => {
		assert.deepEqual<Options>(normalizeOptions({}, ['2']), {
			...defaultOptions,
			length: 2,
		});
	});

	await t.test('Length 8', () => {
		assert.deepEqual<Options>(normalizeOptions({}, ['8']), {
			...defaultOptions,
			length: 8,
		});
	});

	await t.test('Length abc', () => {
		assert.throws(() => {
			normalizeOptions({}, ['abc']);
		});
	});
});

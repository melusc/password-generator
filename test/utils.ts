import test from 'node:test';
import assert from 'node:assert/strict';

import {defaultOptions, normalizeOptions, Options} from '../src/utils.js';

await test('normalizeOptions', async t => {
	await t.test('Empty', () => {
		assert.deepEqual<Options>(normalizeOptions({}, []), {
			lowercase: true,
			uppercase: true,
			number: true,
			special: true,
			length: 14,
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

	await t.test('--length 14', () => {
		assert.deepEqual<Options>(
			normalizeOptions(
				{
					length: '16',
				},
				[],
			),
			{
				...defaultOptions,
				length: 16,
			},
		);
	});

	await t.test('--length 2', () => {
		assert.deepEqual<Options>(
			normalizeOptions(
				{
					length: '2',
				},
				[],
			),
			{
				...defaultOptions,
				length: 4,
			},
		);
	});

	await t.test('--length abc', () => {
		assert.throws(() => {
			normalizeOptions(
				{
					length: 'abc',
				},
				[],
			);
		});
	});

	await t.test('Length as positional: 8', () => {
		assert.deepEqual<Options>(normalizeOptions({}, ['8']), {
			...defaultOptions,
			length: 8,
		});
	});

	await t.test('Length as positional: abc', () => {
		assert.throws(() => {
			normalizeOptions({}, ['abc']);
		});
	});
});

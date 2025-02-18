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

import assert from 'node:assert/strict';
import test from 'node:test';

import type {Options} from '@lusc/util/generate-password';

import {defaultOptions, normalizeOptions} from '../src/utilities.js';

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

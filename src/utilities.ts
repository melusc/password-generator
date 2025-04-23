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

import type {Options} from '@lusc/util/generate-password';

export const defaultOptions: Readonly<Options> = {
	length: 32,
	number: true,
	uppercase: true,
	lowercase: true,
	special: true,
} as const;

const charSets = ['uppercase', 'lowercase', 'number', 'special'] as const;

export const normalizeOptions = (
	flags: Partial<Omit<Options, 'length'>>,
	input: string[],
): Options => {
	const result = {...defaultOptions};

	// Only enable the explicitely enabled character sets
	for (const set of charSets) {
		result[set] = flags[set] ?? false;
	}

	// Unless none are enabled, in that case enable all
	if (!charSets.some(set => result[set])) {
		for (const set of charSets) {
			result[set] = true;
		}
	}

	const lengthOverride = input[0];

	if (lengthOverride !== undefined) {
		result.length = Number(lengthOverride.trim());

		if (!Number.isInteger(result.length)) {
			throw new TypeError(`Received non-integer length: "${lengthOverride}"`);
		}
	}

	return result;
};

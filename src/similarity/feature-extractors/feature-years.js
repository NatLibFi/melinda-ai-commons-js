/**
 *
 * @licstart  The following is the entire license notice for the JavaScript code in this file.
 *
 * AI modules for Melinda's applications
 *
 * Copyright (c) 2017-2018 University Of Helsinki (The National Library Of Finland)
 *
 * This file is part of melinda-ai-commons-js
 *
 * melinda-ai-commons-js is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * melinda-ai-commons-js is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
 **/

/* eslint-disable camelcase */

import * as compareFuncs from './core.compare';
import {Labels} from './constants';

import {
	normalize,
	select,
	clone,
	createField
} from './utils';

export default function (record1, record2) {
	// Will generate a set of years found in the record for matching
	// 500a, 008 merkkipaikat 7-11 ja 12-16 + 260c tehdään vuosista setti ja verrataan niitä keskenään

	let fields1 = select(['260..c', '500..a'], record1);
	let fields2 = select(['260..c', '500..a'], record2);

	const rec1_008 = record1.controlfield.find(f => {
		return f.$.tag === '008';
	});
	const rec2_008 = record2.controlfield.find(f => {
		return f.$.tag === '008';
	});

	if (rec1_008 === undefined) {
		throw new Error('Record is missing field 008');
	}

	if (rec2_008 === undefined) {
		throw new Error('Record is missing field 008');
	}

	const fields_from_008_1 = [rec1_008._.substr(7, 4), rec1_008._.substr(11, 4)].map(createField('008', 'a'));
	const fields_from_008_2 = [rec2_008._.substr(7, 4), rec2_008._.substr(11, 4)].map(createField('008', 'a'));

	fields1 = fields1.concat(fields_from_008_1);
	fields2 = fields2.concat(fields_from_008_2);

	const normalized1 = normalize(clone(fields1), ['onlyYearNumbers', 'removeEmpty']);
	const normalized2 = normalize(clone(fields2), ['onlyYearNumbers', 'removeEmpty']);

	const set1 = normalized1;
	const set2 = normalized2;

	function getData() {
		return {
			fields: [fields1, fields2],
			normalized: [normalized1, normalized2]
		};
	}

	function check() {
		if (set1.length === 0 || set2.length === 0) {
			return null;
		}

		if (compareFuncs.isIdentical(set1, set2)) {
			return Labels.SURE;
		}

		const equalFunc = function (a, b) {
			return a === b;
		};

		equalFunc.options = {nosubcode: true};

		if (compareFuncs.isSubset(set1, set2, equalFunc) || compareFuncs.isSubset(set2, set1, equalFunc)) {
			return Labels.ALMOST_SURE;
		}

		return Labels.SURELY_NOT;
	}

	return {
		check,
		getData
	};
}

/**
 *
 * @licstart  The following is the entire license notice for the JavaScript code in this file.
 *
 * AI modules for Melinda's applications
 *
 * Copyright (c) 2017-2019 University Of Helsinki (The National Library Of Finland)
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

const compareFuncs = require('./core.compare');
const {Labels} = require('./constants');

const {
	normalize,
	select,
	clone,
	hasSubfield
} = require('./utils');

function ISRN(record1, record2) {
	const fields1 = select(['027..a'], record1);
	const fields2 = select(['027..a'], record2);

	const normalized1 = normalize(clone(fields1), ['delChars(":-")', 'trimEnd', 'upper']);
	const normalized2 = normalize(clone(fields2), ['delChars(":-")', 'trimEnd', 'upper']);

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

		if (!hasSubfield(set1, 'a') || !hasSubfield(set2, 'a')) {
			return null;
		}

		if (compareFuncs.isIdentical(set1, set2)) {
			return Labels.SURE;
		}

		if (compareFuncs.isSubset(set1, set2) || compareFuncs.isSubset(set2, set1)) {
			return Labels.SURE;
		}

		if (compareFuncs.intersection(set1, set2).length > 0) {
			return Labels.ALMOST_SURE;
		}

		return Labels.SURELY_NOT;
	}

	return {
		check,
		getData
	};
}

module.exports = ISRN;

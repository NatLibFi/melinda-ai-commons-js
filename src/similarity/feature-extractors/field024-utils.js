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

const {Labels} = require('./constants');
const compareFuncs = require('./core.compare');

const {
	hasSubfield
} = require('./utils');

// Field 024 has multiple different standard numbers which share same check function.

function f024checkFunc(set1, set2) {
	return function () {
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
	};
}

const f024Normalizations = ['delChars(":-")', 'trimEnd', 'upper'];

module.exports = {
	f024checkFunc,
	f024Normalizations
};

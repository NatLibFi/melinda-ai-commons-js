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

/* eslint-disable no-unused-expressions, valid-jsdoc */

import {jaccard, levenshtein} from 'wuzzy';
import _ from 'lodash';

export {levenshtein};

export function stringEquals(string1, string2) {
	return (string1 === string2) ? 1 : 0;
}

export function stringJaccard(string1, string2) {
	const set1 = string1.split('');
	const set2 = string2.split('');
	return jaccard(set1, set2);
}

export function setCompare(set1, set2) {
	return _.intersection(set1, set2).length > 0 ? 1 : 0;
}

export function isIdentical(set1, set2, equalFunc) {
	return isSubset(set1, set2, equalFunc) && isSubset(set2, set1, equalFunc);
}

export function isSubset(set1, set2, equalFunc) {
	if (equalFunc !== undefined) {
		const equalFuncOptions = equalFunc.options || {nosubcode: true};
		if (equalFuncOptions.noNormalization) {
			return setDifference(set1, set2, equalFunc).length === 0;
		}

		return setDifference(fieldSetToString(set1, equalFuncOptions), fieldSetToString(set2, equalFuncOptions), equalFunc).length === 0;
	}

	return setDifference(fieldSetToString(set1), fieldSetToString(set2)).length === 0;
}

/**
* HasIntersection tests if the sets have atleast one intersecting element.
* @param  {Array of fields}  set1
* @param  {Array of fields}  set2
* @param  {CompareFunction}  equalFunc
* @return {Boolean}           true, if the sets have atleast one intersecting element.
*/
export function hasIntersection(set1, set2, equalFunc) {
	if (equalFunc !== undefined) {
		const equalFuncOptions = equalFunc.options || {nosubcode: true};
		return setDifference(fieldSetToString(set1, equalFuncOptions), fieldSetToString(set2, equalFuncOptions), equalFunc).length !== fieldSetToString(set1).length;
	}

	return setDifference(fieldSetToString(set1), fieldSetToString(set2), equalFunc).length !== fieldSetToString(set1).length;
}

export function intersection(set1, set2) {
	return _.intersection(fieldSetToString(set1), fieldSetToString(set2));
}

// Checks for each item in array1 if it exists in array2, returning items that do not exist in array2
export function setDifference(array1, array2, equalFunc) {
	return array1.filter(value => {
		return !setContains(array2, value, equalFunc);
	});
}

export function setContains(array, item, equalFunc) {
	if (equalFunc === undefined) {
		equalFunc = function (a, b) {
			return a === b;
		};
	}

	let i = 0;

	let length = array.length;
	for (; i < length; i++) {
		if (equalFunc(array[i], item)) {
			return true;
		}
	}

	return false;
}

export function fieldSetToString(fields, opts) {
	opts = opts || {};
	if (!_.isArray(fields)) {
		fields = [fields];
	}

	let subfields = [];
	fields.forEach(field => {
		const data = field.subfield.map(subfield => {
			return (opts.nosubcode ? '' : subfield.$.code) + subfield._;
		});
		subfields = subfields.concat(data);
	});
	return subfields;
}

export function abbrComparator(str1, str2) {
	const arr1 = str1.split(' ').sort();
	const arr2 = str2.split(' ').sort();
	if (longestItem(arr1) <= 1 ||
    longestItem(arr2) <= 1) {
		return false;
	}

	if (arr1.length !== arr2.length) {
		return false;
	}

	let i = 0;

	let length = arr1.length;
	// Abbreviations are in the beginning of sorted name,
	// so start from the end of the array to save abbreviations to last since they match more stuff
	for (; i < length; i++) {
		if (!has(arr1, arr2[length - 1 - i])) {
			return false;
		}
	}

	return true;

	function eq(str1, str2) {
		if (str1 === undefined || str2 === undefined) {
			return false;
		}

		if (str1.length === 1 || str2.length === 1) {
			return str1.substr(0, 1) === str2.substr(0, 1);
		}

		return str1 === str2;
	}

	function has(arr, item) {
		let i = 0;

		let length = arr.length;
		for (; i < length; i++) {
			if (eq(arr[i], item)) {
				delete (arr[i]);
				return true;
			}
		}

		return false;
	}
}

export function longestItem(arr) {
	let length = 0;
	for (let i = 0; i < arr.length; i++) {
		if (length < arr[i].length) {
			length = arr[i].length;
		}
	}

	return length;
}

export function lvComparator(threshold) {
	return function (str1, str2) {
		return levenshtein(str1, str2) >= threshold;
	};
}

export function jaccardComparator(threshold) {
	return function (str1, str2) {
		// Console.log(str1.split(' '), str2.split(' '), jaccard(str1.split(' '), str2.split(' ')));
		return jaccard(str1.split(' '), str2.split(' ')) >= threshold;
	};
}

export function distanceComparator(maxDistance) {
	return function (num1, num2) {
		if (isInt(num1) && isInt(num2)) {
			const n1 = parseInt(num1, 10);
			const n2 = parseInt(num2, 10);
			return Math.abs(n1 - n2) <= maxDistance;
		}

		return false;
	};
}

export function skipSmallerThan(num) {
	return function (num1, num2) {
		if (isInt(num1) && isInt(num2)) {
			if (num1 < num) {
				return false;
			}

			if (num2 < num) {
				return false;
			}

			return num1 === num2;
		}

		return false;
	};
}

export function isInt(x) {
	const y = parseInt(x, 10);
	return !isNaN(y) && x === y && x.toString() === y.toString();
}

export function stringPartofComparator(str1, str2) {
	if (str1.length < 2 || str2.length < 2) {
		return false;
	}

	const smaller = (str1.length < str2.length) ? str1 : str2;
	const larger = (smaller === str1) ? str2 : str1;

	if (smaller.length / larger.length <= 0.2) {
		return false;
	}

	return larger.indexOf(smaller) !== -1;
}

export function stringPartofComparatorRatio(ratio) {
	return function (str1, str2) {
		const strLengthRatio = Math.min(str1.length, str2.length) / Math.max(str1.length, str2.length);
		if (strLengthRatio >= ratio) {
			return stringPartofComparator(str1, str2);
		}

		return false;
	};
}

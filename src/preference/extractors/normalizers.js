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

export const identity = a => a;

export const lexical = (a, b) => a > b ? 1 : 0;

export const notNull = (a, b) => b === null ? (a === null ? 0 : 1) : 0;

export const invert = (a, b) => b;

export const proportion = (a, b) => b === 0 ? 1 : Math.min(a / b, 1);

export function moreRecent(maxAge, requiredAgeDifference) {
	return (a, b) => {
		const now = new Date();
		const currentYear = now.getFullYear();
		const currentMonth = now.getMonth() + 1;

		const age = ({year, month}) => (currentYear + (currentMonth / 12)) - (year + (month / 12));

		const dateA = parseDate(currentYear, a);
		const dateB = parseDate(currentYear, b);

		if (Math.abs(age(dateA) - age(dateB)) < requiredAgeDifference) {
			return 0;
		}

		if (age(dateA) < maxAge && age(dateB) < maxAge) {
			return age(dateA) < age(dateB) ? 1 : 0;
		}

		if (age(dateA) < maxAge) {
			return 1;
		}

		return 0;
	};
}

export function reprint(a, b) {
	if (b.notesOnReprints.some(note => note.includes(a.year))) {
		return 0;
	}

	if (a.notesOnReprints.some(note => note.includes(b.year))) {
		return 1;
	}

	return 0;
}

function parseDate(currentYear, str) {
	if (str.length === 6) {
		let year = parseInt(str.substr(0, 2), 10);
		const month = parseInt(str.substr(2, 2), 10);

		year = year > currentYear % 100 ? year + 1900 : year + 2000;
		return {year, month};
	}

	const year = parseInt(str.substr(0, 4), 10);
	const month = parseInt(str.substr(2, 2), 10);
	return {year, month};
}

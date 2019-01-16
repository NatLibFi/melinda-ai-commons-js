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

const {
	fromXMLjsFormat,
	extractFormat
} = require('./utils');

function format(record1, record2) {
	const formatA = extractFormat(fromXMLjsFormat(record1));
	const formatB = extractFormat(fromXMLjsFormat(record2));

	const formatNames = ['BK', 'CR', 'MP', 'MU', 'CF', 'MX', 'VM'];

	return {
		check,
		names: formatNames.map(name => `format-${name}`)
	};

	function check() {
		if (formatA === undefined || formatB === undefined) {
			return formatNames.map(() => null);
		}

		if (formatA !== formatB) {
			return formatNames.map(() => Labels.ABSOLUTELY_NOT_DOUBLE);
		}

		return formatNames.map(format => {
			return format === formatA ? Labels.SURE : Labels.SURELY_NOT;
		});
	}
}

module.exports = format;

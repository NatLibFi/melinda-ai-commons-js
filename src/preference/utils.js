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

import _ from 'lodash';

export function generateFeatures(record, extractorSet) {
	return _.flatMap(extractorSet, extractor => {
		return Object.keys(extractor).map(key => {
			return {
				name: key,
				value: extractor[key][0](record)
			};
		});
	});
}

export function generateFeatureVector(features) {
	return features.map(feature => feature.value);
}

export function normalizeFeatureVectors(vector1, vector2, extractorSet) {
	const normalizers = extractorSet.map(extractor => _.head(_.values(extractor))).map(val => val[1]);

	const vector1copy = vector1.slice();
	const vector2copy = vector2.slice();

	normalizers.forEach((normalizerFunc, index) => {
		if (typeof normalizerFunc !== 'function') {
			throw new TypeError(`normalizer '${normalizerFunc}' is not a function`);
		}

		vector1[index] = normalizerFunc(vector1copy[index], vector2copy[index]);
		vector2[index] = normalizerFunc(vector2copy[index], vector1copy[index]);
	});
}

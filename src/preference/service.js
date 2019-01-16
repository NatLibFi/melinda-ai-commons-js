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

import _ from 'lodash';
import {Network} from 'synaptic';
import {generateFeatures, generateFeatureVector, normalizeFeatureVectors} from './utils';

export function createService({model, extractorSet}) {
	const network = Network.fromJSON(model);

	return {find};

	function find(firstRecord, secondRecord) {
		const features1 = generateFeatures(firstRecord, extractorSet);
		const features2 = generateFeatures(secondRecord, extractorSet);

		const vector1 = generateFeatureVector(features1);
		const vector2 = generateFeatureVector(features2);

		normalizeFeatureVectors(vector1, vector2, extractorSet);

		const inputVector = _.concat(vector1, vector2);

		// 0 means first is better, 1 means second is better
		const label = network.activate(inputVector)[0];

		const preferredRecord = label < 0.5 ? firstRecord : secondRecord;
		const otherRecord = label < 0.5 ? secondRecord : firstRecord;

		return {
			preferredRecord, otherRecord
		};
	}
}

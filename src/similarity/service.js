/**
*
* @licstart  The following is the entire license notice for the JavaScript code in this file.
*
* AI modules for Melinda's applications
*
* Copyright (C) 2018 University Of Helsinki (The National Library Of Finland)
*
* This file is part of melinda-ai-commons-js
*
* melinda-ai-commons-js program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Lesser General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
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
* for the JavaScript code in this file.
*
*/

import createDebugLogger from 'debug';
import {Network} from 'synaptic';
import {pairToInputVector} from './utils';
import {bibDefault as strategy} from './strategy';

const IS_DUPLICATE_THRESHOLD = 0.9;
const NOT_DUPLICATE_TRESHOLD = 0.65;

export const ServiceStatus = {
	IS_DUPLICATE: 'IS_DUPLICATE',
	NOT_DUPLICATE: 'NOT_DUPLICATE',
	MAYBE_DUPLICATE: 'MAYBE_DUPLICATE'
};

export function createService({model}) {
	const debug = createDebugLogger('@natlibfi/melinda-ai-commons:similarity');
	const duplicateNetwork = Network.fromJSON(model);

	return {check};

	function check(preferredRecord, otherRecord) {
		const recordPair = {record1: preferredRecord, record2: otherRecord};
		const inputVector = pairToInputVector(recordPair, strategy);
		const numericProbability = duplicateNetwork.activate(inputVector)[0];
		const hasNegativeFeatures = inputVector.some(val => val < 0);

		return {
			type: classifyResult(numericProbability),
			numeric: numericProbability,
			inputVector,
			hasNegativeFeatures
		};

		function classifyResult(probability) {
			debug(`Numeric probability: ${probability}`);

			if (probability < NOT_DUPLICATE_TRESHOLD) {
				return ServiceStatus.NOT_DUPLICATE;
			}

			if (probability > IS_DUPLICATE_THRESHOLD) {
				return ServiceStatus.IS_DUPLICATE;
			}

			return ServiceStatus.MAYBE_DUPLICATE;
		}
	}
}

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
import {MarcRecord} from '@natlibfi/marc-record';
import * as Extractors from './feature-extractors';

export function toxmljsFormat(marcRecord) {
	const xmljsFormat = {
		leader: marcRecord.leader,
		controlfield: marcRecord.getControlfields().map(controlfieldFormatter),
		datafield: marcRecord.getDatafields().map(datafieldFormatter)
	};

	return xmljsFormat;

	function controlfieldFormatter(field) {
		return {
			$: {
				tag: field.tag
			},
			_: field.value
		};
	}

	function datafieldFormatter(field) {
		return {
			$: {
				tag: field.tag,
				ind1: field.ind1,
				ind2: field.ind2
			},
			subfield: field.subfields.map(subfieldFormatter)
		};
	}

	function subfieldFormatter(subfield) {
		return {
			$: {
				code: subfield.code
			},
			_: subfield.value
		};
	}
}

export function pairToInputVector(pair, strategy) {
	const featureVector = pairToFeatureVector(pair, strategy);
	const inputVector = featureVectorToInputVector(featureVector);
	return inputVector;
}

export function extractFeatures(strategy, record1, record2) {
	const XMLJSrecord1 = toxmljsFormat(record1);
	const XMLJSrecord2 = toxmljsFormat(record2);

	const featureExtractionResult = executeFeatureExtractors(strategy, XMLJSrecord1, XMLJSrecord2);

	return featureExtractionResult.reduce((memo, item) => _.set(memo, item.name, item.similarity), {});
}

function featureVectorToInputVector(featureVector) {
	const input = Object.keys(featureVector).map(key => {
		if (featureVector[key]) {
			if (featureVector[key] < 0) {
				return featureVector[key];
			}

			return (featureVector[key] * 2) - 1;
		}
		return 0;
	});

	return input;
}

function pairToFeatureVector(pair, strategy) {
	const record1 = MarcRecord.clone(pair.record1);
	const record2 = MarcRecord.clone(pair.record2);

	const featureVector = extractFeatures(strategy, record1, record2);

	return featureVector;
}

function executeFeatureExtractors(strategy, record1, record2) {
	return _.flatMap(strategy, extractorDefinition => {
		const extractor = Extractors[extractorDefinition.name]; /* eslint-disable-line import/namespace */
		const extractorInstance = extractor(record1, record2);

		const featureSimilarity = extractorInstance.check();

		if (_.isArray(featureSimilarity)) {
			const names = extractorInstance.names;
			return _.zip(names, featureSimilarity).map(([name, similarity]) => ({name, similarity}));
		}

		return {
			name: extractorDefinition.name,
			similarity: featureSimilarity
		};
	});
}

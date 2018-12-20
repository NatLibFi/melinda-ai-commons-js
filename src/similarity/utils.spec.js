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

import {expect} from 'chai';
import {MarcRecord} from '@natlibfi/marc-record';
import {extractFeatures} from './utils';

describe('utils', () => {
	let record1;
	let record2;

	beforeEach(() => {
		record1 = new MarcRecord();
		record2 = new MarcRecord();
	});

	it('should extract features based on strategy', () => {
		const strategy = [
			{name: 'title'},
			{name: 'charsimilarity'},
			{name: 'author'},
			{name: 'years'}
		];

		record1.appendField({tag: '008', value: '120201s2011^^^^fi^||||^^m^^^|00|^0|eng|^'});
		record1.appendField({tag: '100', subfields: [{code: 'a', value: 'Tekijä'}]});
		record1.appendField({tag: '245', subfields: [{code: 'a', value: 'Asia, joka on painavaa eikä kovin yleinen sana'}]});

		record2.appendField({tag: '008', value: '120201s2011^^^^fi^||||^^m^^^|00|^0|eng|^'});
		record2.appendField({tag: '100', subfields: [{code: 'a', value: 'Tekijä'}]});
		record2.appendField({tag: '245', subfields: [{code: 'a', value: 'Asia, joka on painavaa eikä kovin yleinen sana'}]});

		const features = extractFeatures(strategy, record1, record2);

		expect(features).to.eql({
			title: 1,
			charsimilarity: 1,
			author: 1,
			years: 1
		});
	});
});

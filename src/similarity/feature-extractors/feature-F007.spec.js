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

/* eslint-disable new-cap */

const chai = require('chai');

const expect = chai.expect;

const {Labels} = require('./constants');
const {MarcRecord} = require('@natlibfi/marc-record');
const Utils = require('./utils');
const {toxmljsFormat} = require('../utils');

const F007 = require('./feature-F007');

MarcRecord.setValidationOptions({subfieldValues: false});

describe('similarity/feature-extractors/F007', () => {
	let record1;
	let record2;

	beforeEach(() => {
		record1 = new MarcRecord();
		record2 = new MarcRecord();

		record1.appendField(Utils.stringToField('008    010608s2000^^^^fi^ppz||||||||||||||mul||'));
		record2.appendField(Utils.stringToField('008    010608s2000^^^^fi^ppz||||||||||||||mul||'));
	});

	it('should return null if field is missing 007', () => {
		const extractor = F007(toxmljsFormat(record1), toxmljsFormat(record2));
		const label = extractor.check();

		expect(label).to.equal(null);
	});

	it('should return SURE for identical 007', () => {
		record1.appendField(Utils.stringToField('007    |||||||||mul||'));
		record2.appendField(Utils.stringToField('007    |||||||||mul||'));

		const extractor = F007(toxmljsFormat(record1), toxmljsFormat(record2));
		const label = extractor.check();

		expect(label).to.equal(Labels.SURE);
	});

	it('should return SURELY_NOT for different 007', () => {
		record1.appendField(Utils.stringToField('007    X||||||||mul||'));
		record2.appendField(Utils.stringToField('007    |||||||||mul||'));

		const extractor = F007(toxmljsFormat(record1), toxmljsFormat(record2));
		const label = extractor.check();

		expect(label).to.equal(Labels.SURELY_NOT);
	});
});

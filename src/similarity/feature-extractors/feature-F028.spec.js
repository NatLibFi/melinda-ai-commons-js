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

/* eslint-disable no-unused-expressions */

const chai = require('chai');

const expect = chai.expect;

const {Labels} = require('./constants');

const {SURE, ABSOLUTELY_NOT_DOUBLE} = Labels;

const {MarcRecord} = require('@natlibfi/marc-record');
const Utils = require('./utils');

const createExtractor = require('./feature-F028');

MarcRecord.setValidationOptions({subfieldValues: false});

describe('similarity/feature-extractors/feature-F028', () => {
	let record1;
	let record2;

	beforeEach(() => {
		record1 = new MarcRecord();
		record2 = new MarcRecord();
	});

	function primeRecords(strForRec1, strForRec2) {
		strForRec1 && record1.appendField(Utils.stringToField(strForRec1));
		strForRec2 && record2.appendField(Utils.stringToField(strForRec2));
	}

	function runExtractor() {
		const extractor = createExtractor(toWeirdFormat(record1), toWeirdFormat(record2));
		expect(extractor).not.to.be.null;

		return extractor.check();
	}

	describe('for records that contain same a,b', () => {
		const tests = [
			['028 00 ‡bUusinta‡aUUCD103', '028 01 ‡bUusinta‡aUUCD103'],
			['028 00 ‡bFazer‡aF08650', '028 30 ‡bFazer‡aF08650'],
			['028 00 ‡bOtava‡aP9204‡qC-kas.', '028 00 ‡bOtava‡aP9204']
		];

		tests.forEach(test => {
			it('should return SURE', () => {
				primeRecords(test[0], test[1]);
				expect(runExtractor()).to.eql([SURE, SURE, null], `${test[0]} - ${test[1]}`);
			});
		});
	});

	describe('for records that contain same q', () => {
		const tests = [
			['028 00 ‡bOtava‡aP920‡qC-kas.', '028 00 ‡bOtava‡aP920‡qC-kas.']
		];

		tests.forEach(test => {
			it('should return SURE', () => {
				primeRecords(test[0], test[1]);
				expect(runExtractor()).to.eql([SURE, SURE, SURE], `${test[0]} - ${test[1]}`);
			});
		});
	});

	describe('for records that contain same b, but different a', () => {
		const tests = [
			['028 01 ‡bSULASOL‡aS280', '028 31 ‡bSulasol‡aS280a'],
			['028 31 ‡bFazer‡aF08820', '028 31 ‡bFazer‡aF08819']
		];

		tests.forEach(test => {
			it('should return SURE', () => {
				primeRecords(test[0], test[1]);
				expect(runExtractor()).to.eql([ABSOLUTELY_NOT_DOUBLE, SURE, null], `${test[0]} - ${test[1]}`);
			});
		});
	});

	describe('for records that contain same a, but missing b', () => {
		const tests = [
			['028 02 ‡a3754547', '028 01 ‡bEMI Finland‡a3754547']
		];

		tests.forEach(test => {
			it('should return SURE', () => {
				primeRecords(test[0], test[1]);
				expect(runExtractor()).to.eql([SURE, null, null], `${test[0]} - ${test[1]}`);
			});
		});
	});
});

function toWeirdFormat(record) {
	return {
		controlfield: record.getControlfields().map(convertControlField),
		datafield: record.getDatafields().map(convertDataField)
	};

	function convertControlField(field) {
		return {
			$: {
				tag: field.tag
			},
			_: field.value
		};
	}

	function convertDataField(field) {
		return {
			$: {
				tag: field.tag,
				ind1: field.ind1,
				ind2: field.ind2
			},
			subfield: field.subfields.map(convertSubfield)
		};

		function convertSubfield(subfield) {
			return {
				$: {
					code: subfield.code
				},
				_: subfield.value
			};
		}
	}
}

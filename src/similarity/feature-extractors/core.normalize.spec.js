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

const chai = require('chai');

const expect = chai.expect;
const _ = require('lodash');

const normalizeFuncs = require('./core.normalize');

function gf(value) {
	return [{
		subfield: [
			{_: value, $: {code: 'a'}}
		]
	}];
}

describe('similarity/feature-extractors/normalize functions', () => {
	// The field mocks have all other data left out, so there is only subfields.
	const testFields = [{
		subfield: [
			{_: 'subfield-A content', $: {code: 'a'}},
			{_: 'subfield B-content', $: {code: 'b'}}
		]
	}];

	const testFields2 = [
		{
			subfield: [
				{_: 'subfield-a-content', $: {code: 'a'}},
				{_: 'subfield-b-content', $: {code: 'b'}}
			]
		}, {
			subfield: [
				{_: 'subfield-a-content', $: {code: 'a'}},
				{_: 'subfield-b-content', $: {code: 'b'}}
			]
		}
	];

	describe('toStringOfSubfieldData', () => {
		it('should turn fields into array of strings', () => {
			const testData = _.cloneDeep(testFields);

			expect(toStringOfSubfieldData(testData)).to.be.an('array');
		});

		it('2 subfields should turn into array of 2 elements', () => {
			const testData = _.cloneDeep(testFields);

			expect(toStringOfSubfieldData(testData)).to.have.length(2);
		});

		it('2 fields with 2 subfields should turn into array of 4 elements.', () => {
			const testData = _.cloneDeep(testFields2);

			expect(toStringOfSubfieldData(testData)).to.have.length(4);
		});

		it('should have the content of subfield as values', () => {
			const testData = _.cloneDeep(testFields);

			expect(toStringOfSubfieldData(testData)).to.include('subfield-A content');
			expect(toStringOfSubfieldData(testData)).to.include('subfield B-content');
		});
	});

	describe('lowercase', () => {
		const lowercase = normalizeFuncs.lowercase;

		it('should return an array of lowercase versions', () => {
			const testData = _.cloneDeep(testFields);

			expect(lowercase(toStringOfSubfieldData(testData))).to.include('subfield-a content');
			expect(lowercase(toStringOfSubfieldData(testData))).to.include('subfield b-content');
		});
	});

	describe('join', () => {
		const join = normalizeFuncs.join;

		it('should join an array into single string', () => {
			const testData = _.cloneDeep(testFields);
			expect(join(toStringOfSubfieldData(testData))).to.equal('subfield-A contentsubfield B-content');
		});
	});

	describe('delChars', () => {
		const delChars = normalizeFuncs.delChars;

		it('should remove all spaces from array elements', () => {
			const testData = _.cloneDeep(testFields);
			expect(toStringOfSubfieldData(delChars(' ')(testData))).to.include('subfield-Acontent');
			expect(toStringOfSubfieldData(delChars(' ')(testData))).to.include('subfieldB-content');
		});
	});

	describe('utf8norm', () => {
		// Nfc=Canonical Decomposition, followed by Canonical Composition
		it('should normalize utf8 characters to nfc', () => {
			expect(toStringOfSubfieldData(normalizeFuncs.utf8norm(gf('ÁÑ')))).to.include('ÁÑ');
		});
	});

	describe('removediacs', () => {
		it('should remove diacritics from string in utf8-nfc from', () => {
			expect(toStringOfSubfieldData(normalizeFuncs.removediacs(gf('ÁÑ')))).to.include('AN');
		});
	});

	describe('toSpace', () => {
		it('should change - to space', () => {
			expect(toStringOfSubfieldData(normalizeFuncs.toSpace('-')(gf('AB-CD')))).to.include('AB CD');
		});
	});
});

function toStringOfSubfieldData(fields) {
	let subfields = [];
	fields.forEach(field => {
		const data = _.map(field.subfield, '_');
		subfields = subfields.concat(data);
	});
	return subfields;
}

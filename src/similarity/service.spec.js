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

import fs from 'fs';
import path from 'path';
import {expect} from 'chai';
import * as testContext from './service';
import {BibDuplicateDetection} from './../model';
import {MarcRecord} from '@natlibfi/marc-record';

const FIXTURES_PATH = path.join(__dirname, '../../test-fixtures/similarity/service');
const recordPair1 = JSON.parse(fs.readFileSync(path.join(FIXTURES_PATH, 'recordPair1.json'), 'utf8')).map(r => new MarcRecord(r));

describe('similarity/service', () => {
	describe('factory', () => {
		it('Should create the expected object', () => {
			const service = testContext.createService({model: BibDuplicateDetection});
			expect(service).to.be.an('object').and.respondTo('check');
		});

		describe('#check', () => {
			it('Should consider the records similar', () => {
				const service = testContext.createService({model: BibDuplicateDetection});
				const results = service.check(recordPair1[0], recordPair1[1]);

				expect(results).to.eql({
					type: testContext.ServiceStatus.IS_DUPLICATE,
					numeric: 1,
					inputVector: [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
					hasNegativeFeatures: false
				});
			});
		});
	});
});

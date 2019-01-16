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

/* eslint-disable camelcase */

import * as Extractors from './extractors';
import * as Normalizers from './normalizers';

export const BibDefault = [
	{fenniOrNotLDR: [Extractors.fenniOrNotLDR, Normalizers.lexical]},
	{publicationYear: [Extractors.publicationYear, Normalizers.lexical]},
	{fenniOrNotFrom008: [Extractors.fenniOrNotFrom008, Normalizers.lexical]},
	{nonFinnishHELKA: [Extractors.nonFinnishHELKA, Normalizers.identity]},
	{FENNI: [Extractors.specificLocalOwner('FENNI'), Normalizers.identity]},
	{VIOLA: [Extractors.specificLocalOwner('VIOLA'), Normalizers.identity]},
	{TAISTO_ONLY: [Extractors.specificSingleLocalOwner('TAISTO'), Normalizers.identity]},
	{VAARI_ONLY: [Extractors.specificSingleLocalOwner('VAARI'), Normalizers.identity]},
	{ANDER_ONLY: [Extractors.specificSingleLocalOwner('ANDER'), Normalizers.identity]},
	{recordAge: [Extractors.recordAge, Normalizers.moreRecent(5, 2)]},
	{reprintInfo: [Extractors.reprintInfo, Normalizers.reprint]},
	{localOwnerCount: [Extractors.localOwnerCount, Normalizers.lexical]},
	{FINL: [Extractors.specificFieldValue('040', ['a', 'd'], ['FI-NL']), Normalizers.identity]},
	{RDA: [Extractors.specificFieldValue('040', ['e'], ['RDA', 'rda']), Normalizers.identity]},
	{f245c: [Extractors.specificField('245', ['c']), Normalizers.identity]},
	{latestChange: [Extractors.latestChange(defaultNotARobotFilter), Normalizers.moreRecent(5, 2)]},
	{field008nonEmptyCount: [Extractors.field008nonEmptyCount, Normalizers.proportion]},
	{f100d: [Extractors.specificField('100', ['d']), Normalizers.identity]},
	{f100e: [Extractors.specificField('100', ['e']), Normalizers.identity]},
	{f130a: [Extractors.specificField('130', ['a']), Normalizers.identity]},
	{f240subs: [Extractors.subfieldCount('240'), Normalizers.lexical]},
	{f245subs: [Extractors.subfieldCount('245'), Normalizers.lexical]},
	{f250subs: [Extractors.subfieldCount('250'), Normalizers.lexical]},
	{f300subs: [Extractors.subfieldCount('300'), Normalizers.lexical]},
	{f260subs: [Extractors.subfieldCount('260'), Normalizers.lexical]},
	{f264subs: [Extractors.subfieldCount('264'), Normalizers.lexical]},
	{has007: [Extractors.fieldCount('007'), Normalizers.lexical]},
	{f020q: [Extractors.specificField('020', ['q']), Normalizers.identity]},
	{f260e_or_f: [Extractors.specificField('260', ['e', 'f']), Normalizers.identity]},
	{f084subs: [Extractors.subfieldCount('084'), Normalizers.lexical]},
	{f080subs: [Extractors.subfieldCount('080'), Normalizers.lexical]},
	{f041subs: [Extractors.subfieldCount('041'), Normalizers.lexical]},
	{f830x: [Extractors.specificField('830', ['x']), Normalizers.identity]},
	{f830subs: [Extractors.subfieldCount('830'), Normalizers.lexical]},
	{f338count: [Extractors.fieldCount('338'), Normalizers.lexical]},
	{uppercase: [Extractors.uppercaseSubfield, Normalizers.identity]},
	{unknownPublisher: [Extractors.containsValue(['260', '264'], ['tuntematon']), Normalizers.identity]}
];

function defaultNotARobotFilter(name) {
	return !['LOAD', 'CARE', 'CONV', 'LINK', 'KVPBATCH'].some(robotName => name.includes(robotName));
}

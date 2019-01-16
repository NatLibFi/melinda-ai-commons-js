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
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* melinda-ai-commons-js is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
* @licend  The above is the entire license notice
* for the JavaScript code in this file.
*
*/

import path from 'path';
import fs from 'fs';

const CONFIG_PATH = path.join(__dirname, 'config');

export const BibDuplicateDetection = JSON.parse(fs.readFileSync(path.join(CONFIG_PATH, 'bib-duplicate-detection-model.json'), 'utf8'));
export const BibPreference = JSON.parse(fs.readFileSync(path.join(CONFIG_PATH, 'bib-preference-model.json'), 'utf8'));

/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { Entry } from './Entry';
import { PLUGIN_NAME } from './name';
import { Widget } from './Widget';
import { selectionOptions } from './selection';

export const plugin = {
  name: PLUGIN_NAME,
  condition: () => true,
  Widget,
  Entry,
  selectionOptions,
};

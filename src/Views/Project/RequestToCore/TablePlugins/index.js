/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { plugin as requestPlugin } from './RequestPlugin';
const pluginsMap = {
  [requestPlugin.name]: requestPlugin,
};

const pluginsContainer = {
  getPluginByName: (name) => {
    if (pluginsMap[name]) {
      return pluginsMap[name];
    }
    return {
      name: '',
      order: 1,
      Widget: () => {},
      Entry: () => {},
    };
  },
  getPluginList: () => {
    return Object.values(pluginsMap).sort((a, b) => {
      return a.order - b.order;
    });
  },
};

export { pluginsContainer };

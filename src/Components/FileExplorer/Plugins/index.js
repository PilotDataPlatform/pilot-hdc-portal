/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const plugins = {};
const getPlugin = (pluginName) => {
  const fallback = {};
  return plugins[pluginName] || fallback;
};
const PluginColumnComponents = {};

export { getPlugin, PluginColumnComponents };

/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const { createProxyMiddleware } = require('http-proxy-middleware');
const { API_PATH } = require('./config');
module.exports = function (app) {
  if (process.env.REACT_APP_ENV === 'local') {
    const configs = getConfig();
    configs.forEach((config) => {
      app.use(config.route, createProxyMiddleware(config.options));
    });
  }
};
const API_PATH_DOMAIN = API_PATH.split('/pilot')[0];
function getConfig() {
  return [
    {
      route: '/pilot',
      options: {
        target: API_PATH_DOMAIN,
        changeOrigin: true,
        secure: false,
      },
    },
  ];
}

/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const userAuthLogout = {
  RECEIVED_LOGOUT: 'RECEIVED_LOGOUT',
  RECEIVED_LOGIN: 'RECEIVED_LOGIN',
  TOKEN_EXPIRATION: 'TOKEN_EXPIRATION',
  LOGOUT_REFRESH_MODAL:'LOGOUT_REFRESH_MODAL',
  LOGOUT_HEADER:'LOGOUT_HEADER',
  KEYCLOAK_LOGOUT:"KEYCLOAK_LOGOUT",
  LOADING_TIMEOUT:"LOADING_TIMEOUT",
};

Object.entries(userAuthLogout).forEach(([key, value]) => {
  userAuthLogout[key] = 'USER_AUTH_' + value;
});

export { userAuthLogout };

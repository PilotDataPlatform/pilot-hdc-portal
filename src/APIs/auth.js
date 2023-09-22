/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { KEYCLOAK_REALM } from '../config';
import { serverAxios as axios } from './config';

function login(data) {
  return axios({
    url: '/users/auth',
    method: 'POST',
    data: { ...data, realm: KEYCLOAK_REALM },
  });
}

function refreshTokenAPI(data) {
  return axios({
    url: '/users/refresh',
    method: 'POST',
    data: { ...data, realm: KEYCLOAK_REALM },
  });
}

function resetPasswordAPI(data) {
  return axios({
    url: '/users/password',
    method: 'PUT',
    data: { ...data, realm: KEYCLOAK_REALM },
  });
}

function sendResetPasswordEmailAPI(username, cancelToken) {
  return axios({
    url: '/users/reset/send-email',
    method: 'POST',
    data: { ...username, realm: KEYCLOAK_REALM },
    cancelToken,
  });
}

function sendUsernameEmailAPI(email, cancelToken) {
  return axios({
    url: '/users/reset/send-username',
    method: 'POST',
    data: { ...email, realm: KEYCLOAK_REALM },
    cancelToken,
  });
}

function resetForgottenPasswordAPI(data, cancelToken) {
  return axios({
    url: '/users/reset/password',
    method: 'POST',
    data: { ...data, realm: KEYCLOAK_REALM },
    cancelToken,
  });
}

function checkTokenAPI(token) {
  return axios({
    url: `/users/reset/check-token?token=${token}&realm=${KEYCLOAK_REALM}`,
    method: 'GET',
  });
}

export {
  login,
  refreshTokenAPI,
  resetPasswordAPI,
  sendResetPasswordEmailAPI,
  sendUsernameEmailAPI,
  resetForgottenPasswordAPI,
  checkTokenAPI,
};

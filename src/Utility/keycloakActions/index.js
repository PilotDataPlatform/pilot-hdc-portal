/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { tokenTimer } from '../../Service/keycloak';
import { store } from '../../Redux/store';
import { Modal } from 'antd';
import _ from 'lodash';
import { keycloak } from '../../Service/keycloak';
import { namespace as serviceNamespace } from '../../Service/namespace';
import { broadcastManager } from '../../Service/broadcastManager';
import { tokenManager } from '../../Service/tokenManager';
import { BRANDING_PREFIX } from '../../config';

const debouncedBroadcastLogout = _.debounce(
  () => {
    broadcastManager.postMessage('logout', serviceNamespace.broadCast.LOGOUT);
  },
  5 * 1000,
  { leading: true, trailing: false },
);

function logout() {
  Modal.destroyAll();
  tokenManager.clearCookies();
  debouncedBroadcastLogout();
  let redirectUrL;
  if (BRANDING_PREFIX.indexOf('http') !== -1) {
    redirectUrL = BRANDING_PREFIX;
  } else {
    redirectUrL = window.location.origin + BRANDING_PREFIX;
  }
  return keycloak.logout({ redirectUri: redirectUrL }).then((res) => {});
}

function refresh() {
  return keycloak.updateToken(300);
}
function login() {
  return keycloak.login({ redirectUri: window.location.origin + '/landing' });
}

export { logout, refresh, login };

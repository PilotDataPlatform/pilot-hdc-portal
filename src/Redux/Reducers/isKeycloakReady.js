/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { SET_IS_KEYCLOAK_READY } from '../actionTypes';

const init = false;
function isKeycloakReady(state = init, action) {
  let { type, payload } = action;
  switch (type) {
    case SET_IS_KEYCLOAK_READY: {
      if (typeof payload !== 'boolean') {
        return state;
      }
      return payload;
    }
    default: {
      return state;
    }
  }
}

export default isKeycloakReady;

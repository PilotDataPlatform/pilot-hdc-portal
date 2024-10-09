/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { SET_USER_STATUS, SET_USER_LAST_LOGIN } from '../actionTypes';

const init = { status: null, lastLogin: null };

export default function (state = init, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_USER_STATUS: {
      return {
        ...state,
        status: payload,
      };
    }
    case SET_USER_LAST_LOGIN: {
      return { ...state, lastLogin: payload };
    }
    default:
      return state;
  }
}

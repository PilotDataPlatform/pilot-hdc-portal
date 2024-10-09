/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { SET_TOKEN_AUTO_REFRESH } from '../actionTypes';

const init = false;
function tokenAutoRefresh(state = init, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_TOKEN_AUTO_REFRESH: {
      return payload;
    }
    default: {
      return state;
    }
  }
}

export default tokenAutoRefresh;

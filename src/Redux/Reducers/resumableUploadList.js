/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { SET_RESUMABLE_LIST, ADD_RESUMABLE_LIST } from '../actionTypes';

const init = [];
function resumableUploadList(state = init, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_RESUMABLE_LIST: {
      return payload;
    }
    case ADD_RESUMABLE_LIST: {
      const { appendContent } = payload;
      if (appendContent instanceof Array) {
        return [...state, ...appendContent];
      } else {
        return [...state, appendContent];
      }
    }
    default: {
      return state;
    }
  }
}

export default resumableUploadList;

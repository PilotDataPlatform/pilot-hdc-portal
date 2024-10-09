/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import {
  UPDATE_COPY2CORE_LIST,
  ADD_COPY2CORE_LIST,
  SET_COPY2_CORE_LIST,
} from '../actionTypes';

const init = [];
function copy2CoreList(state = init, action) {
  const { type, payload } = action;
  switch (type) {
    case ADD_COPY2CORE_LIST: {
      return [...state, ...payload];
    }

    case UPDATE_COPY2CORE_LIST: {
      const copy2Core = [...state];

      for (const pItem of payload) {
        const fileIndex = copy2Core.findIndex(
          (item) => pItem.jobId === item.jobId,
        );

        copy2Core[fileIndex] = {
          ...pItem,
          createdTime: copy2Core[fileIndex].createdTime,
        };
      }

      return copy2Core;
    }

    case SET_COPY2_CORE_LIST: {
      return payload;
    }

    default: {
      return state;
    }
  }
}

export default copy2CoreList;

/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */

import {
  SET_MOVED_TO_BIN_LIST,
  UPDATE_MOVED_TO_BIN_LIST,
  ADD_MOVED_TO_BIN_LIST,
} from '../actionTypes';

const init = [];

function movedToBinList(state = init, action) {
  const { type, payload } = action;

  switch (type) {
    case ADD_MOVED_TO_BIN_LIST:
      return [...state, ...payload];

    case UPDATE_MOVED_TO_BIN_LIST:
      const movedToBinList = [...state];

      for (const pItem of payload) {
        const fileIndex = movedToBinList.findIndex(
          (item) => pItem.jobId === item.jobId,
        );

        if (fileIndex > -1) {
          movedToBinList[fileIndex] = {
            ...movedToBinList[fileIndex],
            ...pItem,
          };
        } else {
          return state;
        }
      }

      return movedToBinList;

    case SET_MOVED_TO_BIN_LIST:
      return payload;

    default: {
      return state;
    }
  }
}

export default movedToBinList;

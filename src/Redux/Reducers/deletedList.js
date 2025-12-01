/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */

import {
  SET_DELETE_LIST,
  UPDATE_DELETE_LIST,
  ADD_DELETE_LIST,
} from '../actionTypes';

const init = [];

function deletedFileList(state = init, action) {
  const { type, payload } = action;

  switch (type) {
    case ADD_DELETE_LIST:
      console.log('payload', payload);
      console.log('state', state);
      return [...state, payload];

    case UPDATE_DELETE_LIST:
      const deletedFileList = [state];

      for (const pItem of payload) {
        const fileIndex = deletedFileList.findIndex(
          (item) => pItem.jobId === item.jobId,
        );

        if (fileIndex > -1) {
          deletedFileList[fileIndex] = {
            ...deletedFileList[fileIndex],
            ...pItem,
          };
        } else {
          return state;
        }
      }

      return deletedFileList;

    case SET_DELETE_LIST:
      return payload;

    default: {
      return state;
    }
  }
}

export default deletedFileList;

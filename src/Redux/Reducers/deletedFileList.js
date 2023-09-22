/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
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
      return [...state, ...payload];

    case UPDATE_DELETE_LIST:
      const deleteList = [...state];

      for (const pItem of payload) {
        const fileIndex = deleteList.findIndex(
          (item) => pItem.jobId === item.jobId,
        );

        if (fileIndex > -1) {
          deleteList[fileIndex] = {
            ...deleteList[fileIndex],
            ...pItem,
          };
        } else {
          return state;
        }
      }

      return deleteList;

    case SET_DELETE_LIST:
      return payload;

    default: {
      return state;
    }
  }
}

export default deletedFileList;

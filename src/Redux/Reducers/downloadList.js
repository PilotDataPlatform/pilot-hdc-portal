/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import {
  APPEND_DOWNLOAD_LIST,
  UPDATE_DOWNLOAD_ITEM,
  SET_DOWNLOAD_LIST,
} from '../actionTypes';

const init = [];

function downloadList(state = init, action) {
  const { type, payload } = action;
  switch (type) {
    case APPEND_DOWNLOAD_LIST: {
      return [...state, payload];
    }
    case UPDATE_DOWNLOAD_ITEM: {
      const downloadList = [...state];
      const fileIndex = downloadList.findIndex(
        (item) =>
          payload.sessionId === item.sessionId && payload.jobId === item.jobId,
      );

      downloadList[fileIndex] = {
        ...downloadList[fileIndex],
        ...payload,
      };

      delete downloadList[fileIndex].containerCode;

      return downloadList;
    }
    case SET_DOWNLOAD_LIST: {
      return payload;
    }
    default: {
      return state;
    }
  }
}

export default downloadList;

/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { JOB_STATUS } from '../../Components/Layout/FilePanel/jobStatus';
import {
  SET_UPLOAD_LIST,
  ADD_UPLOAD_LIST,
  UPDATE_UPLOAD_LIST_ITEM,
  DELETE_UPLOAD_LIST_ITEM,
} from '../actionTypes';

const init = [];
function uploadList(state = init, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_UPLOAD_LIST: {
      return payload;
    }
    case ADD_UPLOAD_LIST: {
      const { appendContent } = payload;
      if (appendContent instanceof Array) {
        return [...state, ...appendContent];
      } else {
        return [...state, appendContent];
      }
    }

    case DELETE_UPLOAD_LIST_ITEM: {
      let { item } = payload;
      const currentItem = state.find((ele) => {
        return ele.jobId === item.jobId;
      });
      if (!currentItem) {
        return state;
      }
      return state.filter((ele) => ele.jobId !== item.jobId);
    }

    case UPDATE_UPLOAD_LIST_ITEM: {
      let { item } = payload;

      const currentItem = state.find((ele) => {
        return ele.jobId === item.jobId;
      });
      if (!currentItem) {
        return state;
      }

      if (
        currentItem.status === JOB_STATUS.FAILED ||
        currentItem.status === JOB_STATUS.SUCCEED
      )
        return [...state];

      currentItem.progress = item.progress;
      currentItem.status = item.status;
      currentItem.uploadedTime = item.uploadedTime;
      currentItem.actionType = item.actionType;

      return [...state];
    }
    default: {
      return state;
    }
  }
}

export default uploadList;

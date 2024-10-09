/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { COPY_REQUEST } from '../actionTypes';
import _ from 'lodash';
const init = {
  reqList: [],
  activeReq: null,
  status: 'pending',
  pageNo: 0,
  pageSize: 10,
  total: 0,
};
export default function (state = init, action) {
  const { type, payload } = action;
  switch (type) {
    case COPY_REQUEST.SET_STATUS: {
      return { ...state, status: payload };
    }
    case COPY_REQUEST.SET_REQ_LIST: {
      return { ...state, reqList: payload };
    }
    case COPY_REQUEST.SET_ACTIVE_REQ: {
      return {
        ...state,
        activeReq: payload,
      };
    }
    case COPY_REQUEST.SET_PAGINATION: {
      return {
        ...state,
        pageNo: payload.pageNo,
        pageSize: payload.pageSize,
        total: payload.total,
      };
    }
    default: {
      return state;
    }
  }
}

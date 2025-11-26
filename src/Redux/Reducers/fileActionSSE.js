/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import {
  SET_UPLOAD_COMMITTING,
  SET_DOWNLOAD_COMMITTING,
  UNSET_DOWNLOAD_COMMITTING,
} from '../actionTypes';

const init = {
  downloadCommitted: new Set(),
  isUploadCommitting: false,
};

function fileActionSSE(state = init, action) {
  const { type, payload } = action;
  let downloadCommitted;

  switch (type) {
    case SET_UPLOAD_COMMITTING:
      return { ...state, isUploadCommitting: payload };

    case SET_DOWNLOAD_COMMITTING:
      downloadCommitted = new Set(state.downloadCommitted);
      downloadCommitted.add(payload);
      console.log('JobId added to downloadCommitted:', payload);
      return { ...state, downloadCommitted: downloadCommitted };

    case UNSET_DOWNLOAD_COMMITTING:
      downloadCommitted = new Set(state.downloadCommitted);
      downloadCommitted.delete(payload);
      console.log('JobId removed from downloadCommitted:', payload);
      return { ...state, downloadCommitted: downloadCommitted };

    default:
      return state;
  }
}

export default fileActionSSE;

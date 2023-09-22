/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { SET_UPLOAD_COMMITTING, SET_DOWNLOAD_COMMITTING } from '../actionTypes';

const init = {
  isDownloadCommitting: false,
  isUploadCommitting: false,
};

function fileActionSSE(state = init, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_UPLOAD_COMMITTING:
      return { ...state, isUploadCommitting: payload };

    case SET_DOWNLOAD_COMMITTING:
      return { ...state, isDownloadCommitting: payload };

    default:
      return state;
  }
}

export default fileActionSSE;

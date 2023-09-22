/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { SET_UPLOAD_FILE_MANIFEST } from '../actionTypes';

const init = [];
function uploadFileManifest(state = init, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_UPLOAD_FILE_MANIFEST: {
      return [...state, payload];
    }
    default: {
      return state;
    }
  }
}

export default uploadFileManifest;

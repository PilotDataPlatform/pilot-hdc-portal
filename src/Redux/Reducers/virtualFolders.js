/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { SET_VIRTUAL_FOLDER_OPERATION } from '../actionTypes';

const init = { operation: null, geid: null };
function virtualFolders(state = init, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_VIRTUAL_FOLDER_OPERATION: {
      return { operation: payload.operation, geid: payload.geid };
    }
    default: {
      return state;
    }
  }
}

export default virtualFolders;

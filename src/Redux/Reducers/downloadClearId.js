/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { SET_DOWNLOAD_CLEAR_ID } from "../actionTypes";

const init = '';
function downloadClearId(state = init, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_DOWNLOAD_CLEAR_ID: {
      return payload;
    }
    default: {
      return state;
    }
  }
}

export default downloadClearId;

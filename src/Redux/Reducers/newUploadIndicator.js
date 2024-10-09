/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { SET_UPLOAD_INDICATOR } from "../actionTypes";

const init = 0;
function newUploadIndicator(state = init, action) {
  const { type} = action;
  switch (type) {
    case SET_UPLOAD_INDICATOR : {
      return state+1;
    }
    default: {
      return state;
    }
  }
}

export default newUploadIndicator;

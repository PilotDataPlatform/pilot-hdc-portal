/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { SET_SUCCESS_NUM } from "../actionTypes";

const init = 0;
function successNum(state = init, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_SUCCESS_NUM: {
      return payload;
    }
    default: {
      return state;
    }
  }
}

export default successNum;

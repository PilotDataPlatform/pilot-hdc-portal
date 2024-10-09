/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { SET_METADATAS } from "../actionTypes";

const init = null;
function metadatas(state = init, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_METADATAS: {
      return payload.metadatas;
    }
    default: {
      return state;
    }
  }
}

export { metadatas };

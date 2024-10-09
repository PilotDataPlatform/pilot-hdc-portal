/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { SET_PERSONAL_DATASET_ID } from "../actionTypes";

const init = null;
function personalDatasetId(state = init, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_PERSONAL_DATASET_ID: {
      return payload.id;
    }
    default: {
      return state;
    }
  }
}

export { personalDatasetId };

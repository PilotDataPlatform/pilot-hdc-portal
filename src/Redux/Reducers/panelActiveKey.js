/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { SET_PANEL_VISIBILITY } from '../actionTypes';

const init = false;
function filePanelVisibility(state = init, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_PANEL_VISIBILITY: {
      return payload;
    }
    default: {
      return state;
    }
  }
}

export default filePanelVisibility;

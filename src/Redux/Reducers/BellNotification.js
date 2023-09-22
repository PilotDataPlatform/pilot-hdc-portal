/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { BELLNOTIFICATION } from '../actionTypes';

const initData = {
  actives: {},
};

const bellNotificationReducer = (state = initData, action) => {
  switch (action.type) {
    case BELLNOTIFICATION.SET_ACTIVE_BELL_NOTIFICATION:
      return { ...state, actives: action.payload };

    default:
      return state;
  }
};

export default bellNotificationReducer;

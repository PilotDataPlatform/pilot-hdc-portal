/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { SET_KG_SPACE_BIND } from '../actionTypes';

const init = {
  spaceBind: null,
};

export default function kgSpaceList(state = init, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_KG_SPACE_BIND: {
      return { ...state, spaceBind: payload };
    }

    default:
      return state;
  }
}

/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { ROLEPERMISSIONS } from '../actionTypes';

const initData = {
  roles: [],
};

const rolePermissions = (state = initData, action) => {
  switch (action.type) {
    case ROLEPERMISSIONS.SET_ROLES_LIST:
      return { ...state, roles: action.payload };

    default:
      return state;
  }
};

export default rolePermissions;

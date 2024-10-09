/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { createSlice } from '@reduxjs/toolkit';
import { initStates } from '../initStates';
import _ from 'lodash';

const routeSlice = createSlice({
  name: 'route',
  initialState: initStates.route,
  reducers: {
    setRoute: (state, action) => _.cloneDeep(action.payload),
    reset: (state) => _.cloneDeep(initStates.route),
  },
});

export default routeSlice;

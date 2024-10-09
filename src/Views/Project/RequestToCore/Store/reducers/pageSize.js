/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { createSlice } from '@reduxjs/toolkit';
import { initStates } from '../initStates';

const pageSizeSlice = createSlice({
  name: 'pageSize',
  initialState: initStates.pageSize,
  reducers: {
    setPageSize: (state, action) => action.payload,
    reset: (state) => initStates.pageSize,
  },
});

export default pageSizeSlice;

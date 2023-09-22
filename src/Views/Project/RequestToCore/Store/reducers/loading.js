/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { createSlice } from '@reduxjs/toolkit';
import { initStates } from '../initStates';

const loadingSlice = createSlice({
  name: 'loading',
  initialState: initStates.loading,
  reducers: {
    loadingOn: (state) => true,
    loadingOff: (state) => false,
    reset: (state) => initStates.loading,
  },
});

export default loadingSlice;

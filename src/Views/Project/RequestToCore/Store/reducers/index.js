/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import pageSlice from './page';
import pageSizeSlice from './pageSize';
import {combineReducers} from 'redux'

export const explorerReducer = combineReducers({
    pageSize:pageSizeSlice.reducer,
    page:pageSlice.reducer
});

export const actions = {
    page:pageSlice.actions,
    pageSize:pageSizeSlice.actions,
}
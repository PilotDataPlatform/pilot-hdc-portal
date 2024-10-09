/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { SHOW_SERVICE_REQUEST_RED_DOT } from '../actionTypes';

const initData = {
    showRedDot: false
}

const serviceRequestRedDot = (state = initData, action) => {
    switch (action.type) {
        case SHOW_SERVICE_REQUEST_RED_DOT:
            return {
                ...state,
                showRedDot: action.payload
            }
        default: {
            return state;
        }
    }
}

export default serviceRequestRedDot;
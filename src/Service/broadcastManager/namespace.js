/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const broadCast = {
    "USER_CLICK_LOGIN": "USER_CLICK_LOGIN",
    "CLICK_HEADER_LOGOUT": "CLICK_HEADER_LOGOUT",
    'CLICK_REFRESH_MODAL': 'CLICK_REFRESH_MODAL',
    "AUTO_REFRESH": 'AUTO_REFRESH',
    "REFRESH_MODAL_LOGOUT": "REFRESH_MODAL_LOGOUT",
    "ONACTION": "ONACTION",
    "LOGOUT": "LOGOUT"
}

Object.entries(broadCast).forEach(([key, value]) => {
    broadCast[key] = "BROADCAST_" + value;
});

export { broadCast };
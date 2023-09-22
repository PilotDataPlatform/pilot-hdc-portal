/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import { NOTIFICATIONS } from '../actionTypes';

const initData = {
  activeNotification: null,
  createNewNotificationStatus: false,
  userNotifications: [],
  notificationList: [],
  updateNotificationTimes: 0,
  edit: false,
};

const notificationReducer = (state = initData, action) => {
  switch (action.type) {
    case NOTIFICATIONS.SET_ACTIVE_NOTIFICATION:
      return { ...state, activeNotification: action.payload };
    case NOTIFICATIONS.SET_CREATE_NEW_NOTIFICATION_LIST_ITEM__STATUS:
      return { ...state, createNewNotificationStatus: action.payload };
    case NOTIFICATIONS.SET_USER_NOTIFICATIONS:
      return { ...state, userNotifications: action.payload };
    case NOTIFICATIONS.SET_NOTIFICATION_LIST:
      return { ...state, notificationList: action.payload };
    case NOTIFICATIONS.SET_UPDATE_NOTIFICATION_TIMES:
      return { ...state, updateNotificationTimes: action.payload };
    case NOTIFICATIONS.SET_EDIT_NOTIFICATION:
      return { ...state, edit: action.payload };
    default:
      return state;
  }
};

export default notificationReducer;

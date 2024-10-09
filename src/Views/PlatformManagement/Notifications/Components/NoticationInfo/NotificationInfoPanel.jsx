/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'antd';
import CreateNewNotification from './CreateNewNotification';
import NotificationDetail from './NotificationDetail';
import { notificationActions } from '../../../../../Redux/actions';
import { PlusOutlined } from '@ant-design/icons';
import styles from './index.module.scss';

const NotificationPanel = () => {
  const { activeNotification, createNewNotificationStatus } = useSelector(
    (state) => state.notifications,
  );
  const dispatch = useDispatch();

  const handleCreateNewNotificationClick = () => {
    dispatch(notificationActions.setCreateNewNotificationStatus(true));
    dispatch(notificationActions.setActiveNotification(null));
    dispatch(notificationActions.setEditNotification(false));
  };

  const renderNotificationContent = () => {
    if (!createNewNotificationStatus && activeNotification === null) {
      return (
        <div className={styles['notification-content']}>
          <Button
            className={styles['notification-content__btn']}
            icon={<PlusOutlined />}
            onClick={handleCreateNewNotificationClick}
          >
            Create New Notification
          </Button>
        </div>
      );
    } else if (!createNewNotificationStatus && activeNotification !== null) {
      return <NotificationDetail />;
    } else if (createNewNotificationStatus && activeNotification === null) {
      return <CreateNewNotification />;
    }
  };
  return (
    <div className={styles.notification}>{renderNotificationContent()}</div>
  );
};

export default NotificationPanel;

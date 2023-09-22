/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { notificationActions } from '../../../../../Redux/actions';
import { List } from 'antd';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import styles from './NotificationList.module.scss';
import { timeConvertWithOffestValue } from '../../../../../Utility/timeCovert';
import moment from 'moment';

const NotificationList = () => {
  const {
    activeNotification,
    createNewNotificationStatus,
    notificationList,
    edit,
  } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const onListClick = (item) => {
    if (!edit) {
      dispatch(notificationActions.setCreateNewNotificationStatus(false));
      dispatch(notificationActions.setActiveNotification(item));
    }
  };
  const onNewNotificationClick = () => {
    dispatch(notificationActions.setCreateNewNotificationStatus(false));
    dispatch(notificationActions.setActiveNotification(null));
  };
  return (
    <div className={styles['notification-list']}>
      <div
        className={`${styles['new-notification-listItem']} ${
          createNewNotificationStatus && styles['list-item-backgroundColor']
        }`}
        onClick={onNewNotificationClick}
      >
        <PlusOutlined className={styles['new-notification-listItem__icon']} />{' '}
        Create New Notification
      </div>
      <List
        size="large"
        bordered={false}
        dataSource={notificationList}
        pagination={{
          pageSize: 10,
          simple: true,
        }}
        renderItem={(item, index) => (
          <List.Item
            className={`${
              !createNewNotificationStatus &&
              activeNotification &&
              activeNotification.id === item.id &&
              styles['list-item-backgroundColor']
            }`}
            id={item.id}
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              onListClick(item);
            }}
          >
            <div className={styles['list-content']}>
              <div className={styles['list-content__icon']}>
                <SettingOutlined />
              </div>
              <div>
                <p>
                  {timeConvertWithOffestValue(
                    item.detail.maintenanceDate,
                    'datetime',
                  )}
                </p>
                <p className={styles['list-content__status']}>Published</p>
              </div>
              {new Date() > new Date(item.detail.maintenanceDate) ? (
                <div className={styles['list-content__expired']}></div>
              ) : null}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default NotificationList;

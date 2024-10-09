/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { notificationActions } from '../../../../../Redux/actions';
import { deleteNotification } from '../../../../../APIs/notifications';
import { Button, Modal, message, Tooltip } from 'antd';
import FormWrapper from './FormWrapper';
import { CheckOutlined, EditOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './index.module.scss';
import NotificationPreview from './NotificationPreview';
import i18n from '../../../../../i18n';
import { timeConvertWithOffestValue } from '../../../../../Utility/timeCovert';
const NotificationDetail = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisibility, setModalVisibility] = useState(false);
  const { activeNotification, updateNotificationTimes, edit } = useSelector(
    (state) => state.notifications,
  );
  const dispatch = useDispatch();
  const detail = activeNotification.detail;
  const handleEditOnClick = () => {
    dispatch(notificationActions.setEditNotification(true));
  };
  const title = <p>Confirmation</p>;
  const disableNotification = async () => {
    try {
      setLoading(true);
      const res = await deleteNotification(activeNotification.id);
      if (res.status === 200 || res.status === 204) {
        dispatch(notificationActions.setActiveNotification(null));
        dispatch(
          notificationActions.setUpdateNotificationTimes(
            updateNotificationTimes + 1,
          ),
        );
      }
      setLoading(false);
    } catch (error) {
      message.error(i18n.t('errormessages:disableNotification.default.0'));
      setLoading(false);
    }
  };
  const footerButton = [
    <Button
      type="link"
      className={styles['disable-notification-modal__cancel-button']}
      onClick={() => {
        setModalVisibility(false);
      }}
    >
      Cancel
    </Button>,
    <Button
      type="primary"
      className={styles['disable-notification-modal__disable-button']}
      icon={<CheckOutlined />}
      loading={loading}
      onClick={() => {
        disableNotification();
        setModalVisibility(false);
      }}
    >
      Disable Notification
    </Button>,
  ];
  return (
    <div>
      {!edit ? (
        <>
          <div>
            <div className={styles['notification-header']}>
              <Button
                className={styles['notification-header__edit-btn']}
                type="link"
                icon={<EditOutlined />}
                onClick={handleEditOnClick}
              >
                Edit
              </Button>
              <div className={styles['notification-header__right']}>
                <p>
                  <span
                    className={
                      styles['notification-header__right__published-message']
                    }
                  >
                    Published on
                  </span>
                  <span
                    className={
                      styles['notification-header__right__pubished-date']
                    }
                  >
                    {timeConvertWithOffestValue(
                      activeNotification.createdAt,
                      'datetime',
                    )}
                  </span>
                </p>
                <Button
                  type="link"
                  icon={<CloseOutlined />}
                  onClick={() => setModalVisibility(true)}
                >
                  Disable Notification
                </Button>
              </div>
            </div>
            <div className={styles['edit-notification']}>
              <div className={styles['line-one']}>
                <p className={styles['line-one__label']}>Message</p>
                <p className={styles['line-one__contents']}>
                  {activeNotification.message.length > 100 ? (
                    <Tooltip
                      title={activeNotification.message}
                    >{`${activeNotification.message.slice(
                      0,
                      100,
                    )}...`}</Tooltip>
                  ) : (
                    activeNotification.message
                  )}
                </p>
              </div>
              <div className={styles['line-two']}>
                <div className={styles['line-two__content']}>
                  <p className={styles['line-two__content__date-lable']}>
                    Maintenance Date and Time
                  </p>
                  <p className={styles['line-two__content__date-contents']}>
                    {timeConvertWithOffestValue(detail.maintenanceDate, 'text')}
                  </p>
                </div>
                <div className={styles['line-two__content']}>
                  <p className={styles['line-two__content__duration-lable']}>
                    Estimated Duration:
                  </p>
                  <p className={styles['line-two__content__duration-contents']}>
                    {detail.duration} {detail.durationUnit}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <NotificationPreview data={activeNotification} />
        </>
      ) : (
        <div>
          <div className={styles['notification-header']}></div>
          <div className={styles['editor']}>
            <FormWrapper />
          </div>
        </div>
      )}
      <div>
        <Modal
          className={styles['disable-notification-modal']}
          title={title}
          footer={footerButton}
          visible={modalVisibility}
          width={403}
          onCancel={() => {
            setModalVisibility(false);
          }}
          centered
          maskClosable={false}
        >
          <p className={styles['disable-notification-modal__message']}>
            Are you sure you want to disable the notification?
          </p>
        </Modal>
      </div>
    </div>
  );
};

export default NotificationDetail;

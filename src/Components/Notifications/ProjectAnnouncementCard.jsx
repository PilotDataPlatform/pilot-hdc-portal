/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Avatar } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import styles from './ProjectAnnouncementCard.module.scss';
import { timeConvertWithOffestValue } from '../../Utility/timeCovert';

const ProjectAnnouncementCard = ({ data }) => {
  const [showDetail, setShowDetail] = useState(false);
  const activeBellNotification = useSelector(
    (state) => state.bellNotificationReducer.actives,
  );

  useEffect(() => {
    const announcementIds = data.list.map((v) => v.id);
    if (announcementIds.indexOf(activeBellNotification.id) !== -1) {
      setShowDetail(true);
    }
  }, [activeBellNotification.id]);
  return (
    <div
      className={styles['access-item']}
      onClick={(e) => {
        setShowDetail(!showDetail);
      }}
    >
      <div className={styles['announcement-item__info']}>
        <div className={styles['access-item__img']}>
          <Avatar
            shape="circle"
            style={{
              borderWidth: '1px',
              width: '3rem',
              height: '3rem',
              background: '#fff',
            }}
          >
            <span className={styles['access-item__img-text']}>
              {data.list?.length}
            </span>
          </Avatar>
        </div>
        <div className={styles['access-item__right']}>
          <span className={styles['access-item__right-title']}>
            {data.projectName}
          </span>
          <span className={styles['access-item__right-info']}>
            Project Code:{' '}
            <Link to={`/project/${data.projectCode}/announcement`}>
              {data.projectCode}
            </Link>
          </span>
        </div>
        <span className={styles['access-item__right-link']}>
          <RightOutlined className={showDetail ? styles['card-open'] : null} />
        </span>
      </div>
      {showDetail ? (
        <div className={styles['announcement-item__detail']}>
          <ul>
            {data?.list && data?.list?.length
              ? data?.list.map((announcementItem) => {
                  return (
                    <li
                      className={styles['detail-item']}
                      id={`project${announcementItem.id}`}
                      key={announcementItem.id}
                    >
                      <p>{announcementItem.message}</p>
                      <p className={styles['detail-item__note']}>
                        {announcementItem.announcerUsername} -{' '}
                        {timeConvertWithOffestValue(
                          announcementItem.createdAt,
                          'datetime',
                        )}
                      </p>
                    </li>
                  );
                })
              : null}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default withRouter(ProjectAnnouncementCard);

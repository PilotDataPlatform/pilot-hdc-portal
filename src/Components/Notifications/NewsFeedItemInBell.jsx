/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';

import { withRouter } from 'react-router-dom';

import { Row } from 'antd';

import {
  SmileOutlined,
  SettingOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  FileImageOutlined,
  FolderOutlined,
  RightOutlined,
  DownOutlined,
  ClockCircleOutlined,
  RetweetOutlined,
} from '@ant-design/icons';

import styles from './NewsFeedItemInBell.module.scss';
import moment from 'moment';

import { CalTimeDiff } from '../../Utility/timeCovert';

const NewsFeedItemInBell = ({ data, onExpand, id, setting, user }) => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    async function initData() {
      try {
        if (Object.keys(setting).length != 0 && setting.id != -1) {
          if (setting.id == id) {
            setHidden(true);
          } else {
            setHidden(false);
          }
        } else {
        }
      } catch (e) {
        console.log(e);
      }
    }
    initData();
  });

  let iconMap = {
    delete: <DeleteOutlined />,
    copy: <CheckOutlined />,
    maintain: <SettingOutlined />,
    'role-change': <RetweetOutlined />,
  };

  const classifyDataAction = (data) => {
    let actionText;
    let actionType;

    switch (data.type) {
      case 'pipeline':
        actionType = 'Pipeline';
        if (data.action == 'delete') {
          actionText = 'Delete';
        } else {
          actionText = 'Copy';
        }

        return (
          <div>
            <li className={styles['notification__newsfeed-item__right-title']}>
              {user === data.initiatorUsername ? (
                <b>You</b>
              ) : (
                <span>
                  {data.initiatorUsername.length > 20
                    ? data.initiatorUsername.slice(0, 20) + '...'
                    : data.initiatorUsername}
                </span>
              )}
              &nbsp;
              <span> executed&nbsp;</span>
              <span
                className={
                  styles[
                    `notification__newsfeed-item__right-action__${actionText}`
                  ]
                }
              >
                {' '}
                {actionText} {actionType}
              </span>
              {showPipelineExcutedTarget(data)} &nbsp;&nbsp;&nbsp;/&nbsp;
              <span
                className={styles['notification__newsfeed-item__right-status']}
                style={{
                  color: data.status == 'success' ? '#4A8500' : '#FF6D72',
                }}
              >
                {' '}
                {data.status == 'success' ? 'Succeed' : 'Failed'}{' '}
              </span>
              <span
                className={
                  styles['notification__newsfeed-item__right-editedtime']
                }
              >
                <ClockCircleOutlined />{' '}
                {CalTimeDiff(moment(data.createdAt).unix())}
              </span>
            </li>

            <span className={styles['notification__newsfeed-item__right-time']}>
              {data.targets &&
                data.targets.length > 0 &&
                (data.targets[0]['name'].length > 30
                  ? data.targets[0]['name'].slice(0, 30) + '...'
                  : data.targets[0]['name'])}
              {data.targets &&
                data.targets.length > 1 &&
                ' +' + (data.targets.length - 1).toString()}
              &nbsp;
              {data.action != 'delete' && (
                <span
                  className={
                    styles['notification__newsfeed-item__right-destination']
                  }
                >
                  - Destination:{' '}
                </span>
              )}
              {data.destination
                ? data.projectCode + '/' + data.destination.path
                : ''}
            </span>
          </div>
        );

      case 'role-change':
        actionText = 'changed your role';
        return (
          <div>
            <li className={styles['notification__newsfeed-item__right-title']}>
              <span>
                {data.initiatorUsername.length > 20
                  ? data.initiatorUsername.slice(0, 20) + '...'
                  : data.initiatorUsername}
              </span>
              &nbsp;
              <span
                className={
                  styles[
                    `notification__newsfeed-item__right-action__role-change`
                  ]
                }
              >
                {' '}
                {actionText}&nbsp;
              </span>
              from&nbsp;
              <span
                className={
                  styles['notification__newsfeed-item__right-editedtime']
                }
              >
                <ClockCircleOutlined />{' '}
                {CalTimeDiff(moment(data.createdAt).unix())}
              </span>
            </li>

            <span className={styles['notification__newsfeed-item__right-time']}>
              {data.previous} <span style={{ fontWeight: 300 }}>to</span>{' '}
              {data.current}
              <span
                className={
                  styles['notification__newsfeed-item__right-destination']
                }
              >
                within <b>{data.projectCode}</b>
              </span>
            </span>
          </div>
        );
    }
  };

  const showPipelineExcutedTarget = (data) => {
    let actionStr;

    if (data.involvedAs === 'initiator') {
      actionStr = <span>on data</span>;
    } else {
      if (data.involvedAs === 'receiver') {
        actionStr = <span>on data into your folder</span>;
      } else {
        actionStr = <span>on data from your folder</span>;
      }
    }
    return actionStr;
  };

  return (
    <div
      id={`newsfeed${id}`}
      className={styles['notification__newsfeed-item']}
      onClick={() => {
        if (data.type == 'pipeline') {
          setHidden(!hidden);
          setting.id = -1;
        }
      }}
    >
      <span className={styles['notification__newsfeed-item__icon']}>
        {iconMap[data.action ?? data.type]}
      </span>
      <div className={styles['notification__newsfeed-item__right']}>
        {classifyDataAction(data)}
        {hidden && (
          <div className={styles['hidden-details']}>
            <Row className={styles['hidden-details__location']}>
              Source:{' '}
              <span className={styles['hidden-details__source']}>
                {' '}
                {data.source ? data.projectCode + '/' + data.source.path : ''}
              </span>
            </Row>
            {data.destination ? (
              <Row className={styles['hidden-details__location']}>
                Destination:{' '}
                <span className={styles['hidden-details__destination']}>
                  {data.destination
                    ? data.projectCode + '/' + data.destination.path
                    : ''}
                </span>
              </Row>
            ) : null}

            <div className={styles['hidden-details__files']}>
              {data.targets &&
                data.targets.map((item) => {
                  return (
                    <Row className={styles['hidden-details__file']}>
                      {item.type == 'folder' ? (
                        <FolderOutlined />
                      ) : (
                        <FileImageOutlined />
                      )}{' '}
                      {item.name}
                    </Row>
                  );
                })}
            </div>
          </div>
        )}
      </div>
      <span className={styles['notification__newsfeed-item__jumpicon']}>
        {hidden ? <DownOutlined /> : <RightOutlined />}
      </span>
    </div>
  );
};

export default withRouter(NewsFeedItemInBell);

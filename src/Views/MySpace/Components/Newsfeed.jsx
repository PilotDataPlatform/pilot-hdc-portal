/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useRef } from 'react';

import { withRouter, Link } from 'react-router-dom';

import {
  SmileOutlined,
  SettingOutlined,
  DoubleRightOutlined,
  DeleteOutlined,
  CheckOutlined,
  RetweetOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  PullRequestOutlined,
  NotificationOutlined,
} from '@ant-design/icons';

import styles from '../MySpace.module.scss';
import { bellNotificationActions } from '../../../Redux/actions';
import { useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import moment from 'moment';

import { CalTimeDiff } from '../../../Utility/timeCovert';
import { timeConvertWithOffestValue } from '../../../Utility/timeCovert';
import DatasetActivity from '../../Dataset/DatasetActivity/DatasetActivity';
import { history } from '../../../Routes';

const Newsfeed = ({ data, id, user }) => {
  const dispatch = useDispatch();

  const scrollToAnchor = (name) => {
    if (name) {
      setTimeout(() => {
        let anchorElement = document.getElementById(name);
        console.log(anchorElement);
        if (anchorElement) {
          anchorElement.scrollIntoView();
        }
      }, 500);
    }
  };

  let iconMap = {
    delete: <DeleteOutlined />,
    copy: <CheckOutlined />,
    'role-change': <RetweetOutlined />,
    maintenance: <SettingOutlined />,
    approval: <CheckOutlined />,
    denial: <CloseOutlined />,
    close: <PullRequestOutlined />,
    project: <NotificationOutlined />,
  };

  const classifyDataAction = (data) => {
    let actionText;
    let actionType;

    switch (data.type) {
      case 'project':
        return (
          <div className={styles['newsfeed-item__right']}>
            <li className={styles['newsfeed-item__right-title']}>
              <span className={styles[`newsfeed-item__right-action__project`]}>
                Project Announcement
              </span>
              <span className={styles['newsfeed-item__right-editedtime']}>
                <ClockCircleOutlined />{' '}
                {CalTimeDiff(moment(data.createdAt).unix())}
              </span>
            </li>
            <li className={styles['newsfeed-item__right-time']}>
              <span className={styles['newsfeed-item__right-destination']}>
                Project Code:{' ' + data.projectCode + ' /'}
              </span>
              &nbsp;
              <span className={styles['newsfeed-item__right-project']}>
                {data.projectName}
              </span>
            </li>
          </div>
        );
      case 'role-change':
        actionText = 'Changed your Role';
        return (
          <div className={styles['newsfeed-item__right']}>
            <li className={styles['newsfeed-item__right-title']}>
              <span>
                {data.initiatorUsername.length > 20
                  ? data.initiatorUsername.slice(0, 20) + '...'
                  : data.initiatorUsername}
              </span>
              &nbsp;
              <span className={styles[`newsfeed-item__right-action__role`]}>
                {' '}
                {actionText}&nbsp;
              </span>
              from&nbsp;
              <span className={styles['newsfeed-item__right-editedtime']}>
                <ClockCircleOutlined />{' '}
                {CalTimeDiff(moment(data.createdAt).unix())}
              </span>
            </li>

            <span className={styles['newsfeed-item__right-time']}>
              {data.previous == 'admin'
                ? 'Administrator'
                : data.previous[0].toUpperCase() + data.previous.slice(1)}{' '}
              <span style={{ fontWeight: 300 }}>&nbsp;to&nbsp;</span>{' '}
              {data.current == 'admin'
                ? 'Administrator'
                : data.current[0].toUpperCase() + data.current.slice(1)}
              <span className={styles['newsfeed-item__right-destination']}>
                within <b>{data.projectCode}</b>
              </span>
            </span>
          </div>
        );

      case 'maintenance':
        actionText = 'Upcoming Maintenance';
        return (
          <div className={styles['newsfeed-item__right']}>
            <li className={styles['newsfeed-item__right-title']}>
              <span
                className={styles[`newsfeed-item__right-action__maintenance`]}
              >
                {actionText}&nbsp;
              </span>
              <span className={styles['newsfeed-item__right-editedtime']}>
                <ClockCircleOutlined />{' '}
                {CalTimeDiff(moment(data.createdAt).unix())}
              </span>
            </li>

            <span className={styles['newsfeed-item__right-time__maintenance']}>
              {timeConvertWithOffestValue(data.effectiveDate, 'text')}-
              Estimated Duration:&nbsp;
              {data.durationMinutes} minutes
            </span>
          </div>
        );

      case 'copy-request':
        const showCopyRequestExeText = () => {
          let exeStr;
          if (data.recipientUsername == user) {
            exeStr = 'your';
          } else {
            exeStr = data.recipientUsername + "'s";
          }
          return exeStr;
        };

        if (data.action == 'approval') {
          actionText = 'Approved';
        } else if (data.action == 'denial') {
          actionText = 'Denied';
        } else {
          actionText = 'Closed ' + showCopyRequestExeText() + ' copy request';
        }

        return (
          <div className={styles['newsfeed-item__right']}>
            <li className={styles['newsfeed-item__right-title']}>
              {data.initiatorUsername}&nbsp;
              <span
                className={
                  styles[`newsfeed-item__right-action__${data.action}`]
                }
              >
                {' '}
                {actionText}&nbsp;
              </span>
              {data.action != 'close' && (
                <span style={{ fontWeight: 300 }}>
                  {showCopyRequestExeText()}&nbsp;
                </span>
              )}
              {data.action == 'close'
                ? 'and left review notes'
                : 'Copy Request'}
              <span className={styles['newsfeed-item__right-editedtime']}>
                <ClockCircleOutlined />{' '}
                {CalTimeDiff(moment(data.createdAt).unix())}
              </span>
            </li>

            <li className={styles['newsfeed-item__right-time']}>
              <span>
                {data.targets &&
                  data.targets.length > 0 &&
                  (data.targets[0]['name'].length > 30
                    ? data.targets[0]['name'].slice(0, 30) + '...'
                    : data.targets[0]['name'])}
                {data.targets &&
                  data.targets.length > 1 &&
                  ' +' + (data.targets.length - 1).toString()}
              </span>

              <span
                className={
                  styles[
                    data.targets
                      ? 'newsfeed-item__right-destination'
                      : 'newsfeed-item__right-destination__copy-request'
                  ]
                }
              >
                {data.action != 'close' ? '- ' : ''}
              </span>
              <span
                className={
                  styles[
                    data.targets
                      ? 'newsfeed-item__right-destination'
                      : 'newsfeed-item__right-destination__copy-request'
                  ]
                }
              >
                Destination:&nbsp;
              </span>
              <span>
                {data.action != 'close'
                  ? data.projectCode + '/' + data.destination?.path
                  : data.projectCode}
              </span>
            </li>
          </div>
        );
      case 'pipeline':
        actionType = 'Pipeline';
        if (data.action == 'delete') {
          actionText = 'Move to Trash Bin';
        } else {
          actionText = 'Copy';
        }

        return (
          <div className={styles['newsfeed-item__right']}>
            <li className={styles['newsfeed-item__right-title']}>
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
                className={styles[`newsfeed-item__right-action__${actionText}`]}
              >
                {' '}
                {actionText} {actionType}
              </span>
              {showExcutedTarget(data)} &nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;
              <span
                className={styles['newsfeed-item__right-status']}
                style={{
                  color: data.status == 'success' ? '#4A8500' : '#FF6D72',
                }}
              >
                {' '}
                {data.status == 'success' ? 'Succeed' : 'Failed'}{' '}
              </span>
              <span className={styles['newsfeed-item__right-editedtime']}>
                <ClockCircleOutlined />{' '}
                {CalTimeDiff(moment(data.createdAt).unix())}
              </span>
            </li>

            <span className={styles['newsfeed-item__right-time']}>
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
                <span className={styles['newsfeed-item__right-destination']}>
                  - Destination:&nbsp;
                </span>
              )}
              {data.destination
                ? data.projectCode + '/' + data.destination.path
                : ''}
            </span>
          </div>
        );
    }
  };

  const showExcutedTarget = (data) => {
    let fileNum = 0;
    let folderNum = 0;

    let actionStr;

    let targetsStr = 'data';

    if (data.involvedAs == 'initiator') {
      actionStr = <span>on {targetsStr}</span>;
    } else {
      if (data.involvedAs == 'receiver') {
        actionStr = <span>on {targetsStr} into your folder</span>;
      } else {
        actionStr = <span>on {targetsStr} from your folder</span>;
      }
    }
    return actionStr;
  };

  return (
    <div
      className={styles['newsfeed-item']}
      onClick={() => {
        if (data.type == 'pipeline') {
          dispatch(
            bellNotificationActions.setActiveBellNotification({
              tab: 'Pipeline',
              openModal: true,
              id: id,
            }),
          );
          scrollToAnchor(`newsfeed${id}`);
        } else if (data.type == 'maintenance') {
          dispatch(
            bellNotificationActions.setActiveBellNotification({
              tab: 'Maintenance',
              openModal: true,
              id: 0,
            }),
          );
        } else if (data.type == 'project') {
          dispatch(
            bellNotificationActions.setActiveBellNotification({
              tab: 'Project',
              openModal: true,
              id: id,
            }),
          );
          setTimeout(() => {
            scrollToAnchor(`project${id}`);
          }, 200);
        } else if (data.type == 'copy-request') {
          history.push(`/project/${data.projectCode}/request`);
        }
      }}
    >
      <span className={styles['newsfeed-item__icon']}>
        {iconMap[data.action ?? data.type]}
      </span>
      {classifyDataAction(data)}
      {data.type != 'role-change' && (
        <div className={styles['newsfeed-item__jumpicon']}>
          <DoubleRightOutlined />
        </div>
      )}
    </div>
  );
};

export default connect(
  (state) => ({
    activeBellNotification: state.bellNotificationReducer.actives,
  }),
  {
    setActiveBellNotification:
      bellNotificationActions.setActiveBellNotification,
  },
)(withRouter(Newsfeed));

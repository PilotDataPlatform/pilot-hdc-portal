/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Row, Col } from 'antd';
import {
  MailOutlined,
  CloseOutlined,
  RetweetOutlined,
  CheckOutlined,
  ExclamationOutlined,
} from '@ant-design/icons';

import { timeConvert } from '../../../../Utility/timeCovert';
import { mapProjectRoles } from '../../utils';
import styles from '../../index.module.scss';

const RecentActivitiesItem = ({ activity }) => {
  const appendActionDescription = (activity) => {
    const Action = ({
      description = activity.detail.projectName,
      detail,
      icon,
    }) => (
      <div>
        <Row>
          <Col>{icon}</Col>
          <Col className={styles['action__action-description']}>
            <span>{description}</span>
            {detail && (
              <span className={styles['action__action-detail']}>{detail}</span>
            )}
          </Col>
        </Row>
      </div>
    );

    switch (activity.eventType) {
      case 'INVITE_TO_PLATFORM':
        return (
          <Action
            description={`Invited as ${activity.detail.platformRole === 'admin' ? 'Platform Admin' : 'Platform Member'}`}
            detail={<em>{`by ${activity.operator}`}</em>}
            icon={<MailOutlined />}
          />
        );
      case 'INVITE_TO_PROJECT':
        return (
          <Action
            detail={
              <>
                {`Invited as ${mapProjectRoles(activity.detail.projectRole)} - `}
                <em>{`by ${activity.operator}`}</em>
              </>
            }
            icon={<MailOutlined />}
          />
        );
      case 'REMOVE_FROM_PROJECT':
        return (
          <Action
            detail={
              <>
                {`Removed from Project - `}
                <em>{`by ${activity.operator}`}</em>
              </>
            }
            icon={<CloseOutlined />}
          />
        );
      case 'ACCOUNT_DISABLE':
        return (
          <Action
            description="Account Disabled"
            detail={<em>{`by ${activity.operator}`}</em>}
            icon={<CloseOutlined />}
          />
        );
      case 'ROLE_CHANGE':
        return (
          <Action
            icon={<RetweetOutlined />}
            detail={
              <>
                {`Role changed from ${mapProjectRoles(activity.detail.from)} to ${mapProjectRoles(activity.detail.to)} - `}{' '}
                <em>{`by ${activity.operator}`}</em>
              </>
            }
          />
        );
      case 'ACCOUNT_ACTIVATED':
        return (
          <Action description="Account Activated" icon={<CheckOutlined />} />
        );
      default:
        return (
          <Action
            icon={<ExclamationOutlined />}
            description="Unrecognized Action"
          />
        );
    }
  };

  return (
    <li className={styles['activities-log__activity-item']}>
      <Row>
        <Col flex="0 0 150px">
          <span>
            {timeConvert(activity.timestamp, 'datetime')}
          </span>
        </Col>
        <Col className="activity-item__action">
          {appendActionDescription(activity)}
        </Col>
      </Row>
    </li>
  );
};

export default RecentActivitiesItem;

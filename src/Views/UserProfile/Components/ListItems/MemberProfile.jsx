/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Row, Col } from 'antd';
import styles from '../../index.module.scss';

import {
  timeConvert,
  timeConvertWithZulu,
} from '../../../../Utility/timeCovert';

const MemberProfile = ({ user, layout }) => {
  return (
    <ul className={styles[`member__content--${layout}`]}>
      <li className={styles['content__user-meta']}>
        <Row>
          <Col>
            <span>Username</span>
            <span>{user.username}</span>
          </Col>
        </Row>
        <Row>
          <Col>
            <span>First Name</span>
            <span>{user.firstName}</span>
          </Col>
          <Col>
            <span>Last Name</span>
            <span>{user.lastName}</span>
          </Col>
        </Row>
        <Row>
          <Col>
            <span>Email</span>
            <span>{user.email}</span>
          </Col>
        </Row>
      </li>
      <li className={styles['content__user-login']}>
        <Row>
          <Col>
            <span>Join Date</span>
            <span>{timeConvert(user.createdTimestamp, 'text')}</span>
          </Col>
        </Row>
        <Row>
          <Col>
            <span>Last Login</span>
            <span>
              {user.attributes?.lastLogin
                ? timeConvertWithZulu(user.attributes?.lastLogin, 'text')
                : null}
            </span>
          </Col>
        </Row>
      </li>
    </ul>
  );
};

export default MemberProfile;

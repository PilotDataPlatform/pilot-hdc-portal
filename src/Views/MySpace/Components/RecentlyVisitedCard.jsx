/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';

import { withRouter, Link } from 'react-router-dom';

import { Avatar } from 'antd';
import { mapProjectRoles } from '../../UserProfile/utils';
import styles from '../MySpace.module.scss';
import { useSelector } from 'react-redux';

const RecentlyVisitedCard = (props) => {
  const { type, data } = props;
  const { role } = useSelector((state) => state);
  return (
    <div>
      {type === 'projects' ? (
        <Link to={`/project/${data.code}/canvas`}>
          <div className={styles['project-item']}>
            <div className={styles['access-item__img']}>
              {data.imgUrl ? (
                <Avatar
                  shape="circle"
                  src=""
                  style={{
                    borderWidth: '1px',
                    width: '3rem',
                    height: '3rem',
                  }}
                ></Avatar>
              ) : (
                <Avatar
                  shape="circle"
                  style={{
                    borderWidth: '1px',
                    width: '3rem',
                    height: '3rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.9rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      textAlign: 'center',
                    }}
                  >
                    {data.name ? data.name.charAt(0) : ''}
                  </span>
                </Avatar>
              )}
            </div>
            <div className={styles['access-item__right']}>
              <span className={styles['access-item__right-title']}>
                {data.name}
              </span>
              <div className={styles['access-item__right-info']}>
                Project Code: {data.code}
                <span className={styles['access-item__right-role']}>
                  {' '}
                  <br /> Your role is{' '}
                  {role === 'admin'
                    ? 'Platform Administrator'
                    : data.permission
                    ? mapProjectRoles(data.permission)
                    : ''}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ) : (
        <Link to={`/dataset/${data.code}/home`}>
          <div className={styles['dataset-item']}>
            <div className={styles['access-item__img']}>
              {data.imgUrl ? (
                <Avatar
                  shape="circle"
                  src=""
                  style={{
                    borderWidth: '1px',
                    width: '3rem',
                    height: '3rem',
                  }}
                ></Avatar>
              ) : (
                <Avatar
                  shape="circle"
                  style={{
                    borderWidth: '1px',
                    width: '3rem',
                    height: '3rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.9rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      textAlign: 'center',
                    }}
                  >
                    {data.title ? data.title.charAt(0) : ''}
                  </span>
                </Avatar>
              )}
            </div>
            <div className={styles['access-item__right']}>
              <span className={styles['access-item__right-title']}>
                {data.title}
              </span>
              <div className={styles['access-item__right-info']}>
                Dataset Code: {data.code}
              </div>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
};

export default withRouter(RecentlyVisitedCard);

/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { List, Tooltip } from 'antd';
import styles from './FilePanelItem.module.scss';
import { WarningOutlined } from '@ant-design/icons';
import _ from 'lodash';
const getPopupContainer = (node) => node.parentNode;
export function FilePanelItem(props) {
  const { icon, status, originalFullPath } = props;
  const statusLowerCase = _.lowerCase(status);
  const isError = statusLowerCase === 'error';
  const title = (
    <div className={styles['title']}>
      {isError ? <WarningOutlined className={styles['icon']} /> : icon}
      {originalFullPath.length >= 48 ? (
        <Tooltip getPopupContainer={getPopupContainer} title={originalFullPath}>
          <div className={styles['file-name']}>
            <div>{originalFullPath}</div>
          </div>
        </Tooltip>
      ) : (
        <div className={styles['file-name']}>
          <div>{originalFullPath}</div>
        </div>
      )}{' '}
      <i className={styles['status']}>
        {' '}
        -{' '}
        {statusLowerCase === 'init' ? 'waiting' : _.capitalize(statusLowerCase)}
      </i>
    </div>
  );
  return (
    <List.Item className={isError ? styles['error'] : styles['not-error']}>
      <List.Item.Meta title={title} />
    </List.Item>
  );
}

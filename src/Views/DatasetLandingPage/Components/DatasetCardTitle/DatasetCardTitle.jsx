/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { PageHeader, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import styles from './DatasetCardTitle.module.scss';

export default function DatasetCardHeader(props) {
  const { title, code } = props;

  return (
    <PageHeader
      ghost={true}
      style={{
        padding: '0px 0px 0px 0px',
      }}
      title={getTitle(title, code)}
    ></PageHeader>
  );
}

const getTitle = (title, code) => {
  const titleComponent =
    title.length > 40 ? (
      <Tooltip title={title}>
        <div className={styles['toolTip-div']}>
          <Link to={`/dataset/${code}/home`}>
            <span>{title}</span>
          </Link>
        </div>
      </Tooltip>
    ) : (
      <div className={styles['no-toolTip-div']}>
        <Link to={`/dataset/${code}/home`}>
          <span>{title}</span>
        </Link>
      </div>
    );

  return titleComponent;
};

/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import { Card, Tag } from 'antd';
import { UpCircleOutlined, DownCircleOutlined } from '@ant-design/icons';
import styles from './DatasetCard.module.scss';
import DatasetCardTitle from '../DatasetCardTitle/DatasetCardTitle';
import { getFileSize, getTags } from '../../../../Utility';
import moment from 'moment';

export default function DatasetCard(props) {
  const {
    title,
    creator,
    createdAt,
    description,
    tags,
    size,
    totalFiles,
    code,
  } = props.dataset;
  const [isExpand, setIsExpand] = useState(false);

  const toggleExpand = () => {
    setIsExpand((preValue) => !preValue);
  };
  return (
    <div className={styles['dataset-card']}>
      <Card>
        <div className={styles['left']}>
          <DatasetCardTitle title={title} code={code} />
          <div className={styles['dataset-card-note']}>
            <b>
              Dataset Code: {code} / Created on{' '}
              {moment.utc(createdAt).local().format('YYYY-MM-DD')}
            </b>{' '}
            by {creator || 'N/A'}
          </div>
          {isExpand && <Description>{description}</Description>}
        </div>

        <div className={styles['right']}>
          <div className={styles['statistics-container']}>
            <Statistics label="Files">{totalFiles}</Statistics>
            <Statistics label="Size">{getFileSize(size)}</Statistics>
          </div>
          <div className={styles['tags-container']}>{getTags(tags)}</div>
        </div>

        <div onClick={toggleExpand} className={styles['expand']}>
          {isExpand ? <UpCircleOutlined /> : <DownCircleOutlined />}
        </div>
      </Card>
    </div>
  );
}

const Statistics = (props) => {
  const { label, children } = props;
  return (
    <span className={styles['statistics']}>
      <span className={styles['statistics-title']}>{label}</span>
      <span className={styles['statistics-value']}>{children}</span>
    </span>
  );
};

const Description = (props) => {
  const { children } = props;
  return (
    <div className={styles['description']}>
      <div>Description:</div>
      <p>{children || 'N/A'}</p>
    </div>
  );
};

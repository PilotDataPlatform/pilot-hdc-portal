/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Card } from 'antd';
import styles from './DatasetCard.module.scss';
import _ from 'lodash';

export function DatasetCard(props) {
  const { className } = props;
  return (
    <Card
      className={`${styles['card']} ${className}`}
      {..._.omit(props, ['className'])}
    ></Card>
  );
}

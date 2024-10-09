/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Card } from 'antd';
import styles from './NotSupportCard.module.scss';
import { FileImageOutlined } from '@ant-design/icons';
export function NotSupportCard(params) {
  return (
    <Card className={styles['card']}>
      <div className={styles['wrapper']}>
        {' '}
        <div>
          <FileImageOutlined />
        </div>
        <span>This file type does not support preview</span>
      </div>
    </Card>
  );
}

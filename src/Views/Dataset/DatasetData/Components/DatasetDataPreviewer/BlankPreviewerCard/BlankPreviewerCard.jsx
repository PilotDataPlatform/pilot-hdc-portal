/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import { Card } from 'antd';
import styles from './BlankPreviewerCard.module.scss';
import { FileImageOutlined, EyeOutlined } from '@ant-design/icons';
export function BlankPreviewerCard(params) {
  return (
    <Card className={styles['card']}>
      <div className={styles['wrapper']}>
        {' '}
        <div>
          <FileImageOutlined />
        </div>
        <span>
          click <EyeOutlined /> to preview
        </span>
      </div>
    </Card>
  );
}

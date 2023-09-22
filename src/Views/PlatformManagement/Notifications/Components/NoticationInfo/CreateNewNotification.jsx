/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import { Switch } from 'antd';
import styles from './index.module.scss';
import FormWrapper from './FormWrapper';
import { EyeOutlined } from '@ant-design/icons';

const CreateNewNotification = () => {
  return (
    <div>
      <div className={styles['new-notification-header']}></div>
      <div className={styles['editor']}>
        <FormWrapper edit={false} />
      </div>
    </div>
  );
};

export default CreateNewNotification;

/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import styles from './CardExtra.module.scss';

export function CardExtra(props) {
  const { editMode, onCancel, submitting, onClickSubmit, onClickEditButton } =
    props;

  if (editMode) {
    return (
      <div>
        <Button
          onClick={onCancel}
          className={styles['cancel-button']}
          type="link"
          disabled={submitting}
        >
          Cancel
        </Button>{' '}
        <Button
          className={styles['submit-button']}
          icon={<SaveOutlined />}
          type="primary"
          onClick={onClickSubmit}
          loading={submitting}
        >
          Submit
        </Button>{' '}
      </div>
    );
  }

  return null;
}

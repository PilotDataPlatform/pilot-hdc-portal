/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import {
  EditOutlined,
  CloseOutlined,
  SaveOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

import styles from './index.module.scss';

const FavouriteCardButttons = ({
  isFavouriteEditMode,
  isSaving,
  onCancel,
  onSave,
  onEdit,
}) =>
  isFavouriteEditMode ? (
    <>
      <button className={styles['favourite__cancel-button']} onClick={onCancel}>
        <CloseOutlined /> Cancel
      </button>
      <button
        className={styles['favourite__save-button']}
        loading={isSaving}
        onClick={onSave}
      >
        {isSaving ? <LoadingOutlined /> : <SaveOutlined />} Save
      </button>
    </>
  ) : (
    <button onClick={onEdit}>
      <EditOutlined />
    </button>
  );

export default FavouriteCardButttons;

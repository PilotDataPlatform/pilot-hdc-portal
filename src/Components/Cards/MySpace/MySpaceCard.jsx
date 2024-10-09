/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Button, Card } from 'antd';
import { DragOutlined, CloseOutlined } from '@ant-design/icons';

import styles from '../index.module.scss';

function MySpaceCard({
  title,
  extra,
  isEditMode,
  isDraggable,
  children,
  className = 'mySpace',
  ...cardStyles
}) {
  const extraButtons = isDraggable ? (
    <>
      <Button type="link" className="dragarea">
        <DragOutlined />
      </Button>
      <Button type="link">
        <CloseOutlined />
      </Button>
    </>
  ) : (
    extra
  );

  return (
    <Card
      className={
        isEditMode
          ? `${styles[className]} ${styles[`${className}-editMode`]}`
          : styles[className]
      }
      title={title}
      extra={extraButtons}
      size="small"
      {...cardStyles}
    >
      {children}
    </Card>
  );
}

export default MySpaceCard;

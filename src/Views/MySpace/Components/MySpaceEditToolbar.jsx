/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import {
  EditOutlined,
  ReloadOutlined,
  CloseOutlined,
  SaveOutlined,
} from '@ant-design/icons';

import styles from '../MySpace.module.scss';

const MySpaceEditToolbar = ({
  isEditMode,
  setIsEditMode,
  gridLayout,
  setGridLayout,
  initialGridLayout,
  handleSaveLayout,
  handleResetLayout,
}) => {
  const [oldGridLayout, setOldGridLayout] = useState({});

  useEffect(() => {
    setOldGridLayout(initialGridLayout);
  }, [initialGridLayout]);

  if (!isEditMode) {
    return (
      <Button
        type="text"
        icon={<EditOutlined />}
        onClick={() => setIsEditMode(true)}
      >
        Edit Layout
      </Button>
    );
  }

  const handlers = {
    reset() {
      handleResetLayout();
    },
    cancel() {
      setGridLayout(oldGridLayout);
      setIsEditMode(false);
    },
    save() {
      handleSaveLayout();
      setOldGridLayout(gridLayout);
      setIsEditMode(false);
    },
  };

  return (
    <div className={styles['my-space__edit-toolbar']}>
      <Button type="text" icon={<ReloadOutlined />} onClick={handlers.reset}>
        Reset
      </Button>
      <Button type="text" icon={<CloseOutlined />} onClick={handlers.cancel}>
        Cancel
      </Button>
      <Button type="primary" icon={<SaveOutlined />} onClick={handlers.save}>
        Save
      </Button>
    </div>
  );
};

export default MySpaceEditToolbar;

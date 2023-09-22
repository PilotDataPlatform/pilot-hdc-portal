/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import CreateFolderModal from './CreateDatasetFolderModal';
import styles from '../../ExplorerActions.module.scss';

export default function CreateDatasetFolderPlugin() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <Button
        type="link"
        icon={<PlusOutlined />}
        onClick={() => {
          setIsModalVisible(true);
        }}
        className={styles['button-enable']}
      >
        New Folder
      </Button>
      <CreateFolderModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
    </>
  );
}

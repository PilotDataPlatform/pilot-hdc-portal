/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState, useEffect } from 'react';
import { Card, Space, Button } from 'antd';
import {
  DownloadOutlined,
  EditOutlined,
  ImportOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import styles from './ExplorerActions.module.scss';
import { EDIT_MODE } from '../../../../../Redux/Reducers/datasetData';
import { Move } from './Actions/Move/Move';
import CreateFolder from './Actions/CreateDatasetFolder/CreateDatasetFolderPlugin';
import BidsValidator from './Actions/BidsValidator/BidsValidator';

export function ExplorerActions(props) {
  const editorMode = useSelector((state) => state.datasetData.mode);
  const selectedData = useSelector((state) => state.datasetData.selectedData);
  const basicInfo = useSelector((state) => state.datasetInfo.basicInfo);
  const moveCondition =
    selectedData.length !== 0 && editorMode !== EDIT_MODE.EIDT_INDIVIDUAL;
  return (
    <div className={styles['actions']}>
      <Space>
        <Move />
        <CreateFolder />
      </Space>
      { basicInfo.type && basicInfo.type === 'BIDS' && <BidsValidator />}
    </div>
  );
}

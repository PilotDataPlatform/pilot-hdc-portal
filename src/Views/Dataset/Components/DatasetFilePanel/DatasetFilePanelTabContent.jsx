/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { List } from 'antd';
import { FilePanelItem } from '../FilePanelItem/FilePanelItem';
import {
  SyncOutlined,
  EditOutlined,
  SwapOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { datasetFileOps } from '../../../../Redux/actions';
import { countStatus, parsePath } from './utility';
import { useSelector } from 'react-redux';

function DatasetFilePanelTabContent({ action }) {
  const fileOperations = useSelector(
    (state) => state.datasetFileOperations[action],
  );

  const [runningCount, errorCount, finishCount, initCount] =
    countStatus(fileOperations);

  const getActionIcon = (actionType) => {
    const action =
      actionType === datasetFileOps.transfer
        ? 'move'
        : actionType.replace('data_', '');

    switch (action) {
      case 'import':
        return <SyncOutlined />;
      case 'rename':
        return <EditOutlined />;
      case 'move':
        return <SwapOutlined />;
      case 'delete':
        return <DeleteOutlined />;
    }
  };

  return (
    <>
      <div>
        {' '}
        {initCount} waiting, {runningCount} running, {errorCount} error,{' '}
        {finishCount} finish
      </div>
      <List
        dataSource={fileOperations}
        renderItem={(record, index) => {
          const itemProps = {
            originalFullPath: record.name,
            status: record.status,
            icon: getActionIcon(record.actionType),
          };
          return <FilePanelItem {...itemProps} />;
        }}
      />
    </>
  );
}

export default DatasetFilePanelTabContent;

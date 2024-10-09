/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useReducer } from 'react';
import { Layout } from 'antd';
import { useCurrentProject } from '../../../Utility';
import {
  FileExplorerTable,
  ExplorerStateProvider,
} from '../../../Components/FileExplorer';
import styles from './request.module.scss';
import { useSelector } from 'react-redux';
import { pluginsContainer } from './TablePlugins';
import { useDataFetcher } from './useDataFetcher/useDataFetcher';

const { Content } = Layout;

function Request() {
  const { activeReq, status } = useSelector((state) => state.request2Core);
  const [currentDataset] = useCurrentProject();
  const [explorerState, explorerDispatch] = useReducer();
  const dataFetcher = useDataFetcher('request2core-' + activeReq.id);
  const projectGeid = currentDataset?.globalEntityId;
  const columns = [
    { title: '', dataIndex: 'label', key: 'label' },
    {
      title: 'Name',
      dataIndex: 'fileName',
      key: 'fileName',
      sidePanelVisible: true,
      sorter: true,
      searchKey: 'name',
    },
    {
      title: 'Added',
      dataIndex: 'owner',
      key: 'owner',
      sorter: true,
      searchKey: 'owner',
      ellipsis: true,
    },
    {
      title: 'Created',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: true,
    },
    {
      title: 'Size',
      dataIndex: 'fileSize',
      key: 'fileSize',
      sorter: true,
    },
  ];
  if (status === 'complete') {
    columns.splice(
      4,
      1,
      {
        title: 'Reviewed At',
        dataIndex: 'reviewedAt',
        key: 'reviewedAt',
      },
      {
        title: 'Reviewed By',
        dataIndex: 'reviewedBy',
        key: 'reviewedBy',
      },
    );
  }

  const columnsLayoutNewList = (isSidePanelOpen) => {
    if (isSidePanelOpen) {
      return {
        label: 60,
        fileName: '65%',
      };
    } else {
      return {
        label: 60,
        fileName: '40%',
        owner: '20%',
        createTime: 120,
        fileSize: 100,
      };
    }
  };

  const columnsLayoutCompletedList = (isSidePanelOpen) => {
    if (isSidePanelOpen) {
      return {
        label: 60,
        fileName: '65%',
      };
    } else {
      return {
        label: 60,
        fileName: '15%',
        owner: '17%',
        reviewedAt: '15%',
        reviewedBy: '15%',
        createTime: 120,
        fileSize: 100,
      };
    }
  };
  const rowClassName = (record, index) => {
    let classArr = [];
    if (record.status.toLowerCase() === 'archived') {
      classArr.push('record-deleted');
    } else {
      if (record.reviewStatus === 'approved') {
        classArr.push('record-approved');
      }
      if (record.reviewStatus === 'denied') {
        classArr.push('record-denied');
      }
    }

    return classArr.join(' ');
  };

  return (
    <Content className={styles.content}>
      <ExplorerStateProvider value={explorerState}>
        <FileExplorerTable
          columns={columns}
          columnsLayout={
            status === 'complete'
              ? columnsLayoutCompletedList
              : columnsLayoutNewList
          }
          reduxKey={'request2core-' + activeReq.id}
          initDataSource={{
            type: 'request',
            value: activeReq,
          }}
          dataFetcher={dataFetcher}
          columnsDisplayCfg={{
            deleteIndicator: true,
          }}
          rowClassName={rowClassName}
          routing={{
            startGeid: activeReq.sourceFolderGeid,
          }}
          projectGeid={projectGeid}
          pluginsContainer={pluginsContainer}
          sidePanelCfg={{
            showSystemTags: true,
            allowTagEdit: true,
          }}
        />
      </ExplorerStateProvider>
    </Content>
  );
}

export default Request;

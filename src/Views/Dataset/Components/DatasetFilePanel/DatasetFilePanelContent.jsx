/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React from 'react';
import { Tabs } from 'antd';
import {
  SyncOutlined,
  SwapOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import styles from './DatasetFilePanelContent.module.scss';
import { DatasetCard as Card } from '../DatasetCard/DatasetCard';
import DatasetFilePanelTabContent from './DatasetFilePanelTabContent';

import _ from 'lodash';

const { TabPane } = Tabs;

const getTabTitle = (action) => {
  const TabTitleContainer = ({ children }) => (
    <div className={styles.tabName}>{children}</div>
  );

  switch (action) {
    case 'import':
      return (
        <TabTitleContainer>
          <SyncOutlined />
          <span>Import</span>
        </TabTitleContainer>
      );
    case 'move':
      return (
        <TabTitleContainer>
          <SwapOutlined />
          <span>Move</span>
        </TabTitleContainer>
      );
    case 'rename':
      return (
        <TabTitleContainer>
          <EditOutlined />
          <span>Rename</span>
        </TabTitleContainer>
      );
    case 'delete':
      return (
        <TabTitleContainer>
          <DeleteOutlined />
          <span>Delete</span>
        </TabTitleContainer>
      );
    default:
      return null;
  }
};

const title = (
  <>
    <span>Dataset Status</span>
  </>
);

const DatasetFilePanelContent = () => {
  const datasetFileOperations = ['import', 'move', 'rename', 'delete'];
  return (
    <div className={styles.panel_popover_content}>
      <Card title={title} className={styles['panel_content_card']}>
        <Tabs className={styles.tab} tabPosition={'left'} tabBarGutter={1}>
          {datasetFileOperations.map((operation) => (
            <TabPane
              className={styles['tab-pane']}
              tab={getTabTitle(operation)}
              key={operation}
            >
              <DatasetFilePanelTabContent action={operation} />
            </TabPane>
          ))}
        </Tabs>
      </Card>
    </div>
  );
};

export default DatasetFilePanelContent;

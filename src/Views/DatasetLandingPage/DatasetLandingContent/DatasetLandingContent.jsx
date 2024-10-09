/*
 * Copyright (C) 2022-Present Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE,
 * Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import React, { useState } from 'react';
import { Tabs } from 'antd';
import MyDatasetsList from '../Components/MyDatasetList/MyDatasetsList';
import styles from './index.module.scss';
import DatasetListActions from '../Components/DatasetListActions/DatasetListActions';
import CreateDatasetPanel from '../Components/CreateDatasetPanel/CreateDatasetPanel';

const { TabPane } = Tabs;

const ACTIONS = { default: 'default', search: 'search', create: 'create' };

function DatasetLandingContent(props) {
  const [action, setAction] = useState(ACTIONS.default);

  return (
    <div className={styles.tab}>
      <Tabs
        tabBarExtraContent={
          <DatasetListActions
            ACTIONS={ACTIONS}
            action={action}
            setAction={setAction}
          />
        }
      >
        <TabPane>
          {action === ACTIONS.create && (
            <CreateDatasetPanel
              ACTIONS={ACTIONS}
              action={action}
              setAction={setAction}
            />
          )}
          <MyDatasetsList />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default DatasetLandingContent;
